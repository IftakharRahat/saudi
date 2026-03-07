import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings.' },
      { status: 500 }
    );
  }
}