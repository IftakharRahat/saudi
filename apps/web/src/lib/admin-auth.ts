import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

type AllowedRole = 'admin' | 'editor';

export async function requireAdmin(allowedRoles: AllowedRole[] = ['admin']) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Failed to get admin session.', error);
    return NextResponse.json({ error: 'Authentication error.' }, { status: 500 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (!allowedRoles.includes(session.user.role as AllowedRole)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  return null;
}
