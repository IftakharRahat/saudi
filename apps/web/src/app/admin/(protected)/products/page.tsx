'use client';

import CrudManager, { CrudField } from '@/components/admin/CrudManager';
import type { ProductRecord } from '@/lib/content-types';
import { fetchAdminProducts } from '@/lib/admin-client';

const fields: CrudField[] = [
  { key: 'titleEn', label: 'Title (English)', type: 'text', required: true },
  { key: 'titleAr', label: 'Title (Arabic)', type: 'text', required: true },
  { key: 'descriptionEn', label: 'Description (English)', type: 'textarea', required: true, rows: 4 },
  { key: 'descriptionAr', label: 'Description (Arabic)', type: 'textarea', required: true, rows: 4 },
  {
    key: 'featuresEn',
    label: 'Features (English, one per line)',
    type: 'list',
    required: false,
    rows: 5,
  },
  {
    key: 'featuresAr',
    label: 'Features (Arabic, one per line)',
    type: 'list',
    required: false,
    rows: 5,
  },
  {
    key: 'images',
    label: 'Image URLs (one per line)',
    type: 'list',
    required: false,
    rows: 5,
  },
  { key: 'isActive', label: 'Active', type: 'checkbox' },
];

export default function AdminProductsPage() {
  return (
    <CrudManager<ProductRecord>
      title="Products"
      subtitle="Manage product details and image lists used in dynamic product pages."
      endpoint="/api/admin/products"
      fields={fields}
      loadItems={fetchAdminProducts}
      columns={[
        { label: 'Title EN', render: (item) => item.titleEn },
        { label: 'Title AR', render: (item) => item.titleAr },
        { label: 'Images', render: (item) => String(item.images.length) },
        { label: 'Active', render: (item) => (item.isActive ? 'Yes' : 'No') },
      ]}
      toFormValues={(item) => ({
        titleEn: item.titleEn,
        titleAr: item.titleAr,
        descriptionEn: item.descriptionEn,
        descriptionAr: item.descriptionAr,
        featuresEn: item.featuresEn.join('\n'),
        featuresAr: item.featuresAr.join('\n'),
        images: item.images
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((entry) => entry.imageUrl)
          .join('\n'),
        isActive: item.isActive,
      })}
    />
  );
}
