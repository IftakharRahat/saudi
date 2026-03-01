import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { idParamSchema, testimonialUpdateSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const params = await context.params;
  const parsedId = idParamSchema.safeParse(params);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Invalid testimonial id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: testimonial });
  } catch (error) {
    console.error(`Failed to fetch admin testimonial ${id}.`, error);
    return NextResponse.json({ error: 'Failed to fetch testimonial.' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const params = await context.params;
  const parsedId = idParamSchema.safeParse(params);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Invalid testimonial id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = testimonialUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: testimonial });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 });
    }

    console.error(`Failed to update testimonial ${id}.`, error);
    return NextResponse.json({ error: 'Failed to update testimonial.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  const params = await context.params;
  const parsedId = idParamSchema.safeParse(params);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Invalid testimonial id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ message: 'Testimonial deleted.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 });
    }

    console.error(`Failed to delete testimonial ${id}.`, error);
    return NextResponse.json({ error: 'Failed to delete testimonial.' }, { status: 500 });
  }
}
