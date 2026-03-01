'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/I18nProvider';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { dir, lang } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-dvh bg-[#F5F7FB] text-[#1F2937]">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-white text-[#333]">
      <TopBar />
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
