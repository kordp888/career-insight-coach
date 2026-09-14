import React, { useState, useRef, useEffect } from 'react';
import { Experience, ChatMessage } from '../types';
import { Sparkles, Send, X, Check, Bot, User, RefreshCw, Layers } from 'lucide-react';

interface AiDiggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExperience: (exp: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const INITIAL_AI_MESSAGE: ChatMessage = {
  id: 'msg-init',
  sender: 'ai',
  content: `안녕하세요! 잊혀진 취업 경험을 구체적으로 정리하는 경험디깅 봇입니다.

어떤 경험부터 이야기해 볼까요? 인턴, 동아리, 팀 프로젝트, 공모전, 혹은 알바나 개인 프로젝트도 좋습니다!

편하게 "작년 여름에 인턴을 했어" 나 "대학 다닐 때 커뮤니티 앱을 만들었어" 같이 떠오르는 경험을 말해 주세요!`,
  timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
};

export const AiDiggingModal: React.FC<AiDiggingModalProps> = ({
  isOpen,
  onClose,
  onSaveExperience,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AI_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Experience>>({
    category: '팀프로젝트',
    skillsUsed: [],
    tags: [],
    recommendedKeywords: [],
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    '작년에 팀 프로젝트로 웹 앱 개발했던 경험이 있어',
    '스타트업에서 마케팅/기획 인턴했던 경험 정리하고 싶어',
    '공모전에 나가서 수상했던 아이디어 프로젝트가 있어',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/digging-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ sender: m.sender, content: m.content })),
          currentData: extractedData,
        }),
      });

      if (!response.ok) {
        throw new Error('AI 응답 처리 중 오류가 발생했습니다.');
      }

      const resData = await response.json();

      const aiReplyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        content: resData.reply || '답변을 작성했습니다.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReplyMsg]);

      if (resData.updatedData) {
        setExtractedData((prev) => ({
          ...prev,
          ...resData.updatedData,
        }));
      }
    } catch (error: any) {
      console.error('AI chat error:', error);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 2}`,
        sender: 'ai',
        content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 말씀해 주세요!',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!extractedData.title) {
      alert('최소한 활동명(제목)이 도출된 후 저장할 수 있습니다. AI와 조금 더 이야기해보세요!');
      return;
    }

    onSaveExperience({
      title: extractedData.title || '신규 발굴 경험',
      category: extractedData.category || '기타',
      startDate: extractedData.startDate || '2024-01',
      endDate: extractedData.endDate || '2024-06',
      taskOrGoal: extractedData.taskOrGoal || '',
      teamAndRole: extractedData.teamAndRole || '',
      workDetails: extractedData.workDetails || '',
      knowledgeOrTheory: extractedData.knowledgeOrTheory || '',
      skillsUsed: extractedData.skillsUsed || [],
      finalOutput: extractedData.finalOutput || '',
      attitudeOrTrait: extractedData.attitudeOrTrait || '',
      tags: extractedData.tags || ['직무역량'],
      recommendedKeywords: extractedData.recommendedKeywords || [],
      summary: extractedData.summary || extractedData.finalOutput || '',
      inputMethod: 'ai_chat',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm font-sans">
      <div
        className="bg-white/95 backdrop-blur-xl rounded-[18px] max-w-6xl w-full h-[90vh] flex flex-col border border-[#e5e5ea] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Top Bar */}
        <div className="bg-white/80 p-4 sm:p-5 border-b border-[#e5e5ea] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] text-[#48526f] border border-[#e5e5ea] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#48526f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#1d1d1f]">AI 경험 발굴하기</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#414b66] font-medium border border-[#e5e5ea]">
                  AI 연결 대기
                </span>
              </div>
              <p className="text-xs text-[#6e6e73] font-normal">
                대화하듯 편하게 답변하면 AI가 경험을 11가지 세부 구조 항목으로 자동 추출해 드립니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="bg-[#48526f] hover:bg-[#3a425b] text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>경험 아카이브 저장</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#8e8e93] hover:text-[#1d1d1f] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Chat Body (Full Width) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">

          {/* Quick Prompts Banner */}
          <div className="bg-[#f5f5f7] p-3 border-b border-[#e5e5ea] overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0 text-xs font-medium text-[#1d1d1f]">
            <span className="text-[10px] uppercase shrink-0 text-[#8e8e93]">💡 추천 프롬프트:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-white hover:bg-[#e5e5ea] text-[#1d1d1f] px-3 py-1 rounded-full border border-[#d1d1d6] shrink-0 transition-all cursor-pointer font-normal"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 max-w-4xl mx-auto ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-[#1d1d1f] text-white'
                      : 'bg-[#f5f5f7] text-[#48526f] border border-[#e5e5ea]'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-[#48526f]" />}
                </div>

                <div className={`space-y-1 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`p-4 rounded-[18px] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#48526f] text-white font-normal'
                        : 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] font-normal'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[#8e8e93] block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#48526f] font-medium p-2 max-w-4xl mx-auto">
                <RefreshCw className="w-4 h-4 animate-spin text-[#48526f]" />
                <span>AI 경험 분석 엔진 작동 중...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-[#e5e5ea] bg-white flex items-center gap-2 shrink-0">
            <div className="max-w-4xl w-full mx-auto flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="답변 입력 (예: 팀장으로 가설 검증과 사용성 테스트를 주도했어)"
                className="flex-1 px-4 py-3 rounded-full bg-[#f5f5f7] border border-[#e5e5ea] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="bg-[#48526f] hover:bg-[#3a425b] text-white px-5 py-3 rounded-full text-xs font-medium flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
