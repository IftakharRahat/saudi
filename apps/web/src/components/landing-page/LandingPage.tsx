'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

type ServiceCard = { title: string; img: string };

export default function LandingPage() {
  const { t, dir } = useI18n();

  // assets from: /public/landing-page/
 const services: ServiceCard[] = useMemo(
  () => [
    { title: t.service1, img: '/product-details/pd_img1.png' },
    { title: t.service2, img: '/product-details/s2.png' },
    { title: t.service3, img: '/product-details/s3.png' },
    { title: t.service4, img: '/product-details/s4.png' },
    { title: t.service5, img: '/product-details/s5.png' },
    { title: t.service6, img: '/product-details/s6.png' },
    { title: t.service7, img: '/product-details/s7.png' },
    { title: t.service8, img: '/product-details/s8.png' },
    { title: t.service9, img: '/product-details/s9.png' },
  ],
  [t]
);

  const whyCards = useMemo(
    () => [
      { icon: '/landing-page/Icon (1).png', title: t.whyCard1Title, desc: t.whyCard1Desc, featured: true },
      { icon: '/landing-page/Icon (2).png', title: t.whyCard2Title, desc: t.whyCard2Desc, featured: false },
      { icon: '/landing-page/Icon 04.png', title: t.whyCard3Title, desc: t.whyCard3Desc, featured: false },
      { icon: '/landing-page/Icon.png', title: t.whyCard4Title, desc: t.whyCard4Desc, featured: false },
    ],
    [t]
  );

  const faqs = useMemo(
    () => [
      { q: t.faqQ1, a: t.faqA1 },
      { q: t.faqQ2, a: t.faqA2 },
      { q: t.faqQ3, a: t.faqA3 },
      { q: t.faqQ4, a: t.faqA4 },
      { q: t.faqQ5, a: t.faqA5 },
      { q: t.faqQ6, a: t.faqA6 },
      { q: t.faqQ7, a: t.faqA7 },
      { q: t.faqQ8, a: t.faqA8 },
    ],
    [t]
  );

  const [openFaq, setOpenFaq] = useState<number | null>(1); // open 2nd like screenshot vibe

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="w-full">
  <div
    className="w-full"
    style={{
      background:
        'linear-gradient(182.36deg, rgba(243, 248, 255, 0.68) 2.77%, rgba(243, 248, 255, 0.68) 76.53%, rgba(146, 149, 153, 0.4148) 98.66%)',
    }}
  >
          <div className="relative w-full overflow-hidden">
      {/* background image FULL WIDTH */}
      <div className="relative h-[420px] w-full md:h-[520px]">
        <Image
          src="/landing-page/banner.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

               {/* centered content */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className={`w-full max-w-[736px] ${dir === 'rtl' ? 'text-right' : 'text-center'}`}>
                  <div className="mx-auto inline-flex h-11 items-center justify-center rounded-[22px] bg-[#CEE1FF] px-6 text-xs font-medium text-[#333]">
                    {t.heroBadge}
                  </div>

                  <h1 className="mt-4 text-[32px] font-black leading-[42px] md:text-[48px] md:leading-[70px]">
  <span className="text-[#004FCE]">
    {t.heroTitleBlue}
  </span>
  <span className="text-[#333] font-normal">
    {t.heroTitleRest}
  </span>
</h1>

                  <p className="mx-auto mt-4 max-w-[638px] text-sm leading-6 text-[#333] md:text-[16px] md:leading-[24px]">
                    {t.heroSubtitle}
                  </p>

                  <div className="mt-6 flex justify-center">
  <Link
    href="/contact"
    className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[5px] bg-[#004FCE] px-6 text-sm font-semibold text-white"
  >
    {/* phone icon */}
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.7 3.8.7.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C11.3 22 2 12.7 2 1c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.3.2 2.6.7 3.8.1.4 0 .8-.2 1.1L6.6 10.8Z"
        fill="white"
      />
    </svg>
    <span>{t.contactUsCta}</span>
  </Link>
</div>
                </div>
              </div>
            </div>
          </div>
        
      </section>

      {/* SECTION 2: Premium Services (same cards style as product) */}
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#333] md:text-[28px]">{t.premiumTitle}</h2>
            <p className="mx-auto mt-2 max-w-3xl text-sm text-[#666]">{t.premiumSubtitle}</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-[15px] border border-black/10 bg-white shadow-[0px_4px_60px_0px_rgba(0,0,0,0.06)]"
              >
                <div className="relative aspect-[544/277] w-full bg-black/5">
                  <Image src={card.img} alt={card.title} fill className="object-cover" />
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#004FCE]">{card.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#666]">
  {t.serviceCardDesc}
</p>
                  <button className="mt-4 h-[31px] rounded-[5px] border border-black/20 bg-white px-4 text-xs text-[#333]">
  {t.viewMoreBtn}
</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button className="h-[50px] rounded-[5px] bg-[#004FCE] px-6 text-sm font-semibold text-white">
              {t.viewAllServices}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Testimonial */}
      {/* SECTION 3: Testimonial */}
<section className="w-full bg-white">
  <TestimonialCarousel />
</section>
      {/* SECTION 4: Sale + YouTube image */}
      <section className="w-full bg-white">
        <div className="mx-auto grid w-full max-w-[1680px] items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:px-[120px]">
          <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="flex items-start gap-4">
              <div className="h-[65px] w-[7px] rounded-[3.5px] bg-[#004FCE]" />
              <h3 className="pt-3 text-[22px] font-normal text-[#333] md:text-[28px]">{t.saleTitle}</h3>
            </div>

            <p className="mt-6 text-[18px] font-medium leading-8 text-[#333] md:text-[28px] md:leading-[45px]">
              {t.saleDesc}
            </p>

            <button className="mt-8 h-[59px] rounded-[5px] bg-[#004FCE] px-6 text-[16px] font-semibold text-white shadow-[0px_4px_60px_0px_rgba(0,0,0,0.08)] md:text-[18px]">
              {t.fillForm} →
            </button>
          </div>

          <div className="relative overflow-hidden rounded-[11px]">
            <div className="relative aspect-[828/635] w-full bg-black/5">
              <Image src="/landing-page/yt_image.png" alt="YouTube" fill className="object-cover" />
              <div className="absolute inset-0 grid place-items-center">
                <Image src="/landing-page/yt_button.png" alt="Play" width={115} height={80} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Why choose us */}
      <section className="w-full bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-[26px] font-semibold text-[#333] md:text-[36px]">{t.whyChoose}</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((c, idx) => (
  <div
    key={idx}
    className="group rounded-[10px] bg-white p-6 text-center text-[#333] transition-colors duration-300 hover:bg-[#004FCE] hover:text-white"
  >
    {/* Icon Container */}
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F4F5F7] group-hover:bg-white/10">
      <Image src={c.icon} alt="icon" width={56} height={56} />
    </div>
    
    <h3 className="mt-5 text-[18px] font-semibold leading-7">{c.title}</h3>
    <p className="mt-3 text-sm leading-6 opacity-95">{c.desc}</p>
  </div>
))}
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-[26px] font-semibold text-[#333] md:text-[36px]">{t.faqTitle}</h2>
            <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-[#999]">{t.faqSubtitle}</p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-[4px] bg-white shadow-[1px_2px_13.3px_2px_rgba(0,0,0,0.05)]"
                >
                  <div className="absolute left-0 top-0 h-full w-[7px] bg-[#004FCE]" />
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className={`flex w-full items-center justify-between px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                  >
                    <span className="text-sm font-medium text-[#333] md:text-[16px]">{item.q}</span>
                    <span className="text-[18px] font-semibold text-[#004FCE]">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className={`px-6 pb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <p className="text-sm leading-6 text-[#999]">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

     {/* SECTION 7: Ready to sell CTA */}
<section className="w-full bg-white">
  <div className="mx-auto w-full max-w-[1680px] px-4 pb-16 lg:px-[120px]">
    <div className="relative overflow-hidden rounded-[10px] bg-[#F0F7FF] px-6 py-10 md:px-12">
      {/* ===== Background decorations (BEHIND content) ===== */}
      {/* Right top soft blob */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-[340px] w-[340px] rounded-full opacity-60 blur-[70px]"
        style={{ background: 'rgba(127, 178, 225, 1)' }}
      />

      {/* Left bottom soft blob */}
      <div
        className="pointer-events-none absolute -left-20 -bottom-24 h-[360px] w-[360px] rounded-full opacity-60 blur-[75px]"
        style={{ background: 'rgba(106, 165, 220, 1)' }}
      />

      {/* Ellipse 1 (Top-right) — thin stroke + very soft fill */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: '148.736px',
          height: '242.672px',
          top: '-50px',
          right: '-88px',
          transform: 'rotate(-77.75deg)',
          borderRadius: '50%',
          border: '1px solid #F2F2F2',
          background: 'rgba(255,255,255,0.08)',
        }}
      />

      {/* Ellipse 2 (Bottom-left) — thin stroke + very soft fill */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: '189.832px',
          height: '309.722px',
          bottom: '-200px',
          left: '-10px',
          transform: 'rotate(49.33deg)',
          borderRadius: '50%',
          border: '1px solid #F2F2F2',
          background: 'rgba(255,255,255,0.08)',
        }}
      />

      {/* Blue squares (polygons) */}
      <div
        className="pointer-events-none absolute rounded-[2px] bg-[#004FCE]"
        style={{
          width: '33px',
          height: '33px',
          top: '14px',
          right: '80px',
          transform: 'rotate(-42.33deg)',
        }}
      />
      <div
        className="pointer-events-none absolute rounded-[2px] bg-[#004FCE]"
        style={{
          width: '30px',
          height: '30px',
          bottom: '40px',
          left: '50px',
          transform: 'rotate(40.88deg)',
        }}
      />

      {/* ===== Content ===== */}
      <div className="relative z-10 text-center">
        <h3 className="text-[18px] font-semibold text-[#333] md:text-[24px]">
          {t.readySellTitle}
        </h3>

        <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-[#666] md:text-[16px]">
          {t.readySellDesc}
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-[650px] flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-0">
          {/* Input */}
          <input
            className="h-[57px] w-full rounded-[5px] border border-black/10 bg-[#FFFBFB] px-5 text-sm outline-none sm:rounded-r-none"
            placeholder={t.footerEmailPlaceholder}
          />

          {/* Button */}
          <Link
  href="/contact"
  className="inline-flex h-[57px] w-full items-center justify-center gap-2 rounded-[5px] bg-[#004FCE] text-sm font-semibold text-white sm:w-[190px] sm:rounded-l-none"
>
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.7 3.8.7.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C11.3 22 2 12.7 2 1c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.3.2 2.6.7 3.8.1.4 0 .8-.2 1.1L6.6 10.8Z"
      fill="white"
    />
  </svg>
  <span>{t.contactUsCta}</span>
</Link>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );


}


function TestimonialCarousel() {
  const { t, dir } = useI18n();

  // ✅ For now: same review duplicated 3 times (later you can replace)
  const slides = [
    {
      text: t.testimonialText,
      name: t.testimonialName,
      title: t.testimonialRole,
    },
    {
      text: t.testimonialText,
      name: t.testimonialName,
      title: t.testimonialRole,
    },
    {
      text: t.testimonialText,
      name: t.testimonialName,
      title: t.testimonialRole,
    },
  ] as const;

  const [idx, setIdx] = useState(0);

  return (
    <div className="mx-auto w-full max-w-[1144px] px-4 py-14">
      <div className="text-center">
        <h2 className="text-[26px] font-semibold text-[#333] md:text-[36px]">{t.peopleSayTitle}</h2>
        <p className="mt-2 text-sm text-[#666]">{t.peopleSaySub}</p>
      </div>

      {/* CARD (949 width on large screens) */}
      <div className="mt-10 flex justify-center">
        <div
          className="relative w-full max-w-[949px] rounded-[10px] bg-[#F3F8FF] px-6 py-10 md:px-14"
          style={{ opacity: 1 }}
        >
          {/* Quote stroke (rotated like figma) */}
          <div className="absolute left-8 top-8">
            <Image
              src="/landing-page/testimonial_sign.png"
              alt="Quote"
              width={103}
              height={80}
              className="rotate-[179.54deg]"
              priority={false}
            />
          </div>

          {/* Text block */}
          <p
            className={`mx-auto mt-24 max-w-[949px] text-[18px] font-medium text-[#333] md:text-[20px] ${
              dir === 'rtl' ? 'text-right' : 'text-center'
            }`}
            style={{ lineHeight: '45px', opacity: 0.66 }}
          >
            {slides[idx].text}
          </p>

          {/* Person row */}
          <div className="mt-10 flex items-center gap-3">
            <div className="relative h-[56px] w-[56px] overflow-hidden rounded-full bg-black/5">
              <Image
                src="/landing-page/elegant-businessman-office 1.png"
                alt="User"
                fill
                className="object-cover"
              />
            </div>

            <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {/* Name */}
              <div className="text-[20px] font-semibold text-[#333] md:text-[24px]" style={{ lineHeight: '24px' }}>
                {slides[idx].name}
              </div>

              {/* Title */}
              <div className="mt-1 text-[14px] text-[#666] md:text-[16px]" style={{ lineHeight: '16px' }}>
                {slides[idx].title}
              </div>

              {/* Stars (174x30, color #E38F2A) */}
              <div className="mt-2 text-[22px]" style={{ color: '#E38F2A', lineHeight: '30px' }}>
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots (3-dot carousel) */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {slides.map((_, i) => {
          const active = i === idx;
          return (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={[
                'rounded-full transition-all duration-200',
                active ? 'h-[22px] w-[22px] bg-[#004FCE]' : 'h-4 w-4 bg-[#129FFF33]',
              ].join(' ')}
            />
          );
        })}
      </div>
    </div>
  );
}