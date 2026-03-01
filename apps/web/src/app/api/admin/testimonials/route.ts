import { NextResponse } from 'next/server';
import { createPaginationMeta, parsePaginationParams } from '@/lib/api-query';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { testimonialCreateSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const url = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(url, 100);

  try {
    const [total, testimonials] = await Promise.all([
      prisma.testimonial.count(),
      prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: testimonials,
      pagination: createPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error('Failed to fetch testimonials for admin.', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials.' }, { status: 500 });
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

  const parsed = testimonialCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: testimonial }, { status: 201 });
  } catch (error) {
    console.error('Failed to create testimonial.', error);
    return NextResponse.json({ error: 'Failed to create testimonial.' }, { status: 500 });
  }
}
