import Image from "next/image";
import Link from "next/link";
import appIcon from "@/assets/app-icon.png";
import { SITE } from "@/lib/site";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-2.5 rounded-btn" aria-label={`${SITE.name} 홈`}>
      <Image src={appIcon} alt="" width={40} height={40} priority className="h-10 w-10 rounded-[11px] shadow-[0_2px_8px_rgba(21,101,249,0.18)]" />
      <span className="flex flex-col leading-tight">
        <span className="text-[16px] font-bold tracking-tight text-navy">{SITE.name}</span>
        {!compact && <span className="text-[11px] font-medium text-ink-3">{SITE.englishName}</span>}
      </span>
    </Link>
  );
}
