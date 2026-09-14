import React, { useState } from 'react';
import { Experience, ExperienceCategory } from '../types';
import { X, Sparkles, Check, FileEdit, Zap, Plus, Trash2 } from 'lucide-react';

interface DirectInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExperience: (exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const DirectInputModal: React.FC<DirectInputModalProps> = ({
  isOpen,
  onClose,
  onSaveExperience,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExperienceCategory>('팀프로젝트');
  const [startDate, setStartDate] = useState('2024-03');
  const [endDate, setEndDate] = useState('2024-06');
  const [taskOrGoal, setTaskOrGoal] = useState('');
  const [teamAndRole, setTeamAndRole] = useState('');
  const [workDetails, setWorkDetails] = useState('');
  const [knowledgeOrTheory, setKnowledgeOrTheory] = useState('');
  const [skillsInput, setSkillsInput] = useState('Figma, React, SQL');
  const [finalOutput, setFinalOutput] = useState('');
  const [attitudeOrTrait, setAttitudeOrTrait] = useState('');
  const [tagsInput, setTagsInput] = useState('기획/PM, 데이터분석');
  const [summary, setSummary] = useState('');
  const [recommendedKeywords, setRecommendedKeywords] = useState<string[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  if (!isOpen) return null;

  const categories: ExperienceCategory[] = ['인턴', '공모전', '팀프로젝트', '동아리', '개인프로젝트', '아르바이트', '기타'];

  const handleAiAutoAnalyze = async () => {
    if (!title && !workDetails) {
      alert('활동명과 업무 내용을 최소한 일부 입력하신 후 AI 추천 키워드를 도출해 주세요.');
      return;
    }

    setIsAiAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceData: {
            title,
            category,
            taskOrGoal,
            teamAndRole,
            workDetails,
            knowledgeOrTheory,
            skillsInput,
            finalOutput,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('AI 분석 실패');
      }

      const resData = await response.json();

      if (resData.recommendedKeywords) {
        setRecommendedKeywords(resData.recommendedKeywords);
      }
      if (resData.tags && resData.tags.length > 0) {
        setTagsInput(resData.tags.join(', '));
      }
      if (resData.summary) {
        setSummary(resData.summary);
      }
      if (resData.attitudeOrTrait && !attitudeOrTrait) {
        setAttitudeOrTrait(resData.attitudeOrTrait);
      }
    } catch (error: any) {
      console.error('AI Analyze error:', error);
      alert('AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('활동명(제목)을 입력해주세요.');
      return;
    }

    const skillsUsed = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSaveExperience({
      title,
      category,
      startDate,
      endDate,
      taskOrGoal,
      teamAndRole,
      workDetails,
      knowledgeOrTheory,
      skillsUsed,
      finalOutput,
      attitudeOrTrait,
      tags: tags.length > 0 ? tags : ['직무역량'],
      recommendedKeywords: recommendedKeywords.length > 0 ? recommendedKeywords : ['경험구조화'],
      summary: summary || finalOutput || workDetails.slice(0, 80),
      inputMethod: 'direct',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-white/95 backdrop-blur-xl rounded-[18px] max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#e5e5ea] shadow-2xl p-6 sm:p-8 space-y-6 my-auto font-sans"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-3 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]">
                DIRECT FORM MODE
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f]">경험 정리하기 (직접 입력)</h2>
            <p className="text-xs text-[#6e6e73]">
              세부 11가지 항목 양식에 맞춰 작성하세요. 작성 후 AI가 추천 키워드를 자동 보완해 줍니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#8e8e93] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Keyword Auto Generator Banner */}
        <div className="bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-[#1d1d1f]">
              <Sparkles className="w-4 h-4 text-[#48526f]" />
              <span>AI 추천 키워드 & 요약 자동 생성</span>
            </div>
            <p className="text-xs text-[#6e6e73]">
              입력한 내용을 기반으로 AI가 자소서용 키워드와 1줄 핵심 요약을 만들어 줍니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAiAutoAnalyze}
            disabled={isAiAnalyzing}
            className="bg-[#48526f] hover:bg-[#3a425b] text-white font-medium text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shrink-0 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>{isAiAnalyzing ? 'AI 분석 중...' : 'AI 키워드 자동 도출'}</span>
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">

          {/* Row 1: Title & Category */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">활동명 (제목) *</label>
              <input
                type="text"
                required
                placeholder="예: 대학생 IT 커뮤니티 UX/UI 리뉴얼 프로젝트"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">경험 활동 종류 *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExperienceCategory)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Dates */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">시작월 *</label>
              <input
                type="month"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">종료월 *</label>
              <input
                type="text"
                required
                placeholder="YYYY-MM 또는 진행 중"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Row 3: Task/Goal & Team/Role */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">과제 / 목표 또는 해결할 문제</label>
              <textarea
                rows={2}
                placeholder="예: 앱 이탈률 40% 감소 및 리텐션 20% 향상 목표"
                value={taskOrGoal}
                onChange={(e) => setTaskOrGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">참가자 / 팀 구성 & 나의 역할</label>
              <textarea
                rows={2}
                placeholder="예: 5인 팀 (기획 1, 디자인 1, 개발 3) / 리드 PM 및 와이어프레임 설계"
                value={teamAndRole}
                onChange={(e) => setTeamAndRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Row 4: Work Details */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#1d1d1f]">수행 업무 내용 및 세부 과정 (Action) *</label>
            <textarea
              rows={4}
              required
              placeholder="예: 유저 15명 대상 심층 인터뷰 진행. Figma로 온보딩 화면 2단계 축소. 유저 테스트 후 A/B 테스팅 적용..."
              value={workDetails}
              onChange={(e) => setWorkDetails(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all"
            />
          </div>

          {/* Row 5: Knowledge & Skills */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">적용 지식 / 이론</label>
              <input
                type="text"
                placeholder="예: UT 방법론, Double Diamond 모델, SQL가공"
                value={knowledgeOrTheory}
                onChange={(e) => setKnowledgeOrTheory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">적용 기술 / 도구 (쉼표로 구분)</label>
              <input
                type="text"
                placeholder="예: Figma, React, GA4, SQL"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Row 6: Final Output & Attitude/Trait */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">최종 결과물 내용 (정량적/정성적 성과) *</label>
              <textarea
                rows={2}
                required
                placeholder="예: D1 리텐션 28% 달성, 이탈률 42% 감소, 전국 공모전 우수상 수상"
                value={finalOutput}
                onChange={(e) => setFinalOutput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">수행 과정에서 보여준 성향 및 태도</label>
              <textarea
                rows={2}
                placeholder="예: 데이터 기반의 문제 해결력, 갈등을 매끄럽게 푸는 소통 태도"
                value={attitudeOrTrait}
                onChange={(e) => setAttitudeOrTrait(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#e5e5ea] bg-[#f5f5f7] text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Tags & Keywords */}
          <div className="grid sm:grid-cols-2 gap-4 bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea]">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">직무 역량 태그 (쉼표로 구분)</label>
              <input
                type="text"
                placeholder="기획/PM, 데이터분석, UI/UX"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-white text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1d1d1f]">자소서용 1줄 핵심 요약</label>
              <input
                type="text"
                placeholder="AI 버튼 클릭 시 자동 도출되거나 직접 입력"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-white text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] transition-all"
              />
            </div>
          </div>

          {recommendedKeywords.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-[#1d1d1f] block">AI 추천 자소서 키워드:</span>
              <div className="flex flex-wrap gap-1.5">
                {recommendedKeywords.map((kw, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-[#eeeff4] text-[#414b66] border border-[#d2d6e3] font-medium">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submit Row */}
          <div className="flex items-center justify-end gap-3 border-t border-[#e5e5ea] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-medium border border-[#d1d1d6] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] cursor-pointer transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-full text-xs font-medium bg-[#48526f] hover:bg-[#3a425b] text-white transition-all shadow-xs cursor-pointer"
            >
              경험 아카이브 저장
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
