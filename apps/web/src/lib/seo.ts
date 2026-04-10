import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * Fallback metadata used when no SEO entry exists for a page.
 */
const SITE_NAME = 'Future Companies';
const DEFAULT_DESCRIPTION = 'Used Furniture Saudi';

type SeoRow = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  schema: string;
  content: string;
  image: string;
};

/**
 * Fetch the PageSeo row for a given slug directly from the DB (server-side only).
 * Returns `null` when no matching row is found.
 */
export async function getPageSeo(slug: string): Promise<SeoRow | null> {
  try {
    const row = await prisma.pageSeo.findUnique({
      where: { pageSlug: slug },
      select: {
        metaTitle: true,
        metaDescription: true,
        ogTitle: true,
        ogDescription: true,
        ogImage: true,
        ogUrl: true,
        schema: true,
        content: true,
        image: true,
      },
    });
    return row;
  } catch (error) {
    console.error(`[SEO] Failed to fetch SEO for slug "${slug}".`, error);
    return null;
  }
}

/**
 * Build a Next.js Metadata object from a PageSeo row + sensible defaults.
 *
 * Usage in any `page.tsx`:
 * ```ts
 * export async function generateMetadata(): Promise<Metadata> {
 *   return buildPageMetadata('home');
 * }
 * ```
 */
export async function buildPageMetadata(
  slug: string,
  fallbackTitle?: string,
  fallbackDescription?: string,
): Promise<Metadata> {
  const seo = await getPageSeo(slug);

  const title = seo?.metaTitle || fallbackTitle || SITE_NAME;
  const description = seo?.metaDescription || fallbackDescription || DEFAULT_DESCRIPTION;

  const metadata: Metadata = {
    title,
    description,
  };

  // Open Graph
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const ogImage = seo?.ogImage || undefined;
  const ogUrl = seo?.ogUrl || undefined;

  metadata.openGraph = {
    title: ogTitle,
    description: ogDescription,
    siteName: SITE_NAME,
    ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    ...(ogUrl ? { url: ogUrl } : {}),
  };

  // Twitter card
  metadata.twitter = {
    card: 'summary_large_image',
    title: ogTitle,
    description: ogDescription,
    ...(ogImage ? { images: [ogImage] } : {}),
  };

  return metadata;
}

/**
 * Returns the JSON-LD schema string for a page (if configured in the admin).
 * Meant to be rendered inside a `<script type="application/ld+json">` tag.
 *
 * Returns `null` when no schema is set.
 */
export async function getPageSchema(slug: string): Promise<string | null> {
  const seo = await getPageSeo(slug);
  if (!seo?.schema) return null;
  return seo.schema;
}
