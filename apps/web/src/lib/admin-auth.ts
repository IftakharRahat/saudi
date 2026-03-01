import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

type AllowedRole = 'admin' | 'editor';

export async function requireAdmin(allowedRoles: AllowedRole[] = ['admin']) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (!allowedRoles.includes(session.user.role as AllowedRole)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  return null;
}
