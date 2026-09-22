import test from "node:test";
import assert from "node:assert/strict";
import {emptyWorkspace,newExperience,parseWorkspace,applyWorkspacePatch,analysisPayload,documentRequirements,validResponse,migrateWorkspace,digPayload,pendingTurn,WORKSPACE_SCHEMA_VERSION} from "../lib/workspace-data.ts";
const fixture=()=>({...emptyWorkspace(),experiences:[newExperience("a"),newExperience("b")],selectedExperienceIds:["a","b"],insights:[{id:"i",strength:"기록",evidence:"작업 기록",roleLink:"운영",story:"작업을 기록했습니다.",experienceIds:["a"],competencies:["정리"],decision:"accepted"}]});
test("actual workspace starts empty without sample data",()=>{const ws=emptyWorkspace();assert.equal(ws.mode,"actual");assert.equal(ws.target.role,"");assert.equal(ws.experiences.length,0);assert.deepEqual(ws.outputs,{});});
test("JSON round trip preserves user inputs",()=>{const ws=fixture();ws.experiences[0].title="내 경험";assert.deepEqual(parseWorkspace(JSON.stringify(ws)),ws);});
test("unknown schema and malformed data are rejected",()=>{for(const value of [{schemaVersion:1},{...emptyWorkspace(),schemaVersion:WORKSPACE_SCHEMA_VERSION+1},{...emptyWorkspace(),maxLength:99},{...emptyWorkspace(),target:[]},{...emptyWorkspace(),extra:"unsupported"}])assert.throws(()=>parseWorkspace(JSON.stringify(value)));});
test("experience inventory is limited to ten",()=>{const ws=emptyWorkspace();ws.experiences=Array.from({length:10},(_,i)=>newExperience(String(i)));assert.equal(parseWorkspace(JSON.stringify(ws)).experiences.length,10);ws.experiences.push(newExperience("11"));assert.throws(()=>parseWorkspace(JSON.stringify(ws)));});
test("invalid experience references are rejected",()=>{const ws=fixture();ws.selectedExperienceIds=["missing"];assert.throws(()=>parseWorkspace(JSON.stringify(ws)));});
test("actual import cannot contain sample analysis",()=>{const ws={...emptyWorkspace(),industry:{source:"sample",data:{structure:"예시",changes:[],impact:"예시",details:[]}}};assert.throws(()=>parseWorkspace(JSON.stringify(ws)));ws.mode="sample";assert.equal(parseWorkspace(JSON.stringify(ws)).mode,"sample");});
test("document only uses selected experiences and approved applicable insights",()=>{const ws=fixture();ws.selectedExperienceIds=["b"];assert.equal(analysisPayload(ws,true).experiences.length,1);assert.equal(analysisPayload(ws,true).approvedInsights.length,0);ws.selectedExperienceIds=["a"];assert.equal(analysisPayload(ws,true).approvedInsights.length,1);ws.insights[0].decision="rejected";assert.equal(analysisPayload(ws,true).approvedInsights.length,0);});
test("unreviewed company analysis is excluded",()=>{const ws=fixture();ws.company={source:"ai",data:{overview:"회사",business:"서비스",product:"도구",direction:"문제",roleLink:"운영"}};assert.equal(analysisPayload(ws).companyAnalysis,"");ws.companyReviewed=true;assert.ok(analysisPayload(ws).companyAnalysis.includes("회사"));});
test("experience changes clear stale insights and documents",()=>{const ws=fixture();ws.outputs={letter:"이전 초안"};const next=applyWorkspacePatch(ws,{experiences:[newExperience("a")]});assert.deepEqual(next.insights,[]);assert.deepEqual(next.outputs,{});assert.deepEqual(next.selectedExperienceIds,["a"]);});
test("editing an experience keeps its follow-up questions, deleting it drops them",()=>{
 const ws=fixture();ws.questions=[{experienceId:"a",questions:["직접 맡은 부분은요?"]},{experienceId:"b",questions:["첫 행동은요?"]}];
 const edited=applyWorkspacePatch(ws,{experiences:ws.experiences.map(e=>e.id==="a"?{...e,action:"화면을 그렸습니다."}:e)});
 assert.equal(edited.questions.length,2);
 const removed=applyWorkspacePatch(ws,{experiences:ws.experiences.filter(e=>e.id!=="b")});
 assert.deepEqual(removed.questions.map(q=>q.experienceId),["a"]);
});
test("v2 export migrates to the current schema without losing inputs",()=>{
 const v3=fixture();v3.experiences[0].title="옛 경험";v3.experiences[0].problem="문제";
 const v2={...v3,schemaVersion:2,experiences:v3.experiences.map(e=>{const c={...e};delete c.dialogue;delete c.aiNotes;return c;})};delete v2.meaning;
 const parsed=parseWorkspace(JSON.stringify(v2));
 assert.equal(parsed.schemaVersion,WORKSPACE_SCHEMA_VERSION);
 assert.equal(parsed.experiences[0].title,"옛 경험");
 assert.deepEqual(parsed.experiences[0].dialogue,[]);assert.deepEqual(parsed.experiences[0].aiNotes,[]);
 assert.deepEqual(parsed.meaning,{industry:"",company:"",job:""});
 assert.deepEqual(parsed.insights,v3.insights);
 assert.equal(migrateWorkspace("not an object"),"not an object");
});
test("dialogue turns and AI notes round trip, and bad focus is rejected",()=>{
 const ws=fixture();ws.experiences[0].dialogue=[{focus:"story",q:"어떤 경험인가요?",a:"출석 앱을 만들었습니다."},{focus:"role",q:"직접 맡은 부분은요?",a:""}];ws.experiences[0].aiNotes=["출석 앱 경험으로 보입니다."];
 assert.deepEqual(parseWorkspace(JSON.stringify(ws)),ws);
 assert.deepEqual(pendingTurn(ws.experiences[0].dialogue),ws.experiences[0].dialogue[1]);
 assert.equal(pendingTurn(ws.experiences[1].dialogue),null);
 ws.experiences[0].dialogue[0].focus="unknown";assert.throws(()=>parseWorkspace(JSON.stringify(ws)));
});
test("analysis payload sends user statements and meaning but not AI notes",()=>{
 const ws=fixture();ws.experiences[0].dialogue=[{focus:"role",q:"역할?",a:"기준 정리"},{focus:"steps",q:"다음?",a:""}];ws.experiences[0].aiNotes=["AI 해석"];ws.meaning.industry="직접 겪은 문제";
 const p=analysisPayload(ws);
 assert.deepEqual(p.experiences[0].dialogue,[{focus:"role",q:"역할?",a:"기준 정리"}]);
 assert.equal("aiNotes" in p.experiences[0],false);
 assert.equal(p.meaning.industry,"직접 겪은 문제");
 const d=digPayload(ws,ws.experiences[0]);
 assert.equal(d.mode,"dig");assert.equal(d.experience.id,"a");assert.equal("aiNotes" in d.experience,false);assert.equal(d.dialogue.length,2);
});
test("meaning answers invalidate drafted documents",()=>{const ws=fixture();ws.outputs={letter:"이전 초안"};assert.deepEqual(applyWorkspacePatch(ws,{meaning:{...ws.meaning,company:"내 말"}}).outputs,{});});
test("editing analysis clears dependent results",()=>{const ws=fixture();ws.outputs={letter:"이전 초안"};const next=applyWorkspacePatch(ws,{job:{source:"ai",data:{summary:"직무",responsibilities:[],core:[],preferred:[],perspective:[]}}});assert.deepEqual(next.insights,[]);assert.deepEqual(next.outputs,{});});
test("company edits retain completed industry analysis",()=>{const ws=fixture();ws.industry={source:"ai",data:{structure:"구조",changes:[],impact:"영향",details:[]}};const next=applyWorkspacePatch(ws,{target:{...ws.target,company:"다른 회사"}});assert.deepEqual(next.industry,ws.industry);});
test("public response shapes reject incomplete AI results",()=>{assert.equal(validResponse("/api/analyze/industry",{},{}),false);assert.equal(validResponse("/api/analyze/industry",{},{structure:"구조",changes:[],impact:"영향",details:[]}),true);assert.equal(validResponse("/api/analyze/industry",{},{structure:"구조",changes:[],impact:"영향",details:[],summary:"요약",social:"의미",personalQuestions:["질문"]}),true);assert.equal(validResponse("/api/coach/experience",{mode:"dig"},{question:"질문",focus:"role",note:"",title:"",done:false}),true);assert.equal(validResponse("/api/coach/experience",{mode:"dig"},{question:"질문",focus:"엉뚱",note:"",title:"",done:false}),false);assert.equal(validResponse("/api/coach/experience",{mode:"questions"},{questions:[]}),true);assert.equal(validResponse("/api/generate/document",{kind:"letter",stage:"draft"},{kind:"letter",stage:"draft",draft:"초안"}),true);assert.equal(validResponse("/api/generate/document",{kind:"resume"},{kind:"resume",sections:[]}),false);});
test("document requirements explain every missing prerequisite",()=>{
 const ws=fixture();
 assert.deepEqual(documentRequirements(ws,"resume").map(({id,done})=>({id,done})),[
  {id:"job",done:false},{id:"experience",done:true},{id:"insight",done:true},
 ]);
 ws.job={source:"ai",data:{summary:"직무",responsibilities:[],core:[],preferred:[],perspective:[]}};
 ws.company={source:"ai",data:{overview:"회사",business:"사업",product:"제품",direction:"방향",roleLink:"연결"}};
 assert.equal(documentRequirements(ws,"resume").find(item=>item.id==="company")?.done,false);
 ws.companyReviewed=true;
 assert.equal(documentRequirements(ws,"resume").every(item=>item.done),true);
 const letter=documentRequirements(ws,"letter");
 assert.equal(letter.find(item=>item.id==="question")?.done,false);
 ws.question="지원 동기를 작성해 주세요.";
 assert.equal(documentRequirements(ws,"letter").every(item=>item.done),true);
});
test("insight requirement only accepts insights backed by selected experiences",()=>{
 const ws=fixture();
 ws.job={source:"ai",data:{summary:"직무",responsibilities:[],core:[],preferred:[],perspective:[]}};
 ws.selectedExperienceIds=["b"];
 assert.equal(documentRequirements(ws,"resume").find(item=>item.id==="insight")?.done,false);
});
