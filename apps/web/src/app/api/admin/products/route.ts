import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams } from '@/lib/api-query';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { saveUploadedImage } from '@/lib/uploads';
import { productCreateSchema } from '@/lib/validation';

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

async function getCreatePayload(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.includes('multipart/form-data')) {
    return (await request.json()) as unknown;
  }

  const formData = await request.formData();
  const images = await extractImageUrls(formData);

  return {
    titleEn: asText(formData.get('titleEn')),
    titleAr: asText(formData.get('titleAr')),
    descriptionEn: asText(formData.get('descriptionEn')),
    descriptionAr: asText(formData.get('descriptionAr')),
    featuresEn: asText(formData.get('featuresEn')),
    featuresAr: asText(formData.get('featuresAr')),
    isActive: asText(formData.get('isActive')),
    images,
  };
}

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const url = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(url, 100);

  try {
    const [total, products] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: products,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('Failed to fetch products for admin.', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  let payload: unknown;
  try {
    payload = await getCreatePayload(request);
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = productCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { images, ...productData } = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images.map((imageUrl, index) => ({
            imageUrl,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product.', error);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}
