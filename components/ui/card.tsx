import type { ReactNode } from "react";

export function Card({
  children, className = "", large = false, as: Tag = "div",
}: { children: ReactNode; className?: string; large?: boolean; as?: "div" | "section" | "article" | "li" }) {
  return (
    <Tag className={`border border-line bg-white ${large ? "rounded-card-lg p-6 sm:p-8" : "rounded-card p-5 sm:p-6"} ${className}`}>
      {children}
    </Tag>
  );
}

export function NumberBadge({ no, tone = "blue" }: { no: string; tone?: "blue" | "navy" }) {
  const color = tone === "navy" ? "bg-navy text-white" : "bg-soft-blue text-brand";
  return (
    <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[13px] font-bold tabular-nums ${color}`}>
      {no}
    </span>
  );
}

export function SourceBadge({ source }: { source: "sample" | "ai" }) {
  return source === "ai" ? (
    <span className="inline-flex items-center rounded-full bg-soft-purple px-2.5 py-1 text-xs font-semibold text-violet">AI 초안</span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-soft-orange px-2.5 py-1 text-xs font-semibold text-amber">가상 예시</span>
  );
}

export function Chip({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "mint" | "plain" }) {
  const color =
    tone === "mint" ? "bg-soft-mint text-mint" : tone === "plain" ? "border border-line bg-white text-ink-2" : "bg-soft-blue text-brand";
  return <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${color}`}>{children}</span>;
}
