"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { STEPS, stepIndex, type StepKey } from "@/lib/site";
import { isDone } from "@/lib/progress";
import { useWorkspace } from "@/lib/workspace";
import { buttonClass } from "@/components/ui/button";

export function StepProgress({ current }: { current?: StepKey }) {
  const ws = useWorkspace();
  const at = current ? stepIndex(current) : -1;
  return (
    <ol className="grid grid-cols-7 gap-1.5" aria-label="진행 단계">
      {STEPS.map((s, i) => {
        const done = isDone(ws, s.key);
        const now = i === at;
        return (
          <li key={s.key} className="min-w-0">
            <Link href={s.href} className="group flex min-h-11 flex-col justify-center gap-2 rounded-md py-1" aria-current={now ? "step" : undefined}>
              <span className={`h-1.5 rounded-full transition-colors duration-200 ${now ? "bg-brand" : done ? "bg-brand/40" : "bg-line"}`} />
              <span className={`truncate text-center text-[11px] sm:text-[12px] ${now ? "font-bold text-brand" : done ? "font-medium text-ink-2" : "text-ink-3"}`}>
                {s.short}
                <span className="sr-only">{done ? " 완료" : " 미완료"}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function StepHeader({ step, title, desc }: { step: StepKey; title?: string; desc?: string }) {
  const i = stepIndex(step);
  const s = STEPS[i];
  return (
    <div className="space-y-6">
      <StepProgress current={step} />
      <div>
        <p className="text-[13px] font-semibold text-brand">
          {s.title} · {i + 1} / {STEPS.length} 단계
        </p>
        <h1 className="mt-1.5 text-[26px] font-bold leading-tight tracking-tight text-navy sm:text-[32px]">{title ?? s.title}</h1>
        {desc && <p className="mt-2 text-[15px] leading-relaxed text-ink-3 sm:text-[16px]">{desc}</p>}
      </div>
    </div>
  );
}

/** 받침 없는 글자와 ㄹ 받침 뒤에는 "로", 그 밖에는 "으로". */
function toward(word: string): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return `${word}로`;
  const jong = code % 28;
  return `${word}${jong === 0 || jong === 8 ? "로" : "으로"}`;
}

/** 다음 단계 버튼. 모바일에서는 엄지가 닿는 화면 아래에 붙는다. */
export function StepFooter({ step, nextLabel, nextHref }: { step: StepKey; nextLabel?: string; nextHref?: string }) {
  const i = stepIndex(step);
  const prev = STEPS[i - 1];
  const next = STEPS[i + 1];
  const href = nextHref ?? next?.href;
  const label = nextLabel ?? (next ? toward(next.title) : "처음으로");
  return (
    <>
    {/* 화면 아래에 붙은 버튼이 마지막 내용과 바닥글을 가리지 않게 자리를 비워 둔다 */}
    <div aria-hidden="true" className="h-16 lg:hidden" />
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur lg:static lg:mt-10 lg:border-0 lg:bg-transparent lg:p-0">
      <div className="mx-auto flex max-w-[960px] gap-2">
        {prev && (
          <Link href={prev.href} className={buttonClass("secondary", "h-12 shrink-0 px-4")} aria-label={`이전 단계: ${prev.title}`}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="max-sm:sr-only">{prev.title}</span>
          </Link>
        )}
        {href && (
          <Link href={href} className={buttonClass("primary", "h-12 flex-1 text-[16px] lg:ml-auto lg:flex-none lg:px-6")}>
            {label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
    </>
  );
}
