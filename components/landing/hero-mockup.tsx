import Image from "next/image";
import appIcon from "@/assets/app-icon.png";
import { ChartColumn, Building, FileText, UserRound, Lightbulb, FilePenLine, Check, ListChecks, Target, Link2, House } from "lucide-react";

const PROGRESS = [
  { label: "산업 분석", icon: ChartColumn, state: "done" },
  { label: "기업 분석", icon: Building, state: "done" },
  { label: "직무 분석", icon: FileText, state: "now" },
  { label: "경험 정리", icon: UserRound, state: "todo" },
  { label: "인사이트 발견", icon: Lightbulb, state: "todo" },
  { label: "문서화", icon: FilePenLine, state: "todo" },
] as const;

/** 히어로 오른쪽의 제품 화면. 실제 데모 화면의 축소판이며 장식이다. */
export function HeroMockup() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[640px] select-none">
      <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_24px_60px_rgba(20,50,90,0.12)]">
        <div className="flex items-center gap-1.5 border-b border-line bg-canvas px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6159]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c940]" />
          <div className="ml-3 h-5 flex-1 rounded-md bg-white" />
        </div>
        <div className="grid grid-cols-[132px_1fr] max-sm:grid-cols-1">
          <div className="border-r border-line bg-white p-3 max-sm:hidden">
            <div className="flex items-center gap-1.5"><Image src={appIcon} alt="" width={20} height={20} className="h-5 w-5 rounded-[5px]" /><div className="text-[10px] font-bold leading-tight text-navy">커리어코치</div></div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[10px] text-ink-3"><House className="h-3 w-3" />홈</div>
              {["산업 분석", "기업 분석", "직무 분석", "경험 정리", "인사이트", "결과"].map((l, i) => (
                <div key={l} className={`rounded-md px-1.5 py-1 text-[10px] ${i === 2 ? "bg-soft-blue font-semibold text-brand" : "text-ink-3"}`}>{l}</div>
              ))}
            </div>
          </div>
          <div className="bg-canvas p-4 sm:p-5">
            <p className="text-[15px] font-bold leading-snug text-navy sm:text-[17px]">
              안녕하세요.<br />어떤 커리어를 준비하고 계신가요?
            </p>
            <div className="mt-4 flex items-center justify-between gap-1">
              {PROGRESS.map(({ label, icon: Icon, state }) => (
                <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      state === "done" ? "bg-brand text-white" : state === "now" ? "bg-white text-brand ring-2 ring-brand" : "bg-white text-ink-3 ring-1 ring-line"
                    }`}
                  >
                    {state === "done" ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className={`truncate text-[9px] ${state === "now" ? "font-bold text-brand" : "text-ink-3"}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[14px] border border-line bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-navy">직무 분석</span>
                <span className="rounded-full bg-soft-blue px-2 py-0.5 text-[9px] font-semibold text-brand">진행 중</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { t: "핵심 역량", icon: Target, tone: "bg-soft-blue text-brand" },
                  { t: "주요 업무", icon: ListChecks, tone: "bg-soft-mint text-mint" },
                  { t: "내 경험 연결", icon: Link2, tone: "bg-soft-purple text-violet" },
                ].map(({ t, icon: Icon, tone }) => (
                  <div key={t} className="rounded-[10px] border border-line p-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-md ${tone}`}><Icon className="h-3.5 w-3.5" /></span>
                    <div className="mt-2 text-[10px] font-semibold text-ink">{t}</div>
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-line" />
                      <div className="h-1.5 w-2/3 rounded-full bg-line" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-14 -right-2 w-[132px] rounded-[26px] border-[5px] border-navy bg-white p-2 shadow-[0_20px_40px_rgba(20,50,90,0.18)] max-sm:hidden lg:-right-6 lg:w-[150px]">
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-navy/80" />
        <div className="flex items-center gap-1"><Image src={appIcon} alt="" width={16} height={16} className="h-4 w-4 rounded-[4px]" /><div className="text-[10px] font-bold leading-tight text-navy">커리어코치</div></div>
        <div className="mt-2 space-y-1.5">
          {["산업 분석", "기업 분석", "직무 분석", "경험 정리", "인사이트 발견", "문서화"].map((l, i) => (
            <div key={l} className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-[8.5px] ${i === 2 ? "border-brand/40 bg-soft-blue font-semibold text-brand" : "border-line text-ink-2"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${i < 2 ? "bg-brand" : i === 2 ? "bg-brand" : "bg-line-strong"}`} />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
