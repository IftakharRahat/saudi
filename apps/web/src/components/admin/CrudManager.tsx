'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { adminCreate, adminDelete, adminUpdate } from '@/lib/admin-client';

type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'list';

export type CrudField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
};

export type CrudColumn<T> = {
  label: string;
  render: (item: T) => string;
};

type CrudManagerProps<T extends { id: string }> = {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: CrudField[];
  columns: CrudColumn<T>[];
  loadItems: () => Promise<T[]>;
  idLabel?: string;
  toFormValues?: (item: T) => Record<string, string | number | boolean>;
  toPayload?: (values: Record<string, string | number | boolean>) => Record<string, unknown>;
};

function defaultValuesForFields(fields: CrudField[]) {
  const initial: Record<string, string | number | boolean> = {};
  for (const field of fields) {
    if (field.type === 'checkbox') {
      initial[field.key] = false;
    } else if (field.type === 'number') {
      initial[field.key] = 0;
    } else {
      initial[field.key] = '';
    }
  }
  return initial;
}

function normalizeByField(field: CrudField, value: string | number | boolean) {
  if (field.type === 'checkbox') {
    return Boolean(value);
  }
  if (field.type === 'number') {
    if (typeof value === 'number') {
      return value;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (field.type === 'list') {
    const text = String(value);
    const list = text
      .split('\n')
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (!field.required && list.length === 0) {
      return [];
    }
    return list;
  }
  const normalized = String(value).trim();
  if (!field.required && normalized.length === 0) {
    return undefined;
  }
  return normalized;
}

function toSafeString(value: string | number | boolean | undefined) {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return value ?? '';
}

export default function CrudManager<T extends { id: string }>({
  title,
  subtitle,
  endpoint,
  fields,
  columns,
  loadItems,
  idLabel = 'ID',
  toFormValues,
  toPayload,
}: CrudManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'idle' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  const defaultValues = useMemo(() => defaultValuesForFields(fields), [fields]);
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>(defaultValues);

  useEffect(() => {
    setFormValues(defaultValues);
  }, [defaultValues]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [loadItems]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resetForm = () => {
    setEditingId(null);
    setFormValues(defaultValues);
    setFieldErrors({});
  };

  const startEdit = (item: T) => {
    const nextValues = defaultValuesForFields(fields);
    const source = toFormValues ? toFormValues(item) : (item as unknown as Record<string, string | number | boolean>);

    for (const field of fields) {
      const raw = source[field.key];
      if (field.type === 'list' && Array.isArray(raw)) {
        nextValues[field.key] = raw.join('\n');
        continue;
      }
      nextValues[field.key] = raw ?? nextValues[field.key];
    }

    setEditingId(item.id);
    setFormValues(nextValues);
    setFieldErrors({});
    setMessage('');
    setMessageType('idle');
  };

  const buildPayload = () => {
    const normalized: Record<string, unknown> = {};
    for (const field of fields) {
      const value = formValues[field.key];
      normalized[field.key] = normalizeByField(field, value);
    }
    return toPayload ? toPayload(formValues) : normalized;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setMessageType('idle');
    setFieldErrors({});

    try {
      const payload = buildPayload();
      const result = editingId
        ? await adminUpdate(`${endpoint}/${editingId}`, payload)
        : await adminCreate(endpoint, payload);

      setMessage(result.message);
      setMessageType(result.ok ? 'success' : 'error');
      setFieldErrors(result.fieldErrors);

      if (result.ok) {
        await refresh();
        resetForm();
      }
    } catch {
      setMessageType('error');
      setMessage('Request failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: string) => {
    const shouldDelete = window.confirm('Delete this item?');
    if (!shouldDelete) {
      return;
    }

    setMessage('');
    setMessageType('idle');

    const result = await adminDelete(`${endpoint}/${id}`);
    setMessage(result.message);
    setMessageType(result.ok ? 'success' : 'error');

    if (result.ok) {
      await refresh();
      if (editingId === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold">{editingId ? `Edit ${title}` : `Create ${title}`}</h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          {fields.map((field) => {
            const value = formValues[field.key];
            return (
              <div key={field.key} className={field.type === 'textarea' || field.type === 'list' ? 'md:col-span-2' : ''}>
                <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>

                {field.type === 'textarea' || field.type === 'list' ? (
                  <textarea
                    required={field.required}
                    value={toSafeString(value)}
                    rows={field.rows ?? (field.type === 'list' ? 5 : 4)}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                ) : field.type === 'checkbox' ? (
                  <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(event) =>
                        setFormValues((prev) => ({
                          ...prev,
                          [field.key]: event.target.checked,
                        }))
                      }
                    />
                    <span>Enabled</span>
                  </label>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    required={field.required}
                    value={toSafeString(value)}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500"
                  />
                )}

                {fieldErrors[field.key]?.[0] && <p className="mt-1 text-xs text-red-600">{fieldErrors[field.key]?.[0]}</p>}
              </div>
            );
          })}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>

        {messageType !== 'idle' && (
          <p className={`mt-3 text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-600'}`}>{message}</p>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold">{title} List</h3>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">{idLabel}</th>
                  {columns.map((column) => (
                    <th key={column.label} className="px-2 py-2 text-left font-semibold text-slate-600">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 align-top">
                    <td className="px-2 py-2 font-mono text-xs text-slate-500">{item.id.slice(0, 10)}...</td>
                    {columns.map((column) => (
                      <td key={`${item.id}-${column.label}`} className="max-w-[320px] px-2 py-2 text-slate-700">
                        {column.render(item)}
                      </td>
                    ))}
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(item.id)}
                          className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
