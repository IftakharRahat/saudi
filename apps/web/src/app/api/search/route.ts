import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams, parseSearchParams } from '@/lib/api-query';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, 'public:search', {
    windowMs: 60_000,
    maxRequests: 80,
  });
  if (limited) {
    return limited;
  }

  const url = new URL(request.url);
  const parsedSearch = parseSearchParams(url);

  if (!parsedSearch.ok) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        fieldErrors: parsedSearch.errors,
      },
      { status: 400 }
    );
  }

  const { q, lang } = parsedSearch.value;
  const { page, limit, skip } = parsePaginationParams(url, 10);

  const textContains = { contains: q, mode: Prisma.QueryMode.insensitive };

  const servicesWhere = {
    isActive: true,
    OR: [{ titleEn: textContains }, { titleAr: textContains }, { descriptionEn: textContains }, { descriptionAr: textContains }],
  } satisfies Prisma.ServiceWhereInput;

  const productsWhere = {
    isActive: true,
    OR: [
      { titleEn: textContains },
      { titleAr: textContains },
      { descriptionEn: textContains },
      { descriptionAr: textContains },
      { featuresEn: { hasSome: [q] } },
      { featuresAr: { hasSome: [q] } },
    ],
  } satisfies Prisma.ProductWhereInput;

  const faqsWhere = {
    isActive: true,
    OR: [{ questionEn: textContains }, { questionAr: textContains }, { answerEn: textContains }, { answerAr: textContains }],
  } satisfies Prisma.FAQWhereInput;

  try {
    const [
      serviceTotal,
      productTotal,
      faqTotal,
      services,
      products,
      faqs,
    ] = await Promise.all([
      prisma.service.count({ where: servicesWhere }),
      prisma.product.count({ where: productsWhere }),
      prisma.fAQ.count({ where: faqsWhere }),
      prisma.service.findMany({
        where: servicesWhere,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.product.findMany({
        where: productsWhere,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        skip,
        take: limit,
      }),
      prisma.fAQ.findMany({
        where: faqsWhere,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: {
        services,
        products,
        faqs,
      },
      query: {
        q,
        lang,
      },
      pagination: {
        services: createPaginationMeta(serviceTotal, page, limit),
        products: createPaginationMeta(productTotal, page, limit),
        faqs: createPaginationMeta(faqTotal, page, limit),
      },
    });
  } catch (error) {
    console.error('Failed to search content.', error);
    return NextResponse.json({ error: 'Failed to search content.' }, { status: 500 });
  }
}
