"use client";
import {CheckCircle2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAiReady} from "@/lib/use-ai";
import {startSample,switchToActual,useLastSavedAt,useStorageWarning,useWorkspace} from "@/lib/workspace";
export function WorkspaceNotice(){
  const ws=useWorkspace();const ready=useAiReady();const warning=useStorageWarning();const lastSavedAt=useLastSavedAt();
  return <div className="mb-6 space-y-3 text-[13px] leading-relaxed">
    {ws.mode==="sample" && <div className="flex flex-wrap items-center justify-between gap-2 rounded-card bg-soft-orange p-4"><strong>예시 데이터</strong><span>실제 입력은 별도로 보관됩니다.</span><Button variant="secondary" onClick={switchToActual}>내 작업으로 돌아가기</Button></div>}
    <div className="rounded-card border border-line bg-white p-4"><p>입력한 정보는 이 브라우저에 저장됩니다. AI 분석 버튼을 누르면 입력 내용이 서버 AI 분석 API로 전달됩니다.</p><p className="mt-1 text-ink-3">주민등록번호, 계좌번호, 비밀번호, API key를 입력하지 마세요.</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-x-4 gap-y-2"><span role="status">{ready===null?"AI 분석 연결을 확인하고 있습니다.":ready?"AI 분석을 사용할 수 있습니다.":"현재 AI 분석을 사용할 수 없습니다."}</span><span aria-live="polite" className={`inline-flex items-center gap-1.5 ${warning?"text-danger":"text-mint"}`}><CheckCircle2 className="h-4 w-4" aria-hidden="true"/>{warning?"저장 상태를 확인해 주세요.":lastSavedAt?"이 브라우저에 저장됨":"입력할 때 자동 저장됩니다."}</span></div>{ws.mode==="actual" && <Button variant="ghost" onClick={startSample}>예시로 둘러보기</Button>}</div></div>
    {warning && <p role="alert" className="text-danger">{warning}</p>}
  </div>;
}
