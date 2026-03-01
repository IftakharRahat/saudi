import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams } from '@/lib/api-query';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, 'public:services:list', {
    windowMs: 60_000,
    maxRequests: 120,
  });
  if (limited) {
    return limited;
  }

  const url = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(url, 24);

  try {
    const where = { isActive: true };
    const [total, services] = await Promise.all([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: services,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('Failed to fetch services.', error);
    return NextResponse.json({ error: 'Failed to fetch services.' }, { status: 500 });
  }
}
