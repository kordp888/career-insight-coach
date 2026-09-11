"use client";

import { CircleCheck, CircleDashed } from "lucide-react";
import { StepFooter, StepHeader } from "@/components/dashboard/step-frame";
import { EmptyCard } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { answeredCount } from "@/lib/progress";
import { SAMPLE_CONNECT, SAMPLE_JOB } from "@/lib/samples";
import type { ExperiencePart } from "@/lib/types";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

const PARTS: { key: ExperiencePart; label: string }[] = [
  { key: "problem", label: "문제" },
  { key: "role", label: "역할" },
  { key: "choice", label: "선택" },
  { key: "reason", label: "이유" },
  { key: "result", label: "결과" },
  { key: "none", label: "아직 없음" },
];

export function ConnectView() {
  const ws = useWorkspace();
  const competencies = ws.job ? [...ws.job.data.core, ...ws.job.data.preferred] : [...SAMPLE_JOB.core, ...SAMPLE_JOB.preferred];
  const hasExperience = answeredCount(ws) > 0;

  const pick = (competency: string, part: ExperiencePart) => updateWorkspace({ connect: { ...ws.connect, [competency]: part } });
  const valueOf = (c: string): ExperiencePart | undefined => ws.connect[c];

  return (
    <div className="space-y-6">
      <StepHeader step="connect" desc="직무가 요구하는 역량마다, 내 경험의 어느 부분이 근거가 되는지 골라보세요." />

      {!hasExperience ? (
        <EmptyCard
          title="경험을 추가하면 역량과 연결해볼 수 있습니다."
          action={<ButtonLink href="/demo/experience">경험 추가</ButtonLink>}
        />
      ) : (
        <>
          {!ws.job && (
            <p className="rounded-[12px] bg-soft-orange px-4 py-3 text-[14px] text-ink-2">
              직무 분석 전이라 가상 예시의 역량으로 보여드립니다.
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[14px] text-ink-3">점수를 매기지 않습니다. 근거가 없는 역량은 &lsquo;아직 없음&rsquo;으로 두고 다른 경험으로 채워보세요.</p>
            <button
              type="button"
              className="min-h-10 rounded-btn px-3 text-[14px] font-semibold text-brand hover:bg-soft-blue"
              onClick={() => updateWorkspace({ connect: { ...SAMPLE_CONNECT } })}
            >
              예시 연결 채우기
            </button>
          </div>
          <ul className="space-y-3">
            {competencies.map((c) => {
              const v = valueOf(c);
              const linked = v && v !== "none";
              const quote = linked ? ws.experience[v as Exclude<ExperiencePart, "none">] : "";
              return (
                <li key={c} className="rounded-card border border-line bg-white p-5 sm:p-6">
                  <div className="flex items-center gap-2.5">
                    {linked ? (
                      <CircleCheck className="h-5 w-5 text-brand" aria-hidden="true" />
                    ) : (
                      <CircleDashed className="h-5 w-5 text-line-strong" aria-hidden="true" />
                    )}
                    <h2 className="text-[17px] font-bold text-navy">{c}</h2>
                    <span className="ml-auto text-[13px] font-semibold text-ink-3">{linked ? "근거 있음" : v === "none" ? "다른 경험으로 보완" : "선택 전"}</span>
                  </div>
                  <fieldset className="mt-4">
                    <legend className="sr-only">{c}의 근거가 되는 경험 부분</legend>
                    <div className="flex flex-wrap gap-2">
                      {PARTS.map((p) => (
                        <label key={p.key} className="cursor-pointer">
                          <input type="radio" name={`connect-${c}`} value={p.key} checked={v === p.key} onChange={() => pick(c, p.key)} className="peer sr-only" />
                          <span className="inline-flex min-h-10 items-center rounded-full border border-line px-3.5 text-[14px] font-medium text-ink-2 transition-colors duration-150 peer-checked:border-brand peer-checked:bg-soft-blue peer-checked:text-brand peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-brand">
                            {p.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {quote && <p className="mt-4 rounded-[12px] bg-canvas px-4 py-3 text-[14px] leading-relaxed text-ink-2">{quote}</p>}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <StepFooter step="connect" />
    </div>
  );
}
