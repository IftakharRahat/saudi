import { describe, expect, it } from 'vitest';
import {
  normalizeSeoInternalLinks,
  pageSeoKeyFromIdentifier,
  pageSeoUrlFromKey,
  toPageSeoRecord,
} from '@/lib/page-seo';

describe('page SEO helpers', () => {
  it('normalizes URLs into stored SEO keys', () => {
    expect(pageSeoKeyFromIdentifier('/')).toBe('home');
    expect(pageSeoKeyFromIdentifier('/about')).toBe('about');
    expect(pageSeoKeyFromIdentifier('/product-details')).toBe('products');
    expect(pageSeoKeyFromIdentifier('/services/service-123')).toBe('services/service-123');
    expect(pageSeoKeyFromIdentifier('https://example.com/contact?x=1')).toBe('contact');
  });

  it('converts stored SEO keys back to public URLs', () => {
    expect(pageSeoUrlFromKey('home')).toBe('/');
    expect(pageSeoUrlFromKey('products')).toBe('/product-details');
    expect(pageSeoUrlFromKey('services/service-123')).toBe('/services/service-123');
  });

  it('parses stored internal links and filters incomplete rows', () => {
    const parsed = normalizeSeoInternalLinks(
      JSON.stringify([
        { anchorText: 'Contact us', destinationUrl: '/contact' },
        { anchorText: 'Broken', destinationUrl: '' },
      ]),
    );

    expect(parsed).toEqual([{ anchorText: 'Contact us', destinationUrl: '/contact' }]);
  });

  it('maps raw SEO rows into API records', () => {
    const record = toPageSeoRecord({
      id: 'seo_1',
      pageSlug: 'home',
      metaTitle: 'Home',
      implementationStatus: 'done',
      internalLinks: '[{\"anchorText\":\"About\",\"destinationUrl\":\"/about\"}]',
    });

    expect(record.url).toBe('/');
    expect(record.implementationStatus).toBe('done');
    expect(record.internalLinks).toEqual([{ anchorText: 'About', destinationUrl: '/about' }]);
  });
});
