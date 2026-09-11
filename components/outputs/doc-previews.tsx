/** 문서 모양 미리보기. 긴 예시 글 없이 형태만 보여준다. 모두 장식이므로 읽기 도구에서는 숨긴다. */

function Line({ w, tone = "bg-line" }: { w: string; tone?: string }) {
  return <div className={`h-2 rounded-full ${tone}`} style={{ width: w }} />;
}

export function ResumePreview() {
  return (
    <div aria-hidden="true" className="rounded-[14px] border border-line bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <div className="h-9 w-9 rounded-full bg-soft-blue" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 w-20 rounded-full bg-navy/80" />
          <Line w="45%" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-2 w-14 rounded-full bg-brand/70" />
        {["88%", "72%", "80%"].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <Line w={w} />
          </div>
        ))}
        <div className="h-2 w-12 rounded-full bg-brand/70 pt-1" />
        {["76%", "64%"].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <Line w={w} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LetterPreview() {
  return (
    <div aria-hidden="true" className="grid grid-cols-[1fr_38%] gap-2 rounded-[14px] border border-line bg-white p-4 shadow-soft">
      <div className="space-y-2">
        <div className="h-2.5 w-16 rounded-full bg-navy/80" />
        {["96%", "90%", "94%", "70%"].map((w, i) => <Line key={i} w={w} />)}
        <div className="pt-1" />
        {["92%", "84%", "60%"].map((w, i) => <Line key={i} w={w} />)}
      </div>
      <div className="space-y-2 rounded-[10px] bg-canvas p-2">
        {["bg-brand/60", "bg-mint/50", "bg-violet/50"].map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-[4px] ${c}`} />
            <Line w="70%" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioPreview() {
  return (
    <div aria-hidden="true" className="rounded-[14px] border border-line bg-white p-4 shadow-soft">
      <div className="h-2.5 w-24 rounded-full bg-navy/80" />
      <div className="mt-3 grid grid-cols-[1fr_42%] gap-3">
        <div className="flex aspect-[4/3] items-end justify-center overflow-hidden rounded-[10px] bg-soft-blue">
          <svg viewBox="0 0 80 40" className="w-3/4 text-brand/40" fill="currentColor">
            <path d="M0 40 L25 14 L42 30 L55 20 L80 40 Z" />
            <circle cx="60" cy="10" r="5" />
          </svg>
        </div>
        <div className="space-y-2.5">
          {["문제", "나의 판단", "결과"].map((t) => (
            <div key={t} className="space-y-1">
              <div className="h-1.5 w-8 rounded-full bg-brand/60" />
              <Line w="90%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
