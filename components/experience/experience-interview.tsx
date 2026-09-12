"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {TextField,TextArea} from "@/components/ui/field";
import {AiFeedback,showResult} from "@/components/ui/ai-feedback";
import {StepFooter,StepHeader} from "@/components/dashboard/step-frame";
import {useWorkspace,updateWorkspace} from "@/lib/workspace";
import {analysisPayload,newExperience} from "@/lib/workspace-data";
import {useAiRequest} from "@/lib/use-ai";
import type {InventoryExperience,ExperienceQuestion} from "@/lib/types";
const FIELDS: [keyof Omit<InventoryExperience,"id"|"category">,string][]=[["title","경험 / 프로젝트 이름"],["period","기간 (선택)"],["situation","상황"],["problem","해결하려던 문제"],["role","나의 역할"],["action","직접 한 행동"],["choice","중요한 판단"],["reason","판단 이유"],["result","결과"],["learning","배운 점"],["evidence","확인 가능한 근거"],["technologies","사용 기술 (선택)"],["research","리서치 (선택)"]];
export function ExperienceInterview(){
 const ws=useWorkspace();const [active,setActive]=useState("");const [message,setMessage]=useState("");
 const current=ws.experiences.find(e=>e.id===active)??ws.experiences[0];
 const ai=useAiRequest<{questions:ExperienceQuestion[]}>("/api/coach/experience");
 const add=()=>{if(ws.experiences.length>=10)return;const e=newExperience(crypto.randomUUID());updateWorkspace({experiences:[...ws.experiences,e],selectedExperienceIds:[...ws.selectedExperienceIds,e.id]});setActive(e.id);};
 const edit=(patch:Partial<InventoryExperience>)=>{if(current)updateWorkspace({experiences:ws.experiences.map(e=>e.id===current.id?{...e,...patch}:e)});};
 const move=(delta:number)=>{if(!current)return;const at=ws.experiences.indexOf(current),next=at+delta;if(next<0||next>=ws.experiences.length)return;const list=[...ws.experiences];[list[at],list[next]]=[list[next],list[at]];updateWorkspace({experiences:list});};
 const ask=async()=>{if(ws.experiences.some(e=>!e.title.trim()||!(e.problem||e.action||e.choice||e.result).trim())){setMessage("각 경험의 이름과 문제, 행동, 판단 또는 결과를 입력해 주세요.");return;}setMessage("");const r=await ai.run({...analysisPayload(ws),mode:"questions"});if(r)updateWorkspace({questions:r.questions});};
 return <div className="space-y-6"><StepHeader step="experience" title="내 경험을 하나씩 정리합니다." desc="팀 전체의 일과 직접 한 행동을 구분해 주세요. 확인한 사실만 입력합니다."/>
 <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">내 경험 {ws.experiences.length} / 10</h2><Button onClick={add} disabled={ws.experiences.length>=10}>+ 경험 추가</Button></div>
 {ws.experiences.length===0?<p className="rounded-card border border-dashed border-line p-8">경험을 추가하면 직접 한 행동과 판단을 기록할 수 있습니다.</p>:<>
 <div className="flex flex-wrap gap-2">{ws.experiences.map((e,i)=><Button key={e.id} variant={e.id===current?.id?"primary":"secondary"} onClick={()=>setActive(e.id)}>{e.title||"경험 "+(i+1)}</Button>)}</div>
 {current&&<section className="space-y-5 rounded-card-lg border border-line bg-white p-5 sm:p-7"><div className="flex flex-wrap gap-2"><label className="mr-auto flex items-center gap-2">경험 구분<select aria-label="경험 구분" value={current.category} onChange={e=>edit({category:e.target.value as "project"|"career"})} className="min-h-11 rounded-btn border border-line px-3"><option value="project">프로젝트</option><option value="career">경력</option></select></label><Button variant="secondary" onClick={()=>move(-1)} disabled={ws.experiences.indexOf(current)===0}>위로 이동</Button><Button variant="secondary" onClick={()=>move(1)} disabled={ws.experiences.indexOf(current)===ws.experiences.length-1}>아래로 이동</Button><Button variant="ghost" onClick={()=>{if(confirm("이 경험을 삭제할까요?"))updateWorkspace({experiences:ws.experiences.filter(e=>e.id!==current.id)});}}>경험 삭제</Button></div>
 <div className="grid gap-5 sm:grid-cols-2">{FIELDS.map(([key,label])=>key==="title"||key==="period"?<TextField key={key} id={"exp-"+key} label={label} value={current[key]} onChange={e=>edit({[key]:e.target.value})} maxLength={80}/>:<TextArea key={key} id={"exp-"+key} label={label} value={current[key]} onChange={e=>edit({[key]:e.target.value})} rows={3} maxLength={2000}/>)}</div></section>}
 {message&&<p role="alert" className="text-danger">{message}</p>}
 <Button onClick={()=>void ask()} disabled={ai.status==="loading"}>경험 보완 질문 받기</Button>
 <AiFeedback status={ai.status} onAgain={()=>void ask()}/>
 {showResult(ai.status)&&ws.questions.map(q=><article key={q.experienceId} className="rounded-card bg-soft-blue p-6"><h3 className="font-bold text-navy">{ws.experiences.find(e=>e.id===q.experienceId)?.title}에서 더 꺼내볼 이야기</h3><ul className="mt-3 space-y-3">{q.questions.map((question,i)=><li key={i}>{question}</li>)}</ul><p className="mt-4 text-sm text-ink-3">위 경험 입력란에 답을 보완한 뒤 다시 분석할 수 있습니다.</p></article>)}
 </>}<StepFooter step="experience"/></div>;
}
