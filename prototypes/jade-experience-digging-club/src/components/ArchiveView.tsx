import React, { useState, useMemo } from 'react';
import { Experience, ExperienceCategory } from '../types';
import { Search, Sparkles, Copy, Check, Trash2, Layers, ChevronRight, Plus } from 'lucide-react';

interface ArchiveViewProps {
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
  onOpenAiDigging: () => void;
  onOpenDirectInput: () => void;
  onOpenAiDraftModal: (exp: Experience) => void;
  onDeleteExperience: (id: string) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  experiences,
  onSelectExperience,
  onOpenAiDigging,
  onOpenDirectInput,
  onOpenAiDraftModal,
  onDeleteExperience,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all unique tags across experiences
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    experiences.forEach((exp) => {
      (exp.tags || []).forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [experiences]);

  // Categories list
  const categories: ExperienceCategory[] = ['인턴', '공모전', '팀프로젝트', '동아리', '개인프로젝트', '아르바이트', '기타'];

  // Filtered Experiences
  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      const matchesSearch =
        searchTerm === '' ||
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.workDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.taskOrGoal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.recommendedKeywords || []).some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (exp.skillsUsed || []).some((sk) => sk.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTag = selectedTag === 'ALL' || (exp.tags || []).includes(selectedTag);
      const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;

      return matchesSearch && matchesTag && matchesCategory;
    });
  }, [experiences, searchTerm, selectedTag, selectedCategory]);

  const handleCopyStar = (exp: Experience, e: React.MouseEvent) => {
    e.stopPropagation();
    const starText = `[경험 제목: ${exp.title}]
- 활동 기간: ${exp.startDate} ~ ${exp.endDate} (${exp.category})
- 팀 및 역할: ${exp.teamAndRole}

[S - Situation & Task (상황 및 과제)]
${exp.taskOrGoal}

[A - Action (수행 과정 및 내 역할)]
${exp.workDetails}
- 적용 기술/도구: ${(exp.skillsUsed || []).join(', ')}
- 적용 지식/이론: ${exp.knowledgeOrTheory}
- 태도 및 성향: ${exp.attitudeOrTrait}

[R - Result (최종 결과 및 성과)]
${exp.finalOutput}

[추천 핵심 키워드]
${(exp.recommendedKeywords || []).join(', ')}`;

    navigator.clipboard.writeText(starText);
    setCopiedId(exp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">

      {/* Header Banner */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#f5f5f7] text-[#1d1d1f] px-3 py-1 rounded-full border border-[#e5e5ea]">
            <Layers className="w-3.5 h-3.5 text-[#48526f]" />
            <span>경험 자산 라이브러리</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            나의 구조화된 경험 아카이브
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-normal">
            직무 역량별, 키워드별로 구조화된 경험을 검색하고, AI 자소서 작성 및 면접 준비에 활용하세요.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAiDigging}
            className="bg-[#48526f] hover:bg-[#3a425b] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>AI 발굴하기</span>
          </button>
          <button
            onClick={onOpenDirectInput}
            className="bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] border border-[#d1d1d6] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-[#6e6e73]" />
            <span>직접 입력</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-[18px] p-5 sm:p-6 border border-[#e5e5ea] space-y-4 shadow-xs">

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8e93]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="활동명, 사용 기술, 키워드, 세부 내용 검색..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f5f5f7] border border-[#e5e5ea] text-xs sm:text-sm text-[#1d1d1f] outline-none font-normal placeholder:text-[#8e8e93] focus:border-[#48526f] focus:bg-white transition-all"
          />
        </div>

        {/* Competency Tags Filter Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wider block">
            직무 역량 태그 필터
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTag('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedTag === 'ALL'
                  ? 'bg-[#48526f] text-white shadow-xs'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] hover:bg-[#e5e5ea]'
              }`}
            >
              전체 ({experiences.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#48526f] text-white shadow-xs'
                    : 'bg-[#eeeff4] text-[#414b66] border border-[#d2d6e3] hover:bg-[#e5e5ea]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-1.5 pt-3 border-t border-[#e5e5ea]">
          <span className="text-[11px] font-medium text-[#8e8e93] uppercase tracking-wider block">
            카테고리 필터
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] hover:bg-[#e5e5ea]'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] hover:bg-[#e5e5ea]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Experience List / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-normal text-[#6e6e73] px-1">
          <span>검색 결과: 총 {filteredExperiences.length}개의 경험</span>
          <span className="text-[#414b66]">카드 클릭 시 11가지 세부 항목 조회</span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="bg-white rounded-[18px] p-10 text-center border border-[#e5e5ea] space-y-3 shadow-xs">
            <p className="text-[#1d1d1f] font-semibold text-sm">
              조건에 일치하는 경험이 없습니다.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('ALL');
                setSelectedCategory('ALL');
              }}
              className="text-xs font-medium text-[#414b66] underline cursor-pointer"
            >
              필터 초기화하기
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                onClick={() => onSelectExperience(exp)}
                className="bg-white rounded-[18px] p-5 sm:p-6 border border-[#e5e5ea] hover:border-[#48526f] transition-all cursor-pointer shadow-xs flex flex-col justify-between space-y-4 group"
              >
                {/* Top Badge & Date */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 border-b border-[#e5e5ea] pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]">
                        {exp.category}
                      </span>
                      {exp.inputMethod === 'ai_chat' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#cf6b64] text-white">
                          ✨ AI 발굴
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[#8e8e93] font-normal">
                      {exp.startDate} ~ {exp.endDate}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-[#1d1d1f] group-hover:text-[#414b66] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed bg-[#f5f5f7] p-3 rounded-[12px] line-clamp-3">
                    {exp.summary || exp.finalOutput}
                  </p>
                </div>

                {/* Key Fields Snippet */}
                <div className="space-y-1 text-xs text-[#6e6e73]">
                  <div className="flex items-start gap-1">
                    <span className="font-semibold text-[#1d1d1f] shrink-0">역할:</span>
                    <span className="line-clamp-1">{exp.teamAndRole}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="font-semibold text-[#1d1d1f] shrink-0">기술:</span>
                    <span className="line-clamp-1">{exp.skillsUsed?.join(', ') || '-'}</span>
                  </div>
                </div>

                {/* Keywords & Quick Action Row */}
                <div className="pt-3 border-t border-[#e5e5ea] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 overflow-hidden max-h-6">
                    {(exp.recommendedKeywords || []).slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#eeeff4] text-[#414b66] border border-[#d2d6e3]"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => handleCopyStar(exp, e)}
                      className="p-2 rounded-full bg-[#f5f5f7] hover:bg-[#48526f] hover:text-white text-[#6e6e73] transition-colors cursor-pointer border border-[#e5e5ea]"
                      title="STAR 구조로 전체 복사"
                    >
                      {copiedId === exp.id ? (
                        <Check className="w-3.5 h-3.5 text-[#48526f] group-hover:text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAiDraftModal(exp);
                      }}
                      className="p-2 rounded-full bg-[#faf0ef] hover:bg-[#cf6b64] text-[#cf6b64] hover:text-white transition-colors border border-[#f3d5d3] cursor-pointer"
                      title="AI 자소서 초안 작성"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('이 경험을 정말 삭제하시겠습니까?')) {
                          onDeleteExperience(exp.id);
                        }
                      }}
                      className="p-2 rounded-full bg-[#f5f5f7] hover:bg-[#cf6b64] text-[#6e6e73] hover:text-white transition-colors cursor-pointer border border-[#e5e5ea]"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
