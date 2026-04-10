'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchSeoEntries,
  createSeoEntry,
  updateSeoEntry,
  deleteSeoEntry,
} from '@/lib/frontend-api';
import { useAdminI18n } from '@/i18n/admin-i18n';
import type { PageSeoRecord } from '@/lib/content-types';

/** All known page slugs that can be configured with SEO metadata. */
const PAGE_SLUGS = [
  { value: 'home', label: 'Home  ( / )' },
  { value: 'about', label: 'About  ( /about )' },
  { value: 'contact', label: 'Contact  ( /contact )' },
  { value: 'services', label: 'Services  ( /services )' },
  { value: 'products', label: 'Products  ( /product-details )' },
] as const;

const EMPTY_FORM = {
  pageSlug: '',
  metaTitle: '',
  metaDescription: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogUrl: '',
  schema: '',
  content: '',
  image: '',
};

export default function AdminSeoPage() {
  const { t } = useAdminI18n();

  const [entries, setEntries] = useState<PageSeoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  /** Slugs that already have an SEO entry (excluding the one being edited). */
  const usedSlugs = new Set(
    entries
      .filter((e) => e.id !== editingId)
      .map((e) => e.pageSlug),
  );

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSeoEntries();
      setEntries(data);
    } catch {
      setStatus('error');
      setMessage(t.failedLoadSeo);
    } finally {
      setLoading(false);
    }
  }, [t.failedLoadSeo]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const updateField = (key: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setStatus('idle');
    setMessage('');
  };

  const openEdit = (entry: PageSeoRecord) => {
    setEditingId(entry.id);
    setForm({
      pageSlug: entry.pageSlug,
      metaTitle: entry.metaTitle,
      metaDescription: entry.metaDescription,
      ogTitle: entry.ogTitle,
      ogDescription: entry.ogDescription,
      ogImage: entry.ogImage,
      ogUrl: entry.ogUrl,
      schema: entry.schema,
      content: entry.content,
      image: entry.image,
    });
    setShowForm(true);
    setStatus('idle');
    setMessage('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('idle');
    setMessage('');

    const result = editingId
      ? await updateSeoEntry(editingId, form)
      : await createSeoEntry(form);

    if (result.ok) {
      setStatus('success');
      setMessage(result.message);
      closeForm();
      await loadEntries();
    } else {
      setStatus('error');
      setMessage(result.message);
    }

    setSaving(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm(t.confirmDeleteSeo)) return;

    const result = await deleteSeoEntry(id);
    if (result.ok) {
      setStatus('success');
      setMessage(result.message);
      await loadEntries();
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  const selectClass =
    'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE] transition-colors bg-white appearance-none cursor-pointer';
  const inputClass =
    'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE] transition-colors';
  const textareaClass =
    'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE] min-h-[100px] transition-colors';
  const monoTextareaClass =
    'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#004FCE] min-h-[140px] font-mono transition-colors';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">{t.seoManagement}</h1>
          <p className="mt-1 text-sm text-[#6B7280]">{t.seoManagementSub}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#004FCE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003DA6]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t.addSeoEntry}
        </button>
      </div>

      {/* Status message */}
      {status !== 'idle' && (
        <div
          className={`rounded-[8px] px-4 py-3 text-sm ${
            status === 'success'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Modal / Slide-out form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-12">
          <div className="w-full max-w-3xl rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111827]">
                {editingId ? t.editSeoEntry : t.addSeoEntry}
              </h2>
              <button
                onClick={closeForm}
                className="rounded-md p-1 text-[#6B7280] transition hover:bg-slate-100 hover:text-[#111827]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Page Slug — dropdown */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.pageSlug} *</label>
                {editingId ? (
                  /* When editing, slug is locked — show as readonly badge */
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                      /{form.pageSlug}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">
                      {PAGE_SLUGS.find((p) => p.value === form.pageSlug)?.label ?? form.pageSlug}
                    </span>
                  </div>
                ) : (
                  /* When creating, show dropdown */
                  <div className="relative">
                    <select
                      value={form.pageSlug}
                      onChange={(e) => updateField('pageSlug', e.target.value)}
                      className={selectClass}
                      required
                    >
                      <option value="" disabled>
                        — Select a page —
                      </option>
                      {PAGE_SLUGS.map((page) => {
                        const taken = usedSlugs.has(page.value);
                        return (
                          <option key={page.value} value={page.value} disabled={taken}>
                            {page.label}{taken ? '  ✓ (already configured)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {/* Chevron icon */}
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Meta Title & OG Title */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.metaTitle}</label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    placeholder="My Page — Future Companies"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogTitle}</label>
                  <input
                    type="text"
                    value={form.ogTitle}
                    onChange={(e) => updateField('ogTitle', e.target.value)}
                    placeholder="My Page — Future Companies"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Meta Description & OG Description */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.metaDescription}</label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    placeholder="A short description for search engines..."
                    className={textareaClass}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogDescription}</label>
                  <textarea
                    value={form.ogDescription}
                    onChange={(e) => updateField('ogDescription', e.target.value)}
                    placeholder="Description for social media previews..."
                    className={textareaClass}
                    rows={3}
                  />
                </div>
              </div>

              {/* OG Image & Page Image */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogImage}</label>
                  <input
                    type="text"
                    value={form.ogImage}
                    onChange={(e) => updateField('ogImage', e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.pageImage}</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => updateField('image', e.target.value)}
                    placeholder="https://example.com/page-image.jpg"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* OG URL */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogUrl}</label>
                <input
                  type="text"
                  value={form.ogUrl}
                  onChange={(e) => updateField('ogUrl', e.target.value)}
                  placeholder="https://usedfurnituresaudi.com/about"
                  className={inputClass}
                />
              </div>

              {/* Schema JSON-LD */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.schemaJsonLd}</label>
                <textarea
                  value={form.schema}
                  onChange={(e) => updateField('schema', e.target.value)}
                  placeholder='{"@context":"https://schema.org","@type":"WebPage",...}'
                  className={monoTextareaClass}
                  rows={5}
                />
                <p className="mt-1.5 text-xs text-[#6B7280]">{t.schemaJsonLdHint}</p>
              </div>

              {/* Content */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.contentText}</label>
                <textarea
                  value={form.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  placeholder="Page content or SEO text..."
                  className={textareaClass}
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-[8px] bg-[#004FCE] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003DA6] disabled:opacity-70"
                >
                  {saving ? t.saving : t.save}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-[8px] border border-[#D1D5DB] px-6 py-3 text-sm font-medium text-[#374151] transition hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
              </div>

              {/* Inline error in modal */}
              {status === 'error' && message && (
                <p className="text-sm text-red-600">{message}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <div className="p-6">
            <p className="text-sm text-[#6B7280]">{t.loading}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3 h-10 w-10 text-[#D1D5DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-[#6B7280]">{t.noSeoEntries}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-4 py-3 font-medium text-[#374151]">{t.pageSlug}</th>
                  <th className="px-4 py-3 font-medium text-[#374151]">{t.metaTitle}</th>
                  <th className="hidden px-4 py-3 font-medium text-[#374151] lg:table-cell">{t.ogTitle}</th>
                  <th className="hidden px-4 py-3 font-medium text-[#374151] md:table-cell">{t.ogImage}</th>
                  <th className="px-4 py-3 text-right font-medium text-[#374151]">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#F3F4F6] transition hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        /{entry.pageSlug}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-[#374151]">
                      {entry.metaTitle || <span className="text-[#D1D5DB]">—</span>}
                    </td>
                    <td className="hidden max-w-[200px] truncate px-4 py-3 text-[#374151] lg:table-cell">
                      {entry.ogTitle || <span className="text-[#D1D5DB]">—</span>}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {entry.ogImage ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Set
                        </span>
                      ) : (
                        <span className="text-xs text-[#D1D5DB]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEdit(entry)}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-[#004FCE] transition hover:bg-blue-50"
                        >
                          {t.edit}
                        </button>
                        <button
                          onClick={() => onDelete(entry.id)}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
