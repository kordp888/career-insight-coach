"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/ui/card";
import { ErrorCard, LoadingCard, UnavailableCard } from "@/components/ui/states";
import { experiencePayload } from "@/components/experience/experience-interview";
import { SAMPLE_PORTFOLIO } from "@/lib/samples";
import type { DocKind, PortfolioBlocks } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

type DocResult = { kind: DocKind; blocks?: PortfolioBlocks };

const BLOCKS: { key: Exclude<keyof PortfolioBlocks, "intro">; label: string; tone: string }[] = [
  { key: "problem", label: "문제", tone: "bg-soft-danger" },
  { key: "insight", label: "인사이트", tone: "bg-soft-blue" },
  { key: "decision", label: "나의 판단", tone: "bg-soft-purple" },
  { key: "execution", label: "실행", tone: "bg-canvas" },
  { key: "result", label: "결과", tone: "bg-soft-mint" },
  { key: "learning", label: "배운 점", tone: "bg-soft-orange" },
];

export function PortfolioView() {
  const ws = useWorkspace();
  const ai = useAiRequest<DocResult>("/api/generate/document");
  const e = ws.experience;

  const fromExperience: PortfolioBlocks = {
    intro: e.title,
    problem: e.problem,
    insight: ws.insight?.data.strength ?? "",
    decision: e.reason || e.choice,
    execution: e.role,
    result: e.result,
    learning: "",
  };
  const blocks = ws.portfolio?.data ?? fromExperience;

  const fill = async () => {
    const result = await ai.run({ kind: "portfolio", ...experiencePayload(ws.target.role, e), strength: ws.insight?.data.strength ?? "" });
    if (result?.blocks) updateWorkspace({ portfolio: { data: result.blocks, source: "ai" } });
  };
  const sample = () => updateWorkspace({ portfolio: { data: SAMPLE_PORTFOLIO, source: "sample" } });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/demo/output" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] font-semibold text-ink-3 hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 문서화
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-navy sm:text-[32px]">포트폴리오</h1>
            <p className="mt-1.5 text-[15px] text-ink-3">한 편의 프로젝트를 문제에서 배운 점까지 보여줍니다.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => void fill()} disabled={ai.status === "loading" || !(e.problem || e.choice || e.result)}>
              <Sparkles className="h-4 w-4" aria-hidden="true" /> AI로 채우기
            </Button>
            <Button variant="ghost" onClick={sample}>가상 예시</Button>
          </div>
        </div>
      </div>

      {ai.status === "loading" && <LoadingCard message="프로젝트 이야기를 정리하고 있습니다..." lines={4} />}
      {ai.status === "error" && <ErrorCard onAgain={() => void fill()} />}
      {ai.status === "unavailable" && !ws.portfolio && <UnavailableCard onSample={sample} />}

      {ai.status !== "loading" && (
        <article className="overflow-hidden rounded-card-lg border border-line bg-white shadow-soft">
          <header className="bg-navy px-6 py-9 text-white sm:px-10 sm:py-12">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-semibold text-white/70">{ws.target.role || "프로젝트"}</p>
              {ws.portfolio && <SourceBadge source={ws.portfolio.source} />}
            </div>
            <h2 className="mt-3 text-[26px] font-bold leading-snug tracking-tight sm:text-[34px]">
              {blocks.intro || "한 문장 소개가 여기에 들어갑니다."}
            </h2>
          </header>
          <div className="grid gap-px bg-line sm:grid-cols-2">
            {BLOCKS.map((b, i) => (
              <section key={b.key} className={`bg-white p-6 sm:p-8 ${i === 2 ? "sm:col-span-2" : ""}`}>
                <p className={`inline-flex rounded-full px-3 py-1 text-[13px] font-bold text-navy ${b.tone}`}>{b.label}</p>
                <p className={`mt-4 text-[17px] leading-relaxed sm:text-[18px] ${blocks[b.key] ? "font-semibold text-ink" : "text-ink-3"}`}>
                  {blocks[b.key] || "경험 정리에서 채워집니다."}
                </p>
              </section>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
