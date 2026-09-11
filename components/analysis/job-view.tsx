"use client";

import { useRef, useState } from "react";
import { Eye, ListChecks, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip, SourceBadge } from "@/components/ui/card";
import { TextArea, TextField } from "@/components/ui/field";
import { StepFooter, StepHeader } from "@/components/dashboard/step-frame";
import { ResultArea, ResultHeading, SummaryCard } from "./result-area";
import { SAMPLE_JD, SAMPLE_JOB } from "@/lib/samples";
import type { JobResult } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

export function JobView() {
  const ws = useWorkspace();
  const area = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"text" | "url">("text");
  const ai = useAiRequest<JobResult>("/api/analyze/job");

  const analyze = async () => {
    if (!ws.jd.trim()) return area.current?.focus();
    const result = await ai.run({ jd: ws.jd, role: ws.target.role, company: ws.target.company });
    if (result) updateWorkspace({ job: { data: result, source: "ai" } });
  };
  const sample = () => {
    ai.reset();
    updateWorkspace({ jd: SAMPLE_JD, job: { data: SAMPLE_JOB, source: "sample" } });
  };

  return (
    <div className="space-y-6">
      <StepHeader step="job" title="직무 / JD 분석" desc="채용공고에서 이 직무가 무엇을 기대하는지 정리합니다." />

      <section className="rounded-card-lg border border-line bg-white p-5 sm:p-7">
        <div role="tablist" aria-label="입력 방식" className="inline-flex rounded-btn bg-canvas p-1">
          {([["text", "JD 텍스트 붙여넣기"], ["url", "채용공고 URL"]] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className={`min-h-10 rounded-[10px] px-4 text-[14px] font-semibold transition-colors duration-150 ${mode === key ? "bg-white text-navy shadow-soft" : "text-ink-3"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {mode === "text" ? (
            <TextArea
              ref={area}
              id="jd"
              label="채용공고 내용"
              placeholder="주요 업무, 자격 요건, 우대 사항을 붙여넣어 주세요."
              value={ws.jd}
              onChange={(e) => updateWorkspace({ jd: e.target.value })}
              maxLength={4000}
              rows={7}
            />
          ) : (
            <TextField id="jd-url" label="채용공고 URL" placeholder="https://" disabled hint="링크 읽기는 다음 버전에서 지원합니다. 지금은 공고 내용을 붙여넣어 주세요." />
          )}
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => { setMode("text"); void analyze(); }} disabled={ai.status === "loading"} className="h-12 px-6">직무 분석하기</Button>
          <Button variant="ghost" onClick={sample} className="h-12">가상 예시 보기</Button>
        </div>
      </section>

      <ResultArea
        status={ai.status}
        loadingMessage="직무에서 중요한 역량을 찾고 있습니다..."
        hasResult={Boolean(ws.job)}
        onAgain={() => void analyze()}
        onEdit={() => { setMode("text"); area.current?.focus(); }}
        onSample={sample}
        empty={{ title: "아직 직무 분석이 없습니다.", desc: "채용공고를 붙여넣으면 주요 업무와 핵심 역량을 정리합니다.", action: <Button onClick={sample} variant="secondary">가상 예시 보기</Button> }}
      >
        {ws.job && (
          <section aria-live="polite">
            <ResultHeading title={ws.target.role || "직무"} badge={<SourceBadge source={ws.job.source} />} note={ws.job.source === "ai" ? "붙여넣은 공고를 바탕으로 정리했습니다. 공고에 없는 요구사항은 넣지 않았습니다." : "예시 공고로 정리한 결과입니다."} />
            <div className="rounded-card-lg bg-navy p-6 text-white sm:p-7">
              <p className="text-[13px] font-semibold text-white/70">직무 한 줄 요약</p>
              <p className="mt-2 text-[20px] font-bold leading-snug sm:text-[22px]">{ws.job.data.summary}</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SummaryCard title="주요 업무" icon={<ListChecks className="h-5 w-5" aria-hidden="true" />}>
                <ul className="space-y-2">
                  {ws.job.data.responsibilities.map((r) => (
                    <li key={r} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{r}</li>
                  ))}
                </ul>
              </SummaryCard>
              <div className="space-y-4">
                <SummaryCard title="핵심 역량" icon={<Target className="h-5 w-5" aria-hidden="true" />} tone="mint">
                  <div className="flex flex-wrap gap-2">{ws.job.data.core.map((c) => <Chip key={c}>{c}</Chip>)}</div>
                </SummaryCard>
                {ws.job.data.preferred.length > 0 && (
                  <SummaryCard title="우대 역량" icon={<Star className="h-5 w-5" aria-hidden="true" />} tone="purple">
                    <div className="flex flex-wrap gap-2">{ws.job.data.preferred.map((c) => <Chip key={c} tone="plain">{c}</Chip>)}</div>
                  </SummaryCard>
                )}
              </div>
            </div>
            {ws.job.data.perspective.length > 0 && (
              <div className="mt-4 rounded-card border border-line bg-white p-5 sm:p-6">
                <div className="flex items-center gap-2.5">
                  <Eye className="h-5 w-5 text-brand" aria-hidden="true" />
                  <h3 className="text-[17px] font-bold text-navy">직무에서 중요하게 보는 관점</h3>
                </div>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-2">
                  {ws.job.data.perspective.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            )}
          </section>
        )}
      </ResultArea>

      <StepFooter step="job" nextLabel="내 경험 정리하기" />
    </div>
  );
}
