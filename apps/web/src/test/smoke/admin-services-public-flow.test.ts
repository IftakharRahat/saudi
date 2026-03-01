import { beforeEach, describe, expect, it, vi } from 'vitest';

type ServiceRecord = {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
};

const mocks = vi.hoisted(() => {
  const services: ServiceRecord[] = [];

  return {
    services,
    requireAdmin: vi.fn(),
    enforceRateLimit: vi.fn(),
    prisma: {
      service: {
        create: vi.fn(async ({ data }: { data: Omit<ServiceRecord, 'id' | 'createdAt'> }) => {
          const record: ServiceRecord = {
            id: `svc_${services.length + 1}`,
            createdAt: new Date(`2026-03-02T00:00:0${services.length}Z`),
            ...data,
          };
          services.push(record);
          return record;
        }),
        count: vi.fn(async ({ where }: { where?: { isActive?: boolean } } = {}) => {
          if (where?.isActive === undefined) {
            return services.length;
          }
          return services.filter((item) => item.isActive === where.isActive).length;
        }),
        findMany: vi.fn(
          async ({
            where,
            skip = 0,
            take = 24,
          }: {
            where?: { isActive?: boolean };
            skip?: number;
            take?: number;
          } = {}) => {
            const filtered =
              where?.isActive === undefined
                ? services
                : services.filter((item) => item.isActive === where.isActive);

            const sorted = [...filtered].sort((a, b) => {
              if (a.sortOrder !== b.sortOrder) {
                return a.sortOrder - b.sortOrder;
              }
              return b.createdAt.getTime() - a.createdAt.getTime();
            });

            return sorted.slice(skip, skip + take);
          }
        ),
      },
    },
  };
});

vi.mock('@/lib/admin-auth', () => ({
  requireAdmin: mocks.requireAdmin,
}));
vi.mock('@/lib/rate-limit', () => ({
  enforceRateLimit: mocks.enforceRateLimit,
}));
vi.mock('@/lib/prisma', () => ({
  prisma: mocks.prisma,
}));

import { POST as adminCreateService } from '@/app/api/admin/services/route';
import { GET as publicListServices } from '@/app/api/services/route';

describe('smoke: admin service create -> public services list', () => {
  beforeEach(() => {
    mocks.services.length = 0;
    mocks.requireAdmin.mockResolvedValue(null);
    mocks.enforceRateLimit.mockReturnValue(null);
  });

  it('shows newly created active service in public services endpoint', async () => {
    const activeResponse = await adminCreateService(
      new Request('http://localhost/api/admin/services', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          titleEn: 'Used Dining Table',
          titleAr: 'طاولة طعام مستعملة',
          descriptionEn: 'We buy used dining tables quickly.',
          descriptionAr: 'نشتري طاولات الطعام المستعملة بسرعة.',
          imageUrl: '/uploads/table.png',
          sortOrder: 2,
          isActive: true,
        }),
      })
    );

    const inactiveResponse = await adminCreateService(
      new Request('http://localhost/api/admin/services', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          titleEn: 'Hidden Service',
          titleAr: 'خدمة مخفية',
          descriptionEn: 'Hidden from public list.',
          descriptionAr: 'مخفية من القائمة العامة.',
          imageUrl: '/uploads/hidden.png',
          sortOrder: 99,
          isActive: false,
        }),
      })
    );

    expect(activeResponse.status).toBe(201);
    expect(inactiveResponse.status).toBe(201);

    const publicResponse = await publicListServices(
      new Request('http://localhost/api/services?page=1&limit=24')
    );
    const publicPayload = await publicResponse.json();

    expect(publicResponse.status).toBe(200);
    expect(publicPayload.data).toHaveLength(1);
    expect(publicPayload.data[0].titleEn).toBe('Used Dining Table');
    expect(publicPayload.pagination.total).toBe(1);
  });
});
