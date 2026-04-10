'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminI18n } from '@/i18n/admin-i18n';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useAdminI18n();

  const LINKS = [
    { href: '/admin', label: t.dashboard },
    { href: '/admin/services', label: t.services },
    { href: '/admin/products', label: t.products },
    { href: '/admin/testimonials', label: t.testimonials },
    { href: '/admin/faqs', label: t.faqs },
    { href: '/admin/areas', label: t.serviceAreas },
    { href: '/admin/contacts', label: t.contacts },
    { href: '/admin/subscribers', label: t.subscribers },
    { href: '/admin/settings', label: t.settings },
    { href: '/admin/seo', label: t.seo },
    { href: '/admin/account', label: t.account },
  ];

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 lg:w-64 lg:border-b-0 lg:border-r">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{t.adminPanel}</h2>
      <nav className="grid gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'rounded-md px-3 py-2 text-sm font-medium transition',
                active ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100',
              ].join(' ')}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
