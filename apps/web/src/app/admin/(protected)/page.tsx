import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const LINKS = [
  { href: '/admin/services', label: 'Manage Services' },
  { href: '/admin/products', label: 'Manage Products' },
  { href: '/admin/testimonials', label: 'Manage Testimonials' },
  { href: '/admin/faqs', label: 'Manage FAQs' },
  { href: '/admin/areas', label: 'Manage Service Areas' },
  { href: '/admin/contacts', label: 'View Contact Submissions' },
  { href: '/admin/subscribers', label: 'View Subscribers' },
];

export default async function AdminDashboardPage() {
  const [services, products, testimonials, faqs, areas, contacts, subscribers] = await Promise.all([
    prisma.service.count(),
    prisma.product.count(),
    prisma.testimonial.count(),
    prisma.fAQ.count(),
    prisma.serviceArea.count(),
    prisma.contactSubmission.count(),
    prisma.subscriber.count(),
  ]);

  const stats = [
    { label: 'Services', value: services },
    { label: 'Products', value: products },
    { label: 'Testimonials', value: testimonials },
    { label: 'FAQs', value: faqs },
    { label: 'Areas', value: areas },
    { label: 'Contacts', value: contacts },
    { label: 'Subscribers', value: subscribers },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="mt-1 text-sm text-slate-600">Use the sections below to manage website content.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Quick Actions</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
