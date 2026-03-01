import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const tx = {
    product: {
      update: vi.fn(),
    },
    productImage: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  };

  return {
    tx,
    requireAdmin: vi.fn(),
    prisma: {
      product: {
        count: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        findUnique: vi.fn(),
        delete: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    saveUploadedImage: vi.fn(),
  };
});

vi.mock('@/lib/admin-auth', () => ({
  requireAdmin: mocks.requireAdmin,
}));
vi.mock('@/lib/prisma', () => ({
  prisma: mocks.prisma,
}));
vi.mock('@/lib/uploads', () => ({
  saveUploadedImage: mocks.saveUploadedImage,
}));

import { DELETE, GET as GET_BY_ID, PUT } from './[id]/route';
import { GET, POST } from './route';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('admin products routes', () => {
  beforeEach(() => {
    mocks.requireAdmin.mockResolvedValue(null);
    mocks.prisma.$transaction.mockImplementation(async (callback: (tx: typeof mocks.tx) => Promise<void>) => {
      await callback(mocks.tx);
    });
  });

  it('returns 401 when admin auth fails', async () => {
    mocks.requireAdmin.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Unauthorized.' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    );

    const response = await GET(new Request('http://localhost/api/admin/products'));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe('Unauthorized.');
  });

  it('lists products for admin', async () => {
    mocks.prisma.product.count.mockResolvedValueOnce(1);
    mocks.prisma.product.findMany.mockResolvedValueOnce([
      { id: 'prd_1', titleEn: 'Washing Machine', images: [] },
    ]);

    const response = await GET(
      new Request('http://localhost/api/admin/products?page=1&limit=10')
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(1);
    expect(payload.pagination.total).toBe(1);
  });

  it('creates a product with images', async () => {
    const body = {
      titleEn: 'Washing Machine',
      titleAr: 'غسالة',
      descriptionEn: 'Good condition',
      descriptionAr: 'حالة جيدة',
      featuresEn: ['feature-1'],
      featuresAr: ['ميزة-1'],
      isActive: true,
      images: ['/uploads/p1.png', '/uploads/p2.png'],
    };
    mocks.prisma.product.create.mockResolvedValueOnce({
      id: 'prd_1',
      ...body,
    });

    const response = await POST(
      new Request('http://localhost/api/admin/products', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.data.id).toBe('prd_1');
    expect(mocks.prisma.product.create).toHaveBeenCalledWith({
      data: {
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        descriptionEn: body.descriptionEn,
        descriptionAr: body.descriptionAr,
        featuresEn: body.featuresEn,
        featuresAr: body.featuresAr,
        isActive: body.isActive,
        images: {
          create: [
            { imageUrl: '/uploads/p1.png', sortOrder: 0 },
            { imageUrl: '/uploads/p2.png', sortOrder: 1 },
          ],
        },
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  });

  it('updates product details and image set', async () => {
    mocks.tx.product.update.mockResolvedValueOnce({ id: 'prd_1' });
    mocks.tx.productImage.deleteMany.mockResolvedValueOnce({ count: 2 });
    mocks.tx.productImage.createMany.mockResolvedValueOnce({ count: 1 });
    mocks.prisma.product.findUnique.mockResolvedValueOnce({
      id: 'prd_1',
      titleEn: 'Updated Product',
      images: [{ imageUrl: '/uploads/new.png', sortOrder: 0 }],
    });

    const response = await PUT(
      new Request('http://localhost/api/admin/products/prd_1', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          titleEn: 'Updated Product',
          images: ['/uploads/new.png'],
        }),
      }),
      params('prd_1')
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.titleEn).toBe('Updated Product');
    expect(mocks.tx.product.update).toHaveBeenCalledWith({
      where: { id: 'prd_1' },
      data: { titleEn: 'Updated Product' },
    });
    expect(mocks.tx.productImage.deleteMany).toHaveBeenCalledWith({
      where: { productId: 'prd_1' },
    });
    expect(mocks.tx.productImage.createMany).toHaveBeenCalledWith({
      data: [{ productId: 'prd_1', imageUrl: '/uploads/new.png', sortOrder: 0 }],
    });
  });

  it('fetches and deletes a product by id', async () => {
    mocks.prisma.product.findUnique.mockResolvedValueOnce({
      id: 'prd_1',
      titleEn: 'Product',
      images: [],
    });
    mocks.prisma.product.delete.mockResolvedValueOnce({ id: 'prd_1' });

    const getResponse = await GET_BY_ID(
      new Request('http://localhost/api/admin/products/prd_1'),
      params('prd_1')
    );
    const getPayload = await getResponse.json();

    const deleteResponse = await DELETE(
      new Request('http://localhost/api/admin/products/prd_1', { method: 'DELETE' }),
      params('prd_1')
    );
    const deletePayload = await deleteResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getPayload.data.id).toBe('prd_1');
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload.message).toBe('Product deleted.');
  });
});
