'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { FaqRecord, ProductRecord, ServiceRecord, pickLocalized } from '@/lib/content-types';
import { searchContent } from '@/lib/frontend-api';

type SearchResults = {
  services: ServiceRecord[];
  products: ProductRecord[];
  faqs: FaqRecord[];
};

function createEmptyResults(): SearchResults {
  return {
    services: [],
    products: [],
    faqs: [],
  };
}

function getServiceHref(id: string) {
  return id.startsWith('fallback-') ? '/contact' : `/services/${id}`;
}

function SearchPageFallback() {
  return (
    <div className="w-full bg-white">
      <section className="mx-auto w-full max-w-[1680px] px-4 py-12 lg:px-[120px]">
        <h1 className="text-[28px] font-semibold text-[#333]">Search</h1>
        <p className="mt-6 text-sm text-[#666]">Loading search...</p>
      </section>
    </div>
  );
}

function SearchPageContent() {
  const { lang, dir, t } = useI18n();
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim();

  const [results, setResults] = useState<SearchResults>(() => createEmptyResults());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    if (!query) {
      setResults(createEmptyResults());
      setErrorMessage('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const load = async () => {
      try {
        const data = await searchContent(query, lang);
        if (!active) {
          return;
        }
        setResults(data);
      } catch {
        if (!active) {
          return;
        }
        setResults(createEmptyResults());
        setErrorMessage('Failed to load search results.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [lang, query]);

  const totalResults = useMemo(() => {
    return results.services.length + results.products.length + results.faqs.length;
  }, [results.faqs.length, results.products.length, results.services.length]);

  const showPrompt = query.length === 0;
  const showNoResults = !isLoading && !errorMessage && query.length > 0 && totalResults === 0;

  return (
    <div className="w-full bg-white">
      <section className="mx-auto w-full max-w-[1680px] px-4 py-12 lg:px-[120px]">
        <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <h1 className="text-[28px] font-semibold text-[#333]">Search</h1>
          <p className="mt-2 text-sm text-[#666]">
            {query ? `Showing results for "${query}"` : t.searchPlaceholder}
          </p>
        </div>

        {isLoading && <p className="mt-6 text-sm text-[#666]">Searching...</p>}

        {errorMessage && (
          <p className="mt-6 rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        {showPrompt && (
          <p className="mt-6 rounded-[6px] border border-[#D7E6FF] bg-[#F4F8FF] px-4 py-3 text-sm text-[#3D5A80]">
            Use the search bar in the header to find services, products, or FAQs.
          </p>
        )}

        {showNoResults && (
          <p className="mt-6 rounded-[6px] border border-[#E6E6E6] bg-[#FAFAFA] px-4 py-3 text-sm text-[#555]">
            No matching content was found.
          </p>
        )}

        {!isLoading && !errorMessage && totalResults > 0 && (
          <div className="mt-8 space-y-10">
            {results.services.length > 0 && (
              <section>
                <h2 className="text-[22px] font-semibold text-[#333]">
                  {t.services} ({results.services.length})
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {results.services.map((service) => (
                    <article
                      key={service.id}
                      className="rounded-[10px] border border-black/10 bg-white p-5 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.06)]"
                    >
                      <h3 className="text-[18px] font-semibold text-[#004FCE]">
                        {pickLocalized(lang, service.titleEn, service.titleAr)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#666]">
                        {pickLocalized(lang, service.descriptionEn, service.descriptionAr)}
                      </p>
                      <Link
                        href={getServiceHref(service.id)}
                        className="mt-4 inline-flex h-[34px] items-center rounded-[5px] bg-[#004FCE] px-4 text-xs font-semibold text-white"
                      >
                        {t.viewMore}
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {results.products.length > 0 && (
              <section>
                <h2 className="text-[22px] font-semibold text-[#333]">
                  Products ({results.products.length})
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {results.products.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-[10px] border border-black/10 bg-white p-5 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.06)]"
                    >
                      <h3 className="text-[18px] font-semibold text-[#004FCE]">
                        {pickLocalized(lang, product.titleEn, product.titleAr)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#666]">
                        {pickLocalized(lang, product.descriptionEn, product.descriptionAr)}
                      </p>
                      <Link
                        href={`/product-details/${product.id}`}
                        className="mt-4 inline-flex h-[34px] items-center rounded-[5px] bg-[#004FCE] px-4 text-xs font-semibold text-white"
                      >
                        {t.viewMore}
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {results.faqs.length > 0 && (
              <section>
                <h2 className="text-[22px] font-semibold text-[#333]">
                  FAQ ({results.faqs.length})
                </h2>
                <div className="mt-4 space-y-3">
                  {results.faqs.map((item) => (
                    <article
                      key={item.id}
                      className={`rounded-[8px] border border-black/10 bg-white px-5 py-4 ${
                        dir === 'rtl' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <h3 className="text-[16px] font-semibold text-[#333]">
                        {pickLocalized(lang, item.questionEn, item.questionAr)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#666]">
                        {pickLocalized(lang, item.answerEn, item.answerAr)}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
