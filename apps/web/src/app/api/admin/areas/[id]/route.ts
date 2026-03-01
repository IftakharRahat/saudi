import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { idParamSchema, serviceAreaUpdateSchema } from '@/lib/validation';

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
    return NextResponse.json({ error: 'Invalid service area id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    const area = await prisma.serviceArea.findUnique({
      where: { id },
    });

    if (!area) {
      return NextResponse.json({ error: 'Service area not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: area });
  } catch (error) {
    console.error(`Failed to fetch admin service area ${id}.`, error);
    return NextResponse.json({ error: 'Failed to fetch service area.' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid service area id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = serviceAreaUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const area = await prisma.serviceArea.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: area });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Service area not found.' }, { status: 404 });
    }

    console.error(`Failed to update service area ${id}.`, error);
    return NextResponse.json({ error: 'Failed to update service area.' }, { status: 500 });
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
    return NextResponse.json({ error: 'Invalid service area id.' }, { status: 400 });
  }
  const { id } = parsedId.data;

  try {
    await prisma.serviceArea.delete({ where: { id } });
    return NextResponse.json({ message: 'Service area deleted.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Service area not found.' }, { status: 404 });
    }

    console.error(`Failed to delete service area ${id}.`, error);
    return NextResponse.json({ error: 'Failed to delete service area.' }, { status: 500 });
  }
}
