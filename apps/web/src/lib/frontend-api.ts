import type {
  FaqRecord,
  ProductRecord,
  ServiceAreaRecord,
  ServiceRecord,
  SiteSettingsRecord,
  TestimonialRecord,
} from '@/lib/content-types';

type ApiErrorPayload = {
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

type ApiDataPayload<T> = {
  data: T;
};

type ApiMessagePayload = {
  message?: string;
  id?: string;
};

type SearchPayload = {
  data: {
    services: ServiceRecord[];
    products: ProductRecord[];
    faqs: FaqRecord[];
  };
  query: {
    q: string;
    lang: 'en' | 'ar';
  };
};

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function withPagination(path: string, page = 1, limit = 100) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}page=${page}&limit=${limit}`;
}

async function fetchData<T>(path: string, page = 1, limit = 100): Promise<T[]> {
  const response = await fetch(withPagination(path, page, limit), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }
  const payload = await parseJson<ApiDataPayload<T[]>>(response);
  return payload?.data ?? [];
}

export async function fetchServices() {
  return fetchData<ServiceRecord>('/api/services', 1, 100);
}

export async function fetchServiceById(id: string) {
  const response = await fetch(`/api/services/${id}`, { cache: 'no-store' });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Request failed for /api/services/${id}: ${response.status}`);
  }
  const payload = await parseJson<ApiDataPayload<ServiceRecord>>(response);
  return payload?.data ?? null;
}

export async function fetchServiceAreas() {
  return fetchData<ServiceAreaRecord>('/api/areas', 1, 100);
}

export async function fetchTestimonials() {
  return fetchData<TestimonialRecord>('/api/testimonials', 1, 100);
}

export async function fetchFaqs() {
  return fetchData<FaqRecord>('/api/faqs', 1, 100);
}

export async function fetchProducts() {
  return fetchData<ProductRecord>('/api/products', 1, 100);
}

export async function fetchProductById(id: string) {
  const response = await fetch(`/api/products/${id}`, { cache: 'no-store' });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Request failed for /api/products/${id}: ${response.status}`);
  }
  const payload = await parseJson<ApiDataPayload<ProductRecord>>(response);
  return payload?.data ?? null;
}

export async function searchContent(query: string, lang: 'en' | 'ar') {
  const encodedQ = encodeURIComponent(query);
  const response = await fetch(`/api/search?q=${encodedQ}&lang=${lang}&page=1&limit=20`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Search request failed: ${response.status}`);
  }

  const payload = await parseJson<SearchPayload>(response);
  return (
    payload?.data ?? {
      services: [],
      products: [],
      faqs: [],
    }
  );
}

export async function submitNewsletter(email: string) {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const payload = await parseJson<ApiErrorPayload & ApiMessagePayload>(response);

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? 'Subscription failed.',
    };
  }

  return {
    ok: true,
    message: payload?.message ?? 'Subscription successful.',
  };
}

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  location: string;
  message: string;
};

export async function submitContactForm(data: ContactPayload) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const payload = await parseJson<ApiErrorPayload & ApiMessagePayload>(response);

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? 'Failed to submit contact form.',
      fieldErrors: payload?.fieldErrors ?? {},
    };
  }

  return {
    ok: true,
    message: payload?.message ?? 'Contact form submitted successfully.',
    fieldErrors: {} as Record<string, string[] | undefined>,
  };
}

export async function fetchSiteSettings() {
  const response = await fetch('/api/site-settings', { cache: 'no-store' });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Request failed for /api/site-settings: ${response.status}`);
  }

  const payload = await parseJson<{ data: SiteSettingsRecord | null }>(response);
  return payload?.data ?? null;
}

export async function updateSiteSettings(data: {
  supportPhone: string;
  whatsappPhone: string;
  contactEmail: string;
  address: string;
}) {
  const response = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const payload = await parseJson<{ data?: SiteSettingsRecord; error?: string }>(response);

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? 'Failed to update settings.',
      data: null,
    };
  }

  return {
    ok: true,
    message: 'Settings updated successfully.',
    data: payload?.data ?? null,
  };
}

// ── SEO entries ──────────────────────────────────────────────────

export async function fetchSeoEntries() {
  return fetchData<import('@/lib/content-types').PageSeoRecord>('/api/admin/seo', 1, 200);
}

export async function fetchSeoById(id: string) {
  const response = await fetch(`/api/admin/seo/${id}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Request failed for /api/admin/seo/${id}: ${response.status}`);
  const payload = await parseJson<{ data: import('@/lib/content-types').PageSeoRecord }>(response);
  return payload?.data ?? null;
}

export async function createSeoEntry(data: Record<string, string>) {
  const response = await fetch('/api/admin/seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await parseJson<{ data?: unknown; error?: string }>(response);
  if (!response.ok) {
    return { ok: false as const, message: payload?.error ?? 'Failed to create SEO entry.' };
  }
  return { ok: true as const, message: 'SEO entry created.' };
}

export async function updateSeoEntry(id: string, data: Record<string, string>) {
  const response = await fetch(`/api/admin/seo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await parseJson<{ data?: unknown; error?: string }>(response);
  if (!response.ok) {
    return { ok: false as const, message: payload?.error ?? 'Failed to update SEO entry.' };
  }
  return { ok: true as const, message: 'SEO entry updated.' };
}

export async function deleteSeoEntry(id: string) {
  const response = await fetch(`/api/admin/seo/${id}`, { method: 'DELETE' });
  const payload = await parseJson<{ message?: string; error?: string }>(response);
  if (!response.ok) {
    return { ok: false as const, message: payload?.error ?? 'Failed to delete SEO entry.' };
  }
  return { ok: true as const, message: payload?.message ?? 'SEO entry deleted.' };
}