import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    prisma: {
      service: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
      product: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
      fAQ: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
    },
    enforceRateLimit: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({ prisma: mocks.prisma }));
vi.mock('@/lib/rate-limit', () => ({
  enforceRateLimit: mocks.enforceRateLimit,
}));

import { GET } from './route';

describe('GET /api/search', () => {
  beforeEach(() => {
    mocks.enforceRateLimit.mockReturnValue(null);
  });

  it('returns 400 when query text is missing', async () => {
    const request = new Request('http://localhost/api/search?lang=en');
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Validation failed.');
    expect(payload.fieldErrors).toBeTruthy();
    expect(mocks.prisma.service.findMany).not.toHaveBeenCalled();
  });

  it('returns categorized results and pagination metadata', async () => {
    mocks.prisma.service.count.mockResolvedValueOnce(2);
    mocks.prisma.product.count.mockResolvedValueOnce(1);
    mocks.prisma.fAQ.count.mockResolvedValueOnce(3);
    mocks.prisma.service.findMany.mockResolvedValueOnce([
      { id: 'svc_1', titleEn: 'Used Sofa', titleAr: 'sofa', descriptionEn: 'desc', descriptionAr: 'desc ar' },
    ]);
    mocks.prisma.product.findMany.mockResolvedValueOnce([
      {
        id: 'prd_1',
        titleEn: 'Washing Machine',
        titleAr: 'machine',
        descriptionEn: 'desc',
        descriptionAr: 'desc ar',
        images: [],
      },
    ]);
    mocks.prisma.fAQ.findMany.mockResolvedValueOnce([
      { id: 'faq_1', questionEn: 'How?', questionAr: 'how ar', answerEn: 'Like this', answerAr: 'ans ar' },
    ]);

    const request = new Request('http://localhost/api/search?q=chair&lang=en&page=2&limit=5');
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.query).toEqual({ q: 'chair', lang: 'en' });
    expect(payload.data.services).toHaveLength(1);
    expect(payload.data.products).toHaveLength(1);
    expect(payload.data.faqs).toHaveLength(1);
    expect(payload.pagination.services).toEqual({
      page: 2,
      limit: 5,
      total: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: true,
    });
    expect(mocks.prisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
      })
    );
    expect(mocks.prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
      })
    );
    expect(mocks.prisma.fAQ.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
      })
    );
  });

  it('returns 429 when rate limit blocks the search request', async () => {
    mocks.enforceRateLimit.mockReturnValueOnce(
      new Response(JSON.stringify({ error: 'Too many requests.' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      })
    );

    const request = new Request('http://localhost/api/search?q=chair');
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.error).toBe('Too many requests.');
    expect(mocks.prisma.service.findMany).not.toHaveBeenCalled();
  });
});
