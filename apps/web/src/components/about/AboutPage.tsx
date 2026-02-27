'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

type Feature = { title: string; desc: string; icon: 'medal' | 'cash' | 'truck' };
type Step = { title: string; desc: string };

export default function AboutPage() {
  const { t, dir } = useI18n();

  const features: Feature[] = useMemo(
    () => [
      { title: t.aboutFeature1Title, desc: t.aboutFeature1Desc, icon: 'medal' },
      { title: t.aboutFeature2Title, desc: t.aboutFeature2Desc, icon: 'cash' },
      { title: t.aboutFeature3Title, desc: t.aboutFeature3Desc, icon: 'truck' },
    ],
    [t]
  );

  const steps: Step[] = useMemo(
    () => [
      { title: t.aboutStep1Title, desc: t.aboutStep1Desc },
      { title: t.aboutStep2Title, desc: t.aboutStep2Desc },
      { title: t.aboutStep3Title, desc: t.aboutStep3Desc },
      { title: t.aboutStep4Title, desc: t.aboutStep4Desc },
      { title: t.aboutStep5Title, desc: t.aboutStep5Desc },
    ],
    [t]
  );

  return (
    <div className="w-full bg-white">
      {/* SECTION 1: HERO */}
      <section
        className="w-full"
        style={{
          background:
            'linear-gradient(176.72deg, rgba(255, 255, 255, 0.67) 2.1%, rgba(230, 236, 248, 0.89) 106.22%)',
        }}
      >
        <div className="mx-auto w-full max-w-[1680px] px-4 py-12 lg:px-[120px]">
          {/* pill */}
          <div className="flex justify-center">
            <div className="flex h-[47px] w-[180px] items-center justify-center rounded-[23.5px] bg-[#DFEBFE]">
              <span className="text-[16px] font-semibold leading-6 text-[#333]">
                {t.aboutHeroPill}
              </span>
            </div>
          </div>

          {/* title */}
          <div className="mt-8 text-center">
            <h1 className="mx-auto max-w-[928px] text-[28px] font-medium leading-[42px] text-[#333] md:text-[48px] md:leading-[70px]">
              <span className="font-medium">{t.aboutHeroTitleLine1}</span>
              <br />
              <span className="font-semibold">{t.aboutHeroTitleLine2a}</span>
              <span className="font-extrabold text-[#004FCE]">{t.aboutHeroCity}</span>
              <span className="font-semibold">{t.aboutHeroTitleLine2b}</span>
            </h1>

            <p className="mx-auto mt-4 max-w-[798px] text-sm leading-6 text-[#333] md:text-[16px] md:leading-6">
              {t.aboutHeroSubtitle}
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[5px] bg-[#004FCE] px-6 text-[16px] font-medium text-white"
              >
                <PhoneIconWhite />
                {t.contactUsCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT + FEATURES */}
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="grid gap-8 lg:grid-cols-[900px_560px]">
{/* LEFT */}
<div className="bg-white lg:h-[448px]">

  {/* About Us (blue text only) */}
  <div className="text-[16px] font-medium text-[#004FCE]">
    {t.aboutTag}
  </div>

  {/* Title Row */}
  <div className="mt-4 flex items-start gap-4">
    {/* Blue vertical rectangle */}
    <div className="mt-1 h-[70px] w-[9px] rounded-[4.5px] bg-[#004FCE]" />

    <h2 className="text-[28px] font-semibold text-[#333] md:text-[34px] py-3 px-3">
      {t.aboutSection2Title}
    </h2>
  </div>

  {/* Paragraph (aligned with title, NOT with bar) */}
  <p
    className={[
      'mt-8 ml-[1px] max-w-[828px] text-[16px] leading-[150%] text-[#666] text-justify',
      dir === 'rtl' ? 'text-right ml-0 mr-[13px]' : '',
    ].join(' ')}
    style={{ whiteSpace: 'pre-line' }}
  >
    {t.aboutSection2Body}
  </p>

</div>

            {/* RIGHT: feature cards */}
            <div className="space-y-4 max-w-[560px]">
              {features.map((f) => (
                <div key={f.title} className="relative overflow-hidden rounded-[5px] bg-[#E9F1FF]">
                  {/* blue left strip */}
                  <div className="absolute left-0 top-0 h-full w-[12px] bg-[#004FCE]" />
                  <div className="flex min-h-[136px] items-start gap-4 p-6 pl-10">
                    <div className="mt-1 text-[#666]">
                      {f.icon === 'medal' ? <MedalIcon /> : f.icon === 'cash' ? <CashIcon /> : <TruckIcon />}
                    </div>

                    <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <div className="text-[18px] font-semibold text-[#333]">{f.title}</div>
                      <div className="mt-2 text-[13px] leading-5 text-[#666]">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SIMPLE PROCESS */}
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 pb-16 lg:px-[120px]">
          <div className="mx-auto max-w-[1112px] text-center">
            <div className="text-[20px] font-normal text-[#004FCE] md:text-[24px]">
              {t.aboutProcessPill}
            </div>

            <h2 className="mt-4 text-[26px] font-semibold text-[#333] md:text-[36px]">
              {t.aboutProcessTitle}
            </h2>

            <p className="mx-auto mt-4 max-w-[1112px] text-[16px] leading-6 text-[#666]">
              {t.aboutProcessSubtitle}
            </p>
          </div>

          {/* timeline */}
<div className="mx-auto mt-18 max-w-[1013px]">
  <div className="space-y-15">
    {steps.map((s, i) => (
      <div key={s.title} className="grid grid-cols-[72px_1fr] gap-x-8">
        {/* Left: number + connector */}
        <div className="relative flex flex-col items-center">
  {/* Circle */}
  <div className="grid h-[60px] w-[60px] place-items-center rounded-full bg-[#004FCE] text-[24px] font-semibold text-white">
    {i + 1}
  </div>

  {/* Connector */}
  {i !== steps.length - 1 && (
    <div className="absolute top-[65px] bottom-[-55px] w-[4px] bg-[#999999]" />
  )}
</div>

        {/* Right: text */}
        <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className="pt-[6px] text-[24px] font-semibold leading-[100%] text-[#333333]">
            {s.title}
          </div>
          <div className="mt-2 text-[16px] font-normal leading-[150%] text-[#666666]">
            {s.desc}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* CTA Blue box */}
          <div className="mx-auto mt-28 max-w-[1112px] rounded-[15px] bg-[#004FCE] px-6 py-12 text-center">
            <h3 className="text-[28px] font-semibold text-white md:text-[36px]">
              {t.aboutCtaTitle}
            </h3>
            <p className="mx-auto mt-4 max-w-[926px] text-[16px] text-white md:text-[20px]">
              {t.aboutCtaSubtitle}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-[50px] w-[139px] items-center justify-center gap-2 rounded-[5px] bg-white text-[16px] font-medium text-[#004FCE]"
              >
                <PhoneIconBlue />
                {t.contactUsCta}
              </Link>

              <Link
                href="/services"
                className="inline-flex h-[50px] w-[139px] items-center justify-center rounded-[5px] border border-white text-[16px] font-medium text-white"
              >
                {t.aboutCtaButton2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========= Icons ========= */

function PhoneIconWhite() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8C8.2 13.8 10.2 15.8 13.2 17.4L15.2 15.4C15.5 15.1 15.9 15 16.3 15.1C17.3 15.4 18.4 15.6 19.5 15.6C20.3 15.6 21 16.3 21 17.1V20C21 20.8 20.3 21.5 19.5 21.5C10.4 21.5 2.5 13.6 2.5 4.5C2.5 3.7 3.2 3 4 3H6.9C7.7 3 8.4 3.7 8.4 4.5C8.4 5.6 8.6 6.7 8.9 7.7C9 8.1 8.9 8.5 8.6 8.8L6.6 10.8Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function PhoneIconBlue() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8C8.2 13.8 10.2 15.8 13.2 17.4L15.2 15.4C15.5 15.1 15.9 15 16.3 15.1C17.3 15.4 18.4 15.6 19.5 15.6C20.3 15.6 21 16.3 21 17.1V20C21 20.8 20.3 21.5 19.5 21.5C10.4 21.5 2.5 13.6 2.5 4.5C2.5 3.7 3.2 3 4 3H6.9C7.7 3 8.4 3.7 8.4 4.5C8.4 5.6 8.6 6.7 8.9 7.7C9 8.1 8.9 8.5 8.9 8.5L6.6 10.8Z"
        fill="#004FCE"
      />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 2H16V8L12 6L8 8V2Z" stroke="#666" strokeWidth="2" />
      <circle cx="12" cy="15" r="6" stroke="#666" strokeWidth="2" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="#666" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" stroke="#666" strokeWidth="2" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7H15V18H3V7Z" stroke="#666" strokeWidth="2" />
      <path d="M15 10H19L21 12V18H15V10Z" stroke="#666" strokeWidth="2" />
      <circle cx="7" cy="18" r="2" stroke="#666" strokeWidth="2" />
      <circle cx="18" cy="18" r="2" stroke="#666" strokeWidth="2" />
    </svg>
  );
}