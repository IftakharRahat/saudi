import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Failed to load admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

  const supportPhone = String((body as { supportPhone?: string })?.supportPhone ?? '').trim();
  const whatsappPhone = String((body as { whatsappPhone?: string })?.whatsappPhone ?? '').trim();
  const contactEmail = String((body as { contactEmail?: string })?.contactEmail ?? '').trim();
  const address = String((body as { address?: string })?.address ?? '').trim();

  if (!supportPhone || !whatsappPhone) {
    return NextResponse.json(
      { error: 'Support phone and WhatsApp phone are required.' },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    const settings = existing
      ? await prisma.siteSettings.update({
        where: { id: existing.id },
        data: { supportPhone, whatsappPhone, contactEmail, address },
      })
      : await prisma.siteSettings.create({
        data: { supportPhone, whatsappPhone, contactEmail, address },
      });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Failed to update admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings.' },
      { status: 500 }
    );
  }
}