"use client";

import { useRef } from "react";
import { ChartColumn, Compass, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/ui/card";
import { TextField } from "@/components/ui/field";
import { StepFooter, StepHeader } from "@/components/dashboard/step-frame";
import { ResultArea, ResultHeading, SummaryCard } from "./result-area";
import { SAMPLE_INDUSTRY, SAMPLE_TARGET } from "@/lib/samples";
import type { IndustryResult } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

export function IndustryView() {
  const ws = useWorkspace();
  const input = useRef<HTMLInputElement>(null);
  const ai = useAiRequest<IndustryResult>("/api/analyze/industry");
  const industry = ws.target.industry;

  const analyze = async () => {
    if (!industry.trim()) return input.current?.focus();
    const result = await ai.run({ industry, role: ws.target.role });
    if (result) updateWorkspace({ industry: { data: result, source: "ai" } });
  };
  const sample = () => {
    ai.reset();
    updateWorkspace({ target: { ...ws.target, industry: ws.target.industry || SAMPLE_TARGET.industry }, industry: { data: SAMPLE_INDUSTRY, source: "sample" } });
  };

  return (
    <div className="space-y-6">
      <StepHeader step="industry" desc="먼저 지원하려는 산업부터 살펴봅니다." />

      <section className="rounded-card-lg border border-line bg-white p-5 sm:p-7">
        <TextField
          ref={input}
          id="industry"
          label="관심 산업"
          placeholder="예: B2B SaaS"
          value={industry}
          onChange={(e) => updateWorkspace({ target: { ...ws.target, industry: e.target.value } })}
          onKeyDown={(e) => e.key === "Enter" && void analyze()}
        />
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => void analyze()} disabled={ai.status === "loading"} className="h-12 px-6">
            산업 분석하기
          </Button>
          <Button variant="ghost" onClick={sample} className="h-12">가상 예시 보기</Button>
        </div>
      </section>

      <ResultArea
        status={ai.status}
        loadingMessage="산업을 정리하고 있습니다..."
        hasResult={Boolean(ws.industry)}
        onAgain={() => void analyze()}
        onEdit={() => input.current?.focus()}
        onSample={sample}
        empty={{ title: "아직 산업 분석이 없습니다.", action: <Button onClick={() => void analyze()}>산업 분석 시작</Button> }}
      >
        {ws.industry && (
          <section aria-live="polite">
            <ResultHeading
              title={`${industry || "산업"} 한눈에 보기`}
              badge={<SourceBadge source={ws.industry.source} />}
              note={ws.industry.source === "ai" ? "AI가 일반적으로 알려진 내용을 정리했습니다. 최신 정보는 공식 자료로 확인하세요." : "예시 분석입니다. 실제 시장 조사가 아닙니다."}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard title="시장 구조" icon={<ChartColumn className="h-5 w-5" aria-hidden="true" />}>
                {ws.industry.data.structure}
              </SummaryCard>
              <SummaryCard title="주요 변화" icon={<Compass className="h-5 w-5" aria-hidden="true" />} tone="mint">
                <ul className="space-y-2">
                  {ws.industry.data.changes.map((c) => (
                    <li key={c} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />{c}</li>
                  ))}
                </ul>
              </SummaryCard>
              <SummaryCard title="직무에 미치는 영향" icon={<Target className="h-5 w-5" aria-hidden="true" />} tone="purple">
                {ws.industry.data.impact}
              </SummaryCard>
            </div>
            {ws.industry.data.details.length > 0 && (
              <details className="group mt-4 rounded-card border border-line bg-white px-5 py-4 sm:px-6">
                <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-ink">
                  더 알아볼 점
                  <span aria-hidden="true" className="text-ink-3 transition-transform duration-200 group-open:rotate-180">▾</span>
                </summary>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-2">
                  {ws.industry.data.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </details>
            )}
          </section>
        )}
      </ResultArea>

      <StepFooter step="industry" />
    </div>
  );
}
