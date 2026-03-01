import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { saveUploadedImage } from '@/lib/uploads';
import { idParamSchema, productUpdateSchema } from '@/lib/validation';

export const runtime = 'nodejs';

function asText(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value : undefined;
}

async function extractImageUrls(formData: FormData) {
  const imageUrls: string[] = [];

  const appendEntry = async (entry: FormDataEntryValue) => {
    if (typeof entry === 'string') {
      const trimmed = entry.trim();
      if (trimmed) {
        imageUrls.push(trimmed);
      }
      return;
    }

    if (entry.size === 0) {
      return;
    }

    imageUrls.push(await saveUploadedImage(entry, 'products'));
  };

  for (const entry of formData.getAll('images')) {
    await appendEntry(entry);
  }

  for (const entry of formData.getAll('imageUrls')) {
    await appendEntry(entry);
  }

  return imageUrls;
}

async function getUpdatePayload(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.includes('multipart/form-data')) {
    return (await request.json()) as unknown;
  }

  const formData = await request.formData();
  const payload: Record<string, unknown> = {};

  if (formData.has('titleEn')) payload.titleEn = asText(formData.get('titleEn'));
  if (formData.has('titleAr')) payload.titleAr = asText(formData.get('titleAr'));
  if (formData.has('descriptionEn')) payload.descriptionEn = asText(formData.get('descriptionEn'));
  if (formData.has('descriptionAr')) payload.descriptionAr = asText(formData.get('descriptionAr'));
  if (formData.has('featuresEn')) payload.featuresEn = asText(formData.get('featuresEn'));
  if (formData.has('featuresAr')) payload.featuresAr = asText(formData.get('featuresAr'));
  if (formData.has('isActive')) payload.isActive = asText(formData.get('isActive'));

  if (formData.has('images') || formData.has('imageUrls')) {
    payload.images = await extractImageUrls(formData);
  }

  return payload;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const params = await context.params;
  const parsedId = idParamSchema.safeParse(params);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error(`Failed to fetch admin product ${id}.`, error);
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const params = await context.params;
  const parsedId = idParamSchema.safeParse(params);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  let payload: unknown;
  try {
    payload = await getUpdatePayload(request);
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = productUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { images, ...productData } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: productData,
      });

      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });

        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((imageUrl, index) => ({
              productId: id,
              imageUrl,
              sortOrder: index,
            })),
          });
        }
      }
    });

    const updated = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    console.error(`Failed to update product ${id}.`, error);
    return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const params = await context.params;
  const parsedId = idParamSchema.safeParse(params);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    console.error(`Failed to delete product ${id}.`, error);
    return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
  }
}
