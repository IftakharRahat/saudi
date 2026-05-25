'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createSeoEntry,
  deleteSeoEntry,
  fetchSeoEntries,
  fetchSeoUrlOptions,
  updateSeoEntry,
} from '@/lib/frontend-api';
import { useAdminI18n } from '@/i18n/admin-i18n';
import type {
  PageSeoInput,
  PageSeoRecord,
  SeoImplementationStatus,
  SeoInternalLinkRecord,
  SeoUrlOptionGroup,
  SeoUrlOptionRecord,
} from '@/lib/content-types';
import { SEO_IMPLEMENTATION_STATUSES, pageSeoKeyFromIdentifier } from '@/lib/page-seo';

type SeoFormState = {
  url: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  h1Tag: string;
  h2H3Tags: string;
  imageAltText: string;
  internalLinks: SeoInternalLinkRecord[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  schema: string;
  implementationStatus: SeoImplementationStatus;
};

const GROUP_ORDER: SeoUrlOptionGroup[] = [
  'website_pages',
  'service_pages',
  'product_pages',
];

function createEmptyForm(): SeoFormState {
  return {
    url: '',
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    secondaryKeywords: '',
    h1Tag: '',
    h2H3Tags: '',
    imageAltText: '',
    internalLinks: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    schema: '',
    implementationStatus: 'pending',
  };
}

function splitListInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  if (!value) {
    return '—';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }

  return parsed.toLocaleString();
}

function sanitizeInternalLinks(rows: SeoInternalLinkRecord[]) {
  return rows
    .map((row) => ({
      anchorText: row.anchorText.trim(),
      destinationUrl: row.destinationUrl.trim(),
    }))
    .filter((row) => row.anchorText || row.destinationUrl);
}

export default function AdminSeoPage() {
  const { t } = useAdminI18n();

  const [entries, setEntries] = useState<PageSeoRecord[]>([]);
  const [urlOptions, setUrlOptions] = useState<SeoUrlOptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SeoFormState>(() => createEmptyForm());

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);

      const [seoResult, optionsResult] = await Promise.allSettled([
        fetchSeoEntries(),
        fetchSeoUrlOptions(),
      ]);

      if (!active) {
        return;
      }

      if (seoResult.status === 'fulfilled') {
        setEntries(seoResult.value);
      } else {
        setStatus('error');
        setMessage(t.failedLoadSeo);
      }

      if (optionsResult.status === 'fulfilled') {
        setUrlOptions(optionsResult.value);
      } else {
        setUrlOptions([]);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [t.failedLoadSeo]);

  const loadEntries = async () => {
    try {
      const data = await fetchSeoEntries();
      setEntries(data);
      return data;
    } catch {
      setStatus('error');
      setMessage(t.failedLoadSeo);
      return null;
    }
  };

  const loadUrlOptions = async () => {
    try {
      const data = await fetchSeoUrlOptions();
      setUrlOptions(data);
      return data;
    } catch {
      setStatus('error');
      setMessage(t.failedLoadSeo);
      return null;
    }
  };

  const usedSeoKeys = useMemo(() => {
    return new Set(
      entries
        .filter((entry) => entry.id !== editingId)
        .map((entry) => pageSeoKeyFromIdentifier(entry.url)),
    );
  }, [editingId, entries]);

  const groupedOptions = useMemo(() => {
    return urlOptions.reduce<Record<SeoUrlOptionGroup, SeoUrlOptionRecord[]>>(
      (groups, option) => {
        groups[option.group].push(option);
        return groups;
      },
      {
        website_pages: [],
        service_pages: [],
        product_pages: [],
      },
    );
  }, [urlOptions]);

  const selectedOption = useMemo(() => {
    if (!form.url) {
      return null;
    }

    return (
      urlOptions.find((option) => option.url === form.url) ?? {
        url: form.url,
        label: `${t.currentSavedUrl} (${form.url})`,
        group: 'website_pages' as const,
      }
    );
  }, [form.url, t.currentSavedUrl, urlOptions]);

  const availableCreateOptions = useMemo(() => {
    return urlOptions.filter((option) => !usedSeoKeys.has(pageSeoKeyFromIdentifier(option.url)));
  }, [urlOptions, usedSeoKeys]);

  const updateField = <K extends keyof SeoFormState>(key: K, value: SeoFormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const updateInternalLink = (
    index: number,
    key: keyof SeoInternalLinkRecord,
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      internalLinks: previous.internalLinks.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    }));
  };

  const addInternalLink = () => {
    setForm((previous) => ({
      ...previous,
      internalLinks: [
        ...previous.internalLinks,
        {
          anchorText: '',
          destinationUrl: '',
        },
      ],
    }));
  };

  const removeInternalLink = (index: number) => {
    setForm((previous) => ({
      ...previous,
      internalLinks: previous.internalLinks.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const getFirstAvailableUrl = (options: SeoUrlOptionRecord[]) => {
    return (
      options.find((option) => !usedSeoKeys.has(pageSeoKeyFromIdentifier(option.url)))?.url ?? ''
    );
  };

  const openCreate = async () => {
    setStatus('idle');
    setMessage('');

    const latestOptions = (await loadUrlOptions()) ?? urlOptions;
    const firstAvailableUrl = getFirstAvailableUrl(latestOptions);

    setEditingId(null);
    setForm({
      ...createEmptyForm(),
      url: firstAvailableUrl,
    });
    setShowForm(true);
  };

  const openEdit = async (entry: PageSeoRecord) => {
    setStatus('idle');
    setMessage('');
    await loadUrlOptions();

    setEditingId(entry.id);
    setForm({
      url: entry.url,
      metaTitle: entry.metaTitle,
      metaDescription: entry.metaDescription,
      focusKeyword: entry.focusKeyword,
      secondaryKeywords: entry.secondaryKeywords.join('\n'),
      h1Tag: entry.h1Tag,
      h2H3Tags: entry.h2H3Tags.join('\n'),
      imageAltText: entry.imageAltText.join('\n'),
      internalLinks: entry.internalLinks,
      ogTitle: entry.ogTitle,
      ogDescription: entry.ogDescription,
      ogImage: entry.ogImage,
      ogUrl: entry.ogUrl,
      schema: entry.schema,
      implementationStatus: entry.implementationStatus,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyForm());
  };

  const buildPayload = (): PageSeoInput => {
    return {
      url: form.url.trim(),
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      focusKeyword: form.focusKeyword.trim(),
      secondaryKeywords: splitListInput(form.secondaryKeywords),
      h1Tag: form.h1Tag.trim(),
      h2H3Tags: splitListInput(form.h2H3Tags),
      imageAltText: splitListInput(form.imageAltText),
      internalLinks: sanitizeInternalLinks(form.internalLinks),
      ogTitle: form.ogTitle.trim(),
      ogDescription: form.ogDescription.trim(),
      ogImage: form.ogImage.trim(),
      ogUrl: form.ogUrl.trim(),
      schema: form.schema.trim(),
      implementationStatus: form.implementationStatus,
    };
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus('idle');
    setMessage('');

    if (!form.url.trim()) {
      setSaving(false);
      setStatus('error');
      setMessage(t.noUrlOptions);
      return;
    }

    const normalizedLinks = sanitizeInternalLinks(form.internalLinks);
    const hasIncompleteLink = form.internalLinks.some((row) => {
      const anchorText = row.anchorText.trim();
      const destinationUrl = row.destinationUrl.trim();
      return Boolean(anchorText || destinationUrl) && (!anchorText || !destinationUrl);
    });

    if (hasIncompleteLink) {
      setSaving(false);
      setStatus('error');
      setMessage(t.internalLinkValidation);
      return;
    }

    const payload = {
      ...buildPayload(),
      internalLinks: normalizedLinks,
    };

    const result = editingId
      ? await updateSeoEntry(editingId, payload)
      : await createSeoEntry(payload);

    if (result.ok) {
      setStatus('success');
      setMessage(result.message);
      closeForm();
      await Promise.all([loadEntries(), loadUrlOptions()]);
    } else {
      setStatus('error');
      setMessage(result.message);
    }

    setSaving(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm(t.confirmDeleteSeo)) {
      return;
    }

    const result = await deleteSeoEntry(id);
    if (result.ok) {
      setStatus('success');
      setMessage(result.message);
      await Promise.all([loadEntries(), loadUrlOptions()]);
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  const selectClass =
    'w-full rounded-[8px] border border-[#D1D5DB] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#004FCE]';
  const inputClass =
    'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none transition-colors focus:border-[#004FCE]';
  const textareaClass =
    'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm outline-none transition-colors focus:border-[#004FCE] min-h-[100px]';
  const monoTextareaClass =
    'w-full rounded-[8px] border border-[#D1D5DB] px-4 py-3 text-sm font-mono outline-none transition-colors focus:border-[#004FCE] min-h-[140px]';

  const statusLabel = (value: SeoImplementationStatus) => {
    switch (value) {
      case 'done':
        return t.statusDone;
      case 'in_progress':
        return t.statusInProgress;
      default:
        return t.statusPending;
    }
  };

  const statusClass = (value: SeoImplementationStatus) => {
    switch (value) {
      case 'done':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getGroupLabel = (group: SeoUrlOptionGroup) => {
    switch (group) {
      case 'service_pages':
        return t.servicePages;
      case 'product_pages':
        return t.productPages;
      default:
        return t.websitePages;
    }
  };

  const formatOptionLabel = (option: SeoUrlOptionRecord) => {
    const isConfigured =
      option.url !== form.url && usedSeoKeys.has(pageSeoKeyFromIdentifier(option.url));

    return isConfigured
      ? `${option.label} - ${t.alreadyConfiguredShort}`
      : option.label;
  };

  return (
    <div className="space-y-6">
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

      <div className="rounded-[12px] border border-[#D7E6FF] bg-[#F4F8FF] px-4 py-4 text-sm text-[#31537A]">
        {t.seoScopeHint}
      </div>

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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-8">
          <div className="w-full max-w-5xl rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-xl">
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

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.pageSlug} *</label>
                  <select
                    value={form.url}
                    onChange={(event) => updateField('url', event.target.value)}
                    className={selectClass}
                    required
                  >
                    <option value="" disabled>
                      {t.selectPageUrl}
                    </option>

                    {selectedOption && !urlOptions.some((option) => option.url === selectedOption.url) && (
                      <option value={selectedOption.url}>{selectedOption.label}</option>
                    )}

                    {GROUP_ORDER.map((group) => {
                      const options = groupedOptions[group];
                      if (options.length === 0) {
                        return null;
                      }

                      return (
                        <optgroup key={group} label={getGroupLabel(group)}>
                          {options.map((option) => {
                            const isConfigured =
                              option.url !== form.url &&
                              usedSeoKeys.has(pageSeoKeyFromIdentifier(option.url));

                            return (
                              <option
                                key={option.url}
                                value={option.url}
                                disabled={isConfigured}
                              >
                                {formatOptionLabel(option)}
                              </option>
                            );
                          })}
                        </optgroup>
                      );
                    })}
                  </select>

                  <p className="mt-1.5 text-xs text-[#6B7280]">{t.pageSlugHint}</p>

                  {selectedOption ? (
                    <div className="mt-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFBFC] px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6B7280]">
                        {getGroupLabel(selectedOption.group)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#111827]">{selectedOption.label}</p>
                      <p className="mt-1 text-xs text-[#6B7280]">{selectedOption.url}</p>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-[10px] border border-dashed border-[#D1D5DB] px-4 py-3 text-sm text-[#6B7280]">
                      {availableCreateOptions.length === 0 ? t.noUrlOptions : t.selectPageUrl}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.implementationStatus}</label>
                  <select
                    value={form.implementationStatus}
                    onChange={(event) =>
                      updateField('implementationStatus', event.target.value as SeoImplementationStatus)
                    }
                    className={selectClass}
                  >
                    {SEO_IMPLEMENTATION_STATUSES.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusLabel(statusOption)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.metaTitle}</label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(event) => updateField('metaTitle', event.target.value)}
                    placeholder="My Page | Future Companies"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.focusKeyword}</label>
                  <input
                    type="text"
                    value={form.focusKeyword}
                    onChange={(event) => updateField('focusKeyword', event.target.value)}
                    placeholder="used washing machine buyer"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.metaDescription}</label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(event) => updateField('metaDescription', event.target.value)}
                    placeholder="A short description for search engines..."
                    className={textareaClass}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.secondaryKeywords}</label>
                  <textarea
                    value={form.secondaryKeywords}
                    onChange={(event) => updateField('secondaryKeywords', event.target.value)}
                    placeholder="used furniture buyer&#10;washing machine pickup"
                    className={textareaClass}
                    rows={4}
                  />
                  <p className="mt-1.5 text-xs text-[#6B7280]">{t.secondaryKeywordsHint}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.h1Tag}</label>
                  <input
                    type="text"
                    value={form.h1Tag}
                    onChange={(event) => updateField('h1Tag', event.target.value)}
                    placeholder="Used Washing Machine Buyers in Dammam"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.h2H3Tags}</label>
                  <textarea
                    value={form.h2H3Tags}
                    onChange={(event) => updateField('h2H3Tags', event.target.value)}
                    placeholder="Best prices for used washing machines&#10;Fast pickup anywhere in Dammam"
                    className={textareaClass}
                    rows={4}
                  />
                  <p className="mt-1.5 text-xs text-[#6B7280]">{t.headingTagsHint}</p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.imageAltText}</label>
                <textarea
                  value={form.imageAltText}
                  onChange={(event) => updateField('imageAltText', event.target.value)}
                  placeholder="Team loading a used washing machine&#10;Pickup truck outside customer home"
                  className={textareaClass}
                  rows={4}
                />
                <p className="mt-1.5 text-xs text-[#6B7280]">{t.imageAltTextHint}</p>
              </div>

              <div className="rounded-[12px] border border-[#E5E7EB] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">{t.internalLinks}</h3>
                    <p className="mt-1 text-xs text-[#6B7280]">{t.seoScopeHint}</p>
                  </div>
                  <button
                    type="button"
                    onClick={addInternalLink}
                    className="rounded-[8px] border border-[#D1D5DB] px-3 py-2 text-xs font-medium text-[#374151] transition hover:bg-slate-50"
                  >
                    {t.addInternalLink}
                  </button>
                </div>

                {form.internalLinks.length === 0 ? (
                  <div className="rounded-[8px] border border-dashed border-[#D1D5DB] px-4 py-6 text-center text-sm text-[#6B7280]">
                    {t.internalLinks}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {form.internalLinks.map((link, index) => (
                      <div key={`${index}-${link.anchorText}-${link.destinationUrl}`} className="grid gap-3 rounded-[10px] border border-[#E5E7EB] p-3 md:grid-cols-[1fr_1fr_auto]">
                        <input
                          type="text"
                          value={link.anchorText}
                          onChange={(event) => updateInternalLink(index, 'anchorText', event.target.value)}
                          placeholder={t.internalLinkAnchor}
                          className={inputClass}
                        />
                        <input
                          type="text"
                          value={link.destinationUrl}
                          onChange={(event) => updateInternalLink(index, 'destinationUrl', event.target.value)}
                          placeholder="/contact"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => removeInternalLink(index)}
                          className="rounded-[8px] border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          {t.delete}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogTitle}</label>
                  <input
                    type="text"
                    value={form.ogTitle}
                    onChange={(event) => updateField('ogTitle', event.target.value)}
                    placeholder="My Page | Future Companies"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogImage}</label>
                  <input
                    type="text"
                    value={form.ogImage}
                    onChange={(event) => updateField('ogImage', event.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogDescription}</label>
                <textarea
                  value={form.ogDescription}
                  onChange={(event) => updateField('ogDescription', event.target.value)}
                  placeholder="Description for social media previews..."
                  className={textareaClass}
                  rows={4}
                />
              </div>

              <div className="rounded-[12px] border border-[#E5E7EB] p-4">
                <h3 className="text-sm font-semibold text-[#111827]">{t.advancedFields}</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.ogUrl}</label>
                    <input
                      type="text"
                      value={form.ogUrl}
                      onChange={(event) => updateField('ogUrl', event.target.value)}
                      placeholder="https://usedfurnituresaudi.com/services/clx123"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#111827]">{t.schemaJsonLd}</label>
                    <textarea
                      value={form.schema}
                      onChange={(event) => updateField('schema', event.target.value)}
                      placeholder='{"@context":"https://schema.org","@type":"WebPage"}'
                      className={monoTextareaClass}
                      rows={5}
                    />
                    <p className="mt-1.5 text-xs text-[#6B7280]">{t.schemaJsonLdHint}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !form.url}
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

              {status === 'error' && message && <p className="text-sm text-red-600">{message}</p>}
            </form>
          </div>
        </div>
      )}

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
                  <th className="hidden px-4 py-3 font-medium text-[#374151] lg:table-cell">{t.focusKeyword}</th>
                  <th className="px-4 py-3 font-medium text-[#374151]">{t.implementationStatus}</th>
                  <th className="hidden px-4 py-3 font-medium text-[#374151] md:table-cell">{t.updatedAt}</th>
                  <th className="px-4 py-3 text-right font-medium text-[#374151]">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#F3F4F6] transition hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {entry.url}
                      </span>
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-[#374151]">
                      {entry.metaTitle || <span className="text-[#D1D5DB]">—</span>}
                    </td>
                    <td className="hidden max-w-[200px] truncate px-4 py-3 text-[#374151] lg:table-cell">
                      {entry.focusKeyword || <span className="text-[#D1D5DB]">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(entry.implementationStatus)}`}>
                        {statusLabel(entry.implementationStatus)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-[#6B7280] md:table-cell">
                      {formatDate(entry.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => void openEdit(entry)}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-[#004FCE] transition hover:bg-blue-50"
                        >
                          {t.edit}
                        </button>
                        <button
                          onClick={() => void onDelete(entry.id)}
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
