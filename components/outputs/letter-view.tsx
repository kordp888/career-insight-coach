"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/ui/card";
import { TextArea } from "@/components/ui/field";
import { ErrorCard, LoadingCard, UnavailableCard } from "@/components/ui/states";
import { CopyButton } from "./doc-tools";
import { experiencePayload } from "@/components/experience/experience-interview";
import { SAMPLE_LETTER_DRAFT, SAMPLE_LETTER_QUESTION } from "@/lib/samples";
import type { DocKind, LetterStructure } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

type DocResult = { kind: DocKind; draft?: string };

export function LetterView() {
  const ws = useWorkspace();
  const ai = useAiRequest<DocResult>("/api/generate/document");
  const e = ws.experience;
  const structure: LetterStructure = ws.letter ?? {
    question: SAMPLE_LETTER_QUESTION,
    claim: ws.insight?.data.strength ?? "",
    experience: e.title,
  };
  const setStructure = (patch: Partial<LetterStructure>) => updateWorkspace({ letter: { ...structure, ...patch } });

  const flow = [
    { label: "상황", text: e.title },
    { label: "문제", text: e.problem },
    { label: "판단", text: e.reason },
    { label: "행동", text: e.choice || e.role },
    { label: "결과", text: e.result },
    { label: "직무 연결", text: ws.insight?.data.roleLink ?? "" },
  ];

  const write = async () => {
    const result = await ai.run({
      kind: "letter",
      ...experiencePayload(ws.target.role, e),
      strength: ws.insight?.data.strength ?? "",
      question: structure.question,
      claim: structure.claim,
    });
    if (result?.draft) updateWorkspace({ letterDraft: { data: result.draft, source: "ai" } });
  };
  const sample = () => updateWorkspace({ letterDraft: { data: SAMPLE_LETTER_DRAFT, source: "sample" } });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/demo/output" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] font-semibold text-ink-3 hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 문서화
        </Link>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight text-navy sm:text-[32px]">자소서</h1>
        <p className="mt-1.5 text-[15px] text-ink-3">바로 글을 쓰지 않고, 글의 구조부터 정합니다.</p>
      </div>

      <section className="rounded-card-lg border border-line bg-white p-5 sm:p-8" aria-labelledby="structure-title">
        <h2 id="structure-title" className="text-[20px] font-bold text-navy">글의 구조</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextArea id="l-q" label="문항" value={structure.question} onChange={(ev) => setStructure({ question: ev.target.value })} rows={2} maxLength={300} />
          </div>
          <TextArea id="l-claim" label="핵심 주장" value={structure.claim} onChange={(ev) => setStructure({ claim: ev.target.value })} rows={2} placeholder="인사이트에서 찾은 강점을 한 문장으로" />
          <TextArea id="l-exp" label="선택한 경험" value={structure.experience} onChange={(ev) => setStructure({ experience: ev.target.value })} rows={2} />
        </div>

        <p className="mt-7 text-sm font-semibold text-ink">논리 흐름</p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {flow.map((f, i) => (
            <li key={f.label} className="relative rounded-card border border-line bg-canvas p-4">
              <p className="flex items-center gap-2 text-[13px] font-bold text-brand">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {f.label}
                {i < flow.length - 1 && <ArrowRight className="ml-auto h-3.5 w-3.5 text-line-strong" aria-hidden="true" />}
              </p>
              <p className={`mt-1.5 line-clamp-3 text-[14px] leading-relaxed ${f.text ? "text-ink-2" : "text-ink-3"}`}>{f.text || "경험 정리에서 채워집니다."}</p>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button className="h-12 px-6" onClick={() => void write()} disabled={ai.status === "loading" || !(e.problem || e.choice || e.result)}>
            <FilePenLine className="h-4 w-4" aria-hidden="true" /> 초안 만들기
          </Button>
          <Button variant="ghost" className="h-12" onClick={sample}>가상 예시 보기</Button>
        </div>
      </section>

      {ai.status === "loading" && <LoadingCard message="구조에 맞춰 초안을 쓰고 있습니다..." lines={5} />}
      {ai.status === "error" && <ErrorCard onAgain={() => void write()} />}
      {ai.status === "unavailable" && !ws.letterDraft && <UnavailableCard onSample={sample} />}

      {ai.status !== "loading" && ws.letterDraft && (
        <section className="rounded-card-lg border border-line bg-white p-6 shadow-soft sm:p-9" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-bold text-navy">초안</h2>
            <SourceBadge source={ws.letterDraft.source} />
          </div>
          <p className="mt-2 text-[14px] text-ink-3">{structure.question}</p>
          <p className="mt-5 whitespace-pre-line text-[16px] leading-[1.9] text-ink">{ws.letterDraft.data}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <CopyButton text={ws.letterDraft.data} label="초안 복사" />
            <p className="text-[13px] text-ink-3">{ws.letterDraft.data.length}자 · 보내기 전에 사실과 맞는지 확인하세요.</p>
          </div>
        </section>
      )}
    </div>
  );
}
