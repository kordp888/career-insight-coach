"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/ui/card";
import { TextArea, TextField } from "@/components/ui/field";
import { ErrorCard, LoadingCard, UnavailableCard } from "@/components/ui/states";
import { CopyButton } from "./doc-tools";
import { experiencePayload } from "@/components/experience/experience-interview";
import { SAMPLE_PERSON, SAMPLE_RESUME_BULLETS } from "@/lib/samples";
import type { ResumeFields } from "@/lib/types";
import type { DocKind } from "@/lib/types";
import { useAiRequest } from "@/lib/use-ai";
import { updateWorkspace, useWorkspace } from "@/lib/workspace";

type DocResult = { kind: DocKind; bullets?: string[] };

function draftBullet(f: ResumeFields): string {
  const parts = [f.action, f.result].map((s) => s.trim().replace(/[.。]$/, "")).filter(Boolean);
  return parts.length ? `${parts.join(", ")}.` : "";
}

export function ResumeView() {
  const ws = useWorkspace();
  const ai = useAiRequest<DocResult>("/api/generate/document");
  const fields: ResumeFields = ws.resume ?? {
    experience: ws.experience.title,
    role: ws.experience.role,
    action: ws.experience.choice,
    result: ws.experience.result,
    relevance: ws.insight?.data.roleLink ?? "",
  };
  const setField = (patch: Partial<ResumeFields>) => updateWorkspace({ resume: { ...fields, ...patch } });

  const bullets = ws.resumeBullets?.data ?? [draftBullet(fields)].filter(Boolean);
  const source = ws.resumeBullets?.source;

  const polish = async () => {
    const payload = {
      kind: "resume",
      ...experiencePayload(ws.target.role, { ...ws.experience, title: fields.experience, role: fields.role, choice: fields.action, result: fields.result }),
      strength: ws.insight?.data.strength ?? "",
    };
    const result = await ai.run(payload);
    if (result?.bullets) updateWorkspace({ resumeBullets: { data: result.bullets, source: "ai" } });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/demo/output" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] font-semibold text-ink-3 hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 문서화
        </Link>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight text-navy sm:text-[32px]">이력서</h1>
        <p className="mt-1.5 text-[15px] text-ink-3">직무와 연결되는 핵심 경험을 한 문장으로 정리합니다.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
        <section aria-label="미리보기" className="order-2 lg:order-1">
          <div className="rounded-card-lg border border-line bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="text-[20px] font-bold text-navy">{ws.target.company === "Sample Labs" ? SAMPLE_PERSON : "이름"}</p>
                <p className="mt-0.5 text-[14px] text-ink-3">{ws.target.role || "지원 직무"}</p>
              </div>
              {source && <SourceBadge source={source} />}
            </div>
            <p className="mt-5 text-[12px] font-bold tracking-wide text-brand">경력 및 프로젝트</p>
            <p className="mt-2 text-[16px] font-bold text-ink">{fields.experience || "경험 이름"}</p>
            {fields.role && <p className="text-[14px] text-ink-3">{fields.role}</p>}
            {ai.status === "loading" ? (
              <LoadingCard message="문장을 다듬고 있습니다..." lines={2} />
            ) : (
              <ul className="mt-3 space-y-2.5">
                {bullets.length ? (
                  bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-2">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {b}
                    </li>
                  ))
                ) : (
                  <li className="text-[15px] text-ink-3">오른쪽에 행동과 결과를 적으면 여기에 문장이 만들어집니다.</li>
                )}
              </ul>
            )}
            {fields.relevance && (
              <p className="mt-5 rounded-[12px] bg-soft-blue px-4 py-3 text-[14px] leading-relaxed text-ink-2">
                <span className="font-semibold text-brand">직무 연결 </span>
                {fields.relevance}
              </p>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={bullets.join("\n")} label="문장 복사" />
            <Button variant="ghost" onClick={() => updateWorkspace({ resumeBullets: { data: SAMPLE_RESUME_BULLETS, source: "sample" } })}>가상 예시 보기</Button>
          </div>
        </section>

        <section aria-label="내용 편집" className="order-1 space-y-4 rounded-card-lg border border-line bg-white p-5 sm:p-7 lg:order-2">
          <TextField id="r-exp" label="핵심 경험" value={fields.experience} onChange={(e) => setField({ experience: e.target.value })} placeholder="예: 사용자 피드백 분석 도구" />
          <TextField id="r-role" label="역할" value={fields.role} onChange={(e) => setField({ role: e.target.value })} placeholder="예: 서비스 기획" />
          <TextArea id="r-action" label="행동" value={fields.action} onChange={(e) => setField({ action: e.target.value })} rows={3} />
          <TextArea id="r-result" label="결과" value={fields.result} onChange={(e) => setField({ result: e.target.value })} rows={3} hint="확인한 결과만 적어 주세요." />
          <TextArea id="r-rel" label="직무 연결" value={fields.relevance} onChange={(e) => setField({ relevance: e.target.value })} rows={2} />
          <Button className="h-12 w-full" onClick={() => void polish()} disabled={ai.status === "loading" || !(fields.action || fields.result)}>
            <Sparkles className="h-4 w-4" aria-hidden="true" /> AI로 문장 다듬기
          </Button>
          {ai.status === "error" && <ErrorCard onAgain={() => void polish()} />}
          {ai.status === "unavailable" && <UnavailableCard onSample={() => updateWorkspace({ resumeBullets: { data: SAMPLE_RESUME_BULLETS, source: "sample" } })} />}
        </section>
      </div>
    </div>
  );
}
