'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { ServiceRecord, pickLocalized } from '@/lib/content-types';
import { fetchServiceById, fetchServices } from '@/lib/frontend-api';

type ServiceDetailsProps = {
  serviceId: string;
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

export default function ServiceDetails({ serviceId }: ServiceDetailsProps) {
  const { t, dir, lang } = useI18n();
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [relatedServices, setRelatedServices] = useState<ServiceRecord[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setNotFound(false);

      const [serviceResult, servicesResult] = await Promise.allSettled([
        fetchServiceById(serviceId),
        fetchServices(),
      ]);

      if (!active) {
        return;
      }

      if (serviceResult.status === 'fulfilled') {
        if (serviceResult.value) {
          setService(serviceResult.value);
        } else {
          setService(null);
          setNotFound(true);
        }
      } else {
        setService(null);
        setNotFound(true);
      }

      if (servicesResult.status === 'fulfilled') {
        setRelatedServices(servicesResult.value.filter((item) => item.id !== serviceId));
      } else {
        setRelatedServices([]);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [serviceId]);

  const title = service ? pickLocalized(lang, service.titleEn, service.titleAr) : t.services;
  const description = service
    ? pickLocalized(lang, service.descriptionEn, service.descriptionAr)
    : t.servicesPremiumSubtitle;
  const heroImage = resolveServiceImage(service?.imageUrl, 0);

  const relatedCards = useMemo(() => {
    return relatedServices.slice(0, 6).map((item, index) => ({
      id: item.id,
      title: pickLocalized(lang, item.titleEn, item.titleAr),
      description: pickLocalized(lang, item.descriptionEn, item.descriptionAr),
      image: resolveServiceImage(item.imageUrl, index + 1),
    }));
  }, [lang, relatedServices]);

  return (
    <div className="w-full bg-white">
      <section className="mx-auto w-full max-w-[1680px] px-4 py-14 lg:px-[120px]">
        {notFound && (
          <div className="mb-6 rounded-[6px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Service not found.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[828/500] w-full overflow-hidden rounded-[10px] bg-black/5">
            <Image src={heroImage} alt={title} fill className="object-cover" unoptimized />
          </div>

          <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-[30px] font-semibold leading-tight text-[#333]">{title}</h1>
            <p className="mt-4 text-[16px] leading-7 text-[#666]">{description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-[42px] items-center rounded-[5px] bg-[#004FCE] px-5 text-sm font-semibold text-white"
              >
                {t.contactUs}
              </Link>
              <a
                href="tel:+000123456889"
                className="inline-flex h-[42px] items-center rounded-[5px] border border-black/15 px-5 text-sm text-[#333]"
              >
                +000 (123) 456 889
              </a>
            </div>
          </div>
        </div>
      </section>

      {relatedCards.length > 0 && (
        <section className="w-full bg-white pb-20">
          <div className="mx-auto w-full max-w-[1680px] px-4 lg:px-[120px]">
            <h2 className="text-center text-[26px] font-semibold text-[#333]">{t.otherServices}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCards.map((card) => (
                <div
                  key={card.id}
                  className="overflow-hidden rounded-[15px] border border-black/10 bg-white shadow-[0px_4px_60px_0px_rgba(0,0,0,0.06)]"
                >
                  <div className="relative aspect-[544/277] w-full bg-black/5">
                    <Image src={card.image} alt={card.title} fill className="object-cover" unoptimized />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-[18px] font-semibold text-[#004FCE]">{card.title}</h3>
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
      )}
    </div>
  );
}
