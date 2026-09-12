"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {useAiReady} from "@/lib/use-ai";
import {resetWorkspace,replaceWorkspace,useWorkspace} from "@/lib/workspace";
import {parseWorkspace} from "@/lib/workspace-data";
export function SettingsView(){
 const ws=useWorkspace();const ready=useAiReady();const[message,setMessage]=useState("");
 const download=(value:string,name:string)=>{const url=URL.createObjectURL(new Blob([value],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);};
 const restore=async(file?:File)=>{if(!file)return;try{if(file.size>600000)throw new Error("파일이 너무 큽니다.");const next=parseWorkspace(await file.text());if(!window.confirm("현재 작업 공간을 파일 내용으로 바꿀까요? 먼저 내보내기로 백업할 수 있습니다."))return;replaceWorkspace(next);setMessage("데이터를 불러왔습니다.");}catch{setMessage("불러오지 못했습니다. 내보낸 JSON 파일의 형식과 크기를 확인해 주세요.");}};
 return <div className="space-y-6"><h1 className="text-3xl font-bold text-navy">설정</h1>
 <section className="space-y-4 rounded-card-lg border border-line bg-white p-6"><h2 className="text-xl font-bold">내 데이터</h2><p>입력한 정보는 이 브라우저에 저장됩니다. 브라우저 기록을 지우거나 다른 기기를 사용하기 전에 파일을 내보내 주세요.</p><p className="text-sm text-ink-3">현재 공간: {ws.mode==="sample"?"예시 데이터":"내 작업"}. 내보내기는 현재 공간만 포함합니다. 파일에는 직접 입력한 경험과 AI 분석 결과가 포함되므로 안전한 곳에 보관하세요.</p>
 <div className="flex flex-wrap gap-3"><Button onClick={()=>download(JSON.stringify(ws,null,2),"career-workspace.json")}>내 데이터 내보내기</Button><label className="inline-flex min-h-11 cursor-pointer items-center rounded-btn border border-line px-4 font-semibold focus-within:ring-4 focus-within:ring-brand/20">내 데이터 불러오기<input aria-label="내 데이터 불러오기" className="sr-only" type="file" accept=".json,application/json" onChange={e=>{void restore(e.target.files?.[0]);e.target.value="";}}/></label><Button variant="secondary" onClick={()=>{if(window.confirm("내 작업과 예시 공간의 모든 저장 데이터를 삭제할까요? 되돌릴 수 없습니다.")){resetWorkspace();setMessage("전체 데이터를 삭제했습니다.");}}}>전체 데이터 삭제</Button></div>
 <Button variant="ghost" onClick={()=>{const old=localStorage.getItem("career-coach-workspace-v1");if(old)download(old,"career-workspace-legacy.json");else setMessage("이전 버전 데이터가 없습니다.");}}>이전 버전 원본 백업</Button><p role="status" className="text-sm text-brand">{message}</p></section>
 <section className="space-y-3 rounded-card-lg border border-line bg-white p-6"><h2 className="text-xl font-bold">AI 연결</h2><p>{ready===null?"AI 분석 연결을 확인하고 있습니다.":ready?"AI 분석을 사용할 수 있습니다.":"현재 AI 분석을 사용할 수 없습니다."}</p><p>AI 분석 버튼을 누르면 입력 내용이 서버 AI 분석 API로 전달됩니다. 주민등록번호, 계좌번호, 비밀번호, API key를 입력하지 마세요.</p><p className="text-sm text-ink-3">지원 전 사실과 수치를 직접 확인하고 수정하세요. AI 응답은 합격이나 정확도를 보장하지 않습니다.</p></section>
 <section className="space-y-2 rounded-card-lg border border-dashed border-line bg-white p-6"><h2 className="text-xl font-bold">면접 준비</h2><p>면접 답변 작성은 후속 확장 기능입니다. 현재는 이력서, 자기소개서, 포트폴리오를 지원합니다.</p></section></div>;
}
