import React, { useState } from 'react';
import { Sparkles, Plus, Home, BookmarkCheck, UserCheck, ChevronDown, FileText, Compass } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'archive' | 'mypage';
  setActiveTab: (tab: 'home' | 'archive' | 'mypage') => void;
  onOpenAiDigging: () => void;
  onOpenDirectInput: () => void;
  experienceCount: number;
  upcomingDeadlineCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiDigging,
  onOpenDirectInput,
  experienceCount,
  upcomingDeadlineCount,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#e5e5ea] transition-all">

      {/* Primary Header Surface */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">

          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#48526f] flex items-center justify-center text-white font-semibold shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            <span className="font-semibold text-base sm:text-lg tracking-tight text-[#1d1d1f]">
              경험 디깅 클럽
            </span>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-normal">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#1d1d1f] text-white font-medium'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>홈</span>
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'archive'
                  ? 'bg-[#1d1d1f] text-white font-medium'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>경험 아카이브</span>
              {experienceCount > 0 && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ml-0.5 ${
                  activeTab === 'archive' ? 'bg-white/20 text-white' : 'bg-[#e5e5ea] text-[#1d1d1f]'
                }`}>
                  {experienceCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('mypage')}
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'mypage'
                  ? 'bg-[#1d1d1f] text-white font-medium'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>마이페이지</span>
            </button>
          </nav>

          {/* Right Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#48526f] hover:bg-[#3a425b] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer active:scale-98 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>새 경험 디깅</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-[18px] border border-[#e5e5ea] shadow-2xl z-20 p-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAiDigging();
                    }}
                    className="w-full text-left p-3 rounded-[12px] bg-[#f5f5f7] hover:bg-[#eeeff4] text-[#1d1d1f] hover:text-[#414b66] transition-all flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#48526f] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#1d1d1f] group-hover:text-[#414b66]">
                        <span>AI 인터뷰 발굴</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#cf6b64] text-white font-semibold rounded-full">
                          추천
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73] mt-0.5 leading-snug font-normal">
                        AI 대화로 잊고 있던 취업 경험의 STAR 핵심 요소 캐내기
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenDirectInput();
                    }}
                    className="w-full text-left p-3 rounded-[12px] bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] transition-all flex items-start gap-3 cursor-pointer border border-[#e5e5ea]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#e5e5ea] text-[#1d1d1f] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#1d1d1f]">
                        <span>직접 양식 입력</span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73] mt-0.5 leading-snug font-normal">
                        11가지 세부 항목 작성 양식으로 직접 등록하기
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around bg-white/90 text-[#1d1d1f] py-2 px-2 border-t border-[#e5e5ea] text-xs font-medium">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'home' ? 'bg-[#1d1d1f] text-white font-medium' : 'text-[#6e6e73]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>홈</span>
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'archive' ? 'bg-[#1d1d1f] text-white font-medium' : 'text-[#6e6e73]'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>아카이브 ({experienceCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('mypage')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'mypage' ? 'bg-[#1d1d1f] text-white font-medium' : 'text-[#6e6e73]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>마이페이지</span>
        </button>
      </div>

    </header>
  );
};
