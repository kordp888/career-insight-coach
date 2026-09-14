import React from 'react';
import { Experience, ResumeTarget, UserProfile } from '../types';
import { Sparkles, FileEdit, ArrowRight, Copy, Check, FolderKanban, Trophy, ChevronRight } from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  experiences: Experience[];
  resumeTargets: ResumeTarget[];
  onOpenAiDigging: () => void;
  onOpenDirectInput: () => void;
  onSelectExperience: (exp: Experience) => void;
  onSelectTab: (tab: 'home' | 'archive' | 'mypage') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  experiences,
  onOpenAiDigging,
  onOpenDirectInput,
  onSelectExperience,
  onSelectTab,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopySummary = (exp: Experience, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `[${exp.title}]\n- 역할/기간: ${exp.teamAndRole} (${exp.startDate} ~ ${exp.endDate})\n- 과제: ${exp.taskOrGoal}\n- 핵심성과: ${exp.finalOutput}\n- 추천키워드: ${(exp.recommendedKeywords || []).join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(exp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate Tag Frequency
  const tagCounts: { [tag: string]: number } = {};
  experiences.forEach((exp) => {
    (exp.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* Hero Section: Editorial BPL Feature Card */}
      <section className="bg-white rounded-[18px] p-6 sm:p-10 border border-[#e5e5ea] shadow-xs relative overflow-hidden">

        {/* Subtle Background Accent Shape */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48526f]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#48526f]/5 rounded-full blur-3xl pointer-events-none -mb-20" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-4xl font-semibold tracking-tight text-[#1d1d1f] leading-tight">
            잊고 있던 소중한 경험을<br />
            <span className="text-[#48526f]">구조화된 직무 자산</span>으로 체계화하세요
          </h1>

          <p className="text-[#6e6e73] text-sm sm:text-base leading-relaxed font-normal">
            대화형 AI 인터뷰가 경험의 STAR 기법 요소(상황, 과제, 행동, 성과)와 핵심 역량 키워드를 자동으로 추출하여 자소서와 면접에 바로 활용할 수 있게 정리해 드립니다.
          </p>
        </div>

      </section>

      {/* Dual Entry Block Grid */}
      <section className="grid md:grid-cols-2 gap-6">

        {/* AI Digging Block */}
        <div className="bg-white rounded-[18px] p-6 sm:p-7 border border-[#e5e5ea] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#48526f] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-[#f5f5f7] text-[#1d1d1f] font-medium text-xs px-3 py-1 rounded-full border border-[#e5e5ea] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#48526f]" />
                <span>AI INTERVIEW MODE</span>
              </span>
              <span className="text-[11px] font-semibold text-white bg-[#cf6b64] px-2.5 py-0.5 rounded-full">추천</span>
            </div>

            <h2 className="text-xl font-semibold text-[#1d1d1f]">경험 발굴하기 (AI 대화)</h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed font-normal">
              친절한 AI 챗봇의 꼬리 질문에 답해보세요. 활동 내용, 사용한 기술, 해결한 난관, 정량적 결과까지 AI가 자연스럽게 정리해 드립니다.
            </p>
          </div>

          <button
            onClick={onOpenAiDigging}
            className="bg-[#48526f] hover:bg-[#3a425b] text-white w-full font-medium text-xs sm:text-sm py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-xs"
          >
            <span>AI 경험 발굴 시작</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Input Block */}
        <div className="bg-white rounded-[18px] p-6 sm:p-7 border border-[#e5e5ea] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#48526f] transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-[#f5f5f7] text-[#1d1d1f] font-medium text-xs px-3 py-1 rounded-full border border-[#e5e5ea] flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-[#6e6e73]" />
                <span>DIRECT FORM MODE</span>
              </span>
              <span className="text-[11px] font-medium text-[#6e6e73]">11가지 세부 항목</span>
            </div>

            <h2 className="text-xl font-semibold text-[#1d1d1f]">경험 정리하기 (직접 입력)</h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed font-normal">
              활동명, 기간, 팀 역할, 적용 지식, 최종 성과 등 11가지 세부 항목 양식에 맞춰 작성하세요. AI가 추천 키워드를 자동 보완해 줍니다.
            </p>
          </div>

          <button
            onClick={onOpenDirectInput}
            className="bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] border border-[#d1d1d6] w-full font-medium text-xs sm:text-sm py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>양식 직접 입력 열기</span>
            <ArrowRight className="w-4 h-4 text-[#6e6e73]" />
          </button>
        </div>

      </section>

      {/* Main Stats & Experiences Section */}
      <div className="space-y-6">

        {/* Competency Tags Dashboard */}
        <div className="bg-white rounded-[18px] p-6 border border-[#e5e5ea] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#48526f]" />
              <h3 className="font-semibold text-sm text-[#1d1d1f]">직무 역량 키워드 분포</h3>
            </div>
            <span className="text-xs bg-[#f5f5f7] text-[#1d1d1f] px-2.5 py-1 font-medium rounded-full border border-[#e5e5ea]">
              총 {experiences.length}개 기록됨
            </span>
          </div>

          {sortedTags.length === 0 ? (
            <p className="text-xs text-[#6e6e73] py-2">아직 등록된 직무 역량 태그가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {sortedTags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 bg-[#f5f5f7] border border-[#e5e5ea] px-3 py-1.5 rounded-full text-xs font-medium text-[#1d1d1f]"
                >
                  <span className="text-[#414b66]">#{tag}</span>
                  <span className="w-4 h-4 rounded-full bg-[#48526f] text-white text-[10px] flex items-center justify-center font-semibold">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Experiences List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-base text-[#1d1d1f] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#48526f]" />
              최근 구조화된 경험 목록
            </h3>
            <button
              onClick={() => onSelectTab('archive')}
              className="text-xs font-medium text-[#414b66] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>전체 아카이브 보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {experiences.length === 0 ? (
            <div className="bg-white rounded-[18px] p-8 border border-[#e5e5ea] text-center space-y-3 shadow-xs">
              <FolderKanban className="w-8 h-8 text-[#8e8e93] mx-auto" />
              <p className="text-[#1d1d1f] font-semibold text-sm">아직 등록된 경험이 없습니다.</p>
              <p className="text-xs text-[#6e6e73]">AI 대화로 첫 경험을 발굴해보세요!</p>
              <button
                onClick={onOpenAiDigging}
                className="bg-[#48526f] hover:bg-[#3a425b] text-white px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer shadow-xs"
              >
                AI 인터뷰 시작하기
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiences.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => onSelectExperience(exp)}
                  className="bg-white rounded-[18px] p-5 border border-[#e5e5ea] hover:border-[#48526f] transition-all cursor-pointer shadow-xs space-y-3 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-[#e5e5ea] pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]">
                            {exp.category}
                          </span>
                          <span className="text-[11px] text-[#8e8e93] font-normal">
                            {exp.startDate} ~ {exp.endDate}
                          </span>
                        </div>
                        <h4 className="font-semibold text-base text-[#1d1d1f] group-hover:text-[#414b66] transition-colors line-clamp-1">
                          {exp.title}
                        </h4>
                      </div>

                      <button
                        onClick={(e) => handleCopySummary(exp, e)}
                        className="p-2 rounded-full bg-[#f5f5f7] hover:bg-[#48526f] hover:text-white transition-colors text-[#6e6e73] shrink-0 cursor-pointer border border-[#e5e5ea]"
                        title="자소서용 요약 복사"
                      >
                        {copiedId === exp.id ? (
                          <Check className="w-4 h-4 text-[#48526f] group-hover:text-white" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-[#6e6e73] line-clamp-3 leading-relaxed bg-[#f5f5f7] p-3 rounded-[12px]">
                      {exp.summary || exp.finalOutput}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(exp.recommendedKeywords || []).slice(0, 4).map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#eeeff4] text-[#414b66] border border-[#d2d6e3]"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
