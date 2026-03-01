import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { faqUpdateSchema, idParamSchema } from '@/lib/validation';

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
    return NextResponse.json({ error: 'Invalid FAQ id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: faq });
  } catch (error) {
    console.error(`Failed to fetch admin FAQ ${id}.`, error);
    return NextResponse.json({ error: 'Failed to fetch FAQ.' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid FAQ id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = faqUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const faq = await prisma.fAQ.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: faq });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    console.error(`Failed to update FAQ ${id}.`, error);
    return NextResponse.json({ error: 'Failed to update FAQ.' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid FAQ id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    await prisma.fAQ.delete({ where: { id } });
    return NextResponse.json({ message: 'FAQ deleted.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    console.error(`Failed to delete FAQ ${id}.`, error);
    return NextResponse.json({ error: 'Failed to delete FAQ.' }, { status: 500 });
  }
}
