'use client';

import { useEffect, useState } from 'react';
import { fetchSiteSettings, updateSiteSettings } from '@/lib/frontend-api';
import { useAdminI18n } from '@/i18n/admin-i18n';

export default function AdminSettingsPage() {
  const [supportPhone, setSupportPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { t } = useAdminI18n();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchSiteSettings();

        if (!active) return;

        if (data) {
          setSupportPhone(data.supportPhone ?? '');
          setWhatsappPhone(data.whatsappPhone ?? '');
          setContactEmail(data.contactEmail ?? '');
          setAddress(data.address ?? '');
        }
      } catch {
        if (!active) return;
        setStatus('error');
        setMessage(t.failedLoadSettings);
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
      contactEmail,
      address,
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
        <h1 className="text-2xl font-semibold text-[#111827]">{t.siteSettings}</h1>
        <p className="mt-1 text-sm text-[#6B7280]">{t.siteSettingsSub}</p>
      </div>

      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-[#6B7280]">{t.loadingSettings}</p>
        ) : (
          <form onSubmit={onSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                {t.supportPhone}
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+966500000000"
                className="w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE]"
                required
              />
              <p className="mt-2 text-xs text-[#6B7280]">{t.supportPhoneHint}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                {t.whatsappNumber}
              </label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="966500000000"
                className="w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE]"
                required
              />
              <p className="mt-2 text-xs text-[#6B7280]">{t.whatsappNumberHint}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                {t.contactEmail}
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="info@usedfurnituresaudi.com"
                className="w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE]"
              />
              <p className="mt-2 text-xs text-[#6B7280]">{t.contactEmailHint}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                {t.address}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dammam, Eastern Province, Saudi Arabia"
                className="w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE]"
              />
              <p className="mt-2 text-xs text-[#6B7280]">{t.addressHint}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-[8px] bg-[#004FCE] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
              >
                {saving ? t.saving : t.saveSettings}
              </button>
            </div>

            {status !== 'idle' && (
              <p
                className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-600'
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