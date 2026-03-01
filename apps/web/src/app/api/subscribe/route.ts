import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { subscriberSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'public:subscribe:submit', {
    windowMs: 60_000,
    maxRequests: 20,
  });
  if (limited) {
    return limited;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = subscriberSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const subscriber = await prisma.subscriber.create({
      data: parsed.data,
    });

    return NextResponse.json(
      {
        id: subscriber.id,
        message: 'Subscription successful.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Email is already subscribed.' }, { status: 409 });
    }

    console.error('Failed to create subscriber.', error);
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
