'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export default function ContactPage() {
  const { t, dir } = useI18n();

  // form state (frontend only for now)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    message: '',
  });

  const fields = useMemo(
    () => [
      { key: 'name', label: t.contactFullName, placeholder: '' },
      { key: 'phone', label: t.contactPhoneNumberLabel, placeholder: '' },
      { key: 'email', label: t.contactEmailLabel, placeholder: '' },
      { key: 'location', label: t.contactLocationLabel, placeholder: '' },
    ] as const,
    [t]
  );

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-25 pt-10 lg:px-[120px]">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-[28px] font-semibold text-[#333] md:text-[36px]">
            {t.contactTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-[603px] text-sm leading-6 text-[#666] md:text-[16px]">
            {t.contactSubtitle}
          </p>
        </div>

        {/* Two columns */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[544px_1fr]">
          {/* LEFT BOX */}
          <aside className="rounded-[15px] border-2 border-[#999999] bg-white p-10">
            <h2 className="text-[20px] font-semibold text-[#333] md:text-[24px]">
              {t.contactBoxTitle}
            </h2>
            <p className="mt-3 text-[14px] leading-5 text-[#666]">
              {t.contactBoxSubtitle}
            </p>

            <div className="mt-10 space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#004FCE]">
                  <PhoneIcon />
                </div>
                <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div className="text-[16px] font-medium leading-6 text-[#666]">
                    {t.contactPhoneNumberLabel}
                  </div>
                  <div className="text-[16px] leading-6 text-[#666]">
                    {t.contactPhoneNumberValue}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#004FCE]">
                  <MailIcon />
                </div>
                <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div className="text-[16px] font-medium leading-6 text-[#666]">
                    {t.contactEmailLabel}
                  </div>
                  <div className="text-[16px] leading-6 text-[#666]">
                    {t.contactEmailValue}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#004FCE]">
                  <PinIcon />
                </div>
                <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div className="text-[16px] font-medium leading-6 text-[#666]">
                    {t.contactLocationLabel}
                  </div>
                  <div className="text-[16px] leading-6 text-[#666]">
                    {t.contactLocationValue}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT BOX */}
          <section className="rounded-[15px] border-2 border-[#999999] bg-white p-10">
            <h2 className="text-[20px] font-semibold text-[#333] md:text-[24px]">
              {t.contactFormTitle}
            </h2>
            <p className="mt-3 text-[14px] leading-5 text-[#666]">
              {t.contactFormSubtitle}
            </p>

            {/* Form grid like figma (2 columns on desktop) */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className="space-y-3">
                  <label className="block text-[16px] font-semibold leading-6 text-[#666]">
                    {f.label}
                  </label>
                  <input
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="h-[55px] w-full rounded-[5px] border-2 border-[#999999] bg-white px-4 text-sm outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Message full width */}
            <div className="mt-6 space-y-3">
              <label className="block text-[16px] font-semibold leading-6 text-[#666]">
                {t.contactMessageLabel}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className="h-[189px] w-full resize-none rounded-[5px] border-2 border-[#999999] bg-white p-4 text-sm outline-none"
              />
            </div>

            {/* Button full width */}
            <button className="mt-10 h-[50px] w-full rounded-[5px] bg-[#004FCE] px-5 text-sm font-semibold text-white">
              {t.contactSendButton}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ===== icons (match simple blue icons like screenshot) ===== */

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8C8.2 13.8 10.2 15.8 13.2 17.4L15.2 15.4C15.5 15.1 15.9 15 16.3 15.1C17.3 15.4 18.4 15.6 19.5 15.6C20.3 15.6 21 16.3 21 17.1V20C21 20.8 20.3 21.5 19.5 21.5C10.4 21.5 2.5 13.6 2.5 4.5C2.5 3.7 3.2 3 4 3H6.9C7.7 3 8.4 3.7 8.4 4.5C8.4 5.6 8.6 6.7 8.9 7.7C9 8.1 8.9 8.5 8.6 8.8L6.6 10.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 3.5C2.5 2.4 3.4 1.5 4.5 1.5H19.5C20.6 1.5 21.5 2.4 21.5 3.5V14.5C21.5 15.6 20.6 16.5 19.5 16.5H4.5C3.4 16.5 2.5 15.6 2.5 14.5V3.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3.5 4.5L12 10.5L20.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22C12 22 19 16.5 19 11C19 6.6 15.9 4 12 4C8.1 4 5 6.6 5 11C5 16.5 12 22 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}