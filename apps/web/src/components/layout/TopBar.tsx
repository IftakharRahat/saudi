'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchSiteSettings } from '@/lib/frontend-api';

export default function TopBar() {
  const [email, setEmail] = useState('info@usedfurnituresaudi.com');

  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data?.contactEmail) setEmail(data.contactEmail);
      })
      .catch(() => { });
  }, []);

  return (
    <div className="w-full bg-[#004FCE]">
      <div className="mx-auto flex h-9 w-full max-w-[1680px] items-center justify-between px-4 lg:px-[120px]">
        {/* Left: email */}
        <div className="flex items-center gap-2 text-xs text-white">
          <span className="inline-flex h-4 w-4 items-center justify-center">
            ✉
          </span>
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        </div>

        {/* Right: icons */}
        <div className="flex items-center gap-3">
          <Image src="/fb.png" alt="Facebook" width={18} height={18} />
          <a
            href="https://www.instagram.com/furniture.move.ksa_0548531681?igsh=MWE2bHl0bzM2bnFzcQ=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/insta.png" alt="Instagram" width={18} height={18} />
          </a>
          <Image src="/yt.png" alt="YouTube" width={18} height={18} />
        </div>
      </div>
    </div>
  );
}
