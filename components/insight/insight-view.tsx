"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {TextArea} from "@/components/ui/field";
import {AiFeedback,showResult} from "@/components/ui/ai-feedback";
import {StepFooter,StepHeader} from "@/components/dashboard/step-frame";
import {analysisPayload} from "@/lib/workspace-data";
import {useWorkspace,updateWorkspace} from "@/lib/workspace";
import {useAiRequest} from "@/lib/use-ai";
import type {InsightCandidate} from "@/lib/types";
export function InsightView(){
 const ws=useWorkspace();const [editing,setEditing]=useState("");const ai=useAiRequest<{insights:Omit<InsightCandidate,"decision">[]}>("/api/generate/insight");
 const run=async()=>{const r=await ai.run(analysisPayload(ws));if(r)updateWorkspace({insights:r.insights.map(i=>({...i,decision:"pending"}))});};
 const edit=(id:string,patch:Partial<InsightCandidate>)=>updateWorkspace({insights:ws.insights.map(i=>i.id===id?{...i,...patch}:i)});
 return <div className="space-y-6"><StepHeader step="insight" title="반복되는 판단에서 강점을 찾습니다." desc="경험을 바탕으로 제안한 후보입니다. 사용할 인사이트를 직접 선택해 주세요."/>
 <div className="flex flex-wrap items-center justify-between gap-3"><Button onClick={()=>void run()} disabled={!ws.job||!ws.experiences.length||ai.status==="loading"}>인사이트 발견하기</Button><p className="text-sm text-ink-3">선택한 인사이트 {ws.insights.filter(i=>i.decision==="accepted").length}개</p></div>
 {(!ws.job||!ws.experiences.length)&&<p>JD 분석과 경험 입력을 먼저 완료해 주세요.</p>}
 <AiFeedback status={ai.status} onAgain={()=>void run()}/>
 {showResult(ai.status)&&ws.insights.map(i=><article key={i.id} className={"overflow-hidden rounded-card-lg border bg-white shadow-soft "+(i.decision==="accepted"?"border-brand":"border-line")}>
 <div className="bg-soft-blue p-6 sm:p-8"><div className="flex flex-wrap justify-between gap-2 text-sm font-semibold text-brand"><span>경험에서 발견한 강점 후보</span><span>{i.decision==="accepted"?"사용 선택됨":i.decision==="rejected"?"사용하지 않음":"확인 전"}</span></div><h2 className="mt-4 text-[26px] font-bold leading-snug text-navy sm:text-[32px]">{i.strength}</h2></div>
 <div className="space-y-5 p-6 sm:p-8">{editing===i.id?<>{(["strength","evidence","roleLink","story"] as const).map((key)=><TextArea key={key} id={i.id+"-"+key} label={{strength:"강점 후보",evidence:"경험 근거",roleLink:"직무 연결",story:"차별화 이야기"}[key]} value={i[key]} maxLength={key==="strength"?200:1200} onChange={e=>edit(i.id,{[key]:e.target.value,decision:"pending"})}/>)}</>:<><div><h3 className="text-sm font-bold text-ink-3">경험 근거</h3><p className="mt-2 text-lg leading-relaxed">{i.evidence}</p><p className="mt-2 text-sm text-brand">{i.experienceIds.map(id=>ws.experiences.find(e=>e.id===id)?.title).filter(Boolean).join(" · ")}</p></div><div className="grid gap-5 sm:grid-cols-2"><div><h3 className="font-bold">지원 직무와의 연결</h3><p className="mt-2 leading-relaxed text-ink-2">{i.roleLink}</p></div><div><h3 className="font-bold">차별화 가능한 이야기</h3><p className="mt-2 leading-relaxed text-ink-2">{i.story}</p></div></div></>}
 <div className="flex flex-wrap gap-2 border-t border-line pt-5"><Button onClick={()=>{edit(i.id,{decision:"accepted"});setEditing("");}}>이 인사이트 사용</Button><Button variant="secondary" onClick={()=>setEditing(editing===i.id?"":i.id)}>{editing===i.id?"수정 마치기":"수정"}</Button><Button variant="ghost" onClick={()=>edit(i.id,{decision:"rejected"})}>사용하지 않음</Button></div></div></article>)}
 {!ws.insights.length&&showResult(ai.status)&&<p className="rounded-card border border-dashed border-line p-8">아직 발견한 인사이트가 없습니다.</p>}
 <StepFooter step="insight" nextLabel="선택한 인사이트로 문서 만들기"/></div>;
}
