"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {SourceBadge} from "@/components/ui/card";
import {TextArea} from "@/components/ui/field";
import {StepFooter,StepHeader} from "@/components/dashboard/step-frame";
import {ResultArea} from "./result-area";
import {TargetFields} from "./target-fields";
import {useAiRequest} from "@/lib/use-ai";
import {startSample,updateWorkspace,useWorkspace} from "@/lib/workspace";
import type {IndustryResult,CompanyResult,JobResult} from "@/lib/types";

type Step="industry"|"company"|"job";
const titles={industry:"산업 분석",company:"기업 분석",job:"직무 / JD 분석"};
const labels:Record<string,string>={structure:"산업 구조",changes:"주요 변화",impact:"직무에 미치는 영향",details:"추가로 확인할 점",overview:"기업 개요",business:"주요 사업",product:"제품 / 서비스",direction:"기업이 해결하는 문제",roleLink:"지원 직무와의 연결",questions:"추가로 확인할 질문",summary:"직무 한 줄 정의",responsibilities:"주요 업무",core:"필수 역량",preferred:"우대 역량",perspective:"실제로 증명해야 할 것",keywords:"반복되는 키워드"};
export function AnalysisView({step}:{step:Step}){
 const ws=useWorkspace();const [message,setMessage]=useState("");const [editing,setEditing]=useState(false);
 const ai=useAiRequest<IndustryResult|CompanyResult|JobResult>("/api/analyze/"+step);
 const result=ws[step];
 const run=async()=>{
  if(!(step==="industry"?ws.target.industry:step==="company"?ws.target.company:ws.jd).trim()){setMessage(step==="job"?"JD 전체 텍스트를 붙여넣어 주세요.":"분석할 "+(step==="industry"?"산업":"기업명")+"을 입력해 주세요.");return;}
  setMessage("");const data=await ai.run({...ws.target,jd:ws.jd,references:ws.companyReferences});
  if(data){if(step==="industry")updateWorkspace({industry:{source:"ai",data:data as IndustryResult}});if(step==="company")updateWorkspace({company:{source:"ai",data:data as CompanyResult},companyReviewed:false});if(step==="job")updateWorkspace({job:{source:"ai",data:data as JobResult}});}
 };
 const edit=(key:string,value:string| string[])=>{
  if(!result)return;const data={...result.data,[key]:value};
  if(step==="industry")updateWorkspace({industry:{...result,data:data as IndustryResult}});
  if(step==="company")updateWorkspace({company:{...result,data:data as CompanyResult},companyReviewed:false});
  if(step==="job")updateWorkspace({job:{...result,data:data as JobResult}});
 };
 return <div className="space-y-6"><StepHeader step={step} title={titles[step]} desc="지원할 곳을 이해하고 내 경험에서 확인할 근거를 찾습니다." />
  <section className="space-y-5 rounded-card-lg border border-line bg-white p-5 sm:p-7"><TargetFields />
   {step==="company"&&<TextArea id="company-references" label="기업 관련 참고자료 (선택)" value={ws.companyReferences} onChange={e=>updateWorkspace({companyReferences:e.target.value})} rows={6} maxLength={12000} placeholder="채용 페이지, 회사 소개, 서비스 설명, IR 또는 기사에서 확인한 내용을 붙여넣어 주세요." hint="주소를 자동으로 읽지 않습니다. 분석할 텍스트를 직접 붙여넣어 주세요." />}
   {step==="job"&&<TextArea id="jd" label="JD 전체 텍스트" value={ws.jd} onChange={e=>updateWorkspace({jd:e.target.value})} rows={8} maxLength={16000} placeholder="실제 채용공고의 주요 업무, 필수 요건, 우대 사항을 붙여넣어 주세요." />}
   {message&&<p role="alert" className="text-danger">{message}</p>}
   <Button onClick={()=>void run()} disabled={ai.status==="loading"}>{step==="job"?"직무 분석하기":titles[step]+"하기"}</Button>
  </section>
  <ResultArea status={ai.status} loadingMessage="입력한 내용을 분석하고 있습니다. 잠시 기다려 주세요." hasResult={Boolean(result)} onAgain={()=>void run()} onSample={()=>{ai.reset();startSample();}} empty={{title:"아직 분석 결과가 없습니다."}}>
   {result&&<section aria-live="polite" className="space-y-4"><div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold text-navy">{titles[step]} 결과</h2><SourceBadge source={result.source}/><Button variant="secondary" onClick={()=>setEditing(!editing)}>{editing?"수정 마치기":"분석 결과 수정"}</Button></div>
    <p className="text-sm text-ink-3">입력된 정보와 AI 지식을 기반으로 정리한 분석입니다. 시점에 민감한 정보는 공식 자료로 확인하세요.</p>
    <div className="grid gap-4 sm:grid-cols-2">{Object.entries(result.data).map(([key,value],index)=><article key={key} className={"rounded-card border border-line bg-white p-5 sm:p-6 "+(index===0?"sm:col-span-2 bg-soft-blue":"")}><h3 className="mb-3 font-bold text-navy">{step==="job"&&key==="questions"?"경험 탐색 질문":labels[key]}</h3>{editing?<TextArea id={"result-"+key} label={labels[key]} hideLabel value={Array.isArray(value)?value.join("\n"):value} onChange={e=>edit(key,Array.isArray(value)?e.target.value.split("\n"):e.target.value)}/>:Array.isArray(value)?<ul className="space-y-2">{value.map((v,i)=><li key={i}>{v}</li>)}</ul>:<p className="leading-relaxed">{value}</p>}</article>)}</div>
    {step==="company"&&<label className="flex gap-3 rounded-card bg-soft-mint p-5"><input type="checkbox" checked={ws.companyReviewed} onChange={e=>updateWorkspace({companyReviewed:e.target.checked,outputs:{}})}/><span>기업 분석을 확인했습니다. 문서 작성에 사용합니다.</span></label>}
   </section>}
  </ResultArea><StepFooter step={step}/></div>;
}
