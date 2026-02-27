import Image from 'next/image';

export default function TopBar() {
  return (
    <div className="w-full bg-[#004FCE]">
      <div className="mx-auto flex h-9 w-full max-w-[1680px] items-center justify-between px-4 lg:px-[120px]">
        {/* Left: email */}
        <div className="flex items-center gap-2 text-xs text-white">
          <span className="inline-flex h-4 w-4 items-center justify-center">
            ✉
          </span>
          <a href="mailto:info@usedfurnituresaudi.com" className="hover:underline">
            info@usedfurnituresaudi.com
          </a>
        </div>

        {/* Right: icons */}
        <div className="flex items-center gap-3">
          <Image src="/fb.png" alt="Facebook" width={18} height={18} />
          <Image src="/insta.png" alt="Instagram" width={18} height={18} />
          <Image src="/yt.png" alt="YouTube" width={18} height={18} />
        </div>
      </div>
    </div>
  );
}