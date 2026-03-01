'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { ServiceAreaRecord, ServiceRecord, pickLocalized } from '@/lib/content-types';
import { fetchServiceAreas, fetchServices, submitNewsletter } from '@/lib/frontend-api';

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  img: string;
};

type AreaCard = {
  id: string;
  city: string;
  title: string;
  desc: string;
};

const SERVICE_FALLBACK_IMAGES = [
  '/product-details/s1.png',
  '/product-details/s2.png',
  '/product-details/s3.png',
  '/product-details/s4.png',
  '/product-details/s5.png',
  '/product-details/s6.png',
  '/product-details/s7.png',
  '/product-details/s8.png',
  '/product-details/s9.png',
];

function resolveServiceImage(imageUrl: string | undefined, index: number) {
  if (imageUrl && imageUrl.trim().length > 0) {
    return imageUrl;
  }
  return SERVICE_FALLBACK_IMAGES[index % SERVICE_FALLBACK_IMAGES.length];
}

function getServiceHref(id: string) {
  return id.startsWith('fallback-') ? '/contact' : `/services/${id}`;
}

export default function ServicesPage() {
  const { t, dir, lang } = useI18n();
  const [apiServices, setApiServices] = useState<ServiceRecord[]>([]);
  const [apiAreas, setApiAreas] = useState<ServiceAreaRecord[]>([]);
  const [activeArea, setActiveArea] = useState(0);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeSubmitting, setSubscribeSubmitting] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [servicesResult, areasResult] = await Promise.allSettled([
        fetchServices(),
        fetchServiceAreas(),
      ]);

      if (!active) {
        return;
      }

      if (servicesResult.status === 'fulfilled') {
        setApiServices(servicesResult.value);
      }
      if (areasResult.status === 'fulfilled') {
        setApiAreas(areasResult.value);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const fallbackServices = useMemo<ServiceCard[]>(
    () => [
      { id: 'fallback-1', title: t.service1, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[0] },
      { id: 'fallback-2', title: t.service2, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[1] },
      { id: 'fallback-3', title: t.service3, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[2] },
      { id: 'fallback-4', title: t.service4, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[3] },
      { id: 'fallback-5', title: t.service5, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[4] },
      { id: 'fallback-6', title: t.service6, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[5] },
      { id: 'fallback-7', title: t.service7, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[6] },
      { id: 'fallback-8', title: t.service8, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[7] },
      { id: 'fallback-9', title: t.service9, description: t.servicesCardDesc, img: SERVICE_FALLBACK_IMAGES[8] },
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

  const fallbackAreas = useMemo<AreaCard[]>(
    () => [
      { id: 'area-fallback-1', city: t.area1City, title: t.area1Title, desc: t.area1Desc },
      { id: 'area-fallback-2', city: t.area2City, title: t.area2Title, desc: t.area2Desc },
      { id: 'area-fallback-3', city: t.area3City, title: t.area3Title, desc: t.area3Desc },
      { id: 'area-fallback-4', city: t.area4City, title: t.area4Title, desc: t.area4Desc },
      { id: 'area-fallback-5', city: t.area5City, title: t.area5Title, desc: t.area5Desc },
      { id: 'area-fallback-6', city: t.area6City, title: t.area6Title, desc: t.area6Desc },
    ],
    [t]
  );

  const areas = useMemo<AreaCard[]>(() => {
    if (apiAreas.length === 0) {
      return fallbackAreas;
    }

    return apiAreas.map((area) => ({
      id: area.id,
      city: pickLocalized(lang, area.cityEn, area.cityAr),
      title: pickLocalized(lang, area.titleEn, area.titleAr),
      desc: pickLocalized(lang, area.descriptionEn, area.descriptionAr),
    }));
  }, [apiAreas, fallbackAreas, lang]);

  useEffect(() => {
    if (areas.length === 0) {
      setActiveArea(0);
      return;
    }
    if (activeArea >= areas.length) {
      setActiveArea(0);
    }
  }, [activeArea, areas.length]);

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
      <section
        className="w-full"
        style={{
          background:
            'linear-gradient(176.72deg, rgba(255, 255, 255, 0.67) 2.1%, rgba(230, 236, 248, 0.89) 106.22%)',
        }}
      >
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="mx-auto flex max-w-[832px] flex-col items-center text-center">
            <h1 className="text-[28px] font-medium leading-[42px] text-[#333] md:text-[48px] md:leading-[70px]">
              <span className="font-medium">{t.servicesHeroTitle1}</span>
              <br />
              <span className="font-semibold">{t.servicesHeroTitle2a}</span>
              <span className="font-extrabold text-[#004FCE]">{t.servicesHeroCity}</span>
              <span className="font-semibold">{t.servicesHeroTitle2b}</span>
            </h1>

            <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#666]">{t.servicesHeroSubtitle}</p>

            <Link
              href="/contact"
              className="mt-6 inline-flex h-[50px] items-center justify-center gap-2 rounded-[5px] bg-[#004FCE] px-6 text-sm font-semibold text-white"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.7 3.8.7.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C11.3 22 2 12.7 2 1c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.3.2 2.6.7 3.8.1.4 0 .8-.2 1.1L6.6 10.8Z"
                  fill="#FFFFFF"
                />
              </svg>

              <span>{t.contactUsCta}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-[22px] font-semibold text-[#333] md:text-[28px]">{t.servicesPremiumTitle}</h2>
            <p className="mx-auto mt-2 max-w-3xl text-sm text-[#666]">{t.servicesPremiumSubtitle}</p>
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
                  <h3 className="text-[16px] font-semibold text-[#004FCE]">{card.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#666]">{card.description}</p>
                  <Link
                    href={getServiceHref(card.id)}
                    className="mt-4 inline-flex h-[31px] items-center rounded-[5px] border border-black/20 bg-white px-4 text-xs text-[#333]"
                  >
                    {t.viewMore}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
          <div className="text-center">
            <h2 className="text-[26px] font-semibold text-[#333] md:text-[36px]">{t.deliveryTitle}</h2>
            <p className="mx-auto mt-3 max-w-[579px] text-sm leading-6 text-[#333]">{t.deliverySubtitle}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, index) => {
              const active = index === activeArea;
              return (
                <div
                  key={area.id}
                  onMouseEnter={() => setActiveArea(index)}
                  onFocus={() => setActiveArea(index)}
                  tabIndex={0}
                  className={[
                    'relative h-[259px] w-full rounded-[5px] border border-black/15 bg-white p-6 outline-none transition',
                    active ? 'border-[#004FCE]' : '',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'flex h-[43px] w-[43px] items-center justify-center rounded-full transition',
                      active ? 'bg-[#004FCE]' : 'bg-white',
                    ].join(' ')}
                    style={{
                      border: active ? '2px solid #FFFFFF' : '1px solid #004FCE',
                    }}
                  >
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden="true">
                      <path
                        d="M8 19C8 19 15 13.5 15 8C15 3.6 11.9 1 8 1C4.1 1 1 3.6 1 8C1 13.5 8 19 8 19Z"
                        stroke={active ? '#FFFFFF' : '#004FCE'}
                        strokeWidth={active ? 2 : 1.6}
                      />
                      <circle
                        cx="8"
                        cy="8"
                        r="2.2"
                        stroke={active ? '#FFFFFF' : '#004FCE'}
                        strokeWidth={active ? 2 : 1.6}
                      />
                    </svg>
                  </div>

                  <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <div className="mt-4 text-[16px] font-medium uppercase text-[#004FCE]">{area.city}</div>
                    <div className="mt-2 text-[20px] font-semibold leading-7 text-[#333]">{area.title}</div>
                    <div className="mt-2 text-[16px] leading-6 text-[#666]">{area.desc}</div>
                  </div>

                  {active && <div className="absolute bottom-0 left-0 h-[10px] w-full rounded-b-[5px] bg-[#004FCE]" />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 pb-24 py-12 lg:px-[120px]">
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

              <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-[#666] md:text-[16px]">{t.readySellDesc}</p>

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
    </div>
  );
}
