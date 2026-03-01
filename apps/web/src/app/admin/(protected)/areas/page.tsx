'use client';

import CrudManager, { CrudField } from '@/components/admin/CrudManager';
import type { ServiceAreaRecord } from '@/lib/content-types';
import { fetchAdminAreas } from '@/lib/admin-client';

const fields: CrudField[] = [
  { key: 'cityEn', label: 'City (English)', type: 'text', required: true },
  { key: 'cityAr', label: 'City (Arabic)', type: 'text', required: true },
  { key: 'titleEn', label: 'Title (English)', type: 'text', required: true },
  { key: 'titleAr', label: 'Title (Arabic)', type: 'text', required: true },
  { key: 'descriptionEn', label: 'Description (English)', type: 'textarea', required: true, rows: 4 },
  { key: 'descriptionAr', label: 'Description (Arabic)', type: 'textarea', required: true, rows: 4 },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  { key: 'isActive', label: 'Active', type: 'checkbox' },
];

export default function AdminAreasPage() {
  return (
    <CrudManager<ServiceAreaRecord>
      title="Service Areas"
      subtitle="Manage the areas section shown on the Services page."
      endpoint="/api/admin/areas"
      fields={fields}
      loadItems={fetchAdminAreas}
      columns={[
        { label: 'City EN', render: (item) => item.cityEn },
        { label: 'City AR', render: (item) => item.cityAr },
        { label: 'Sort', render: (item) => String(item.sortOrder) },
        { label: 'Active', render: (item) => (item.isActive ? 'Yes' : 'No') },
      ]}
    />
  );
}
