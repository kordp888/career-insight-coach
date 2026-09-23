"use client";
import {useEffect,useRef,useState} from "react";
import {Bot,CornerDownLeft,UserRound} from "lucide-react";
import {Button} from "@/components/ui/button";
import {AiFeedback} from "@/components/ui/ai-feedback";
import {patchExperience,useWorkspace} from "@/lib/workspace";
import {digPayload,FOCUS_FIELD,pendingTurn} from "@/lib/workspace-data";
import {useAiRequest} from "@/lib/use-ai";
import type {DialogueTurn,DigResponse,InventoryExperience} from "@/lib/types";

const OPENING="기억나는 경험 하나를 편하게 말씀해 주세요. 정리되지 않아도 괜찮습니다. 언제 어떤 일이었는지부터요.";
const CLOSING="핵심 질문은 다 여쭤봤습니다. 아래 카드에서 정리된 내용을 확인하고 고쳐 주세요. 더 떠오르는 것이 있으면 계속 적어도 됩니다.";
const STARTERS=["작년에 팀 프로젝트로 앱을 만들었어요","인턴으로 기획 업무를 도왔어요","동아리 운영을 맡았던 적이 있어요"];
const SHORTCUTS=["기억이 안 나요","수치는 없어요","제 역할이 아니었어요"];
const FOCUS_LABEL:Record<string,string>={story:"이야기",situation:"상황",role:"내 역할",choice:"판단",steps:"실행 순서",work:"구체적 작업",revision:"수정",result:"결과 확인",limit:"남은 한계",none:""};
const FIELD_LABEL:Record<string,string>={situation:"상황",role:"나의 역할",choice:"중요한 판단",action:"직접 한 행동",learning:"배운 점",result:"결과"};

/** 경험 하나에 대한 HOW 대화. 코치가 한 번에 질문 하나를 하고, 답은 사용자 진술로 카드에 남는다. */
export function ExperienceDialogue({experience}:{experience:InventoryExperience}){
 const ws=useWorkspace();
 const ai=useAiRequest<DigResponse>("/api/coach/experience");
 const [text,setText]=useState("");
 const endRef=useRef<HTMLDivElement>(null);
 const dialogue=experience.dialogue;
 const pending=pendingTurn(dialogue);
 const last=dialogue[dialogue.length-1];
 const waitingForCoach=Boolean(last&&last.a)&&ai.status!=="loading";
 const finished=pending?.focus==="none";
 useEffect(()=>{endRef.current?.scrollIntoView({block:"nearest"});},[dialogue.length,ai.status]);

 const ask=async(turns:DialogueTurn[])=>{
  const r=await ai.run(digPayload(ws,{...experience,dialogue:turns}));
  if(!r)return;
  patchExperience(experience.id,e=>({
   ...e,
   title:e.title||r.title,
   aiNotes:r.note&&!e.aiNotes.includes(r.note)?[...e.aiNotes,r.note]:e.aiNotes,
   dialogue:[...e.dialogue,r.done?{focus:"none",q:CLOSING,a:""}:{focus:r.focus,q:r.question,a:""}],
  }));
 };
 const send=async(message:string)=>{
  const a=message.trim().slice(0,1500);if(!a||ai.status==="loading")return;
  const turns:DialogueTurn[]=dialogue.length===0?[{focus:"story",q:OPENING,a}]:pending?dialogue.map(t=>t===pending?{...t,a}:t):[...dialogue,{focus:"none",q:"",a}];
  patchExperience(experience.id,e=>({...e,dialogue:turns}));setText("");
  await ask(turns);
 };
 const putInCard=(turn:DialogueTurn)=>{
  const field=FOCUS_FIELD[turn.focus];if(!field)return;
  patchExperience(experience.id,e=>e[field].includes(turn.a)?e:{...e,[field]:e[field]?e[field]+"\n"+turn.a:turn.a});
 };
 const inCard=(turn:DialogueTurn)=>{const field=FOCUS_FIELD[turn.focus];return Boolean(field&&experience[field].includes(turn.a));};

 return <section aria-label="경험 대화" className="rounded-card-lg border border-line bg-white">
  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 sm:px-7">
   <h2 className="text-lg font-bold text-navy">이야기로 꺼내기</h2>
   <p className="text-[13px] text-ink-3">한 번에 질문 하나. 답한 내용은 사용자 진술로 남고, 카드에 넣을지는 직접 고릅니다.</p>
  </div>
  <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
   {dialogue.length===0&&<Bubble who="coach">{OPENING}</Bubble>}
   {dialogue.map((t,i)=><div key={i} className="space-y-3">
    {t.q&&<Bubble who="coach" focus={FOCUS_LABEL[t.focus]}>{t.q}</Bubble>}
    {t.a&&<Bubble who="user" action={FOCUS_FIELD[t.focus]&&<Button variant="ghost" className="min-h-9 px-3 text-[13px]" onClick={()=>putInCard(t)} disabled={inCard(t)}>{inCard(t)?"카드에 있음":"'"+FIELD_LABEL[FOCUS_FIELD[t.focus]!]+"' 칸에 넣기"}</Button>}>{t.a}</Bubble>}
   </div>)}
   <AiFeedback status={ai.status} onAgain={()=>void ask(dialogue)}/>
   {waitingForCoach&&ai.status==="idle"&&<Button variant="secondary" onClick={()=>void ask(dialogue)}>다음 질문 이어받기</Button>}
   <div ref={endRef}/>
  </div>
  <div className="space-y-3 border-t border-line px-5 py-4 sm:px-7">
   {dialogue.length===0&&<div className="flex flex-wrap gap-2">{STARTERS.map(s=><Button key={s} variant="secondary" className="min-h-10 text-[14px]" onClick={()=>void send(s)}>{s}</Button>)}</div>}
   {pending&&!finished&&<div className="flex flex-wrap gap-2">{SHORTCUTS.map(s=><Button key={s} variant="ghost" className="min-h-9 px-3 text-[13px]" onClick={()=>void send(s)}>{s}</Button>)}</div>}
   <form className="flex items-end gap-2" onSubmit={e=>{e.preventDefault();void send(text);}}>
    <label htmlFor={"dialogue-"+experience.id} className="sr-only">답변</label>
    <textarea id={"dialogue-"+experience.id} value={text} maxLength={1500} rows={2} placeholder={dialogue.length===0?"예: 작년 봄에 동아리 출석을 종이로 받다가 앱으로 바꿨어요":finished?"더 떠오르는 것이 있으면 적어 주세요":"떠오르는 대로 적어 주세요. 짧아도 됩니다."} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void send(text);}}} className="min-h-12 w-full resize-y rounded-input border border-line bg-white px-4 py-3 text-[16px] leading-relaxed text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"/>
    <Button type="submit" disabled={!text.trim()||ai.status==="loading"} aria-label="보내기"><CornerDownLeft className="h-4 w-4" aria-hidden="true"/><span className="max-sm:sr-only">보내기</span></Button>
   </form>
   <p className="text-[12px] text-ink-3">일단 저장하고 나가도 됩니다. 대화는 이 브라우저에 저장되고 돌아오면 이어집니다.</p>
  </div>
 </section>;
}

function Bubble({who,focus,action,children}:{who:"coach"|"user";focus?:string;action?:React.ReactNode;children:React.ReactNode}){
 const coach=who==="coach";
 return <div className={"flex gap-3 "+(coach?"":"flex-row-reverse")}>
  <span className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full "+(coach?"bg-soft-blue text-brand":"bg-navy text-white")} aria-hidden="true">{coach?<Bot className="h-4 w-4"/>:<UserRound className="h-4 w-4"/>}</span>
  <div className={"max-w-[85%] space-y-1.5 "+(coach?"":"items-end text-right")}>
   {focus&&<span className="inline-block rounded-full bg-soft-blue px-2 py-0.5 text-[11px] font-semibold text-brand">{focus}</span>}
   <p className={"whitespace-pre-wrap rounded-card px-4 py-3 text-[15px] leading-relaxed "+(coach?"bg-soft-blue text-ink":"border border-line bg-white text-ink")}>{children}</p>
   {action}
  </div>
 </div>;
}
