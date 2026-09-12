"use client";
import {Button,ButtonLink} from "@/components/ui/button";
import {AiFeedback,showResult} from "@/components/ui/ai-feedback";
import {StepFooter,StepHeader} from "@/components/dashboard/step-frame";
import {analysisPayload} from "@/lib/workspace-data";
import {useWorkspace,updateWorkspace} from "@/lib/workspace";
import {useAiRequest} from "@/lib/use-ai";
import type {Connection} from "@/lib/types";
export function ConnectView(){
 const ws=useWorkspace();const ai=useAiRequest<{connections:Connection[]}>("/api/generate/insight");
 const run=async()=>{const r=await ai.run({...analysisPayload(ws),mode:"connect"});if(r)updateWorkspace({connections:r.connections});};
 const ready=Boolean(ws.job)&&ws.experiences.length>0;
 return <div className="space-y-6"><StepHeader step="connect" desc="JD의 핵심 역량마다 내 경험에서 연결할 근거와 더 확인할 질문을 찾습니다."/>
 {!ready&&<p className="rounded-card bg-white p-6">JD 분석과 경험 입력을 먼저 완료해 주세요. <ButtonLink href="/coach/job" variant="secondary">JD 분석으로</ButtonLink></p>}
 <Button onClick={()=>void run()} disabled={!ready||ai.status==="loading"}>경험과 직무 연결하기</Button><AiFeedback status={ai.status} onAgain={()=>void run()}/>
 {showResult(ai.status)&&ws.connections.map((c,i)=><article key={i} className="rounded-card-lg border border-line bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold text-navy">{c.competency}</h2><span className="rounded-full bg-soft-mint px-3 py-1 text-sm">{c.label}</span></div><p className="mt-3 font-semibold text-brand">{c.experienceIds.map(id=>ws.experiences.find(e=>e.id===id)?.title).filter(Boolean).join(" · ")||"추가 경험 정보가 필요합니다."}</p><p className="mt-4 leading-relaxed">{c.reason}</p><ul className="mt-4 space-y-2 border-t border-line pt-4 text-ink-3">{c.questions.map((q,j)=><li key={j}>{q}</li>)}</ul></article>)}
 <StepFooter step="connect"/></div>;
}
