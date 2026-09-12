"use client";

import type { ReactNode } from "react";
import type { AiStatus } from "@/lib/use-ai";
import { EmptyCard, ErrorCard, LoadingCard, UnavailableCard } from "@/components/ui/states";

/** AI 요청 상태에 따라 결과 자리를 그린다: 불러오는 중, 오류, 연결 전, 비어 있음, 결과. */
export function ResultArea({
  status, loadingMessage, hasResult, onAgain, onEdit, onSample, empty, children,
}: {
  status: AiStatus;
  loadingMessage: string;
  hasResult: boolean;
  onAgain: () => void;
  onEdit?: () => void;
  onSample: () => void;
  empty: { title: string; desc?: string; action?: ReactNode };
  children: ReactNode;
}) {
  if (status === "loading") return <LoadingCard message={loadingMessage} lines={4} />;
  if (status === "error") return <ErrorCard onAgain={onAgain} onEdit={onEdit} />;
  if (status === "limited") return <div role="alert" className="rounded-card bg-soft-orange p-6">요청이 많습니다. 잠시 후 다시 시도해주세요.</div>;
  if (status === "unavailable") return <UnavailableCard onSample={onSample} />;
  if (!hasResult) return <EmptyCard {...empty} />;
  return <>{children}</>;
}

export function ResultHeading({ title, badge, note }: { title: string; badge: ReactNode; note?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-bold text-navy">{title}</h2>
        {badge}
      </div>
      {note && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">{note}</p>}
    </div>
  );
}

export function SummaryCard({ title, icon, children, tone = "blue", className = "" }: {
  title: string; icon: ReactNode; children: ReactNode; tone?: "blue" | "mint" | "purple"; className?: string;
}) {
  const toneClass = tone === "mint" ? "bg-soft-mint text-mint" : tone === "purple" ? "bg-soft-purple text-violet" : "bg-soft-blue text-brand";
  return (
    <article className={`rounded-card border border-line bg-white p-5 sm:p-6 ${className}`}>
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${toneClass}`}>{icon}</span>
        <h3 className="text-[17px] font-bold text-navy">{title}</h3>
      </div>
      <div className="mt-4 text-[15px] leading-relaxed text-ink-2">{children}</div>
    </article>
  );
}
