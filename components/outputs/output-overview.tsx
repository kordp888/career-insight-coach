import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LetterPreview, PortfolioPreview, ResumePreview } from "./doc-previews";

const DOCS = [
  { href: "/demo/output/resume", title: "이력서", sub: "직무와 연결되는 핵심 경험을 명확하게 정리", preview: <ResumePreview /> },
  { href: "/demo/output/cover-letter", title: "자소서", sub: "질문에 맞는 경험과 핵심 메시지 구조화", preview: <LetterPreview /> },
  { href: "/demo/output/portfolio", title: "포트폴리오", sub: "문제 → 판단 → 실행 → 결과가 보이는 프로젝트 이야기", preview: <PortfolioPreview /> },
];

export function OutputCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {DOCS.map((d) => (
        <li key={d.href}>
          <Link href={d.href} className="group flex h-full flex-col rounded-card-lg border border-line bg-white p-5 transition-shadow duration-200 hover:shadow-soft sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-navy">{d.title}</h2>
              <ArrowRight className="h-5 w-5 text-ink-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
            </div>
            <p className="mt-1.5 text-[14px] text-ink-3">{d.sub}</p>
            <div className="mt-5 flex-1 rounded-[18px] bg-canvas p-4">{d.preview}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
