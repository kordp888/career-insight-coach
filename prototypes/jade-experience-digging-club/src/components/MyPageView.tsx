import React, { useState } from 'react';
import { UserProfile, ResumeTarget, Experience, EssayQuestion } from '../types';
import { UserCheck, Bell, Plus, ExternalLink, Calendar, Building2, Trash2, Download, Upload, RefreshCw, Sparkles, User } from 'lucide-react';

interface MyPageViewProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  resumeTargets: ResumeTarget[];
  onAddResumeTarget: (target: ResumeTarget) => void;
  onUpdateResumeTarget: (target: ResumeTarget) => void;
  onDeleteResumeTarget: (id: string) => void;
  experiences: Experience[];
  onOpenAiDraftModalWithTarget: (exp: Experience, questionText: string) => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  userProfile,
  onUpdateUserProfile,
  resumeTargets,
  onAddResumeTarget,
  onUpdateResumeTarget,
  onDeleteResumeTarget,
  experiences,
  onOpenAiDraftModalWithTarget,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(userProfile);

  // New Application Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [deadline, setDeadline] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [questionInput, setQuestionInput] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleCreateResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !position || !deadline) {
      alert('기업명, 지원 직무, 마감일은 필수 항목입니다.');
      return;
    }

    const questionTexts = questionInput
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    const questions: EssayQuestion[] = questionTexts.map((text, idx) => ({
      id: `q-${Date.now()}-${idx}`,
      questionText: text,
      matchedExperienceIds: [],
      answerDraft: '',
    }));

    const newTarget: ResumeTarget = {
      id: `res-${Date.now()}`,
      companyName,
      position,
      deadline,
      jobUrl,
      questions: questions.length > 0 ? questions : [
        {
          id: `q-${Date.now()}-0`,
          questionText: '지원 동기 및 직무를 위해 노력한 경험을 서술해주세요.',
          matchedExperienceIds: [],
          answerDraft: '',
        }
      ],
      pushNotificationEnabled: true,
      status: '작성중',
      createdAt: new Date().toISOString(),
    };

    onAddResumeTarget(newTarget);
    setCompanyName('');
    setPosition('');
    setDeadline('');
    setJobUrl('');
    setQuestionInput('');
    setShowAddModal(false);
  };

  const handleTogglePush = (target: ResumeTarget) => {
    const updated = {
      ...target,
      pushNotificationEnabled: !target.pushNotificationEnabled,
    };
    onUpdateResumeTarget(updated);
  };

  const handleToggleStatus = (target: ResumeTarget) => {
    const nextStatus = target.status === '작성중' ? '제출완료' : '작성중';
    onUpdateResumeTarget({ ...target, status: nextStatus });
  };

  const handleTestNotification = (companyName: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`[경험 디깅 클럽] D-1 공고 마감 알림`, {
        body: `${companyName} 서류 제출 마감까지 24시간 남았습니다. 작성 중인 자소서를 확인해보세요!`,
      });
    } else if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(`[경험 디깅 클럽] D-1 공고 마감 알림`, {
            body: `${companyName} 서류 제출 마감까지 24시간 남았습니다.`,
          });
        } else {
          alert(`🔔 [알림 가상 테스트]\n${companyName} 서류 제출 마감 D-1 알림이 전송되었습니다!`);
        }
      });
    } else {
      alert(`🔔 [알림 가상 테스트]\n${companyName} 서류 제출 마감 D-1 알림이 전송되었습니다!`);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">

      {/* Top Header */}
      <div className="bg-white rounded-[18px] p-6 sm:p-8 border border-[#e5e5ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#e5e5ea]">
            <UserCheck className="w-4 h-4 text-[#48526f]" />
            <span>마이페이지 & 자소서 일정 관리</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            프로필 & 서류 관리
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-normal">
            기본 프로필 설정, 지원 자소서 일정 등록, 마감 D-1 알림 및 데이터 관리
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#48526f] hover:bg-[#3a425b] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>지원 자소서 등록</span>
          </button>
        </div>
      </div>

      {/* Profile Management Card */}
      <div className="bg-white rounded-[18px] p-6 border border-[#e5e5ea] space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#48526f]" />
              <h2 className="font-semibold text-base text-[#1d1d1f]">
                내 기본 프로필
              </h2>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-xs font-medium text-[#414b66] hover:underline cursor-pointer"
              >
                프로필 수정
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#1d1d1f]">이름</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#1d1d1f]">목표 지원 직무</label>
                  <input
                    type="text"
                    value={profileForm.targetJob}
                    onChange={(e) => setProfileForm({ ...profileForm, targetJob: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-[#1d1d1f]">이메일</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-[#1d1d1f]">목표 경험 저장 수</label>
                  <input
                    type="number"
                    value={profileForm.experienceGoalCount}
                    onChange={(e) => setProfileForm({ ...profileForm, experienceGoalCount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium border border-[#d1d1d6] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-[#48526f] hover:bg-[#3a425b] text-white px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer"
                >
                  저장하기
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-4 bg-[#f5f5f7] p-5 rounded-[12px] border border-[#e5e5ea]">
                <div>
                  <span className="text-xs text-[#8e8e93] font-medium block mb-1">구직자 이름</span>
                  <span className="font-semibold text-base text-[#1d1d1f]">{userProfile.name}</span>
                </div>
                <div>
                  <span className="text-xs text-[#8e8e93] font-medium block mb-1">희망 직무</span>
                  <span className="font-semibold text-base text-[#1d1d1f]">{userProfile.targetJob}</span>
                </div>
                <div>
                  <span className="text-xs text-[#8e8e93] font-medium block mb-1">연락용 이메일</span>
                  <span className="font-medium text-[#1d1d1f]">{userProfile.email}</span>
                </div>
                <div>
                  <span className="text-xs text-[#8e8e93] font-medium block mb-1">구조화 경험 달성도</span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 bg-[#e5e5ea] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#48526f] h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (experiences.length / (userProfile.experienceGoalCount || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="font-semibold text-[#1d1d1f] text-xs">
                      {experiences.length} / {userProfile.experienceGoalCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup & Restore Bar */}
          <div className="pt-4 border-t border-[#e5e5ea] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={onExportData}
                className="px-3.5 py-2 rounded-full bg-[#f5f5f7] border border-[#e5e5ea] font-medium text-[#1d1d1f] hover:bg-[#e5e5ea] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#48526f]" />
                <span>백업 다운로드 (JSON)</span>
              </button>

              <label className="px-3.5 py-2 rounded-full bg-[#f5f5f7] border border-[#e5e5ea] font-medium text-[#1d1d1f] hover:bg-[#e5e5ea] flex items-center gap-1.5 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-[#48526f]" />
                <span>복원하기</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          onImportData(event.target.result as string);
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </label>
            </div>

            <button
              onClick={() => {
                if (confirm('샘플 데이터로 초기화하시겠습니까? (현재 작성된 내용이 재설정됩니다)')) {
                  onResetData();
                }
              }}
              className="text-[#8e8e93] hover:text-[#cf6b64] font-medium flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>샘플 데이터 초기화</span>
            </button>
          </div>

        </div>

      {/* Resume Applications List Section */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-[18px] border border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] flex items-center justify-center font-medium">
              <Building2 className="w-5 h-5 text-[#48526f]" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-[#1d1d1f]">
                지원 자소서 및 마감 현황
              </h2>
              <p className="text-xs text-[#6e6e73]">
                기업별 자소서 문항 관리 및 D-1 마감 알림
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#48526f] hover:bg-[#3a425b] text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>지원 자소서 등록</span>
          </button>
        </div>

        {resumeTargets.length === 0 ? (
          <div className="bg-white rounded-[18px] p-10 text-center border border-[#e5e5ea] space-y-3 shadow-xs">
            <p className="text-[#6e6e73] font-medium text-sm">등록된 지원 자소서가 없습니다.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#48526f] hover:bg-[#3a425b] text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-xs transition-all cursor-pointer"
            >
              첫 자소서 등록하기
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {resumeTargets.map((target) => (
              <div
                key={target.id}
                className="bg-white rounded-[18px] p-6 border border-[#e5e5ea] shadow-xs space-y-4"
              >
                {/* Application Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[#e5e5ea] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base text-[#1d1d1f]">{target.companyName}</span>
                      <button
                        onClick={() => handleToggleStatus(target)}
                        className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                          target.status === '제출완료'
                            ? 'bg-[#1d1d1f] text-white'
                            : 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea]'
                        }`}
                      >
                        {target.status}
                      </button>
                    </div>
                    <p className="text-xs text-[#6e6e73] font-medium mt-0.5">{target.position}</p>
                  </div>

                  <button
                    onClick={() => onDeleteResumeTarget(target.id)}
                    className="p-1.5 text-[#8e8e93] hover:text-[#cf6b64] hover:bg-[#faf0ef] rounded-full transition-colors cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Deadline & Push Notification Row */}
                <div className="bg-[#f5f5f7] p-3 rounded-[12px] border border-[#e5e5ea] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#48526f]" />
                    <div>
                      <span className="text-[10px] text-[#8e8e93] block font-medium">마감일시</span>
                      <span className="font-medium text-[#1d1d1f] text-xs">{target.deadline.replace('T', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestNotification(target.companyName)}
                      className="text-[11px] font-medium text-[#414b66] hover:underline cursor-pointer"
                    >
                      D-1 알림 테스트
                    </button>

                    <button
                      onClick={() => handleTogglePush(target)}
                      className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        target.pushNotificationEnabled
                          ? 'bg-[#48526f] text-white border-[#48526f]'
                          : 'bg-white text-[#6e6e73] border-[#e5e5ea]'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{target.pushNotificationEnabled ? 'D-1 ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

                {/* Essay Questions List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-[#1d1d1f] uppercase tracking-wider block">
                    자소서 문항 ({target.questions.length})
                  </span>

                  <div className="space-y-2">
                    {target.questions.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        className="bg-[#f5f5f7] p-3.5 rounded-[12px] space-y-2 text-xs border border-[#e5e5ea]"
                      >
                        <p className="font-medium text-[#1d1d1f] leading-snug">
                          Q{idx + 1}. {q.questionText}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e5e5ea]">
                          <span className="text-[10px] font-medium text-[#6e6e73]">
                            매칭된 경험: {q.matchedExperienceIds.length}개
                          </span>

                          <button
                            onClick={() => {
                              if (experiences.length > 0) {
                                onOpenAiDraftModalWithTarget(experiences[0], q.questionText);
                              } else {
                                alert('먼저 경험 아카이브에 하나 이상의 경험을 등록해주세요.');
                              }
                            }}
                            className="bg-[#faf0ef] hover:bg-[#cf6b64] text-[#cf6b64] hover:text-white border border-[#f3d5d3] text-[11px] font-medium px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI 자소서 초안 생성</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                {target.jobUrl && (
                  <div className="pt-2 border-t border-[#e5e5ea] flex justify-end">
                    <a
                      href={target.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-xs text-[#414b66] hover:underline flex items-center gap-1"
                    >
                      <span>채용 공고 페이지 바로가기</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Resume Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-sans">
          <div className="bg-white/95 backdrop-blur-xl rounded-[18px] max-w-lg w-full p-6 space-y-5 border border-[#e5e5ea] shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-3">
              <h3 className="text-base font-semibold text-[#1d1d1f]">신규 지원 자소서 등록</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#6e6e73] hover:text-[#1d1d1f] font-medium p-1 rounded-full hover:bg-[#f5f5f7] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResume} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-medium text-[#1d1d1f]">기업명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 네이버, 카카오, 당근"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#1d1d1f]">지원 직무 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 서비스 기획 / PM"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#1d1d1f]">서류 마감 일시 *</label>
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#1d1d1f]">채용 공고 링크 (URL)</label>
                <input
                  type="url"
                  placeholder="https://recruit.company.com"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[#1d1d1f]">자소서 문항 (줄바꿈으로 구분)</label>
                <textarea
                  rows={3}
                  placeholder="예:&#10;1. 지원동기 및 직무 준비과정&#10;2. 문제해결 경험"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[12px] border border-[#e5e5ea] bg-[#f5f5f7] text-xs sm:text-sm font-normal text-[#1d1d1f] outline-none focus:border-[#48526f] focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-medium border border-[#d1d1d6] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-[#48526f] hover:bg-[#3a425b] text-white px-5 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
