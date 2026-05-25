import { describe, expect, it } from 'vitest';
import { buildSeoUrlOptions, normalizeDiscoveredRoutePattern } from '@/lib/seo-url-options';

describe('SEO URL options helpers', () => {
  it('normalizes public route patterns and excludes admin/api routes', () => {
    expect(normalizeDiscoveredRoutePattern('page.tsx')).toBe('/');
    expect(normalizeDiscoveredRoutePattern('about/page.tsx')).toBe('/about');
    expect(normalizeDiscoveredRoutePattern('services/[id]/page.tsx')).toBe('/services/[id]');
    expect(normalizeDiscoveredRoutePattern('admin/(protected)/seo/page.tsx')).toBeNull();
    expect(normalizeDiscoveredRoutePattern('api/admin/seo/page.tsx')).toBeNull();
  });

  it('builds grouped SEO URL options from static and dynamic routes', () => {
    const options = buildSeoUrlOptions({
      routePatterns: ['/', '/about', '/services', '/services/[id]', '/product-details/[id]'],
      services: [
        {
          id: 'service-2',
          titleEn: 'Refrigerators',
          titleAr: 'ثلاجات',
          sortOrder: 2,
        },
        {
          id: 'service-1',
          titleEn: 'Washing Machine',
          titleAr: 'غسالات',
          sortOrder: 1,
        },
      ],
      products: [
        {
          id: 'product-1',
          titleEn: 'Office Chair',
          titleAr: 'كرسي مكتب',
        },
      ],
    });

    expect(options).toEqual([
      {
        url: '/',
        label: 'Home (/)',
        group: 'website_pages',
      },
      {
        url: '/about',
        label: 'About (/about)',
        group: 'website_pages',
      },
      {
        url: '/services',
        label: 'Services (/services)',
        group: 'website_pages',
      },
      {
        url: '/services/service-1',
        label: 'Washing Machine / غسالات (/services/service-1)',
        group: 'service_pages',
      },
      {
        url: '/services/service-2',
        label: 'Refrigerators / ثلاجات (/services/service-2)',
        group: 'service_pages',
      },
      {
        url: '/product-details/product-1',
        label: 'Office Chair / كرسي مكتب (/product-details/product-1)',
        group: 'product_pages',
      },
    ]);
  });
});
