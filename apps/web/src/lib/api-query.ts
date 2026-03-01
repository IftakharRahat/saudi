import { z } from 'zod';

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(20),
});

const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
  lang: z.enum(['en', 'ar']).default('en'),
});

export type PaginationParams = {
  page: number;
  limit: number;
  skip: number;
};

export function parsePaginationParams(url: URL, fallbackLimit = 20): PaginationParams {
  const rawPage = url.searchParams.get('page') ?? '1';
  const rawLimit = url.searchParams.get('limit') ?? String(fallbackLimit);
  const parsed = paginationSchema.parse({ page: rawPage, limit: rawLimit });

  return {
    page: parsed.page,
    limit: parsed.limit,
    skip: (parsed.page - 1) * parsed.limit,
  };
}

export function createPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function parseSearchParams(url: URL) {
  const parsed = searchQuerySchema.safeParse({
    q: url.searchParams.get('q') ?? '',
    lang: url.searchParams.get('lang') ?? 'en',
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    ok: true as const,
    value: parsed.data,
  };
}
