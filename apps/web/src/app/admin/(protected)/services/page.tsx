'use client';

import CrudManager, { CrudField } from '@/components/admin/CrudManager';
import type { ServiceRecord } from '@/lib/content-types';
import { fetchAdminServices } from '@/lib/admin-client';

const fields: CrudField[] = [
  { key: 'titleEn', label: 'Title (English)', type: 'text', required: true },
  { key: 'titleAr', label: 'Title (Arabic)', type: 'text', required: true },
  { key: 'descriptionEn', label: 'Description (English)', type: 'textarea', required: true, rows: 4 },
  { key: 'descriptionAr', label: 'Description (Arabic)', type: 'textarea', required: true, rows: 4 },
  { key: 'imageUrl', label: 'Image URL', type: 'text', required: true },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  { key: 'isActive', label: 'Active', type: 'checkbox' },
];

export default function AdminServicesPage() {
  return (
    <CrudManager<ServiceRecord>
      title="Services"
      subtitle="Create, edit, and remove service cards shown on public pages."
      endpoint="/api/admin/services"
      fields={fields}
      loadItems={fetchAdminServices}
      columns={[
        { label: 'Title EN', render: (item) => item.titleEn },
        { label: 'Title AR', render: (item) => item.titleAr },
        { label: 'Active', render: (item) => (item.isActive ? 'Yes' : 'No') },
        { label: 'Sort', render: (item) => String(item.sortOrder) },
      ]}
    />
  );
}
