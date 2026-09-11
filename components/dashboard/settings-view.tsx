"use client";

import { KeyRound, MicVocal, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiReady } from "@/lib/use-ai";
import { resetWorkspace } from "@/lib/workspace";

export function SettingsView() {
  const ready = useAiReady();
  return (
    <div className="space-y-6">
      <h1 className="text-[26px] font-bold tracking-tight text-navy sm:text-[32px]">설정</h1>

      <section className="rounded-card-lg border border-line bg-white p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-brand" aria-hidden="true" />
          <h2 className="text-[18px] font-bold text-navy">AI 연결</h2>
          <span className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${ready ? "bg-soft-mint text-mint" : "bg-soft-orange text-amber"}`}>
            {ready === null ? "확인 중" : ready ? "연결됨" : "연결 전"}
          </span>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          AI 분석은 이 서비스의 서버를 거쳐 처리됩니다. 입력한 내용은 분석을 위해 AI 제공사로 전달되니 실제 개인정보는 넣지 마세요.
        </p>
      </section>

      <section className="rounded-card-lg border border-dashed border-line-strong bg-white p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <KeyRound className="h-5 w-5 text-violet" aria-hidden="true" />
          <h2 className="text-[18px] font-bold text-navy">BYOK · Bring Your Own Key</h2>
          <span className="ml-auto rounded-full bg-soft-orange px-2.5 py-1 text-xs font-semibold text-amber">향후 지원 예정</span>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-3">직접 고른 AI 제공사와 본인의 API 키를 연결하는 방식입니다.</p>
        <Button variant="secondary" className="mt-4" disabled>키 연결하기</Button>
      </section>

      <section className="rounded-card-lg border border-dashed border-line-strong bg-white p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <MicVocal className="h-5 w-5 text-brand" aria-hidden="true" />
          <h2 className="text-[18px] font-bold text-navy">면접 준비</h2>
          <span className="ml-auto rounded-full bg-soft-blue px-2.5 py-1 text-xs font-semibold text-brand">v0.2</span>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-3">정리한 경험을 면접 답변으로 이어가는 기능은 다음 버전에서 다룹니다.</p>
      </section>

      <section className="rounded-card-lg border border-line bg-white p-6 sm:p-7">
        <h2 className="text-[18px] font-bold text-navy">데모 데이터</h2>
        <p className="mt-2 text-[15px] text-ink-2">입력한 내용은 이 브라우저에만 저장됩니다.</p>
        <Button variant="secondary" className="mt-4" onClick={() => resetWorkspace()}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> 처음부터 다시 하기
        </Button>
      </section>
    </div>
  );
}
