"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, MessageSquareText, PencilLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/ui/card";
import { TextArea, TextField } from "@/components/ui/field";
import { StepFooter, StepHeader } from "@/components/dashboard/step-frame";
import { ErrorCard, LoadingCard, UnavailableCard } from "@/components/ui/states";
import { answeredCount } from "@/lib/progress";
import { SAMPLE_EXPERIENCE } from "@/lib/samples";
import type { ExperienceAnswers, ExperienceSummary } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { EMPTY_EXPERIENCE, updateWorkspace, useWorkspace } from "@/lib/workspace";

type AnswerKey = Exclude<keyof ExperienceAnswers, "title">;

const QUESTIONS: { key: AnswerKey; q: string; hint: string }[] = [
  { key: "problem", q: "이 경험에서 해결하려던 문제는 무엇이었나요?", hint: "무엇이 불편했고, 왜 해결해야 했는지 적어 주세요." },
  { key: "role", q: "그 문제에서 직접 맡았던 역할은 무엇이었나요?", hint: "팀 전체가 아니라 내가 한 일을 적어 주세요." },
  { key: "choice", q: "어떤 선택을 했나요?", hint: "여러 방법 중 무엇을 골랐는지 적어 주세요." },
  { key: "reason", q: "왜 그렇게 판단했나요?", hint: "그 선택의 이유가 이 경험의 핵심이 됩니다." },
  { key: "result", q: "결과는 무엇이었나요?", hint: "확인한 결과만 적어 주세요. 수치가 없어도 괜찮습니다." },
];

const LABELS: Record<AnswerKey, string> = {
  problem: "해결하려던 문제",
  role: "맡은 역할",
  choice: "한 선택",
  reason: "판단한 이유",
  result: "결과",
};

export function experiencePayload(role: string, e: ExperienceAnswers) {
  return { role, title: e.title, problem: e.problem, roleText: e.role, choice: e.choice, reason: e.reason, result: e.result };
}

export function ExperienceInterview() {
  const ws = useWorkspace();
  const e = ws.experience;
  // 사용자가 직접 움직이기 전에는 저장된 답 상태를 따른다. 다 답했으면 정리 화면부터 보여준다.
  const [manual, setAt] = useState<number | "review" | null>(null);
  const ai = useAiRequest<ExperienceSummary>("/api/coach/experience");

  const setAnswer = (patch: Partial<ExperienceAnswers>) => updateWorkspace({ experience: { ...e, ...patch }, experienceSummary: undefined });
  const fillSample = () => {
    if (answeredCount(ws) > 0 && !window.confirm("지금 적은 답을 가상 예시로 바꿀까요?")) return;
    ai.reset();
    updateWorkspace({ experience: SAMPLE_EXPERIENCE, experienceSummary: undefined });
    setAt("review");
  };
  const organize = async () => {
    const result = await ai.run(experiencePayload(ws.target.role, e));
    if (result) updateWorkspace({ experienceSummary: { data: result, source: "ai" } });
  };

  const answered = answeredCount(ws);
  const at = manual ?? (answered >= QUESTIONS.length ? "review" : 0);

  return (
    <div className="space-y-6">
      <StepHeader step="experience" title="경험을 하나씩 꺼내볼게요." desc="질문 하나에 한 가지씩 답해 주세요. 짧아도 괜찮습니다." />

      {at !== "review" ? (
        <section className="rounded-card-lg border border-line bg-white p-5 shadow-soft sm:p-8" aria-labelledby="q-title">
          {at === 0 && (
            <div className="mb-6">
              <TextField
                id="exp-title"
                label="어떤 경험인가요?"
                placeholder="예: 사용자 피드백 분석 도구"
                value={e.title}
                onChange={(ev) => setAnswer({ title: ev.target.value })}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-3">
              <MessageSquareText className="h-4 w-4 text-brand" aria-hidden="true" /> 질문 {at + 1} / {QUESTIONS.length}
            </p>
            <div className="flex gap-1" aria-hidden="true">
              {QUESTIONS.map((_, i) => (
                <span key={i} className={`h-1.5 w-6 rounded-full ${i < at ? "bg-brand/40" : i === at ? "bg-brand" : "bg-line"}`} />
              ))}
            </div>
          </div>

          <h2 id="q-title" className="mt-4 text-[22px] font-bold leading-snug text-navy sm:text-[26px]">{QUESTIONS[at].q}</h2>
          <div className="mt-5">
            <TextArea
              key={QUESTIONS[at].key}
              id={`exp-${QUESTIONS[at].key}`}
              label={QUESTIONS[at].q}
              hideLabel
              hint={QUESTIONS[at].hint}
              value={e[QUESTIONS[at].key]}
              onChange={(ev) => setAnswer({ [QUESTIONS[at].key]: ev.target.value })}
              rows={5}
              maxLength={800}
              autoFocus={at > 0}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {at > 0 && (
              <Button variant="secondary" className="h-12" onClick={() => setAt(at - 1)}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 이전
              </Button>
            )}
            <Button className="h-12 flex-1 px-6 sm:flex-none" onClick={() => setAt(at + 1 < QUESTIONS.length ? at + 1 : "review")}>
              {at + 1 < QUESTIONS.length ? "다음 질문" : "정리해서 보기"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" className="h-12 sm:ml-auto" onClick={fillSample}>
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" /> 예시 답 채우기
            </Button>
          </div>
        </section>
      ) : (
        <section className="space-y-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[19px] font-bold text-navy">{e.title || "정리한 경험"}</h2>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setAt(0)}>
                <PencilLine className="h-4 w-4" aria-hidden="true" /> 답 고치기
              </Button>
              <Button variant="ghost" onClick={() => { updateWorkspace({ experience: EMPTY_EXPERIENCE, experienceSummary: undefined }); setAt(0); }}>
                새 경험
              </Button>
            </div>
          </div>

          {answered === 0 ? (
            <div className="rounded-card border border-dashed border-line-strong bg-white p-8 text-center">
              <p className="font-semibold text-ink">경험을 추가하면 직무와 연결되는 인사이트를 찾을 수 있습니다.</p>
              <Button className="mt-4" onClick={() => setAt(0)}>경험 추가</Button>
            </div>
          ) : (
            <ol className="grid gap-3 sm:grid-cols-2">
              {QUESTIONS.map(({ key }, i) => (
                <li key={key} className={`rounded-card border border-line bg-white p-5 ${key === "reason" ? "sm:col-span-2 border-brand/25 bg-soft-blue" : ""}`}>
                  <p className="text-[13px] font-semibold text-ink-3">{String(i + 1).padStart(2, "0")} {LABELS[key]}</p>
                  <p className={`mt-2 text-[15px] leading-relaxed ${e[key] ? "text-ink" : "text-ink-3"}`}>{e[key] || "아직 답하지 않았습니다."}</p>
                </li>
              ))}
            </ol>
          )}

          {answered > 0 && (
            <div className="rounded-card-lg border border-line bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-[17px] font-bold text-navy">경험 한 줄로 정리하기</h3>
                  <p className="mt-1 text-[14px] text-ink-3">답한 내용만으로 다듬습니다. 새 사실을 더하지 않습니다.</p>
                </div>
                <Button onClick={() => void organize()} disabled={ai.status === "loading"}>AI로 정리하기</Button>
              </div>
              <div className="mt-5">
                {ai.status === "loading" && <LoadingCard message="경험을 정리하고 있습니다..." />}
                {ai.status === "error" && <ErrorCard onAgain={() => void organize()} onEdit={() => setAt(0)} />}
                {ai.status === "unavailable" && <UnavailableCard onSample={fillSample} />}
                {ai.status !== "loading" && ws.experienceSummary && (
                  <div className="rounded-card bg-canvas p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[17px] font-bold leading-snug text-navy">{ws.experienceSummary.data.oneLine}</p>
                      <SourceBadge source={ws.experienceSummary.source} />
                    </div>
                    {ws.experienceSummary.data.action && <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{ws.experienceSummary.data.action}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <StepFooter step="experience" />
    </div>
  );
}
