import { NextResponse } from 'next/server';
import { contactSubmissionSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';
import { sendContactNotification } from '@/lib/mailer';
import { enforceRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'public:contact:submit', {
    windowMs: 60_000,
    maxRequests: 15,
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

  const parsed = contactSubmissionSchema.safeParse(body);

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
    const submission = await prisma.contactSubmission.create({
      data: parsed.data,
    });

    try {
      await sendContactNotification({
        ...parsed.data,
        submittedAt: submission.createdAt,
      });
    } catch (emailError) {
      console.error('Failed to send contact notification email.', emailError);
    }

    return NextResponse.json(
      {
        id: submission.id,
        message: 'Contact form submitted successfully.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to persist contact submission.', error);
    return NextResponse.json({ error: 'Failed to submit contact form.' }, { status: 500 });
  }
}
