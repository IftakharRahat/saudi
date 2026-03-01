'use client';

import CrudManager, { CrudField } from '@/components/admin/CrudManager';
import type { FaqRecord } from '@/lib/content-types';
import { fetchAdminFaqs } from '@/lib/admin-client';

const fields: CrudField[] = [
  { key: 'questionEn', label: 'Question (English)', type: 'text', required: true },
  { key: 'questionAr', label: 'Question (Arabic)', type: 'text', required: true },
  { key: 'answerEn', label: 'Answer (English)', type: 'textarea', required: true, rows: 4 },
  { key: 'answerAr', label: 'Answer (Arabic)', type: 'textarea', required: true, rows: 4 },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' },
  { key: 'isActive', label: 'Active', type: 'checkbox' },
];

export default function AdminFaqsPage() {
  return (
    <CrudManager<FaqRecord>
      title="FAQs"
      subtitle="Manage frequently asked questions shown on the home page."
      endpoint="/api/admin/faqs"
      fields={fields}
      loadItems={fetchAdminFaqs}
      columns={[
        { label: 'Question EN', render: (item) => item.questionEn },
        { label: 'Question AR', render: (item) => item.questionAr },
        { label: 'Sort', render: (item) => String(item.sortOrder) },
        { label: 'Active', render: (item) => (item.isActive ? 'Yes' : 'No') },
      ]}
    />
  );
}
