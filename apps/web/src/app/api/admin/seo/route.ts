import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams } from '@/lib/api-query';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { seoCreateSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const url = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(url, 100);

  try {
    const [total, entries] = await Promise.all([
      prisma.pageSeo.count(),
      prisma.pageSeo.findMany({
        orderBy: [{ updatedAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: entries,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('Failed to fetch SEO entries for admin.', error);
    return NextResponse.json({ error: 'Failed to fetch SEO entries.' }, { status: 500 });
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

  const parsed = seoCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const entry = await prisma.pageSeo.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (error) {
    // Check for unique constraint violation on pageSlug
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'A SEO entry for this page slug already exists.' },
        { status: 409 }
      );
    }
    console.error('Failed to create SEO entry.', error);
    return NextResponse.json({ error: 'Failed to create SEO entry.' }, { status: 500 });
  }
}
