"use client";

import { useRef } from "react";
import { Building, Link2, Package, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/ui/card";
import { TextField } from "@/components/ui/field";
import { StepFooter, StepHeader } from "@/components/dashboard/step-frame";
import { ResultArea, ResultHeading, SummaryCard } from "./result-area";
import { SAMPLE_COMPANY, SAMPLE_TARGET } from "@/lib/samples";
import type { CompanyResult } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

export function CompanyView() {
  const ws = useWorkspace();
  const input = useRef<HTMLInputElement>(null);
  const ai = useAiRequest<CompanyResult>("/api/analyze/company");
  const { company, industry, role } = ws.target;

  const analyze = async () => {
    if (!company.trim()) return input.current?.focus();
    const result = await ai.run({ company, industry, role });
    if (result) updateWorkspace({ company: { data: result, source: "ai" } });
  };
  const sample = () => {
    ai.reset();
    updateWorkspace({ target: { ...ws.target, company: SAMPLE_TARGET.company }, company: { data: SAMPLE_COMPANY, source: "sample" } });
  };

  return (
    <div className="space-y-6">
      <StepHeader step="company" desc="지원하려는 기업의 사업과 방향을 살펴봅니다." />

      <section className="rounded-card-lg border border-line bg-white p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            ref={input}
            id="company-name"
            label="기업명"
            placeholder="예: Sample Labs"
            value={company}
            onChange={(e) => updateWorkspace({ target: { ...ws.target, company: e.target.value } })}
            onKeyDown={(e) => e.key === "Enter" && void analyze()}
          />
          <TextField id="company-url" label="기업 URL (선택)" placeholder="https://" disabled hint="링크 읽기는 다음 버전에서 지원합니다." />
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => void analyze()} disabled={ai.status === "loading"} className="h-12 px-6">기업 분석하기</Button>
          <Button variant="ghost" onClick={sample} className="h-12">가상 예시 보기</Button>
        </div>
      </section>

      <ResultArea
        status={ai.status}
        loadingMessage="기업의 핵심 정보를 살펴보고 있습니다..."
        hasResult={Boolean(ws.company)}
        onAgain={() => void analyze()}
        onEdit={() => input.current?.focus()}
        onSample={sample}
        empty={{ title: "아직 기업 분석이 없습니다.", action: <Button onClick={() => void analyze()}>기업 분석 시작</Button> }}
      >
        {ws.company && (
          <section aria-live="polite">
            <ResultHeading
              title={company || "기업"}
              badge={<SourceBadge source={ws.company.source} />}
              note={ws.company.source === "ai" ? "AI가 알고 있는 일반 정보입니다. 채용 공고와 기업 공식 자료로 꼭 확인하세요." : "Sample Labs는 가상의 기업입니다."}
            />
            <div className="rounded-card border border-line bg-white p-5 sm:p-6">
              <p className="text-[13px] font-semibold text-ink-3">기업 개요</p>
              <p className="mt-2 text-[18px] font-bold leading-snug text-navy">{ws.company.data.overview}</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <SummaryCard title="핵심 사업" icon={<Building className="h-5 w-5" aria-hidden="true" />}>{ws.company.data.business}</SummaryCard>
              <SummaryCard title="제품 / 서비스" icon={<Package className="h-5 w-5" aria-hidden="true" />} tone="mint">{ws.company.data.product}</SummaryCard>
              <SummaryCard title="최근 방향" icon={<Route className="h-5 w-5" aria-hidden="true" />} tone="purple">{ws.company.data.direction}</SummaryCard>
            </div>
            <div className="mt-4 flex gap-3 rounded-card border border-brand/20 bg-soft-blue p-5 sm:p-6">
              <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="text-[15px] font-bold text-navy">직무와의 연결</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{ws.company.data.roleLink}</p>
              </div>
            </div>
          </section>
        )}
      </ResultArea>

      <StepFooter step="company" />
    </div>
  );
}
