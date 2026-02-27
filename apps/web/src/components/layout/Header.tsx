'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export default function Header() {
  const { t, toggle, dir } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white">
      {/* TOP ROW */}
<div className="mx-auto flex w-full max-w-[1680px] items-center justify-between gap-3 px-4 py-4 lg:px-[120px]">
  {/* LEFT: Logo + Search */}
  <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-6">
    <Link
      href="/"
      className="flex h-[54.97px] w-[70px] shrink-0 items-center justify-center rounded-[5px] bg-[#004FCE]"
    >
      <Image src="/Logo.png" alt="Logo" width={52} height={40} />
    </Link>

    {/* Search (VISIBLE on mobile too) */}
    <div className="relative min-w-0 flex-1">
      <div className="relative w-full max-w-[544px]">
        <input
          className="h-[42px] w-full rounded-[23.5px] bg-[#D0E3FF7A] px-12 text-sm shadow-[0px_4px_80px_0px_rgba(0,0,0,0.06)] outline-none placeholder:text-[#666]"
          placeholder={t.searchPlaceholder}
        />
        <span
          className={`absolute top-1/2 -translate-y-1/2 ${
            dir === 'rtl' ? 'right-4' : 'left-4'
          }`}
        >
          <Image src="/search.png" alt="Search" width={20} height={20} />
        </span>
      </div>
    </div>
  </div>

  {/* CENTER: Nav (desktop only) */}
  <nav className="hidden items-center gap-6 lg:flex px-28">
    <Link className="text-[16px] font-medium text-[#333]" href="/">
      {t.home}
    </Link>
    <Link className="text-[16px] font-medium text-[#333]" href="/services">
      {t.services}
    </Link>
    <Link className="text-[16px] font-medium text-[#333]" href="/about">
      {t.aboutUs}
    </Link>
    <Link className="text-[16px] font-medium text-[#333]" href="/contact">
      {t.contact}
    </Link>
  </nav>

  {/* RIGHT: Language + Call (desktop) + Hamburger (mobile) */}
  <div className="flex shrink-0 items-center gap-3">
    {/* Language (VISIBLE on mobile) */}
    <button
      onClick={toggle}
      className="inline-flex h-12 w-12 items-center justify-center bg-transparent lg:h-[50px] lg:w-[47px]"
      aria-label="Toggle language"
    >
      <Image src="/Language.png" alt="Language" width={34} height={34} className="lg:hidden" />
      <Image src="/Language.png" alt="Language" width={45} height={45} className="hidden lg:block" />
    </button>

    {/* Call (desktop only) */}
    <a
      href="tel:+000123456889"
      className="hidden lg:inline-flex h-[50px] items-center justify-center rounded-[5px] bg-[#004FCE] px-5 text-sm font-semibold text-white"
    >
      {t.callForInfo}
    </a>

    {/* Hamburger (mobile only) */}
    <button
      className="grid h-10 w-10 place-items-center rounded-md border border-black/10 bg-white lg:hidden"
      onClick={() => setOpen((v) => !v)}
      aria-label="Open menu"
    >
      ☰
    </button>
  </div>
</div>

          
        

      {/* MOBILE: Big Call button row (kept like your screenshot) */}
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-4 lg:hidden">
        <a
          href="tel:+000123456889"
          className="inline-flex h-10 w-full items-center justify-center rounded-[5px] bg-[#004FCE] px-4 text-sm font-semibold text-white"
        >
          {t.callForInfo}
        </a>
      </div>

      {/* Mobile dropdown nav */}
      {open && (
        <div className="lg:hidden border-t border-black/10 bg-white">
          <div className="mx-auto w-full max-w-[1680px] px-4 py-3">
            <div className={`flex flex-col gap-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <Link onClick={() => setOpen(false)} className="text-sm font-medium text-[#333]" href="/">
                {t.home}
              </Link>
              <Link onClick={() => setOpen(false)} className="text-sm font-medium text-[#333]" href="/services">
                {t.services}
              </Link>
              <Link onClick={() => setOpen(false)} className="text-sm font-medium text-[#333]" href="/about">
                {t.aboutUs}
              </Link>
              <Link onClick={() => setOpen(false)} className="text-sm font-medium text-[#333]" href="/contact">
                {t.contact}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}