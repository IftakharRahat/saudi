'use client';

import { signOut } from 'next-auth/react';

export default function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      Sign out
    </button>
  );
}
