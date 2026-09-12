"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheck, CircleDashed, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { StepProgress } from "@/components/dashboard/step-frame";
import { STEPS } from "@/lib/site";
import { isDone } from "@/lib/progress";
import { SAMPLE_PERSON, SAMPLE_TARGET } from "@/lib/samples";
import { startSample, updateWorkspace, useWorkspace } from "@/lib/workspace";

export function HomeView() {
  const ws = useWorkspace();
  const router = useRouter();
  const { target } = ws;
  const isSample = ws.mode === "sample";

  const setTarget = (patch: Partial<typeof target>) => updateWorkspace({ target: { ...target, ...patch } });

  return (
    <div className="space-y-6">
      <section className="rounded-card-lg border border-line bg-white p-6 sm:p-9">
        <h1 className="text-[28px] font-bold leading-snug tracking-tight text-navy sm:text-[36px]">
          안녕하세요.
          <br />
          어떤 커리어를 준비하고 계신가요?
        </h1>
        <p className="mt-3 text-[15px] text-ink-3 sm:text-[16px]">먼저 지원하려는 직무와 기업부터 알려주세요.</p>

        <form
          className="mt-8 grid gap-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/coach/industry");
          }}
        >
          <TextField id="role" label="지원 직무" value={target.role} onChange={(e) => setTarget({ role: e.target.value })} placeholder="예: AI Product Manager" autoComplete="off" />
          <TextField id="company" label="지원 기업" value={target.company} onChange={(e) => setTarget({ company: e.target.value })} placeholder="기업명 입력" autoComplete="off" />
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
            <Button type="submit" className="h-12 px-6 text-[16px]" disabled={!target.role.trim()}>
              분석 시작 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              className="h-12"
              onClick={startSample}
            >
              <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" /> 예시로 둘러보기
            </Button>
          </div>
        </form>

        {isSample && (
          <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-[12px] bg-soft-orange px-3 py-2 text-[13px] text-ink-2">
            <span className="font-semibold text-amber">예시 데이터</span>
            {SAMPLE_PERSON} · {SAMPLE_TARGET.role} · {SAMPLE_TARGET.industry} · {SAMPLE_TARGET.company}
          </p>
        )}
      </section>

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
