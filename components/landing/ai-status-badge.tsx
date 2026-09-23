"use client";
import { Sparkles } from "lucide-react";
import { useAiReady } from "@/lib/use-ai";

/** 랜딩 첫머리의 AI 상태 표시. 실제 연결 상태를 확인한 뒤에만 사용 가능하다고 말한다. */
export function AiStatusBadge() {
  const ready = useAiReady();
  if (ready === null) return null;
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-ink-2">
      <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
      {ready ? "실제 AI 분석 기능을 사용할 수 있습니다." : "AI 분석 연결을 준비하고 있습니다. 예시로 흐름을 둘러볼 수 있습니다."}
    </p>
  );
}
