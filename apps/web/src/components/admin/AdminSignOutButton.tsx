'use client';

import { signOut } from 'next-auth/react';
import { useAdminI18n } from '@/i18n/admin-i18n';

export default function AdminSignOutButton() {
  const { t } = useAdminI18n();

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {t.signOut}
    </button>
  );
}
