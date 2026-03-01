'use client';

import CrudManager, { CrudField } from '@/components/admin/CrudManager';
import type { TestimonialRecord } from '@/lib/content-types';
import { fetchAdminTestimonials } from '@/lib/admin-client';

const fields: CrudField[] = [
  { key: 'textEn', label: 'Text (English)', type: 'textarea', required: true, rows: 4 },
  { key: 'textAr', label: 'Text (Arabic)', type: 'textarea', required: true, rows: 4 },
  { key: 'nameEn', label: 'Name (English)', type: 'text', required: true },
  { key: 'nameAr', label: 'Name (Arabic)', type: 'text', required: true },
  { key: 'roleEn', label: 'Role (English)', type: 'text', required: true },
  { key: 'roleAr', label: 'Role (Arabic)', type: 'text', required: true },
  { key: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
  { key: 'photoUrl', label: 'Photo URL', type: 'text' },
  { key: 'isApproved', label: 'Approved', type: 'checkbox' },
];

export default function AdminTestimonialsPage() {
  return (
    <CrudManager<TestimonialRecord>
      title="Testimonials"
      subtitle="Manage customer testimonials shown on the home page."
      endpoint="/api/admin/testimonials"
      fields={fields}
      loadItems={fetchAdminTestimonials}
      columns={[
        { label: 'Name EN', render: (item) => item.nameEn },
        { label: 'Name AR', render: (item) => item.nameAr },
        { label: 'Rating', render: (item) => String(item.rating) },
        { label: 'Approved', render: (item) => (item.isApproved ? 'Yes' : 'No') },
      ]}
      toFormValues={(item) => ({
        textEn: item.textEn,
        textAr: item.textAr,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        roleEn: item.roleEn,
        roleAr: item.roleAr,
        rating: item.rating,
        photoUrl: item.photoUrl ?? '',
        isApproved: item.isApproved,
      })}
    />
  );
}
