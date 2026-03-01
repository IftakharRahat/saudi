import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    requireAdmin: vi.fn(),
    prisma: {
      fAQ: {
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

describe('admin FAQs routes', () => {
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

    const response = await GET(new Request('http://localhost/api/admin/faqs'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized.');
  });

  it('lists FAQ entries for admin', async () => {
    mocks.prisma.fAQ.count.mockResolvedValueOnce(1);
    mocks.prisma.fAQ.findMany.mockResolvedValueOnce([
      { id: 'faq_1', questionEn: 'Q', questionAr: 'Q ar' },
    ]);

    const response = await GET(new Request('http://localhost/api/admin/faqs?page=1&limit=10'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(1);
    expect(payload.pagination.total).toBe(1);
  });

  it('creates and updates an FAQ', async () => {
    const createBody = {
      questionEn: 'How do you buy furniture?',
      questionAr: 'كيف تشترون الأثاث؟',
      answerEn: 'Send photos and we will evaluate.',
      answerAr: 'أرسل الصور وسنقوم بالتقييم.',
      sortOrder: 1,
      isActive: true,
    };
    mocks.prisma.fAQ.create.mockResolvedValueOnce({ id: 'faq_1', ...createBody });
    mocks.prisma.fAQ.update.mockResolvedValueOnce({
      id: 'faq_1',
      answerEn: 'Updated answer',
    });

    const createResponse = await POST(
      new Request('http://localhost/api/admin/faqs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(createBody),
      })
    );
    const createPayload = await createResponse.json();

    const updateResponse = await PUT(
      new Request('http://localhost/api/admin/faqs/faq_1', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answerEn: 'Updated answer' }),
      }),
      params('faq_1')
    );
    const updatePayload = await updateResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createPayload.data.id).toBe('faq_1');
    expect(updateResponse.status).toBe(200);
    expect(updatePayload.data.answerEn).toBe('Updated answer');
  });

  it('fetches and deletes FAQ by id', async () => {
    mocks.prisma.fAQ.findUnique.mockResolvedValueOnce({
      id: 'faq_1',
      questionEn: 'Question',
    });
    mocks.prisma.fAQ.delete.mockResolvedValueOnce({ id: 'faq_1' });

    const getResponse = await GET_BY_ID(
      new Request('http://localhost/api/admin/faqs/faq_1'),
      params('faq_1')
    );
    const getPayload = await getResponse.json();

    const deleteResponse = await DELETE(
      new Request('http://localhost/api/admin/faqs/faq_1', { method: 'DELETE' }),
      params('faq_1')
    );
    const deletePayload = await deleteResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getPayload.data.id).toBe('faq_1');
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload.message).toBe('FAQ deleted.');
  });
});
