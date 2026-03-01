import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

type AllowedRole = 'admin' | 'editor';

export async function requireAdminPage(allowedRoles: AllowedRole[] = ['admin']) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/admin/login');
  }

  if (!allowedRoles.includes(session.user.role as AllowedRole)) {
    redirect('/admin/login');
  }

  return session;
}
