'use client';

import type {
  ContactSubmissionRecord,
  FaqRecord,
  ProductRecord,
  ServiceAreaRecord,
  ServiceRecord,
  SubscriberRecord,
  TestimonialRecord,
} from '@/lib/content-types';

type ApiDataPayload<T> = {
  data: T;
};

type ApiPayload = {
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export type AdminMutationResult = {
  ok: boolean;
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
};

async function parseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function getList<T>(path: string): Promise<T[]> {
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${path}${separator}page=1&limit=500`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }
  const payload = await parseJson<ApiDataPayload<T[]>>(response);
  return payload?.data ?? [];
}

export function fetchAdminServices() {
  return getList<ServiceRecord>('/api/admin/services');
}

export function fetchAdminProducts() {
  return getList<ProductRecord>('/api/admin/products');
}

export function fetchAdminTestimonials() {
  return getList<TestimonialRecord>('/api/admin/testimonials');
}

export function fetchAdminFaqs() {
  return getList<FaqRecord>('/api/admin/faqs');
}

export function fetchAdminAreas() {
  return getList<ServiceAreaRecord>('/api/admin/areas');
}

export function fetchAdminContacts() {
  return getList<ContactSubmissionRecord>('/api/admin/contacts');
}

export function fetchAdminSubscribers() {
  return getList<SubscriberRecord>('/api/admin/subscribers');
}

export async function adminCreate(path: string, body: unknown): Promise<AdminMutationResult> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await parseJson<ApiPayload>(response);

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? 'Request failed.',
      fieldErrors: payload?.fieldErrors ?? {},
    };
  }

  return {
    ok: true,
    message: payload?.message ?? 'Created successfully.',
    fieldErrors: {},
  };
}

export async function adminUpdate(path: string, body: unknown): Promise<AdminMutationResult> {
  const response = await fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await parseJson<ApiPayload>(response);

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? 'Request failed.',
      fieldErrors: payload?.fieldErrors ?? {},
    };
  }

  return {
    ok: true,
    message: payload?.message ?? 'Updated successfully.',
    fieldErrors: {},
  };
}

export async function adminDelete(path: string): Promise<AdminMutationResult> {
  const response = await fetch(path, {
    method: 'DELETE',
  });

  const payload = await parseJson<ApiPayload>(response);

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? 'Delete failed.',
      fieldErrors: {},
    };
  }

  return {
    ok: true,
    message: payload?.message ?? 'Deleted successfully.',
    fieldErrors: {},
  };
}
