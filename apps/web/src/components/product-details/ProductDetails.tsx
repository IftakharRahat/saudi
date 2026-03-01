'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { ProductRecord, ServiceRecord, pickLocalized } from '@/lib/content-types';
import { fetchProductById, fetchProducts, fetchServiceById, fetchServices } from '@/lib/frontend-api';

type ProductDetailsProps = {
  productId?: string;
  serviceId?: string;
};

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  img: string;
};

const PRODUCT_IMAGE_FALLBACKS = [
  '/product-details/pd_img_carousel_image1.png',
  '/product-details/pd_img1.png',
  '/product-details/pd_img2.png',
  '/product-details/pd_img3.png',
];

const SERVICE_IMAGE_FALLBACKS = [
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

function resolveImage(value: string | undefined, fallbackIndex: number, fallbackSet: string[]) {
  if (value && value.trim().length > 0) {
    return value;
  }
  return fallbackSet[fallbackIndex % fallbackSet.length];
}

function getServiceHref(id: string) {
  return id.startsWith('fallback-') ? '/contact' : `/services/${id}`;
}

export default function ProductDetails({ productId, serviceId }: ProductDetailsProps) {
  const { t, dir, lang } = useI18n();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [active, setActive] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setNotFound(false);

      if (serviceId) {
        try {
          const resolvedService = await fetchServiceById(serviceId);
          if (!mounted) {
            return;
          }

          if (!resolvedService) {
            setService(null);
            setProduct(null);
            setNotFound(true);
            return;
          }

          setService(resolvedService);
          setProduct(null);
          setActive(0);
          return;
        } catch {
          if (mounted) {
            setService(null);
            setProduct(null);
            setNotFound(true);
          }
          return;
        }
      }

      setService(null);

      try {
        let resolved: ProductRecord | null = null;

        if (productId) {
          resolved = await fetchProductById(productId);
          if (!resolved) {
            if (mounted) {
              setNotFound(true);
            }
            return;
          }
        } else {
          const products = await fetchProducts();
          resolved = products[0] ?? null;
        }

        if (mounted) {
          setProduct(resolved);
          setActive(0);
        }
      } catch {
        if (mounted) {
          setProduct(null);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [productId, serviceId]);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        const data = await fetchServices();
        if (mounted) {
          setServices(data);
        }
      } catch {
        if (mounted) {
          setServices([]);
        }
      }
    };

    void loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  const images = useMemo(() => {
    if (serviceId) {
      const primary = resolveImage(service?.imageUrl, 0, SERVICE_IMAGE_FALLBACKS);
      return [primary, ...SERVICE_IMAGE_FALLBACKS.slice(1, 4)];
    }

    const apiImages = product?.images
      ?.slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((item, index) => resolveImage(item.imageUrl, index, PRODUCT_IMAGE_FALLBACKS));

    if (apiImages && apiImages.length > 0) {
      return apiImages;
    }

    return PRODUCT_IMAGE_FALLBACKS;
  }, [product, service, serviceId]);

  const featureList = useMemo(() => {
    if (serviceId) {
      return [t.feature1, t.feature2, t.feature3, t.feature4];
    }

    const apiFeatures = product ? (lang === 'ar' ? product.featuresAr : product.featuresEn) : [];
    if (apiFeatures.length > 0) {
      return apiFeatures;
    }
    return [t.feature1, t.feature2, t.feature3, t.feature4];
  }, [lang, product, serviceId, t.feature1, t.feature2, t.feature3, t.feature4]);

  const otherServices = useMemo<ServiceCard[]>(() => {
    const sourceServices = serviceId ? services.filter((item) => item.id !== serviceId) : services;

    if (sourceServices.length === 0) {
      return [
        { id: 'fallback-1', title: t.otherService1, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[0] },
        { id: 'fallback-2', title: t.otherService2, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[1] },
        { id: 'fallback-3', title: t.otherService3, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[2] },
        { id: 'fallback-4', title: t.otherService4, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[3] },
        { id: 'fallback-5', title: t.otherService5, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[4] },
        { id: 'fallback-6', title: t.otherService6, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[5] },
        { id: 'fallback-7', title: t.otherService7, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[6] },
        { id: 'fallback-8', title: t.otherService8, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[7] },
        { id: 'fallback-9', title: t.otherService9, description: t.otherServiceCardDesc, img: SERVICE_IMAGE_FALLBACKS[8] },
      ];
    }

    return sourceServices.map((item, index) => ({
      id: item.id,
      title: pickLocalized(lang, item.titleEn, item.titleAr),
      description: pickLocalized(lang, item.descriptionEn, item.descriptionAr),
      img: resolveImage(item.imageUrl, index, SERVICE_IMAGE_FALLBACKS),
    }));
  }, [
    lang,
    serviceId,
    services,
    t.otherService1,
    t.otherService2,
    t.otherService3,
    t.otherService4,
    t.otherService5,
    t.otherService6,
    t.otherService7,
    t.otherService8,
    t.otherService9,
    t.otherServiceCardDesc,
  ]);

  const title = service
    ? pickLocalized(lang, service.titleEn, service.titleAr)
    : product
      ? pickLocalized(lang, product.titleEn, product.titleAr)
      : t.headline;
  const description = service
    ? pickLocalized(lang, service.descriptionEn, service.descriptionAr)
    : product
      ? pickLocalized(lang, product.descriptionEn, product.descriptionAr)
      : t.subtext;
  const activeIndex = active % images.length;

  const prev = () => setActive((previous) => (previous - 1 + images.length) % images.length);
  const next = () => setActive((previous) => (previous + 1) % images.length);

  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-[1680px] px-4 pb-20 pt-15 lg:px-[120px]">
        {notFound && (
          <div className="mb-6 rounded-[6px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {serviceId ? 'Service not found.' : 'Product not found.'}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[828/341] w-full overflow-hidden rounded-md bg-black/5">
              <Image src={images[activeIndex]} alt="Product image" fill className="object-cover" priority unoptimized />

              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"
                aria-label="Previous"
              >
                {'<'}
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"
                aria-label="Next"
              >
                {'>'}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.slice(0, 3).map((src, index) => (
                <button
                  type="button"
                  key={`${src}-${index}`}
                  onClick={() => setActive(index)}
                  className="relative aspect-[258/229] w-full overflow-hidden rounded-md bg-black/5"
                  aria-label={`Thumbnail ${index + 1}`}
                >
                  <Image src={src} alt="Thumbnail" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl font-semibold leading-tight lg:text-3xl">{title}</h1>

            <p className="mt-4 text-sm leading-6 text-[#666]">{description}</p>

            <h3 className="mt-6 text-sm font-semibold text-[#333]">{t.featuresTitle}</h3>

            <ul className="mt-3 space-y-2 text-sm text-[#333]">
              {featureList.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-[2px] inline-block h-4 w-4 rounded-[3px] bg-[#1DB954]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[5px] bg-[#E9F2FF] p-7">
              <h4 className="text-sm font-semibold text-[#333]">{t.sellBoxTitle}</h4>
              <p className="mt-1 text-xs text-[#666]">{t.sellBoxSub}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="inline-flex h-[34px] items-center rounded-[5px] bg-[#004FCE] px-4 text-xs font-semibold text-white shadow-[0px_4px_60px_0px_rgba(0,0,0,0.08)]"
                >
                  {t.contactUs}
                </a>

                <a
                  href="tel:+000123456889"
                  className="inline-flex h-[34px] items-center rounded-[5px] bg-white px-4 text-xs text-[#333] shadow-sm"
                >
                  +000 (123) 456 889
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 pb-20 lg:px-[120px]">
          <div className="mb-15 text-center">
            <h2 className="text-3xl font-semibold">{t.otherServices}</h2>
            <p className="mx-auto mt-2 max-w-3xl text-sm text-[#666]">{t.otherServicesSub}</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((card) => (
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
                    {t.viewMore}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
