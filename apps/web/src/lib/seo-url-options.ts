import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ProductRecord, SeoUrlOptionRecord, ServiceRecord } from '@/lib/content-types';
import { prisma } from '@/lib/prisma';

const APP_DIRECTORY = path.join(process.cwd(), 'src', 'app');
const APP_PATHS_MANIFEST = path.join(process.cwd(), '.next', 'server', 'app-paths-manifest.json');
const PAGE_FILE_PATTERN = /^page\.(t|j)sx?$/i;
function formatRouteLabel(route: string) {
  if (route === '/') {
    return 'Home (/)';
  }

  const title = route
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/^\[|\]$/g, '')
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
    )
    .join(' / ');

  return `${title} (${route})`;
}

export function normalizeDiscoveredRoutePattern(rawRoute: string) {
  let normalized = rawRoute.replace(/\\/g, '/');
  normalized = normalized.replace(/^page\.(t|j)sx?$/i, '');
  normalized = normalized.replace(/^page$/, '');
  normalized = normalized.replace(/\/page\.(t|j)sx?$/i, '');
  normalized = normalized.replace(/\/page$/, '');

  if (!normalized || normalized === '/' || normalized === '/page') {
    return '/';
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  const segments = normalized
    .split('/')
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')));

  if (segments.length === 0) {
    return '/';
  }

  if (segments[0] === 'api' || segments[0] === 'admin' || segments[0].startsWith('_')) {
    return null;
  }

  return `/${segments.join('/')}`;
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function discoverSourceRoutes(directory: string, prefix = ''): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    const nextPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await discoverSourceRoutes(absolutePath, nextPrefix)));
      continue;
    }

    if (PAGE_FILE_PATTERN.test(entry.name)) {
      routes.push(normalizeDiscoveredRoutePattern(nextPrefix) ?? '');
    }
  }

  return routes.filter(Boolean);
}

async function discoverManifestRoutes() {
  const rawManifest = await fs.readFile(APP_PATHS_MANIFEST, 'utf8');
  const manifest = JSON.parse(rawManifest) as Record<string, string>;

  return Object.keys(manifest)
    .filter((routeKey) => routeKey.endsWith('/page'))
    .map((routeKey) => normalizeDiscoveredRoutePattern(routeKey))
    .filter((route): route is string => Boolean(route));
}

export async function discoverPublicRoutePatterns() {
  if (await pathExists(APP_DIRECTORY)) {
    const routes = await discoverSourceRoutes(APP_DIRECTORY);
    return Array.from(new Set(routes)).sort((left, right) => left.localeCompare(right));
  }

  if (await pathExists(APP_PATHS_MANIFEST)) {
    const routes = await discoverManifestRoutes();
    return Array.from(new Set(routes)).sort((left, right) => left.localeCompare(right));
  }

  return [];
}

type SeoUrlOptionBuilderInput = {
  routePatterns: string[];
  services: Pick<ServiceRecord, 'id' | 'titleEn' | 'titleAr' | 'sortOrder'>[];
  products: Pick<ProductRecord, 'id' | 'titleEn' | 'titleAr'>[];
};

export function buildSeoUrlOptions({
  routePatterns,
  services,
  products,
}: SeoUrlOptionBuilderInput): SeoUrlOptionRecord[] {
  const uniquePatterns = Array.from(new Set(routePatterns))
    .map((route) => normalizeDiscoveredRoutePattern(route))
    .filter((route): route is string => Boolean(route));
  const options = new Map<string, SeoUrlOptionRecord>();
  const hasServiceDetails = uniquePatterns.includes('/services/[id]');
  const hasProductDetails = uniquePatterns.includes('/product-details/[id]');
  const staticRoutes = uniquePatterns
    .filter((route) => !route.includes('['))
    .sort((left, right) => {
      if (left === '/' || right === '/') {
        return left === '/' ? -1 : 1;
      }

      return left.localeCompare(right);
    });

  for (const route of staticRoutes) {
    options.set(route, {
      url: route,
      label: formatRouteLabel(route),
      group: 'website_pages',
    });
  }

  if (hasServiceDetails) {
    const sortedServices = [...services].sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.titleEn.localeCompare(right.titleEn);
    });

    for (const service of sortedServices) {
      const url = `/services/${service.id}`;
      options.set(url, {
        url,
        label: `${service.titleEn} / ${service.titleAr} (${url})`,
        group: 'service_pages',
      });
    }
  }

  if (hasProductDetails) {
    const sortedProducts = [...products].sort((left, right) =>
      left.titleEn.localeCompare(right.titleEn),
    );

    for (const product of sortedProducts) {
      const url = `/product-details/${product.id}`;
      options.set(url, {
        url,
        label: `${product.titleEn} / ${product.titleAr} (${url})`,
        group: 'product_pages',
      });
    }
  }

  return Array.from(options.values());
}

export async function getSeoUrlOptions() {
  const routePatterns = await discoverPublicRoutePatterns();
  const [services, products] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        titleEn: true,
        titleAr: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { titleEn: 'asc' }],
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        titleEn: true,
        titleAr: true,
      },
      orderBy: { titleEn: 'asc' },
    }),
  ]);

  return buildSeoUrlOptions({
    routePatterns,
    services,
    products,
  });
}
