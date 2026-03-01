import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams } from '@/lib/api-query';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, 'public:testimonials:list', {
    windowMs: 60_000,
    maxRequests: 120,
  });
  if (limited) {
    return limited;
  }

  const url = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(url, 24);

  try {
    const where = { isApproved: true };
    const [total, testimonials] = await Promise.all([
      prisma.testimonial.count({ where }),
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: testimonials,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('Failed to fetch testimonials.', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials.' }, { status: 500 });
  }
}
