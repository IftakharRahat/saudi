'use client';

import { useAdminI18n } from '@/i18n/admin-i18n';

export default function AdminLangToggle() {
    const { lang, toggle } = useAdminI18n();

    return (
        <button
            type="button"
            onClick={toggle}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            title={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
        >
            {lang === 'en' ? 'عربي' : 'EN'}
        </button>
    );
}
