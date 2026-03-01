import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rate-limit';
import { idParamSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const limited = enforceRateLimit(request, 'public:services:item', {
    windowMs: 60_000,
    maxRequests: 180,
  });
  if (limited) {
    return limited;
  }

  const params = await context.params;
  const idParsed = idParamSchema.safeParse(params);
  if (!idParsed.success) {
    return NextResponse.json({ error: 'Invalid service id.' }, { status: 400 });
  }
  const { id } = idParsed.data;

  try {
    const service = await prisma.service.findFirst({
      where: { id, isActive: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error(`Failed to fetch service ${id}.`, error);
    return NextResponse.json({ error: 'Failed to fetch service.' }, { status: 500 });
  }
}
