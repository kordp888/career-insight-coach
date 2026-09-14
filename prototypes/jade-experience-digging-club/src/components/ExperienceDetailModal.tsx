import React, { useState } from 'react';
import { Experience } from '../types';
import { X, Copy, Check, Sparkles, Calendar, Users, Target, Wrench, BookOpen, Award, Heart, Tag, Edit3, Trash2 } from 'lucide-react';

interface ExperienceDetailModalProps {
  experience: Experience | null;
  onClose: () => void;
  onOpenAiDraftModal: (exp: Experience) => void;
  onDeleteExperience: (id: string) => void;
}

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  experience,
  onClose,
  onOpenAiDraftModal,
  onDeleteExperience,
}) => {
  const [copied, setCopied] = useState(false);

  if (!experience) return null;

  const handleCopyStarFormat = () => {
    const starText = `[경험 제목: ${experience.title}]
- 분류 및 기간: ${experience.category} (${experience.startDate} ~ ${experience.endDate})
- 팀 및 역할: ${experience.teamAndRole}

1. 과제 및 목표 (Situation & Task)
${experience.taskOrGoal}

2. 수행 업무 및 적용 기술 (Action)
${experience.workDetails}
- 적용 기술/도구: ${(experience.skillsUsed || []).join(', ')}
- 적용 지식/이론: ${experience.knowledgeOrTheory}
- 태도 및 성향: ${experience.attitudeOrTrait}

3. 최종 결과물 및 성과 (Result)
${experience.finalOutput}

4. AI 추천 키워드
${(experience.recommendedKeywords || []).join(', ')}`;

    navigator.clipboard.writeText(starText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto font-sans">
      <div
        className="bg-white/95 backdrop-blur-xl rounded-[18px] max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e5ea] shadow-2xl space-y-6 my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-[#e5e5ea] pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-3 py-0.5 rounded-full bg-[#1d1d1f] text-white">
                {experience.category}
              </span>
              <span className="text-xs text-[#8e8e93] flex items-center gap-1 font-normal">
                <Calendar className="w-3.5 h-3.5" />
                {experience.startDate} ~ {experience.endDate}
              </span>
              {experience.inputMethod === 'ai_chat' && (
                <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-[#cf6b64] text-white">
                  ✨ AI 발굴
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              {experience.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#8e8e93] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyStarFormat}
              className="bg-[#48526f] hover:bg-[#3a425b] text-white font-medium text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'STAR 양식 복사됨!' : 'STAR 양식 복사'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenAiDraftModal(experience);
              }}
              className="bg-white hover:bg-[#e5e5ea] text-[#414b66] font-medium text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all border border-[#d1d1d6] cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-[#48526f]" />
              <span>AI 자소서 초안 작성</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm('이 경험 항목을 삭제하시겠습니까?')) {
                onDeleteExperience(experience.id);
                onClose();
              }
            }}
            className="text-[#cf6b64] hover:text-[#be5a53] font-medium text-xs px-3 py-2 rounded-full flex items-center gap-1 hover:bg-[#faf0ef] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>삭제</span>
          </button>
        </div>

        {/* 11 Detailed Fields Display */}
        <div className="space-y-6 divide-y divide-[#e5e5ea] text-sm">

          {/* 1. Summary & Keywords */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#48526f]" />
              <span>AI 추천 핵심 요약 & 키워드</span>
            </h4>

            {experience.summary && (
              <p className="p-4 rounded-[12px] bg-[#f5f5f7] border border-[#e5e5ea] font-medium text-[#1d1d1f] leading-relaxed">
                "{experience.summary}"
              </p>
            )}

            <div className="flex flex-wrap gap-1.5">
              {(experience.recommendedKeywords || []).map((kw, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-[#eeeff4] text-[#414b66] border border-[#d2d6e3] font-medium"
                >
                  #{kw}
                </span>
              ))}
              {(experience.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-white border border-[#e5e5ea] text-[#1d1d1f] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 2. 과제 / 목표 / 해결할 문제 (Task or Goal) */}
          <div className="space-y-2 pt-4">
            <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#48526f]" />
              <span>과제 / 희망 목표 및 해결할 문제 (Situation & Task)</span>
            </h4>
            <p className="text-[#1d1d1f] leading-relaxed font-normal bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea]">
              {experience.taskOrGoal || '-'}
            </p>
          </div>

          {/* 3. 참가자 / 팀 구성 & 나의 역할 (Team & Role) */}
          <div className="space-y-2 pt-4">
            <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#48526f]" />
              <span>참가자 / 팀 구성 & 나의 역할</span>
            </h4>
            <p className="text-[#1d1d1f] leading-relaxed bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea]">
              {experience.teamAndRole || '-'}
            </p>
          </div>

          {/* 4. 업무 내용 및 세부 과정 (Work Details) */}
          <div className="space-y-2 pt-4">
            <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[#48526f]" />
              <span>수행 업무 내용 및 세부 과정 (Action)</span>
            </h4>
            <div className="text-[#1d1d1f] leading-relaxed whitespace-pre-wrap bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea]">
              {experience.workDetails || '-'}
            </div>
          </div>

          {/* 5. 적용 기술 및 이론 (Skills & Knowledge) */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#48526f]" />
                <span>적용 기술 및 도구</span>
              </h4>
              <div className="bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea] flex flex-wrap gap-1.5">
                {(experience.skillsUsed || []).length > 0 ? (
                  experience.skillsUsed.map((sk, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white text-[#1d1d1f] font-medium border border-[#e5e5ea]">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-[#8e8e93]">-</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#48526f]" />
                <span>적용 지식 / 이론</span>
              </h4>
              <p className="bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea] text-[#1d1d1f]">
                {experience.knowledgeOrTheory || '-'}
              </p>
            </div>
          </div>

          {/* 6. 최종 결과물 내용 (Final Output) */}
          <div className="space-y-2 pt-4">
            <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#48526f]" />
              <span>최종 결과물 내용 (정량적/정성적 성과) (Result)</span>
            </h4>
            <p className="text-[#1d1d1f] font-medium leading-relaxed bg-[#f5f5f7] border border-[#e5e5ea] p-4 rounded-[12px]">
              {experience.finalOutput || '-'}
            </p>
          </div>

          {/* 7. 수행 과정에서 보여준 성향 및 태도 (Attitude / Trait) */}
          <div className="space-y-2 pt-4">
            <h4 className="text-xs font-semibold text-[#8e8e93] uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#48526f]" />
              <span>수행 과정에서 보여준 성향 및 태도</span>
            </h4>
            <p className="text-[#1d1d1f] leading-relaxed bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea]">
              {experience.attitudeOrTrait || '-'}
            </p>
          </div>

        </div>

        {/* Footer Close Button */}
        <div className="pt-4 border-t border-[#e5e5ea] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#1d1d1f] font-medium text-xs px-6 py-2.5 rounded-full transition-all cursor-pointer border border-[#d1d1d6]"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
