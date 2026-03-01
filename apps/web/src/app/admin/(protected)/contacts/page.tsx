'use client';

import { useEffect, useState } from 'react';
import { fetchAdminContacts } from '@/lib/admin-client';
import type { ContactSubmissionRecord } from '@/lib/content-types';

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactSubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminContacts();
      setItems(data);
    } catch {
      setError('Failed to load contact submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Contact Submissions</h2>
          <p className="mt-1 text-sm text-slate-600">Read incoming contact requests from the website.</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No contact submissions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Date</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Name</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Phone</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Email</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Location</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Message</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 align-top">
                    <td className="px-2 py-2 text-slate-600">{formatDate(item.createdAt)}</td>
                    <td className="px-2 py-2">{item.name}</td>
                    <td className="px-2 py-2">{item.phone}</td>
                    <td className="px-2 py-2">{item.email}</td>
                    <td className="px-2 py-2">{item.location}</td>
                    <td className="max-w-[420px] whitespace-pre-wrap px-2 py-2">{item.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
