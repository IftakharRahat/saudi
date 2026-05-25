import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { toPageSeoRecord, toPageSeoUpdateData } from '@/lib/page-seo';
import { prisma } from '@/lib/prisma';
import { idParamSchema, seoUpdateSchema } from '@/lib/validation';

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
    return NextResponse.json({ error: 'Invalid SEO entry id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    const entry = await prisma.pageSeo.findUnique({
      where: { id },
    });

    if (!entry) {
      return NextResponse.json({ error: 'SEO entry not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: toPageSeoRecord(entry) });
  } catch (error) {
    console.error(`Failed to fetch admin SEO entry ${id}.`, error);
    return NextResponse.json({ error: 'Failed to fetch SEO entry.' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid SEO entry id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = seoUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const entry = await prisma.pageSeo.update({
      where: { id },
      data: toPageSeoUpdateData(parsed.data),
    });

    return NextResponse.json({ data: toPageSeoRecord(entry) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'SEO entry not found.' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'A SEO entry for this URL already exists.' }, { status: 409 });
    }

    console.error(`Failed to update SEO entry ${id}.`, error);
    return NextResponse.json({ error: 'Failed to update SEO entry.' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid SEO entry id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    await prisma.pageSeo.delete({ where: { id } });
    return NextResponse.json({ message: 'SEO entry deleted.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'SEO entry not found.' }, { status: 404 });
    }

    console.error(`Failed to delete SEO entry ${id}.`, error);
    return NextResponse.json({ error: 'Failed to delete SEO entry.' }, { status: 500 });
  }
}
