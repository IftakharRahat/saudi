import './globals.css';
import type { Metadata } from 'next';
import { I18nProvider } from '@/i18n/I18nProvider';
import SiteShell from '@/components/layout/SiteShell';

export const metadata: Metadata = {
  title: 'Future Companies',
  description: 'Used Furniture Saudi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <I18nProvider>
          <SiteShell>{children}</SiteShell>
        </I18nProvider>
      </body>
    </html>
  );
}