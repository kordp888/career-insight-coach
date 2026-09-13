import type { CareerWorkspace, DocKind, InventoryExperience } from "./types";

export const EXPERIENCE_FIELDS = ["title", "period", "situation", "problem", "role", "action", "choice", "reason", "result", "learning", "evidence", "technologies", "research"] as const;
export function newExperience(id: string): InventoryExperience {
  return { id, category: "project", ...Object.fromEntries(EXPERIENCE_FIELDS.map((k) => [k, ""])) } as InventoryExperience;
}
export function emptyWorkspace(mode: CareerWorkspace["mode"] = "actual"): CareerWorkspace {
  return { schemaVersion: 2, mode, target: { role: "", company: "", industry: "" }, companyReferences: "", companyReviewed: false, jd: "", experiences: [], selectedExperienceIds: [], questions: [], connections: [], insights: [], question: "", maxLength: 1000, profile: { education: "", technologies: "" }, outputs: {} };
}
type Rule = (v: unknown) => boolean;
const text: Rule = (v) => typeof v === "string" && v.length <= 20000;
const list = (rule: Rule, max = 100): Rule => (v) => Array.isArray(v) && v.length <= max && v.every(rule);
const strings = list(text);
const shape = (fields: Record<string, Rule>, optional: Record<string, Rule> = {}): Rule => (v) => {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const data = v as Record<string, unknown>;
  return Object.keys(data).every((key) => Object.hasOwn(fields,key) || Object.hasOwn(optional,key)) && Object.entries(fields).every(([key, rule]) => rule(data[key])) && Object.entries(optional).every(([key, rule]) => data[key] === undefined || rule(data[key]));
};
const source: Rule = (v) => v === "sample" || v === "ai";
const sourced = (rule: Rule) => shape({source, data: rule});
export const industryShape = shape({structure:text, changes:strings, impact:text, details:strings});
export const companyShape = shape({overview:text,business:text,product:text,direction:text,roleLink:text},{questions:strings});
export const jobShape = shape({summary:text,responsibilities:strings,core:strings,preferred:strings,perspective:strings},{keywords:strings,questions:strings});
const experienceShape = shape({id:text,category:(v)=>v==="project"||v==="career",...Object.fromEntries(EXPERIENCE_FIELDS.map(k=>[k,text]))});
const questionShape = shape({experienceId:text,questions:strings});
const connectionShape = shape({competency:text,experienceIds:strings,reason:text,questions:strings,label:text});
const insightFields = {id:text,strength:text,evidence:text,roleLink:text,story:text,experienceIds:strings,competencies:strings};
const candidateShape = shape({...insightFields,decision:(v)=>["pending","accepted","rejected"].includes(String(v))});
export const blueprintShape = shape({intent:text,claim:text,evidence:text,experienceIds:strings,structure:strings});
export const resumeShape = shape({skills:strings,career:strings,projects:strings,education:strings,technologies:strings});
export const portfolioShape = shape({intro:text,problem:text,research:text,insight:text,decision:text,execution:text,result:text,learning:text,roleLink:text});
const outputsShape = shape({}, {resume:resumeShape,blueprint:blueprintShape,letter:text,portfolio:portfolioShape});
const workspaceShape = shape({schemaVersion:(v)=>v===2,mode:(v)=>v==="actual"||v==="sample",target:shape({role:text,company:text,industry:text}),companyReferences:text,companyReviewed:(v)=>typeof v==="boolean",jd:text,experiences:list(experienceShape,10),selectedExperienceIds:list(text,10),questions:list(questionShape,10),connections:list(connectionShape,10),insights:list(candidateShape,8),question:text,maxLength:(v)=>typeof v==="number"&&Number.isInteger(v)&&v>=100&&v<=3000,profile:shape({education:text,technologies:text}),outputs:outputsShape},{industry:sourced(industryShape),company:sourced(companyShape),job:sourced(jobShape)});
export function parseWorkspace(raw: string): CareerWorkspace {
  if (raw.length > 600000) throw new Error("파일이 너무 큽니다.");
  const data: unknown = JSON.parse(raw);
  if (!workspaceShape(data)) throw new Error("지원하는 커리어 데이터 파일이 아닙니다.");
  const ws = data as CareerWorkspace;
  const ids = new Set(ws.experiences.map(e=>e.id));
  if (ids.size !== ws.experiences.length || ws.selectedExperienceIds.some(id=>!ids.has(id)) || ws.insights.some(i=>i.experienceIds.some(id=>!ids.has(id)))) throw new Error("경험 연결 정보를 확인해 주세요.");
  if (ws.mode === "actual" && [ws.industry,ws.company,ws.job].some(v=>v?.source==="sample")) throw new Error("예시 데이터는 예시 공간에서만 사용할 수 있습니다.");
  return ws;
}
export function validResponse(url: string, payload: unknown, value: unknown): boolean {
  const input = payload as Record<string, unknown>;
  if (url.endsWith("/industry")) return industryShape(value);
  if (url.endsWith("/company")) return companyShape(value);
  if (url.endsWith("/job")) return jobShape(value);
  if (url.endsWith("/experience")) return shape({questions:list(questionShape,10)})(value);
  if (url.endsWith("/insight")) return input.mode === "connect" ? shape({connections:list(connectionShape,10)})(value) : shape({insights:list(shape(insightFields),8)})(value);
  if (input.kind === "resume") return shape({kind:v=>v==="resume",sections:resumeShape})(value);
  if (input.kind === "portfolio") return shape({kind:v=>v==="portfolio",blocks:portfolioShape})(value);
  return input.stage === "blueprint" ? shape({kind:v=>v==="letter",stage:v=>v==="blueprint",blueprint:blueprintShape})(value) : shape({kind:v=>v==="letter",stage:v=>v==="draft",draft:text})(value);
}
export function applyWorkspacePatch(ws: CareerWorkspace, patch: Partial<CareerWorkspace>): CareerWorkspace {
  let next = {...ws,...patch};
  if (patch.target || patch.jd !== undefined || patch.companyReferences !== undefined) next = {...next, companyReviewed:false,questions:[],connections:[],insights:[],outputs:{}};
  if (patch.target) {
    const contextChanged=patch.target.industry!==ws.target.industry||patch.target.role!==ws.target.role;
    if(contextChanged)next={...next,industry:undefined,company:undefined,job:undefined};
    else if(patch.target.company!==ws.target.company)next={...next,company:undefined,job:undefined};
  }
  if (patch.jd !== undefined) next.job = undefined;
  if (patch.companyReferences !== undefined) next.company = undefined;
  if (patch.industry || patch.company || patch.job) next = {...next,questions:[],connections:[],insights:[],outputs:{}};
  if (patch.company) next.companyReviewed = false;
  if (patch.experiences) next = {...next,questions:[],connections:[],insights:[],outputs:{}, selectedExperienceIds:next.selectedExperienceIds.filter(id=>patch.experiences!.some(e=>e.id===id))};
  if (patch.insights || patch.selectedExperienceIds || patch.question !== undefined || patch.maxLength !== undefined || patch.profile) next.outputs = {};
  return next;
}
export function analysisPayload(ws: CareerWorkspace, selected = false) {
  return {...ws.target,jd:ws.jd,companyAnalysis:ws.companyReviewed && ws.company ? JSON.stringify(ws.company.data) : "",competencies:ws.job?.data.core ?? [],experiences:ws.experiences.filter(e=>!selected||ws.selectedExperienceIds.includes(e.id)).map(({role,...e})=>({...e,roleText:role})),approvedInsights:approvedInsights(ws,selected).map(({strength,evidence,roleLink})=>({strength,evidence,roleLink})),profile:ws.profile};
}
export function approvedInsights(ws: CareerWorkspace,selected=false){
  return ws.insights.filter(i=>i.decision==="accepted"&&(!selected||(i.experienceIds.length>0&&i.experienceIds.every(id=>ws.selectedExperienceIds.includes(id)))));
}

export interface DocumentRequirement {
  id: "job" | "experience" | "insight" | "company" | "question";
  label: string;
  done: boolean;
  href?: string;
}

export function documentRequirements(ws: CareerWorkspace, kind: DocKind): DocumentRequirement[] {
  const selected = ws.experiences.filter(e=>ws.selectedExperienceIds.includes(e.id));
  const requirements: DocumentRequirement[] = [
    {id:"job",label:"JD 분석 완료",done:Boolean(ws.job),href:"/coach/job"},
    {id:"experience",label:"문서에 사용할 경험 선택",done:selected.length>0,href:"/coach/experience"},
    {id:"insight",label:"문서에 사용할 인사이트 선택",done:approvedInsights(ws,true).length>0,href:"/coach/insight"},
  ];
  if (ws.company) requirements.push({id:"company",label:"기업 분석 사용 확인",done:ws.companyReviewed,href:"/coach/company"});
  if (kind === "letter") requirements.push({id:"question",label:"자기소개서 질문 입력",done:Boolean(ws.question.trim())});
  return requirements;
}
