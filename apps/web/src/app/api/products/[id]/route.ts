import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rate-limit';
import { idParamSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const limited = enforceRateLimit(request, 'public:products:item', {
    windowMs: 60_000,
    maxRequests: 180,
  });
  if (limited) {
    return limited;
  }

  const params = await context.params;
  const idParsed = idParamSchema.safeParse(params);
  if (!idParsed.success) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  }
  const { id } = idParsed.data;

  try {
    const product = await prisma.product.findFirst({
      where: { id, isActive: true },
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
    console.error(`Failed to fetch product ${id}.`, error);
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}
