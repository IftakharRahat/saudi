import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    requireAdmin: vi.fn(),
    prisma: {
      service: {
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

describe('admin services routes', () => {
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

    const response = await GET(new Request('http://localhost/api/admin/services'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized.');
    expect(mocks.prisma.service.findMany).not.toHaveBeenCalled();
  });

  it('lists services with pagination metadata', async () => {
    mocks.prisma.service.count.mockResolvedValueOnce(1);
    mocks.prisma.service.findMany.mockResolvedValueOnce([
      { id: 'svc_1', titleEn: 'Used Sofa', titleAr: 'sofa', sortOrder: 0 },
    ]);

    const response = await GET(
      new Request('http://localhost/api/admin/services?page=1&limit=10')
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

  it('creates a service', async () => {
    const body = {
      titleEn: 'Used Sofa',
      titleAr: 'كنب مستعمل',
      descriptionEn: 'We buy used sofas.',
      descriptionAr: 'نشتري كنب مستعمل.',
      imageUrl: '/images/sofa.png',
      sortOrder: 1,
      isActive: true,
    };
    mocks.prisma.service.create.mockResolvedValueOnce({ id: 'svc_1', ...body });

    const response = await POST(asJsonRequest('http://localhost/api/admin/services', body));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.data.id).toBe('svc_1');
    expect(mocks.prisma.service.create).toHaveBeenCalledWith({ data: body });
  });

  it('updates a service by id', async () => {
    mocks.prisma.service.update.mockResolvedValueOnce({
      id: 'svc_1',
      titleEn: 'Updated',
    });

    const request = new Request('http://localhost/api/admin/services/svc_1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ titleEn: 'Updated' }),
    });

    const response = await PUT(request, params('svc_1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.titleEn).toBe('Updated');
    expect(mocks.prisma.service.update).toHaveBeenCalledWith({
      where: { id: 'svc_1' },
      data: { titleEn: 'Updated' },
    });
  });

  it('fetches and deletes a service by id', async () => {
    mocks.prisma.service.findUnique.mockResolvedValueOnce({
      id: 'svc_1',
      titleEn: 'Service',
    });
    mocks.prisma.service.delete.mockResolvedValueOnce({ id: 'svc_1' });

    const getResponse = await GET_BY_ID(
      new Request('http://localhost/api/admin/services/svc_1'),
      params('svc_1')
    );
    const getPayload = await getResponse.json();

    const deleteResponse = await DELETE(
      new Request('http://localhost/api/admin/services/svc_1', { method: 'DELETE' }),
      params('svc_1')
    );
    const deletePayload = await deleteResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getPayload.data.id).toBe('svc_1');
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload.message).toBe('Service deleted.');
  });
});
