'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/faqs', label: 'FAQs' },
  { href: '/admin/areas', label: 'Service Areas' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 lg:w-64 lg:border-b-0 lg:border-r">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Admin Panel</h2>
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
