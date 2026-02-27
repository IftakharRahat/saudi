'use client';

import Image from 'next/image';
import { useI18n } from '@/i18n/I18nProvider';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full bg-[#F9F9FA]">
      <div className="mx-auto grid w-full max-w-[1680px] gap-10 px-4 py-10 lg:grid-cols-4 lg:px-[120px]">
        {/* About */}
        <div className="rounded-md">
          <div className="mb-4 inline-flex h-16 w-[118px] items-center justify-center rounded-[5px] bg-[#004FCE]">
            <Image src="/Logo.png" alt="Logo" width={70} height={40} />
          </div>
          <h3 className="mb-2 text-lg font-semibold">{t.footerAboutTitle}</h3>
          <p className="text-sm leading-6 text-[#666]">
  {t.footerDescription}
</p>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">{t.footerSupportTitle}</h3>
          <ul className="space-y-2 text-sm text-[#333]">
  <li>• {t.footerSupport1}</li>
  <li>• {t.footerSupport2}</li>
  <li>• {t.footerSupport3}</li>
  <li>• {t.footerSupport4}</li>
</ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">{t.footerContactTitle}</h3>
          <div className="space-y-2 text-sm text-[#333]">
            <div>0578680908</div>
            <div>info@usedfurnituresaudi.com</div>
          </div>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">{t.footerSubscribeTitle}</h3>

          <div className="flex overflow-hidden rounded-[5px] border border-black/10 bg-white">
            <input
              className="h-[57px] flex-1 px-4 text-sm outline-none"
              placeholder={t.footerEmailPlaceholder}
            />
            <button className="h-[57px] w-[161px] bg-[#004FCE] text-sm font-semibold text-white">
              {t.footerSubscribe}
            </button>
          </div>

          <label className="mt-3 flex items-center gap-2 text-xs text-[#333]">
            <input type="checkbox" className="h-4 w-4" />
            {t.footerAgree}
          </label>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full bg-[#004FCE]">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col items-center justify-between gap-4 px-4 py-4 text-white lg:flex-row lg:px-[120px]">
          <div className="text-sm">{t.copyright}</div>

          <div className="flex items-center gap-3">
            <Image src="/fb.png" alt="Facebook" width={24} height={24} />
            <Image src="/insta.png" alt="Instagram" width={24} height={24} />
            <Image src="/yt.png" alt="YouTube" width={24} height={24} />
            <Image src="/pinterest.png" alt="Pinterest" width={24} height={24} />
            <Image src="/twt.png" alt="Twitter" width={24} height={24} />
          </div>
        </div>
      </div>

     <div className="py-3 text-center text-xs text-[#666]">
  {t.footerBottomCopyright}
</div>
    </footer>
  );
}