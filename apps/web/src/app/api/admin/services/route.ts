import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams } from '@/lib/api-query';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { serviceCreateSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const url = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(url, 100);

  try {
    const [total, services] = await Promise.all([
      prisma.service.count(),
      prisma.service.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: services,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('Failed to fetch services for admin.', error);
    return NextResponse.json({ error: 'Failed to fetch services.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = serviceCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const service = await prisma.service.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: service }, { status: 201 });
  } catch (error) {
    console.error('Failed to create service.', error);
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 });
  }
}
