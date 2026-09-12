import { RefreshCw, PencilLine, TriangleAlert, Info } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";

export function LoadingCard({ message, lines = 3 }: { message: string; lines?: number }) {
  return (
    <div className="rounded-card border border-line bg-white p-6" role="status" aria-live="polite">
      <p className="text-[15px] font-semibold text-ink">{message}</p>
      <div className="mt-5 space-y-3" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="h-3.5 animate-pulse rounded-full bg-soft-blue" style={{ width: `${92 - i * 14}%` }} />
        ))}
      </div>
    </div>
  );
}

export function ErrorCard({ onAgain, onEdit }: { onAgain: () => void; onEdit?: () => void }) {
  return (
    <div className="rounded-card border border-danger/20 bg-soft-danger p-6" role="alert">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
        <div>
          <p className="font-semibold text-ink">분석 중 문제가 발생했습니다.</p>
          <p className="mt-1 text-[15px] text-ink-2">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={onAgain}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> 다시 시도
        </Button>
        {onEdit && (
          <Button variant="secondary" onClick={onEdit}>
            <PencilLine className="h-4 w-4" aria-hidden="true" /> 입력 수정
          </Button>
        )}
      </div>
    </div>
  );
}

export function UnavailableCard({ onSample }: { onSample: () => void }) {
  return (
    <div className="rounded-card border border-line bg-soft-orange p-6" role="status">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
        <div>
          <p className="font-semibold text-ink">현재 AI 분석을 사용할 수 없습니다.</p>
          <p className="mt-1 text-[15px] text-ink-2">예시 데이터로 흐름을 먼저 둘러보실 수 있습니다.</p>
        </div>
      </div>
      <Button className="mt-5" variant="secondary" onClick={onSample}>
        예시로 둘러보기
      </Button>
    </div>
  );
}

export function EmptyCard({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line-strong bg-canvas px-6 py-10 text-center">
      <p className="text-[17px] font-semibold text-ink">{title}</p>
      {desc && <p className="mt-2 max-w-sm text-[15px] text-ink-3">{desc}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
