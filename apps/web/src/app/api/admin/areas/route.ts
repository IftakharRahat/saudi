import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams } from '@/lib/api-query';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { serviceAreaCreateSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const url = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(url, 100);

  try {
    const [total, areas] = await Promise.all([
      prisma.serviceArea.count(),
      prisma.serviceArea.findMany({
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: areas,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('Failed to fetch service areas for admin.', error);
    return NextResponse.json({ error: 'Failed to fetch service areas.' }, { status: 500 });
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

  const parsed = serviceAreaCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const area = await prisma.serviceArea.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: area }, { status: 201 });
  } catch (error) {
    console.error('Failed to create service area.', error);
    return NextResponse.json({ error: 'Failed to create service area.' }, { status: 500 });
  }
}
