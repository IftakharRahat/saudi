import type { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminSignOutButton from '@/components/admin/AdminSignOutButton';
import AdminLangToggle from '@/components/admin/AdminLangToggle';
import { requireAdminPage } from '@/lib/admin-server';

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminPage();

  return (
    <div className="min-h-dvh bg-[#F5F7FB] text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Future Companies</p>
            <h1 className="text-base font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-slate-600 md:block">{session.user.email}</p>
            <AdminLangToggle />
            <AdminSignOutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:min-h-[calc(100dvh-65px)] lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
