'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import {
  FaqRecord,
  ServiceRecord,
  SiteSettingsRecord,
  TestimonialRecord,
  pickLocalized,
} from '@/lib/content-types';
import {
  fetchFaqs,
  fetchServices,
  fetchSiteSettings,
  fetchTestimonials,
  submitNewsletter,
} from '@/lib/frontend-api';

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  img: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type TestimonialSlide = {
  id: string;
  text: string;
  name: string;
  role: string;
  rating: number;
  photoUrl: string;
};

const SERVICE_FALLBACK_IMAGES = [
  '/product-details/pd_img1.png',
  '/product-details/s2.png',
  '/product-details/s3.png',
  '/product-details/s4.png',
  '/product-details/s5.png',
  '/product-details/s6.png',
  '/product-details/s7.png',
  '/product-details/s8.png',
  '/product-details/s9.png',
];

const TESTIMONIAL_FALLBACK_IMAGE = '/landing-page/elegant-businessman-office 1.png';

function resolveServiceImage(imageUrl: string | undefined, index: number) {
  if (imageUrl && imageUrl.trim().length > 0) {
    return imageUrl;
  }
  return SERVICE_FALLBACK_IMAGES[index % SERVICE_FALLBACK_IMAGES.length];
}

function getServiceHref(id: string) {
  return `/services/${id}`;
}

export default function LandingPage() {
  const { t, dir, lang } = useI18n();
  const [apiServices, setApiServices] = useState<ServiceRecord[]>([]);
  const [apiFaqs, setApiFaqs] = useState<FaqRecord[]>([]);
  const [apiTestimonials, setApiTestimonials] = useState<TestimonialRecord[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsRecord | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeSubmitting, setSubscribeSubmitting] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [servicesResult, faqsResult, testimonialsResult, settingsResult] = await Promise.allSettled([
        fetchServices(),
        fetchFaqs(),
        fetchTestimonials(),
        fetchSiteSettings(),
      ]);

      if (!active) {
        return;
      }

      if (servicesResult.status === 'fulfilled') {
        setApiServices(servicesResult.value);
      }
      if (faqsResult.status === 'fulfilled') {
        setApiFaqs(faqsResult.value);
      }
      if (testimonialsResult.status === 'fulfilled') {
        setApiTestimonials(testimonialsResult.value);
      }
      if (settingsResult.status === 'fulfilled') {
        setSiteSettings(settingsResult.value);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const fallbackServices = useMemo(
    () => [
      { id: 'fallback-1', title: t.service1, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[0] },
      { id: 'fallback-2', title: t.service2, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[1] },
      { id: 'fallback-3', title: t.service3, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[2] },
      { id: 'fallback-4', title: t.service4, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[3] },
      { id: 'fallback-5', title: t.service5, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[4] },
      { id: 'fallback-6', title: t.service6, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[5] },
      { id: 'fallback-7', title: t.service7, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[6] },
      { id: 'fallback-8', title: t.service8, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[7] },
      { id: 'fallback-9', title: t.service9, description: t.serviceCardDesc, img: SERVICE_FALLBACK_IMAGES[8] },
    ],
    [t]
  );

  const services = useMemo<ServiceCard[]>(() => {
    if (apiServices.length === 0) {
      return fallbackServices;
    }

    return apiServices.map((service, index) => ({
      id: service.id,
      title: pickLocalized(lang, service.titleEn, service.titleAr),
      description: pickLocalized(lang, service.descriptionEn, service.descriptionAr),
      img: resolveServiceImage(service.imageUrl, index),
    }));
  }, [apiServices, fallbackServices, lang]);

  const whyCards = useMemo(
    () => [
      { icon: '/landing-page/Icon (1).png', title: t.whyCard1Title, desc: t.whyCard1Desc },
      { icon: '/landing-page/Icon (2).png', title: t.whyCard2Title, desc: t.whyCard2Desc },
      { icon: '/landing-page/Icon 04.png', title: t.whyCard3Title, desc: t.whyCard3Desc },
      { icon: '/landing-page/Icon.png', title: t.whyCard4Title, desc: t.whyCard4Desc },
    ],
    [t]
  );

  const fallbackFaqs = useMemo(
    () => [
      { id: 'faq-fallback-1', question: t.faqQ1, answer: t.faqA1 },
      { id: 'faq-fallback-2', question: t.faqQ2, answer: t.faqA2 },
      { id: 'faq-fallback-3', question: t.faqQ3, answer: t.faqA3 },
      { id: 'faq-fallback-4', question: t.faqQ4, answer: t.faqA4 },
      { id: 'faq-fallback-5', question: t.faqQ5, answer: t.faqA5 },
      { id: 'faq-fallback-6', question: t.faqQ6, answer: t.faqA6 },
      { id: 'faq-fallback-7', question: t.faqQ7, answer: t.faqA7 },
      { id: 'faq-fallback-8', question: t.faqQ8, answer: t.faqA8 },
    ],
    [t]
  );

  const faqs = useMemo<FaqItem[]>(() => {
    if (apiFaqs.length === 0) {
      return fallbackFaqs;
    }

    return apiFaqs.map((item) => ({
      id: item.id,
      question: pickLocalized(lang, item.questionEn, item.questionAr),
      answer: pickLocalized(lang, item.answerEn, item.answerAr),
    }));
  }, [apiFaqs, fallbackFaqs, lang]);

  useEffect(() => {
    if (faqs.length === 0) {
      setOpenFaq(null);
      return;
    }
    if (openFaq === null || openFaq >= faqs.length) {
      setOpenFaq(0);
    }
  }, [faqs.length, openFaq]);

  const fallbackTestimonials = useMemo<TestimonialSlide[]>(
    () => [
      {
        id: 'testimonial-fallback-1',
        text: t.testimonialText,
        name: t.testimonialName,
        role: t.testimonialRole,
        rating: 5,
        photoUrl: TESTIMONIAL_FALLBACK_IMAGE,
      },
      {
        id: 'testimonial-fallback-2',
        text: t.testimonialText,
        name: t.testimonialName,
        role: t.testimonialRole,
        rating: 5,
        photoUrl: TESTIMONIAL_FALLBACK_IMAGE,
      },
      {
        id: 'testimonial-fallback-3',
        text: t.testimonialText,
        name: t.testimonialName,
        role: t.testimonialRole,
        rating: 5,
        photoUrl: TESTIMONIAL_FALLBACK_IMAGE,
      },
    ],
    [t]
  );

  const testimonialSlides = useMemo<TestimonialSlide[]>(() => {
    if (apiTestimonials.length === 0) {
      return fallbackTestimonials;
    }

    return apiTestimonials.map((item) => ({
      id: item.id,
      text: pickLocalized(lang, item.textEn, item.textAr),
      name: pickLocalized(lang, item.nameEn, item.nameAr),
      role: pickLocalized(lang, item.roleEn, item.roleAr),
      rating: item.rating,
      photoUrl: item.photoUrl || TESTIMONIAL_FALLBACK_IMAGE,
    }));
  }, [apiTestimonials, fallbackTestimonials, lang]);

  const onSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribeSubmitting(true);
    setSubscribeStatus('idle');
    setSubscribeMessage('');

    try {
      const result = await submitNewsletter(subscribeEmail);
      setSubscribeStatus(result.ok ? 'success' : 'error');
      setSubscribeMessage(result.message);
      if (result.ok) {
        setSubscribeEmail('');
      }
    } catch {
      setSubscribeStatus('error');
      setSubscribeMessage('Failed to subscribe right now. Please try again.');
    } finally {
      setSubscribeSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <style jsx>{`
        @keyframes supportBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>

      <section className="w-full">
        <div
          className="w-full"
          style={{
            background:
              'linear-gradient(182.36deg, rgba(243, 248, 255, 0.68) 2.77%, rgba(243, 248, 255, 0.68) 76.53%, rgba(146, 149, 153, 0.4148) 98.66%)',
          }}
        >
          <div className="relative w-full overflow-hidden">
            <div className="relative h-[420px] w-full md:h-[520px]">
              <Image src="/landing-page/banner.png" alt="Banner" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-white/60" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className={`w-full max-w-[736px] ${dir === 'rtl' ? 'text-right' : 'text-center'}`}>
                <div className="mx-auto inline-flex h-11 items-center justify-center rounded-[22px] bg-[#CEE1FF] px-6 text-xs font-medium text-[#333]">
                  {t.heroBadge}
                </div>

                <h1 className="mt-4 text-[32px] font-black leading-[42px] md:text-[48px] md:leading-[70px]">
                  <span className="text-[#004FCE]">{t.heroTitleBlue}</span>
                  <span className="font-normal text-[#333]">{t.heroTitleRest}</span>
                </h1>

                <p className="mx-auto mt-4 max-w-[638px] text-sm leading-6 text-[#333] md:text-[16px] md:leading-[24px]">
                  {t.heroSubtitle}
                </p>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[5px] bg-[#004FCE] px-6 text-sm font-semibold text-white"
                  >
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

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#333] md:text-[28px]">{t.premiumTitle}</h2>
            <p className="mx-auto mt-2 max-w-3xl text-sm text-[#666]">{t.premiumSubtitle}</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((card) => (
              <div
                key={card.id}
                className="overflow-hidden rounded-[15px] border border-black/10 bg-white shadow-[0px_4px_60px_0px_rgba(0,0,0,0.06)]"
              >
                <div className="relative aspect-[544/277] w-full bg-black/5">
                  <Image src={card.img} alt={card.title} fill className="object-cover" unoptimized />
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#004FCE]">{card.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#666]">{card.description}</p>
                  <Link
                    href={getServiceHref(card.id)}
                    className="mt-4 inline-flex h-[31px] items-center rounded-[5px] border border-black/20 bg-white px-4 text-xs text-[#333]"
                  >
                    {t.viewMoreBtn}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/services"
              className="inline-flex h-[50px] items-center justify-center rounded-[5px] bg-[#004FCE] px-6 text-sm font-semibold text-white"
            >
              {t.viewAllServices}
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <TestimonialCarousel slides={testimonialSlides} />
      </section>

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

            <Link
              href="/contact"
              className="mt-8 inline-flex h-[59px] items-center justify-center rounded-[5px] bg-[#004FCE] px-6 text-[16px] font-semibold text-white shadow-[0px_4px_60px_0px_rgba(0,0,0,0.08)] md:text-[18px]"
            >
              {t.fillForm} -&gt;
            </Link>
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

      <section className="w-full bg-[#F4F5F7]">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-[26px] font-semibold text-[#333] md:text-[36px]">{t.whyChoose}</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="group rounded-[10px] bg-white p-6 text-center text-[#333] transition-colors duration-300 hover:bg-[#004FCE] hover:text-white"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F4F5F7] group-hover:bg-white/10">
                  <Image src={card.icon} alt="icon" width={56} height={56} />
                </div>

                <h3 className="mt-5 text-[18px] font-semibold leading-7">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 opacity-95">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-[26px] font-semibold text-[#333] md:text-[36px]">{t.faqTitle}</h2>
            <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-[#999]">{t.faqSubtitle}</p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-[4px] bg-white shadow-[1px_2px_13.3px_2px_rgba(0,0,0,0.05)]"
                >
                  <div className="absolute left-0 top-0 h-full w-[7px] bg-[#004FCE]" />
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className={`flex w-full items-center justify-between px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                  >
                    <span className="text-sm font-medium text-[#333] md:text-[16px]">{item.question}</span>
                    <span className="text-[18px] font-semibold text-[#004FCE]">{isOpen ? '-' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className={`px-6 pb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <p className="text-sm leading-6 text-[#999]">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 pb-16 lg:px-[120px]">
          <div className="relative overflow-hidden rounded-[10px] bg-[#F0F7FF] px-6 py-10 md:px-12">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-[340px] w-[340px] rounded-full opacity-60 blur-[70px]"
              style={{ background: 'rgba(127, 178, 225, 1)' }}
            />
            <div
              className="pointer-events-none absolute -left-20 -bottom-24 h-[360px] w-[360px] rounded-full opacity-60 blur-[75px]"
              style={{ background: 'rgba(106, 165, 220, 1)' }}
            />
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

            <div className="relative z-10 text-center">
              <h3 className="text-[18px] font-semibold text-[#333] md:text-[24px]">{t.readySellTitle}</h3>
              <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-[#666] md:text-[16px]">
                {t.readySellDesc}
              </p>

              <form
                onSubmit={onSubscribe}
                className="mx-auto mt-8 flex w-full max-w-[650px] flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-0"
              >
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(event) => setSubscribeEmail(event.target.value)}
                  required
                  className="h-[57px] w-full rounded-[5px] border border-black/10 bg-[#FFFBFB] px-5 text-sm outline-none sm:rounded-r-none"
                  placeholder={t.footerEmailPlaceholder}
                />

                <button
                  type="submit"
                  disabled={subscribeSubmitting}
                  className="h-[57px] w-full rounded-[5px] bg-[#004FCE] text-sm font-semibold text-white sm:w-[190px] sm:rounded-l-none disabled:opacity-70"
                >
                  {subscribeSubmitting ? 'Submitting...' : t.footerSubscribe}
                </button>
              </form>

              {subscribeStatus !== 'idle' && (
                <p className={`mt-3 text-sm ${subscribeStatus === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                  {subscribeMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 sm:bottom-6 sm:right-6">
        <a
          href={siteSettings?.supportPhone ? `tel:${siteSettings.supportPhone}` : '#'}
          aria-label="Call support"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#004FCE] text-white shadow-[0px_8px_30px_rgba(0,79,206,0.35)] transition-transform duration-200 hover:scale-105 motion-safe:animate-[supportBounce_3.2s_ease-in-out_infinite] sm:h-16 sm:w-16"
          style={!siteSettings?.supportPhone ? { pointerEvents: 'none', opacity: 0.65 } : undefined}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.7 3.8.7.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C11.3 22 2 12.7 2 3c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.3.2 2.6.7 3.8.1.4 0 .8-.2 1.1L6.6 10.8Z"
              fill="currentColor"
            />
          </svg>
        </a>

        <a
          href={siteSettings?.whatsappPhone ? `https://wa.me/${siteSettings.whatsappPhone}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0px_8px_30px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 motion-safe:animate-[supportBounce_3.2s_ease-in-out_infinite] sm:h-16 sm:w-16"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.56 2 2.1 6.46 2.1 11.93c0 1.75.46 3.46 1.33 4.97L2 22l5.24-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.47 0 9.93-4.46 9.93-9.93 0-2.65-1.03-5.14-2.92-7Zm-7.02 15.26h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.17 8.2Zm4.5-6.15c-.25-.13-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.13-.17.25-.65.82-.8.98-.15.17-.3.19-.55.07-.25-.13-1.06-.39-2.01-1.25-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.01-.38.11-.5.11-.11.25-.3.37-.45.12-.15.16-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.21-.5-.42-.43-.57-.44h-.49c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.12 0 1.25.91 2.46 1.03 2.63.13.17 1.79 2.73 4.33 3.83.61.26 1.09.42 1.46.54.61.19 1.16.16 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

function TestimonialCarousel({ slides }: { slides: TestimonialSlide[] }) {
  const { t, dir } = useI18n();
  const [idx, setIdx] = useState(0);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[idx % slides.length];
  const stars = Array.from({ length: Math.min(Math.max(activeSlide.rating, 1), 5) }, () => '*').join('');

  return (
    <div className="mx-auto w-full max-w-[1144px] px-4 py-14">
      <div className="text-center">
        <h2 className="text-[26px] font-semibold text-[#333] md:text-[36px]">{t.peopleSayTitle}</h2>
        <p className="mt-2 text-sm text-[#666]">{t.peopleSaySub}</p>
      </div>

      <div className="mt-10 flex justify-center">
        <div
          className="relative w-full max-w-[949px] rounded-[10px] bg-[#F3F8FF] px-6 py-10 md:px-14"
          style={{ opacity: 1 }}
        >
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

          <p
            className={`mx-auto mt-24 max-w-[949px] text-[18px] font-medium text-[#333] md:text-[20px] ${
              dir === 'rtl' ? 'text-right' : 'text-center'
            }`}
            style={{ lineHeight: '45px', opacity: 0.66 }}
          >
            {activeSlide.text}
          </p>

          <div className="mt-10 flex items-center gap-3">
            <div className="relative h-[56px] w-[56px] overflow-hidden rounded-full bg-black/5">
              <Image src={activeSlide.photoUrl} alt="User" fill className="object-cover" unoptimized />
            </div>

            <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className="text-[20px] font-semibold text-[#333] md:text-[24px]" style={{ lineHeight: '24px' }}>
                {activeSlide.name}
              </div>

              <div className="mt-1 text-[14px] text-[#666] md:text-[16px]" style={{ lineHeight: '16px' }}>
                {activeSlide.role}
              </div>

              <div className="mt-2 text-[22px]" style={{ color: '#E38F2A', lineHeight: '30px' }}>
                {stars}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {slides.map((slide, index) => {
          const active = index === idx;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIdx(index)}
              aria-label={`Go to testimonial ${index + 1}`}
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