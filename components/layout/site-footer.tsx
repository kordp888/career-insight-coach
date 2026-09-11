import Link from "next/link";
import { SITE } from "@/lib/site";
import { GithubMark } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[16px] font-bold text-navy">{SITE.name}</p>
          <p className="mt-1 text-sm text-ink-3">{SITE.englishName} · AI PM 포트폴리오</p>
          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-ink-3">
            공개 저장소에는 포트폴리오, 제품 개요, 템플릿 및 가상 예시만 포함합니다. MIT License.
          </p>
        </div>
        <nav aria-label="바닥글 메뉴" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-2">
          <Link href="/demo" className="inline-flex min-h-11 items-center hover:text-brand">데모</Link>
          <Link href="/about" className="inline-flex min-h-11 items-center hover:text-brand">프로젝트</Link>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 hover:text-brand">
            <GithubMark /> GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
