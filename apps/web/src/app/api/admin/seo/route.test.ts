import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    requireAdmin: vi.fn(),
    prisma: {
      pageSeo: {
        count: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

vi.mock('@/lib/admin-auth', () => ({
  requireAdmin: mocks.requireAdmin,
}));
vi.mock('@/lib/prisma', () => ({
  prisma: mocks.prisma,
}));

import { DELETE, GET as GET_BY_ID, PUT } from './[id]/route';
import { GET, POST } from './route';

function asJsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('admin SEO routes', () => {
  beforeEach(() => {
    mocks.requireAdmin.mockResolvedValue(null);
  });

  it('returns 401 when admin auth fails', async () => {
    mocks.requireAdmin.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Unauthorized.' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    );

    const response = await GET(new Request('http://localhost/api/admin/seo'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized.');
    expect(mocks.prisma.pageSeo.findMany).not.toHaveBeenCalled();
  });

  it('lists SEO entries with pagination metadata', async () => {
    mocks.prisma.pageSeo.count.mockResolvedValueOnce(1);
    mocks.prisma.pageSeo.findMany.mockResolvedValueOnce([
      { id: 'seo_1', pageSlug: 'home', metaTitle: 'Home Page' },
    ]);

    const response = await GET(
      new Request('http://localhost/api/admin/seo?page=1&limit=10')
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(1);
    expect(payload.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });

  it('creates a SEO entry', async () => {
    const body = {
      pageSlug: 'about',
      metaTitle: 'About Us',
      metaDescription: 'Learn about Future Companies.',
    };
    mocks.prisma.pageSeo.create.mockResolvedValueOnce({ id: 'seo_2', ...body });

    const response = await POST(asJsonRequest('http://localhost/api/admin/seo', body));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.data.id).toBe('seo_2');
  });

  it('updates a SEO entry by id', async () => {
    mocks.prisma.pageSeo.update.mockResolvedValueOnce({
      id: 'seo_1',
      metaTitle: 'Updated Home',
    });

    const request = new Request('http://localhost/api/admin/seo/seo_1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ metaTitle: 'Updated Home' }),
    });

    const response = await PUT(request, params('seo_1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.metaTitle).toBe('Updated Home');
  });

  it('fetches and deletes a SEO entry by id', async () => {
    mocks.prisma.pageSeo.findUnique.mockResolvedValueOnce({
      id: 'seo_1',
      pageSlug: 'home',
    });
    mocks.prisma.pageSeo.delete.mockResolvedValueOnce({ id: 'seo_1' });

    const getResponse = await GET_BY_ID(
      new Request('http://localhost/api/admin/seo/seo_1'),
      params('seo_1')
    );
    const getPayload = await getResponse.json();

    const deleteResponse = await DELETE(
      new Request('http://localhost/api/admin/seo/seo_1', { method: 'DELETE' }),
      params('seo_1')
    );
    const deletePayload = await deleteResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getPayload.data.id).toBe('seo_1');
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload.message).toBe('SEO entry deleted.');
  });
});
