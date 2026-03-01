import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    requireAdmin: vi.fn(),
    prisma: {
      serviceArea: {
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

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('admin service area routes', () => {
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

    const response = await GET(new Request('http://localhost/api/admin/areas'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized.');
  });

  it('lists service areas for admin', async () => {
    mocks.prisma.serviceArea.count.mockResolvedValueOnce(1);
    mocks.prisma.serviceArea.findMany.mockResolvedValueOnce([
      { id: 'area_1', cityEn: 'Dammam', cityAr: 'الدمام' },
    ]);

    const response = await GET(new Request('http://localhost/api/admin/areas?page=1&limit=10'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(1);
    expect(payload.pagination.total).toBe(1);
  });

  it('creates and updates a service area', async () => {
    const createBody = {
      cityEn: 'Dammam',
      cityAr: 'الدمام',
      titleEn: 'Buying Used Furniture in Dammam',
      titleAr: 'شراء الأثاث المستعمل في الدمام',
      descriptionEn: 'Fast on-site evaluation.',
      descriptionAr: 'تقييم سريع في الموقع.',
      sortOrder: 1,
      isActive: true,
    };
    mocks.prisma.serviceArea.create.mockResolvedValueOnce({ id: 'area_1', ...createBody });
    mocks.prisma.serviceArea.update.mockResolvedValueOnce({
      id: 'area_1',
      titleEn: 'Updated title',
    });

    const createResponse = await POST(
      new Request('http://localhost/api/admin/areas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(createBody),
      })
    );
    const createPayload = await createResponse.json();

    const updateResponse = await PUT(
      new Request('http://localhost/api/admin/areas/area_1', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ titleEn: 'Updated title' }),
      }),
      params('area_1')
    );
    const updatePayload = await updateResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createPayload.data.id).toBe('area_1');
    expect(updateResponse.status).toBe(200);
    expect(updatePayload.data.titleEn).toBe('Updated title');
  });

  it('fetches and deletes service area by id', async () => {
    mocks.prisma.serviceArea.findUnique.mockResolvedValueOnce({
      id: 'area_1',
      titleEn: 'Area title',
    });
    mocks.prisma.serviceArea.delete.mockResolvedValueOnce({ id: 'area_1' });

    const getResponse = await GET_BY_ID(
      new Request('http://localhost/api/admin/areas/area_1'),
      params('area_1')
    );
    const getPayload = await getResponse.json();

    const deleteResponse = await DELETE(
      new Request('http://localhost/api/admin/areas/area_1', { method: 'DELETE' }),
      params('area_1')
    );
    const deletePayload = await deleteResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getPayload.data.id).toBe('area_1');
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload.message).toBe('Service area deleted.');
  });
});
