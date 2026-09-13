"use client";
import {useState} from "react";
import Link from "next/link";
import {CheckCircle2,CircleDashed} from "lucide-react";
import {Button} from "@/components/ui/button";
import {TextArea,TextField} from "@/components/ui/field";
import {AiFeedback,showResult} from "@/components/ui/ai-feedback";
import {CopyButton} from "./doc-tools";
import {useWorkspace,updateWorkspace} from "@/lib/workspace";
import {analysisPayload,approvedInsights,documentRequirements} from "@/lib/workspace-data";
import {useAiRequest} from "@/lib/use-ai";
import type {Blueprint,CaseStudy,DocKind,ResumeSections} from "@/lib/types";
type DocumentResult={kind:DocKind;stage?:string;sections?:ResumeSections;blueprint?:Blueprint;draft?:string;blocks?:CaseStudy};
const titles={resume:"이력서",letter:"자기소개서",portfolio:"포트폴리오"};
const sectionLabels:Record<keyof ResumeSections,string>={skills:"핵심 역량",career:"경력",projects:"프로젝트",education:"교육",technologies:"기술"};
const blockLabels:Record<keyof CaseStudy,string>={intro:"한 문장 소개",problem:"문제",research:"리서치",insight:"인사이트",decision:"나의 판단",execution:"실행",result:"결과",learning:"배운 점",roleLink:"직무 연결"};
export function WorkspaceOutput({kind}:{kind:DocKind}){
 const ws=useWorkspace();const ai=useAiRequest<DocumentResult>("/api/generate/document");
 const [lastStage,setLastStage]=useState<"blueprint"|"draft">("blueprint");const [project,setProject]=useState("");
 const selected=ws.experiences.filter(e=>ws.selectedExperienceIds.includes(e.id));const chosen=selected.find(e=>e.id===project)??selected[0];
 const accepted=approvedInsights(ws,true);const requirements=documentRequirements(ws,kind);const ready=requirements.every(item=>item.done);
 const output=ws.outputs;
 const run=async(stage:"blueprint"|"draft"="draft")=>{
  setLastStage(stage);const base=analysisPayload(ws,true);
  const data=await ai.run({...base,kind,stage,question:ws.question,maxLength:ws.maxLength,blueprint:output.blueprint,experiences:kind==="portfolio"?base.experiences.filter(e=>e.id===chosen?.id):base.experiences});
  if(!data)return;
  if(data.sections)updateWorkspace({outputs:{...ws.outputs,resume:data.sections}});
  if(data.blueprint)updateWorkspace({outputs:{...ws.outputs,blueprint:data.blueprint,letter:undefined}});
  if(data.draft)updateWorkspace({outputs:{...ws.outputs,letter:data.draft}});
  if(data.blocks)updateWorkspace({outputs:{...ws.outputs,portfolio:data.blocks}});
 };
 const toggle=(id:string)=>updateWorkspace({selectedExperienceIds:ws.selectedExperienceIds.includes(id)?ws.selectedExperienceIds.filter(v=>v!==id):[...ws.selectedExperienceIds,id]});
 const editBlueprint=(patch:Partial<Blueprint>)=>{if(output.blueprint)updateWorkspace({outputs:{...output,blueprint:{...output.blueprint,...patch},letter:undefined}});};
 return <div className="space-y-6"><div><Link className="text-sm font-semibold text-brand" href="/coach/output">문서화로 돌아가기</Link><h1 className="mt-3 text-3xl font-bold text-navy">{titles[kind]}</h1><p className="mt-2 text-ink-3">지원 전에 사실과 수치를 직접 확인하세요. 모든 초안은 직접 수정할 수 있습니다.</p></div>
 <section className="space-y-4 rounded-card-lg border border-line bg-white p-5 sm:p-7"><h2 className="text-lg font-bold">문서에 사용할 경험</h2><div className="flex flex-wrap gap-3">{ws.experiences.map(e=><label key={e.id} className="flex min-h-11 items-center gap-2 rounded-btn bg-canvas px-3"><input type="checkbox" checked={ws.selectedExperienceIds.includes(e.id)} onChange={()=>toggle(e.id)}/>{e.title||"이름 없는 경험"}</label>)}</div>
 <p className="text-sm text-ink-3">사용 선택한 인사이트: {accepted.map(i=>i.strength).join(" · ")||"없음"}</p>
 {ws.company&&!ws.companyReviewed&&<label className="flex gap-2"><input type="checkbox" onChange={e=>updateWorkspace({companyReviewed:e.target.checked})}/>기업 분석 결과를 확인했으며 문서 작성에 사용하는 데 동의합니다.</label>}
 <section className="rounded-card border border-line bg-canvas p-4" aria-labelledby={`document-requirements-${kind}`}>
 <h3 id={`document-requirements-${kind}`} className="text-sm font-bold text-navy">생성 전 확인</h3>
 <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{requirements.map(item=><li key={item.id} className={`flex items-center gap-2 ${item.done?"text-mint":"text-ink-3"}`}>{item.done?<CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true"/>:<CircleDashed className="h-4 w-4 shrink-0" aria-hidden="true"/>}{item.done||!item.href?<span>{item.label}</span>:<Link className="font-semibold underline underline-offset-4" href={item.href}>{item.label}</Link>}</li>)}</ul>
 {!ready&&<p role="status" className="mt-3 text-sm text-ink-2">완료되지 않은 항목을 확인하면 생성 버튼이 활성화됩니다.</p>}
 </section>
 {kind==="resume"&&<div className="grid gap-4 sm:grid-cols-2"><TextArea id="profile-education" label="교육 (선택, 직접 입력)" value={ws.profile.education} maxLength={3000} onChange={e=>updateWorkspace({profile:{...ws.profile,education:e.target.value}})}/><TextArea id="profile-technologies" label="기술 (선택, 직접 입력)" value={ws.profile.technologies} maxLength={3000} onChange={e=>updateWorkspace({profile:{...ws.profile,technologies:e.target.value}})}/></div>}
 {kind==="portfolio"&&<label className="block space-y-2"><span className="font-semibold">Case Study 프로젝트</span><select aria-label="Case Study 프로젝트" className="min-h-12 w-full rounded-input border border-line p-3" value={chosen?.id??""} onChange={e=>{setProject(e.target.value);updateWorkspace({outputs:{...output,portfolio:undefined}});}}>{selected.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}</select></label>}
 {kind!=="letter"&&<Button disabled={!ready||ai.status==="loading"} onClick={()=>void run()}>{titles[kind]} 생성하기</Button>}
 {kind==="letter"&&<><TextArea id="letter-question" label="기업 자소서 질문" value={ws.question} maxLength={2000} rows={3} onChange={e=>updateWorkspace({question:e.target.value})}/><TextField id="letter-limit" label="최대 글자 수 (공백 포함)" type="number" min={100} max={3000} value={ws.maxLength} onChange={e=>{const n=Number(e.target.value);if(Number.isInteger(n)&&n>=100&&n<=3000)updateWorkspace({maxLength:n});}}/><Button disabled={!ready||!ws.question.trim()||ai.status==="loading"} onClick={()=>void run("blueprint")}>Writing Blueprint 만들기</Button></>}
 </section>
 <AiFeedback status={ai.status} onAgain={()=>void run(lastStage)}/>
 {showResult(ai.status)&&kind==="letter"&&output.blueprint&&<section className="space-y-5 rounded-card-lg border border-brand/20 bg-soft-blue p-5 sm:p-7"><h2 className="text-xl font-bold text-navy">Writing Blueprint</h2><div className="grid gap-4 sm:grid-cols-2"><TextArea id="blueprint-intent" label="질문 의도" value={output.blueprint.intent} maxLength={1000} onChange={e=>editBlueprint({intent:e.target.value})}/><TextArea id="blueprint-claim" label="핵심 주장" value={output.blueprint.claim} maxLength={1000} onChange={e=>editBlueprint({claim:e.target.value})}/><TextArea id="blueprint-evidence" label="경험 근거" value={output.blueprint.evidence} maxLength={2000} onChange={e=>editBlueprint({evidence:e.target.value})}/><TextArea id="blueprint-structure" label="전개 구조 (한 줄에 하나)" value={output.blueprint.structure.join("\n")} onChange={e=>editBlueprint({structure:e.target.value.split("\n")})}/></div><p>사용할 경험: {output.blueprint.experienceIds.map(id=>ws.experiences.find(e=>e.id===id)?.title).filter(Boolean).join(" · ")}</p><Button disabled={!ready} onClick={()=>void run("draft")}>초안 작성</Button></section>}
 {showResult(ai.status)&&kind==="letter"&&output.letter!==undefined&&<section className="space-y-4 rounded-card-lg border border-line bg-white p-6 sm:p-8"><h2 className="text-xl font-bold">자기소개서 초안</h2><TextArea id="letter-draft" label="초안 직접 수정" rows={12} maxLength={3000} value={output.letter} onChange={e=>updateWorkspace({outputs:{...output,letter:e.target.value}})}/><div className="flex flex-wrap items-center gap-3"><CopyButton text={output.letter}/><Button variant="secondary" onClick={()=>void run("draft")}>다시 작성</Button><span className={output.letter.length>ws.maxLength?"text-danger":"text-ink-3"}>{output.letter.length} / {ws.maxLength}자</span></div></section>}
 {showResult(ai.status)&&kind==="resume"&&output.resume&&<section className="space-y-6 rounded-card-lg border border-line bg-white p-6 sm:p-8"><div className="border-b border-line pb-5"><h2 className="text-2xl font-bold text-navy">{ws.target.role}</h2><p className="mt-2 text-ink-3">확인한 경험을 바탕으로 정리한 이력서</p></div>{(Object.keys(sectionLabels) as (keyof ResumeSections)[]).map(key=><section key={key} className="space-y-3"><h3 className="text-lg font-bold text-brand">{sectionLabels[key]}</h3>{output.resume![key].length?output.resume![key].map((bullet,i)=><TextArea key={i} id={"resume-"+key+"-"+i} label={sectionLabels[key]+" 문장 "+(i+1)} value={bullet} rows={2} onChange={e=>updateWorkspace({outputs:{...output,resume:{...output.resume!,[key]:output.resume![key].map((v,j)=>j===i?e.target.value:v)}}})}/>):<p className="text-sm text-ink-3">입력한 정보가 없어 비워 두었습니다.</p>}</section>)}<CopyButton text={Object.entries(output.resume).map(([key,lines])=>sectionLabels[key as keyof ResumeSections]+"\n"+lines.join("\n")).join("\n\n")}/></section>}
 {showResult(ai.status)&&kind==="portfolio"&&output.portfolio&&<article className="overflow-hidden rounded-card-lg border border-line bg-white shadow-soft"><header className="bg-navy p-6 text-white sm:p-10"><p className="text-sm text-white/70">{chosen?.title} · {ws.target.role}</p><h2 className="mt-4 text-3xl font-bold leading-snug">{output.portfolio.intro}</h2></header><div className="grid gap-px bg-line sm:grid-cols-2">{(Object.keys(blockLabels) as (keyof CaseStudy)[]).map(key=><section key={key} className={"bg-white p-6 "+(key==="decision"?"sm:col-span-2":"")}><TextArea id={"portfolio-"+key} label={blockLabels[key]} value={output.portfolio![key]} rows={3} onChange={e=>updateWorkspace({outputs:{...output,portfolio:{...output.portfolio!,[key]:e.target.value}}})}/></section>)}</div><div className="p-6"><CopyButton text={Object.entries(output.portfolio).map(([key,value])=>blockLabels[key as keyof CaseStudy]+"\n"+value).join("\n\n")}/></div></article>}
 </div>;
}
