import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSeoUrlOptions } from '@/lib/seo-url-options';

export const runtime = 'nodejs';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) {
    return authError;
  }

  try {
    const options = await getSeoUrlOptions();
    return NextResponse.json({ data: options });
  } catch (error) {
    console.error('Failed to fetch SEO URL options.', error);
    return NextResponse.json({ error: 'Failed to fetch SEO URL options.' }, { status: 500 });
  }
}
