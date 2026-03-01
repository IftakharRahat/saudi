import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    requireAdmin: vi.fn(),
    prisma: {
      testimonial: {
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

describe('admin testimonials routes', () => {
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

    const response = await GET(new Request('http://localhost/api/admin/testimonials'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized.');
  });

  it('lists testimonials for admin', async () => {
    mocks.prisma.testimonial.count.mockResolvedValueOnce(1);
    mocks.prisma.testimonial.findMany.mockResolvedValueOnce([
      { id: 'tm_1', nameEn: 'Ahmed', nameAr: 'أحمد' },
    ]);

    const response = await GET(
      new Request('http://localhost/api/admin/testimonials?page=1&limit=10')
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(1);
    expect(payload.pagination.total).toBe(1);
  });

  it('creates and updates a testimonial', async () => {
    const createBody = {
      textEn: 'Great service.',
      textAr: 'خدمة رائعة.',
      nameEn: 'Ahmed',
      nameAr: 'أحمد',
      roleEn: 'Customer',
      roleAr: 'عميل',
      rating: 5,
      photoUrl: '/uploads/user.png',
      isApproved: true,
    };
    mocks.prisma.testimonial.create.mockResolvedValueOnce({ id: 'tm_1', ...createBody });
    mocks.prisma.testimonial.update.mockResolvedValueOnce({
      id: 'tm_1',
      textEn: 'Updated review.',
    });

    const createResponse = await POST(
      new Request('http://localhost/api/admin/testimonials', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(createBody),
      })
    );
    const createPayload = await createResponse.json();

    const updateResponse = await PUT(
      new Request('http://localhost/api/admin/testimonials/tm_1', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ textEn: 'Updated review.' }),
      }),
      params('tm_1')
    );
    const updatePayload = await updateResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createPayload.data.id).toBe('tm_1');
    expect(updateResponse.status).toBe(200);
    expect(updatePayload.data.textEn).toBe('Updated review.');
  });

  it('fetches and deletes testimonial by id', async () => {
    mocks.prisma.testimonial.findUnique.mockResolvedValueOnce({
      id: 'tm_1',
      nameEn: 'Ahmed',
    });
    mocks.prisma.testimonial.delete.mockResolvedValueOnce({ id: 'tm_1' });

    const getResponse = await GET_BY_ID(
      new Request('http://localhost/api/admin/testimonials/tm_1'),
      params('tm_1')
    );
    const getPayload = await getResponse.json();

    const deleteResponse = await DELETE(
      new Request('http://localhost/api/admin/testimonials/tm_1', { method: 'DELETE' }),
      params('tm_1')
    );
    const deletePayload = await deleteResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getPayload.data.id).toBe('tm_1');
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload.message).toBe('Testimonial deleted.');
  });
});
