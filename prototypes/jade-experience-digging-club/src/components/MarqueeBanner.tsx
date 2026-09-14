import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MarqueeBannerProps {
  experienceCount: number;
  upcomingCount: number;
  onOpenAiDigging: () => void;
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  experienceCount,
  upcomingCount,
  onOpenAiDigging,
}) => {
  return (
    <div className="bg-[#FFFDF9] text-[#2E2219] text-xs py-2.5 px-4 overflow-hidden select-none border-b border-[#E8DEC8] shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 bg-[#F0F4E5] text-[#43501F] font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-[#D3DEB4]">
            <Sparkles className="w-3.5 h-3.5 text-[#6B7C32]" />
            BPL EXPERIENCES
          </span>
          <span className="text-[#2E2219] font-medium">
            구조화된 경험 자산: <strong className="text-[#6B7C32] font-bold">{experienceCount}개</strong>
          </span>
          <span className="text-[#E8DEC8]">|</span>
          <span className="text-[#2E2219] font-medium">
            지원 준비 자소서: <strong className="text-[#DF8888] font-bold">{upcomingCount}건</strong>
          </span>
          <span className="text-[#E8DEC8] hidden sm:inline">|</span>
          <span className="text-[#7D6555] hidden sm:inline text-xs">
            파편화된 경험을 STAR 구조화와 역량 키워드로 체계화합니다.
          </span>
        </div>

        <button
          onClick={onOpenAiDigging}
          className="hidden md:flex items-center gap-1.5 text-xs text-[#6B7C32] hover:text-[#5A6929] font-bold shrink-0 cursor-pointer"
        >
          <span>AI 인터뷰 발굴 시작</span>
          <div className="w-5 h-5 rounded-full bg-[#6B7C32] text-white flex items-center justify-center text-[10px]">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </div>
  );
};
