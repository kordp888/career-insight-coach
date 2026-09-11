"use client";

import { Lightbulb, Link2, Quote } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Chip, SourceBadge } from "@/components/ui/card";
import { EmptyCard, ErrorCard, LoadingCard, UnavailableCard } from "@/components/ui/states";
import { StepFooter, StepHeader } from "@/components/dashboard/step-frame";
import { experiencePayload } from "@/components/experience/experience-interview";
import { answeredCount } from "@/lib/progress";
import { SAMPLE_EXPERIENCE, SAMPLE_INSIGHT, SAMPLE_JOB } from "@/lib/samples";
import type { InsightResult } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

export function InsightView() {
  const ws = useWorkspace();
  const ai = useAiRequest<InsightResult>("/api/generate/insight");
  const hasExperience = answeredCount(ws) > 0;

  const find = async () => {
    const competencies = ws.job ? ws.job.data.core : SAMPLE_JOB.core;
    const result = await ai.run({ ...experiencePayload(ws.target.role, ws.experience), competencies });
    if (result) updateWorkspace({ insight: { data: result, source: "ai" } });
  };
  const sample = () => {
    ai.reset();
    updateWorkspace({
      insight: { data: SAMPLE_INSIGHT, source: "sample" },
      ...(hasExperience ? {} : { experience: SAMPLE_EXPERIENCE }),
    });
  };

  const insight = ws.insight;

  return (
    <div className="space-y-6">
      <StepHeader step="insight" title="이 경험에서 이런 강점이 보입니다." desc="정리한 경험 속에서 반복되는 판단과 행동을 찾아 직무와 이어봅니다." />

      {!hasExperience && !insight ? (
        <EmptyCard
          title="경험을 추가하면 직무와 연결되는 인사이트를 찾을 수 있습니다."
          action={<><ButtonLink href="/demo/experience">경험 추가</ButtonLink><Button variant="secondary" onClick={sample}>가상 예시 보기</Button></>}
        />
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="h-12 px-6" onClick={() => void find()} disabled={ai.status === "loading" || !hasExperience}>
            <Lightbulb className="h-4 w-4" aria-hidden="true" /> {insight ? "다시 찾기" : "인사이트 찾기"}
          </Button>
          <Button variant="ghost" className="h-12" onClick={sample}>가상 예시 보기</Button>
        </div>
      )}

      {ai.status === "loading" && <LoadingCard message="당신의 경험에서 반복되는 패턴을 찾고 있습니다..." lines={5} />}
      {ai.status === "error" && <ErrorCard onAgain={() => void find()} />}
      {ai.status === "unavailable" && !insight && <UnavailableCard onSample={sample} />}

      {ai.status !== "loading" && insight && (
        <section aria-live="polite" className="space-y-4">
          <article className="relative overflow-hidden rounded-card-lg border border-brand/15 bg-gradient-to-br from-white to-soft-blue p-6 shadow-soft sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand">
                <Lightbulb className="h-4 w-4" aria-hidden="true" /> 발견된 강점
              </p>
              <SourceBadge source={insight.source} />
            </div>
            <h2 className="mt-4 text-[28px] font-bold leading-snug tracking-tight text-navy sm:text-[38px]">{insight.data.strength}</h2>
            <div className="mt-7 flex gap-3 border-t border-line pt-6">
              <Quote className="mt-1 h-5 w-5 shrink-0 text-brand/60" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-semibold text-ink-3">근거</p>
                <p className="mt-1.5 text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">{insight.data.evidence}</p>
              </div>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
            <article className="rounded-card border border-line bg-white p-5 sm:p-6">
              <p className="inline-flex items-center gap-2 text-[14px] font-bold text-navy">
                <Link2 className="h-4 w-4 text-brand" aria-hidden="true" /> 직무와의 연결
              </p>
              <p className="mt-3"><Chip>{ws.target.role || "지원 직무"}</Chip></p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{insight.data.roleLink}</p>
            </article>
            <article className="rounded-card border border-line bg-white p-5 sm:p-6">
              <p className="text-[14px] font-bold text-navy">관련 역량</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {insight.data.competencies.map((c) => <li key={c}><Chip tone="mint">{c}</Chip></li>)}
              </ul>
            </article>
          </div>
          <p className="text-[13px] leading-relaxed text-ink-3">이 결과는 성격 진단이 아닙니다. 이 경험에서 드러난 한 가지 관점이며, 다른 경험에서는 다르게 보일 수 있습니다.</p>
        </section>
      )}

      <StepFooter step="insight" nextLabel="문서로 연결하기" />
    </div>
  );
}
