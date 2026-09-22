"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {TextField,TextArea} from "@/components/ui/field";
import {AiFeedback,showResult} from "@/components/ui/ai-feedback";
import {StepFooter,StepHeader} from "@/components/dashboard/step-frame";
import {ExperienceDialogue} from "./experience-dialogue";
import {useWorkspace,updateWorkspace,patchExperience} from "@/lib/workspace";
import {analysisPayload,newExperience} from "@/lib/workspace-data";
import {useAiRequest} from "@/lib/use-ai";
import type {InventoryExperience,ExperienceQuestion} from "@/lib/types";
type Field=keyof Omit<InventoryExperience,"id"|"category"|"dialogue"|"aiNotes">;
/** 사용자 진술 칸. 첨부 근거(evidence)는 따로 보여 준다. */
const STATEMENT_FIELDS: [Field,string][]=[["title","경험 / 프로젝트 이름"],["period","기간 (선택)"],["situation","상황"],["problem","해결하려던 문제"],["role","나의 역할"],["action","직접 한 행동"],["choice","중요한 판단"],["reason","판단 이유"],["result","결과"],["learning","배운 점"],["technologies","사용 기술 (선택)"],["research","리서치 (선택)"]];
export function ExperienceInterview(){
 const ws=useWorkspace();const [active,setActive]=useState("");const [message,setMessage]=useState("");const [showCard,setShowCard]=useState(true);
 const current=ws.experiences.find(e=>e.id===active)??ws.experiences[0];
 const ai=useAiRequest<{questions:ExperienceQuestion[]}>("/api/coach/experience");
 const add=()=>{if(ws.experiences.length>=10)return;const e=newExperience(crypto.randomUUID());updateWorkspace({experiences:[...ws.experiences,e],selectedExperienceIds:[...ws.selectedExperienceIds,e.id]});setActive(e.id);};
 const edit=(patch:Partial<InventoryExperience>)=>{if(current)patchExperience(current.id,e=>({...e,...patch}));};
 const move=(delta:number)=>{if(!current)return;const at=ws.experiences.indexOf(current),next=at+delta;if(next<0||next>=ws.experiences.length)return;const list=[...ws.experiences];[list[at],list[next]]=[list[next],list[at]];updateWorkspace({experiences:list});};
 const ask=async()=>{if(ws.experiences.some(e=>!e.title.trim()||(!(e.problem||e.action||e.choice||e.result).trim()&&!e.dialogue.some(t=>t.a)))){setMessage("각 경험의 이름과 함께 대화 답변이나 문제, 행동, 판단, 결과 중 하나를 채워 주세요.");return;}setMessage("");const r=await ai.run({...analysisPayload(ws),mode:"questions"});if(r)updateWorkspace({questions:r.questions});};
 return <div className="space-y-6"><StepHeader step="experience" title="자소서보다 먼저, 쓸 수 있는 경험부터 찾아보세요." desc="잘 정리하지 않아도 괜찮습니다. 기억나는 일을 말하면, 직접 판단하고 행동한 부분을 함께 찾아봅니다. 지원 직무는 아직 없어도 됩니다."/>
 <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">내 경험 {ws.experiences.length} / 10</h2><Button onClick={add} disabled={ws.experiences.length>=10}>+ 경험 하나 이야기하기</Button></div>
 {ws.experiences.length===0?<div className="rounded-card border border-dashed border-line-strong bg-canvas p-8 text-center"><p className="text-[17px] font-semibold text-ink">아직 꺼낸 경험이 없습니다.</p><p className="mt-2 text-[15px] text-ink-3">인턴, 팀 프로젝트, 동아리, 아르바이트, 개인 프로젝트 무엇이든 괜찮습니다.</p><Button className="mt-5" onClick={add}>경험 하나 이야기하기</Button></div>:<>
 <div className="flex flex-wrap gap-2">{ws.experiences.map((e,i)=><Button key={e.id} variant={e.id===current?.id?"primary":"secondary"} onClick={()=>setActive(e.id)}>{e.title||"경험 "+(i+1)}</Button>)}</div>
 {current&&<>
 <ExperienceDialogue key={current.id} experience={current}/>
 <section className="space-y-5 rounded-card-lg border border-line bg-white p-5 sm:p-7">
  <div className="flex flex-wrap items-center gap-2"><h2 className="mr-auto text-lg font-bold text-navy">경험 카드</h2><Button variant="ghost" onClick={()=>setShowCard(!showCard)} aria-expanded={showCard}>{showCard?"카드 접기":"카드 펼치기"}</Button></div>
  <p className="text-[13px] text-ink-3">비어 있는 칸은 그대로 두어도 됩니다. 수치가 없어도 저장되고, 확인되지 않은 숫자는 넣지 않습니다.</p>
  {showCard&&<>
  <div className="flex flex-wrap gap-2"><label className="mr-auto flex items-center gap-2">경험 구분<select aria-label="경험 구분" value={current.category} onChange={e=>edit({category:e.target.value as "project"|"career"})} className="min-h-11 rounded-btn border border-line px-3"><option value="project">프로젝트</option><option value="career">경력</option></select></label><Button variant="secondary" onClick={()=>move(-1)} disabled={ws.experiences.indexOf(current)===0}>위로 이동</Button><Button variant="secondary" onClick={()=>move(1)} disabled={ws.experiences.indexOf(current)===ws.experiences.length-1}>아래로 이동</Button><Button variant="ghost" onClick={()=>{if(confirm("이 경험을 삭제할까요?"))updateWorkspace({experiences:ws.experiences.filter(e=>e.id!==current.id)});}}>경험 삭제</Button></div>
  <h3 className="border-b border-line pb-2 text-sm font-bold text-ink-3">사용자 진술 <span className="font-normal">· 직접 말하고 확인한 내용</span></h3>
  <div className="grid gap-5 sm:grid-cols-2">{STATEMENT_FIELDS.map(([key,label])=>key==="title"||key==="period"?<TextField key={key} id={"exp-"+key} label={label} value={current[key]} onChange={e=>edit({[key]:e.target.value})} maxLength={80}/>:<TextArea key={key} id={"exp-"+key} label={label} value={current[key]} onChange={e=>edit({[key]:e.target.value})} rows={3} maxLength={2000}/>)}</div>
  <h3 className="border-b border-line pb-2 text-sm font-bold text-ink-3">첨부 근거 <span className="font-normal">· 자료와 산출물. 주장과의 연결은 따로 확인합니다</span></h3>
  <TextArea id="exp-evidence" label="확인 가능한 근거 (링크, 문서 이름, 산출물 설명)" value={current.evidence} onChange={e=>edit({evidence:e.target.value})} rows={3} maxLength={2000} hint="근거가 없다고 해서 진술이 거짓이 되는 것은 아닙니다. 없으면 비워 두세요."/>
  <h3 className="border-b border-line pb-2 text-sm font-bold text-ink-3">AI 해석 <span className="font-normal">· 제안일 뿐, 확정된 이력이 아닙니다. 분석 입력에도 넣지 않습니다</span></h3>
  {current.aiNotes.length===0?<p className="text-[14px] text-ink-3">대화를 하면 코치가 답변에서 읽어 낸 내용을 여기에 적습니다.</p>:<ul className="space-y-2">{current.aiNotes.map((n,i)=><li key={i} className="flex items-start justify-between gap-3 rounded-card bg-soft-purple px-4 py-3 text-[14px]"><span><span className="mr-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-violet">AI 해석</span>{n}</span><Button variant="ghost" className="min-h-8 px-2 text-[12px]" onClick={()=>edit({aiNotes:current.aiNotes.filter((_,j)=>j!==i)})}>지우기</Button></li>)}</ul>}
  </>}
 </section></>}
 {message&&<p role="alert" className="text-danger">{message}</p>}
 <div className="flex flex-wrap items-center gap-3"><Button variant="secondary" onClick={()=>void ask()} disabled={ai.status==="loading"}>경험 전체 보완 질문 받기</Button><span className="text-[13px] text-ink-3">모든 경험을 한 번에 훑어 빈 곳을 묻습니다. 카드를 고쳐도 질문은 남습니다.</span></div>
 <AiFeedback status={ai.status} onAgain={()=>void ask()}/>
 {showResult(ai.status)&&ws.questions.map(q=><article key={q.experienceId} className="rounded-card bg-soft-blue p-6"><h3 className="font-bold text-navy">{ws.experiences.find(e=>e.id===q.experienceId)?.title}에서 더 꺼내볼 이야기</h3><ul className="mt-3 space-y-3">{q.questions.map((question,i)=><li key={i}>{question}</li>)}</ul><p className="mt-4 text-sm text-ink-3">위 경험 카드에 답을 보완한 뒤 다시 분석할 수 있습니다.</p></article>)}
 </>}<StepFooter step="experience" nextLabel="산업 이해로"/></div>;
}
