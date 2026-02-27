'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

type Card = { title: string; img: string };

export default function ProductDetails() {
  const { t, dir } = useI18n();

  // ✅ UPDATE these paths if you did NOT rename the folder:
  // If your folder is still "Product Details", use "/Product%20Details/xxx.png"
  const images = useMemo(
    () => [
      '/product-details/pd_img_carousel_image1.png',
      '/product-details/pd_img1.png',
      '/product-details/pd_img2.png',
      '/product-details/pd_img3.png',
    ],
    []
  );

  const thumbs = useMemo(
    () => [
      '/product-details/pd_img1.png',
      '/product-details/pd_img2.png',
      '/product-details/pd_img3.png',
    ],
    []
  );

const otherServices: Card[] = useMemo(
  () => [
    { title: t.otherService1, img: '/product-details/s1.png' },
    { title: t.otherService2, img: '/product-details/s2.png' },
    { title: t.otherService3, img: '/product-details/s3.png' },
    { title: t.otherService4, img: '/product-details/s4.png' },
    { title: t.otherService5, img: '/product-details/s5.png' },
    { title: t.otherService6, img: '/product-details/s6.png' },
    { title: t.otherService7, img: '/product-details/s7.png' },
    { title: t.otherService8, img: '/product-details/s8.png' },
    { title: t.otherService9, img: '/product-details/s9.png' },
  ],
  [t]
);

  const [active, setActive] = useState(0);

  const prev = () => setActive((p) => (p - 1 + images.length) % images.length);
  const next = () => setActive((p) => (p + 1) % images.length);

  return (
    <div className="w-full">
      {/* Main section */}
      <section className="mx-auto w-full max-w-[1680px] px-4 pb-20 pt-15 lg:px-[120px]">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: carousel + thumbs */}
          <div>
            <div className="relative aspect-[828/341] w-full overflow-hidden rounded-md bg-black/5">
              <Image
                src={images[active]}
                alt="Product image"
                fill
                className="object-cover"
                priority
              />

              {/* arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"
                aria-label="Next"
              >
                ›
              </button>
            </div>

            {/* Thumb row */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              {thumbs.map((src, idx) => (
                <button
                  key={src}
                  onClick={() => setActive(Math.min(idx + 1, images.length - 1))}
                  className="relative aspect-[258/229] w-full overflow-hidden rounded-md bg-black/5"
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <Image src={src} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: content */}
          <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl font-semibold leading-tight lg:text-3xl">{t.headline}</h1>

            <p className="mt-4 text-sm leading-6 text-[#666]">{t.subtext}</p>

            <h3 className="mt-6 text-sm font-semibold text-[#333]">{t.featuresTitle}</h3>

            <ul className="mt-3 space-y-2 text-sm text-[#333]">
              {[t.feature1, t.feature2, t.feature3, t.feature4].map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <span className="mt-[2px] inline-block h-4 w-4 rounded-[3px] bg-[#1DB954]" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>

            {/* Sell box */}
            <div className="mt-8 rounded-[5px] bg-[#E9F2FF] p-7">
              <h4 className="text-sm font-semibold text-[#333]">{t.sellBoxTitle}</h4>
              <p className="mt-1 text-xs text-[#666]">{t.sellBoxSub}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button className="h-[34px] rounded-[5px] bg-[#004FCE] px-4 text-xs font-semibold text-white shadow-[0px_4px_60px_0px_rgba(0,0,0,0.08)]">
                  {t.contactUs}
                </button>

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

      {/* Other services */}
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1680px] px-4 pb-20 lg:px-[120px]">
          <div className="text-center mb-15">
            <h2 className="text-3xl font-semibold">{t.otherServices}</h2>
            <p className="mx-auto mt-2 max-w-3xl text-sm text-[#666]">{t.otherServicesSub}</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((card) => (
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
  {t.otherServiceCardDesc}
</p>

                  <button className="mt-4 h-[31px] rounded-[5px] border border-black/20 bg-white px-4 text-xs text-[#333]">
                    {t.viewMore}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}