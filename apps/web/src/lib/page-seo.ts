import type {
  PageSeoInput,
  PageSeoRecord,
  SeoImplementationStatus,
  SeoInternalLinkRecord,
} from '@/lib/content-types';

const STATIC_KEY_TO_URL: Record<string, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  services: '/services',
  products: '/product-details',
};

const STATIC_SEGMENT_TO_KEY: Record<string, string> = {
  home: 'home',
  about: 'about',
  contact: 'contact',
  services: 'services',
  'product-details': 'products',
  products: 'products',
};

export const SEO_IMPLEMENTATION_STATUSES = ['pending', 'in_progress', 'done'] as const;

function normalizePathname(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return '/';
  }

  let pathname = trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      pathname = new URL(trimmed).pathname || '/';
    } catch {
      pathname = trimmed;
    }
  }

  pathname = pathname.replace(/\\/g, '/');
  pathname = pathname.split(/[?#]/, 1)[0] ?? pathname;

  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  pathname = pathname.replace(/\/{2,}/g, '/');

  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  return pathname || '/';
}

function normalizeUrlSegment(value: string) {
  return value.trim().replace(/^\/+|\/+$/g, '');
}

export function pageSeoKeyFromIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) {
    return 'home';
  }

  if (!trimmed.startsWith('/') && !/^https?:\/\//i.test(trimmed)) {
    const normalizedSegment = normalizeUrlSegment(trimmed);
    if (!normalizedSegment) {
      return 'home';
    }
    return STATIC_SEGMENT_TO_KEY[normalizedSegment] ?? normalizedSegment;
  }

  const pathname = normalizePathname(trimmed);
  if (pathname === '/') {
    return 'home';
  }

  const normalizedSegment = pathname.slice(1);
  return STATIC_SEGMENT_TO_KEY[normalizedSegment] ?? normalizedSegment;
}

export function pageSeoUrlFromKey(key: string) {
  const normalizedKey = normalizeUrlSegment(key);
  if (!normalizedKey || normalizedKey === 'home') {
    return '/';
  }

  return STATIC_KEY_TO_URL[normalizedKey] ?? `/${normalizedKey}`;
}

export function normalizeSeoImplementationStatus(
  value: string | null | undefined,
): SeoImplementationStatus {
  if (value === 'pending' || value === 'in_progress' || value === 'done') {
    return value;
  }
  return 'pending';
}

export function normalizeSeoInternalLinks(value: unknown): SeoInternalLinkRecord[] {
  const source = typeof value === 'string'
    ? (() => {
        const trimmed = value.trim();
        if (!trimmed) {
          return [];
        }

        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })()
    : Array.isArray(value)
      ? value
      : [];

  return source
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const rawAnchor = 'anchorText' in item ? item.anchorText : '';
      const rawDestination = 'destinationUrl' in item ? item.destinationUrl : '';
      const anchorText = typeof rawAnchor === 'string' ? rawAnchor.trim() : '';
      const destinationUrl = typeof rawDestination === 'string' ? rawDestination.trim() : '';

      if (!anchorText || !destinationUrl) {
        return null;
      }

      return {
        anchorText,
        destinationUrl,
      };
    })
    .filter((item): item is SeoInternalLinkRecord => item !== null);
}

type PageSeoRowLike = {
  id: string;
  pageSlug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string[] | null;
  h1Tag?: string | null;
  h2H3Tags?: string[] | null;
  imageAltText?: string[] | null;
  internalLinks?: unknown;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogUrl?: string | null;
  schema?: string | null;
  implementationStatus?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

function toIsoString(value: Date | string | null | undefined) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  return '';
}

export function toPageSeoRecord(row: PageSeoRowLike): PageSeoRecord {
  return {
    id: row.id,
    url: pageSeoUrlFromKey(row.pageSlug ?? ''),
    metaTitle: row.metaTitle ?? '',
    metaDescription: row.metaDescription ?? '',
    focusKeyword: row.focusKeyword ?? '',
    secondaryKeywords: row.secondaryKeywords ?? [],
    h1Tag: row.h1Tag ?? '',
    h2H3Tags: row.h2H3Tags ?? [],
    imageAltText: row.imageAltText ?? [],
    internalLinks: normalizeSeoInternalLinks(row.internalLinks),
    ogTitle: row.ogTitle ?? '',
    ogDescription: row.ogDescription ?? '',
    ogImage: row.ogImage ?? '',
    ogUrl: row.ogUrl ?? '',
    schema: row.schema ?? '',
    implementationStatus: normalizeSeoImplementationStatus(row.implementationStatus),
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

export function toPageSeoCreateData(input: PageSeoInput) {
  return {
    pageSlug: pageSeoKeyFromIdentifier(input.url),
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    focusKeyword: input.focusKeyword,
    secondaryKeywords: input.secondaryKeywords,
    h1Tag: input.h1Tag,
    h2H3Tags: input.h2H3Tags,
    imageAltText: input.imageAltText,
    internalLinks: JSON.stringify(input.internalLinks),
    ogTitle: input.ogTitle,
    ogDescription: input.ogDescription,
    ogImage: input.ogImage,
    ogUrl: input.ogUrl,
    schema: input.schema,
    implementationStatus: input.implementationStatus,
  };
}

export function toPageSeoUpdateData(input: Partial<PageSeoInput>) {
  return {
    ...(input.url !== undefined ? { pageSlug: pageSeoKeyFromIdentifier(input.url) } : {}),
    ...(input.metaTitle !== undefined ? { metaTitle: input.metaTitle } : {}),
    ...(input.metaDescription !== undefined ? { metaDescription: input.metaDescription } : {}),
    ...(input.focusKeyword !== undefined ? { focusKeyword: input.focusKeyword } : {}),
    ...(input.secondaryKeywords !== undefined ? { secondaryKeywords: input.secondaryKeywords } : {}),
    ...(input.h1Tag !== undefined ? { h1Tag: input.h1Tag } : {}),
    ...(input.h2H3Tags !== undefined ? { h2H3Tags: input.h2H3Tags } : {}),
    ...(input.imageAltText !== undefined ? { imageAltText: input.imageAltText } : {}),
    ...(input.internalLinks !== undefined
      ? { internalLinks: JSON.stringify(input.internalLinks) }
      : {}),
    ...(input.ogTitle !== undefined ? { ogTitle: input.ogTitle } : {}),
    ...(input.ogDescription !== undefined ? { ogDescription: input.ogDescription } : {}),
    ...(input.ogImage !== undefined ? { ogImage: input.ogImage } : {}),
    ...(input.ogUrl !== undefined ? { ogUrl: input.ogUrl } : {}),
    ...(input.schema !== undefined ? { schema: input.schema } : {}),
    ...(input.implementationStatus !== undefined
      ? { implementationStatus: input.implementationStatus }
      : {}),
  };
}
