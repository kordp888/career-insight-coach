import React, { useState } from 'react';
import { Experience } from '../types';
import { X, Sparkles, Copy, Check, RefreshCw, Send, BookOpen } from 'lucide-react';

interface AiDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience | null;
  initialQuestionText?: string;
}

export const AiDraftModal: React.FC<AiDraftModalProps> = ({
  isOpen,
  onClose,
  experience,
  initialQuestionText = '',
}) => {
  const [questionText, setQuestionText] = useState(
    initialQuestionText || '지원 직무와 관련된 핵심 성공 경험을 STAR 기법으로 서술해주세요. (800자 이내)'
  );
  const [draftResult, setDraftResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !experience) return null;

  const handleGenerateDraft = async () => {
    if (!questionText.trim()) {
      alert('자소서 문항 내용을 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setDraftResult('');

    try {
      const response = await fetch('/api/ai/draft-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          experience,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 초안 생성 실패');
      }

      const resData = await response.json();
      setDraftResult(resData.draft || '초안이 작성되었습니다.');
    } catch (error: any) {
      console.error('Draft error:', error);
      alert('초안 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto font-sans">
      <div
        className="bg-white/95 backdrop-blur-xl rounded-[18px] max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#e5e5ea] shadow-2xl p-6 sm:p-8 space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-3 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]">
                AI ESSAY GENERATOR
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f]">AI 자소서 초안 생성기</h2>
            <p className="text-xs text-[#6e6e73]">
              선택한 경험 [{experience.title}]을(를) 기반으로 자소서 질문에 딱 맞는 STAR 답변을 자동 작성합니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#8e8e93] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Experience Card Banner */}
        <div className="bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e5e5ea] space-y-1 text-xs">
          <span className="text-[10px] text-[#6e6e73] font-medium block uppercase">
            연동된 경험 아카이브
          </span>
          <p className="font-semibold text-sm text-[#1d1d1f]">{experience.title}</p>
          <p className="text-[#6e6e73]">{experience.summary || experience.finalOutput}</p>
        </div>

        {/* Question Prompt Input */}
        <div className="space-y-2 text-xs">
          <label className="text-xs font-medium text-[#1d1d1f] block">
            작성할 자소서 문항 내용 *
          </label>
          <textarea
            rows={2}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="지원할 기업의 자소서 문항을 입력하세요."
            className="w-full px-4 py-3 rounded-[12px] border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all resize-none"
          />

          <button
            onClick={handleGenerateDraft}
            disabled={isGenerating}
            className="w-full bg-[#48526f] hover:bg-[#3a425b] text-white font-medium text-xs sm:text-sm py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI가 STAR 초안을 작성 중입니다...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>AI 자소서 초안 생성 시작</span>
              </>
            )}
          </button>
        </div>

        {/* Draft Result Box */}
        {draftResult && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8e8e93] uppercase">
                생성된 자소서 초안
              </span>

              <button
                onClick={handleCopy}
                className="bg-[#f5f5f7] hover:bg-[#e5e5ea] text-[#414b66] font-medium text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 border border-[#d1d1d6] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사 완료!' : '초안 복사'}</span>
              </button>
            </div>

            <div className="bg-[#f5f5f7] p-5 rounded-[12px] text-xs sm:text-sm text-[#1d1d1f] leading-relaxed whitespace-pre-wrap border border-[#e5e5ea] max-h-80 overflow-y-auto font-sans">
              {draftResult}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#e5e5ea]">
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
