'use client';

import { useEffect, useState } from 'react';
import { fetchSiteSettings, updateSiteSettings } from '@/lib/frontend-api';

export default function AdminSettingsPage() {
  const [supportPhone, setSupportPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchSiteSettings();

        if (!active) return;

        if (data) {
          setSupportPhone(data.supportPhone ?? '');
          setWhatsappPhone(data.whatsappPhone ?? '');
        }
      } catch {
        if (!active) return;
        setStatus('error');
        setMessage('Failed to load current settings.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus('idle');
    setMessage('');

    const result = await updateSiteSettings({
      supportPhone,
      whatsappPhone,
    });

    if (result.ok) {
      setStatus('success');
      setMessage(result.message);
    } else {
      setStatus('error');
      setMessage(result.message);
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Site Settings</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Manage the floating call and WhatsApp contact buttons for the website.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-[#6B7280]">Loading settings...</p>
        ) : (
          <form onSubmit={onSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Support Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+966500000000"
                className="w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE]"
                required
              />
              <p className="mt-2 text-xs text-[#6B7280]">
                This value will be used for the call button link.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="966500000000"
                className="w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE]"
                required
              />
              <p className="mt-2 text-xs text-[#6B7280]">
                Use digits only for WhatsApp, without spaces or plus sign.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-[8px] bg-[#004FCE] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

            {status !== 'idle' && (
              <p
                className={`text-sm ${
                  status === 'success' ? 'text-green-700' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}