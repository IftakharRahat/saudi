'use client';

import { useEffect, useState } from 'react';
import { fetchAdminSubscribers } from '@/lib/admin-client';
import type { SubscriberRecord } from '@/lib/content-types';

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminSubscribersPage() {
  const [items, setItems] = useState<SubscriberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminSubscribers();
      setItems(data);
    } catch {
      setError('Failed to load subscribers.');
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
          <h2 className="text-xl font-semibold text-slate-900">Newsletter Subscribers</h2>
          <p className="mt-1 text-sm text-slate-600">View all email subscriptions captured from the website.</p>
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
          <p className="text-sm text-slate-500">No subscribers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Date</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Email</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="px-2 py-2 text-slate-600">{formatDate(item.createdAt)}</td>
                    <td className="px-2 py-2">{item.email}</td>
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
