"use client";

import { ArrowRight, CircleCheck, CircleDashed, FolderOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { StepProgress } from "@/components/dashboard/step-frame";
import { STEPS } from "@/lib/site";
import { isDone } from "@/lib/progress";
import { SAMPLE_PERSON, SAMPLE_TARGET } from "@/lib/samples";
import { startSample, updateWorkspace, useWorkspace } from "@/lib/workspace";

export function HomeView() {
  const ws = useWorkspace();
  const { target } = ws;
  const isSample = ws.mode === "sample";
  const count = ws.experiences.length;

  const setTarget = (patch: Partial<typeof target>) => updateWorkspace({ target: { ...target, ...patch } });

  return (
    <div className="space-y-6">
      <section className="rounded-card-lg border border-line bg-white p-6 sm:p-9">
        <h1 className="text-[28px] font-bold leading-snug tracking-tight text-navy sm:text-[36px]">
          자소서보다 먼저,
          <br />
          쓸 수 있는 경험부터 찾아보세요.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-3 sm:text-[16px]">
          잘 정리하지 않아도 괜찮습니다. 기억나는 일을 말하면, 직접 판단하고 행동한 부분을 함께 찾아봅니다.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ButtonLink href="/coach/experience" className="h-12 px-6 text-[16px]">
            {count > 0 ? `이어서 이야기하기 (경험 ${count}개)` : "경험 하나 이야기하기"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/coach/settings" variant="secondary" className="h-12">
            <FolderOpen className="h-4 w-4" aria-hidden="true" /> 기존 경험 불러오기
          </ButtonLink>
          {!isSample && (
            <Button variant="ghost" className="h-12" onClick={startSample}>
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" /> 예시로 둘러보기
            </Button>
          )}
        </div>

        {isSample && (
          <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-[12px] bg-soft-orange px-3 py-2 text-[13px] text-ink-2">
            <span className="font-semibold text-amber">예시 데이터</span>
            {SAMPLE_PERSON} · {SAMPLE_TARGET.role} · {SAMPLE_TARGET.industry} · {SAMPLE_TARGET.company}
          </p>
        )}
      </section>

      <details className="group rounded-card-lg border border-line bg-white p-6 sm:p-9" open={Boolean(target.role || target.company)}>
        <summary className="cursor-pointer list-none text-[17px] font-bold text-navy marker:content-none">
          관심 직무나 기업이 있다면 적어 두세요 <span className="text-[13px] font-normal text-ink-3">(선택)</span>
        </summary>
        <p className="mt-2 text-[14px] text-ink-3">직무가 없어도 시작할 수 있습니다. 나중에 바꿔도 경험 원본은 그대로 남고, 직무별 연결만 새로 만듭니다.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField id="role" label="관심 직무" value={target.role} onChange={(e) => setTarget({ role: e.target.value })} placeholder="예: AI Product Manager" autoComplete="off" />
          <TextField id="company" label="관심 기업" value={target.company} onChange={(e) => setTarget({ company: e.target.value })} placeholder="기업명 입력" autoComplete="off" />
        </div>
      </details>

      <section className="rounded-card-lg border border-line bg-white p-6 sm:p-9" aria-labelledby="progress-title">
        <h2 id="progress-title" className="text-[19px] font-bold text-navy">진행 단계</h2>
        <div className="mt-5">
          <StepProgress />
        </div>
        <ol className="mt-6 divide-y divide-line">
          {STEPS.map((s) => {
            const done = isDone(ws, s.key);
            return (
              <li key={s.key}>
                <Link href={s.href} className="flex min-h-14 items-center gap-3 rounded-btn px-1 py-3 hover:bg-canvas">
                  {done ? (
                    <CircleCheck className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                  ) : (
                    <CircleDashed className="h-5 w-5 shrink-0 text-line-strong" aria-hidden="true" />
                  )}
                  <span className="w-7 text-[13px] font-bold tabular-nums text-ink-3">{s.no}</span>
                  <span className="flex-1">
                    <span className="block text-[16px] font-semibold text-ink">{s.title}</span>
                    <span className="block text-[13px] text-ink-3">{s.desc}</span>
                  </span>
                  <span className={`text-[13px] font-semibold ${done ? "text-brand" : "text-ink-3"}`}>{done ? "완료" : "시작 전"}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
