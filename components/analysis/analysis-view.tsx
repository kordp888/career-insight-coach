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
type Result=IndustryResult|CompanyResult|JobResult;
type Value=string|string[]|undefined;
const titles={industry:"산업 분석",company:"기업 분석",job:"직무 / JD 분석"};
const nouns={industry:"이 산업",company:"이 기업",job:"이 직무"};
const labels:Record<string,string>={summary:"핵심 요약",structure:"산업 구조",changes:"주요 변화",impact:"직무에 미치는 영향",details:"추가로 확인할 점",overview:"기업 개요",business:"주요 사업",product:"제품 / 서비스",direction:"기업이 해결하는 문제",roleLink:"지원 직무와의 연결",questions:"추가로 확인할 질문",responsibilities:"주요 업무",core:"필수 역량",preferred:"우대 역량",perspective:"실제로 증명해야 할 것",keywords:"반복되는 키워드",social:"사회적 의미",personalQuestions:"나와 연결하는 질문"};
/** 상세 분석에 놓는 칸. 요약·의미·질문은 따로 자리를 잡는다. */
const DETAIL:Record<Step,string[]>={industry:["structure","changes","impact","details"],company:["overview","business","product","direction","roleLink"],job:["responsibilities","core","preferred","perspective","keywords"]};

export function AnalysisView({step}:{step:Step}){
 const ws=useWorkspace();const [message,setMessage]=useState("");const [editing,setEditing]=useState(false);
 const ai=useAiRequest<Result>("/api/analyze/"+step);
 const result=ws[step];
 const data=result?.data as Record<string,Value>|undefined;
 const run=async()=>{
  if(!(step==="industry"?ws.target.industry:step==="company"?ws.target.company:ws.jd).trim()){setMessage(step==="job"?"JD 전체 텍스트를 붙여넣어 주세요.":"분석할 "+(step==="industry"?"산업":"기업명")+"을 입력해 주세요.");return;}
  setMessage("");const next=await ai.run({...ws.target,jd:ws.jd,references:ws.companyReferences});
  if(next){if(step==="industry")updateWorkspace({industry:{source:"ai",data:next as IndustryResult}});if(step==="company")updateWorkspace({company:{source:"ai",data:next as CompanyResult},companyReviewed:false});if(step==="job")updateWorkspace({job:{source:"ai",data:next as JobResult}});}
 };
 const edit=(key:string,value:Value)=>{
  if(!result)return;const nextData={...result.data,[key]:value};
  if(step==="industry")updateWorkspace({industry:{...result,data:nextData as IndustryResult}});
  if(step==="company")updateWorkspace({company:{...result,data:nextData as CompanyResult},companyReviewed:false});
  if(step==="job")updateWorkspace({job:{...result,data:nextData as JobResult}});
 };
 // 요약이 없는 옛 결과는 첫 상세 칸을 요약 자리에 올리고 상세에서는 뺀다.
 const summaryKey=data?.summary?"summary":DETAIL[step][0];
 const detailKeys=DETAIL[step].filter(k=>k!==summaryKey);
 const field=(key:string)=>{const value=data?.[key];return editing?<TextArea id={"result-"+key} label={labels[key]} hideLabel value={Array.isArray(value)?value.join("\n"):value??""} onChange={e=>edit(key,Array.isArray(value)||key==="personalQuestions"||key==="questions"?e.target.value.split("\n"):e.target.value)}/>:Array.isArray(value)?<ul className="space-y-2">{value.map((v,i)=><li key={i}>{v}</li>)}</ul>:<p className="leading-relaxed">{value}</p>;};
 const questionKeys=[...(data?.personalQuestions||editing?["personalQuestions"]:[]),...(data?.questions?["questions"]:[])];
 const inputNote=step==="industry"?`산업명 "${ws.target.industry}"`:step==="company"?`기업명 "${ws.target.company}"`+(ws.companyReferences.trim()?`, 붙여넣은 참고자료 ${ws.companyReferences.trim().length}자`:", 참고자료 없음"):`채용공고 ${ws.jd.trim().length}자`;
 return <div className="space-y-6"><StepHeader step={step} title={titles[step]} desc="지원할 곳을 이해하고, 그 일이 사회와 나에게 갖는 의미를 확인합니다." />
  <section className="space-y-5 rounded-card-lg border border-line bg-white p-5 sm:p-7"><TargetFields />
   {step==="company"&&<TextArea id="company-references" label="기업 관련 참고자료 (선택)" value={ws.companyReferences} onChange={e=>updateWorkspace({companyReferences:e.target.value})} rows={6} maxLength={12000} placeholder="채용 페이지, 회사 소개, 서비스 설명, IR 또는 기사에서 확인한 내용을 붙여넣어 주세요. 날짜와 출처를 함께 적으면 분석에 표시됩니다." hint="주소를 자동으로 읽지 않습니다. 분석할 텍스트를 직접 붙여넣어 주세요." />}
   {step==="job"&&<TextArea id="jd" label="JD 전체 텍스트" value={ws.jd} onChange={e=>updateWorkspace({jd:e.target.value})} rows={8} maxLength={16000} placeholder="실제 채용공고의 주요 업무, 필수 요건, 우대 사항을 붙여넣어 주세요." />}
   {message&&<p role="alert" className="text-danger">{message}</p>}
   <Button onClick={()=>void run()} disabled={ai.status==="loading"}>{step==="job"?"직무 분석하기":titles[step]+"하기"}</Button>
  </section>
  <ResultArea status={ai.status} loadingMessage="입력한 내용을 분석하고 있습니다. 잠시 기다려 주세요." hasResult={Boolean(result)} onAgain={()=>void run()} onSample={()=>{ai.reset();startSample();}} empty={{title:"아직 분석 결과가 없습니다."}}>
   {result&&data&&<section aria-live="polite" className="space-y-6">
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold text-navy">{titles[step]} 결과</h2><div className="flex items-center gap-2"><SourceBadge source={result.source}/><Button variant="secondary" onClick={()=>setEditing(!editing)}>{editing?"수정 마치기":"분석 결과 수정"}</Button></div></div>

    <article className="rounded-card-lg border border-line bg-soft-blue p-5 sm:p-7"><h3 className="mb-3 text-[13px] font-bold text-brand">핵심 요약</h3><div className="text-[17px] leading-relaxed text-ink">{field(summaryKey)}</div></article>

    <div><h3 className="mb-3 text-[15px] font-bold text-navy">상세 분석</h3>
    <div className="grid gap-4 sm:grid-cols-2">{detailKeys.map(key=><article key={key} className="rounded-card border border-line bg-white p-5 sm:p-6"><h4 className="mb-3 font-bold text-navy">{labels[key]}</h4>{field(key)}</article>)}</div></div>

    <article className="rounded-card border border-line bg-white p-5 sm:p-6"><h3 className="mb-3 font-bold text-navy">근거와 확인 범위</h3><ul className="space-y-1.5 text-[14px] leading-relaxed text-ink-2"><li>입력: {inputNote}.</li><li>실시간 자료는 확인하지 않았습니다. 최신 변화로 적힌 내용은 공식 자료에서 날짜를 확인하세요. &quot;시점 확인 필요&quot; 표시가 있으면 특히 그렇습니다.</li><li>확인한 사실과 AI의 해석이 섞여 있습니다. 문서에 쓰기 전에 사실 부분을 직접 확인해 주세요.</li></ul></article>

    {(data.social||editing)&&<article className="rounded-card border border-line bg-white p-5 sm:p-6"><h3 className="mb-1 font-bold text-navy">사회적 의미</h3><p className="mb-3 text-[13px] text-ink-3">누구의 어떤 문제를 해결하는지, 그리고 한계와 부작용. 칭찬문이 아니라 분석입니다.</p>{field("social")}</article>}

    <article className="rounded-card-lg border border-line bg-white p-5 sm:p-7"><h3 className="font-bold text-navy">나와 연결하는 질문</h3><p className="mt-1 text-[13px] text-ink-3">AI가 지원 동기를 대신 정하지 않습니다. 생계, 안정성, 성장, 기술적 흥미, 일하는 방식도 유효한 이유입니다.</p>
     {questionKeys.map(key=><div key={key} className="mt-4"><h4 className="mb-2 text-[13px] font-bold text-ink-3">{step==="job"&&key==="questions"?"경험 탐색 질문":labels[key]}</h4>{field(key)}</div>)}
     <div className="mt-5"><TextArea id={"meaning-"+step} label={`${nouns[step]}이 나에게 갖는 의미 (내 말로)`} value={ws.meaning[step]} onChange={e=>updateWorkspace({meaning:{...ws.meaning,[step]:e.target.value}})} rows={4} maxLength={2000} placeholder="직접 겪거나 가까이서 본 문제, 관심 가는 부분, 다른 곳과 비교해 중요하게 보는 차이를 적어 주세요." hint="여기에 쓴 내용은 사용자 답변으로 저장되고, 자기소개서 초안의 지원 이유에 우선 사용됩니다."/></div>
    </article>

    {step==="company"&&<label className="flex gap-3 rounded-card bg-soft-mint p-5"><input type="checkbox" checked={ws.companyReviewed} onChange={e=>updateWorkspace({companyReviewed:e.target.checked,outputs:{}})}/><span>기업 분석을 확인했습니다. 문서 작성에 사용합니다.</span></label>}
   </section>}
  </ResultArea><StepFooter step={step}/></div>;
}
