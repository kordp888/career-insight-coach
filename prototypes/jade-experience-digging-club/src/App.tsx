import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ArchiveView } from './components/ArchiveView';
import { MyPageView } from './components/MyPageView';
import { ExperienceDetailModal } from './components/ExperienceDetailModal';
import { AiDiggingModal } from './components/AiDiggingModal';
import { DirectInputModal } from './components/DirectInputModal';
import { AiDraftModal } from './components/AiDraftModal';
import { Experience, ResumeTarget, UserProfile } from './types';
import { INITIAL_EXPERIENCES, INITIAL_RESUME_TARGETS, INITIAL_USER_PROFILE } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'archive' | 'mypage'>('home');

  // Load state from localStorage or initial mock data
  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('digging_club_experiences') || localStorage.getItem('career_wave_experiences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EXPERIENCES;
  });

  const [resumeTargets, setResumeTargets] = useState<ResumeTarget[]>(() => {
    const saved = localStorage.getItem('digging_club_resumes') || localStorage.getItem('career_wave_resumes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_RESUME_TARGETS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('digging_club_profile') || localStorage.getItem('career_wave_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USER_PROFILE;
  });

  // Modal States
  const [isAiDiggingOpen, setIsAiDiggingOpen] = useState(false);
  const [isDirectInputOpen, setIsDirectInputOpen] = useState(false);
  const [selectedExperienceForDetail, setSelectedExperienceForDetail] = useState<Experience | null>(null);
  const [selectedExperienceForDraft, setSelectedExperienceForDraft] = useState<{
    exp: Experience;
    questionText?: string;
  } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('digging_club_experiences', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem('digging_club_resumes', JSON.stringify(resumeTargets));
  }, [resumeTargets]);

  useEffect(() => {
    localStorage.setItem('digging_club_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Handlers for Experiences
  const handleSaveNewExperience = (newExpData: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newExp: Experience = {
      ...newExpData,
      id: `exp-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setExperiences((prev) => [newExp, ...prev]);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Handlers for Resume Targets
  const handleAddResumeTarget = (target: ResumeTarget) => {
    setResumeTargets((prev) => [target, ...prev]);
  };

  const handleUpdateResumeTarget = (target: ResumeTarget) => {
    setResumeTargets((prev) => prev.map((t) => (t.id === target.id ? target : t)));
  };

  const handleDeleteResumeTarget = (id: string) => {
    setResumeTargets((prev) => prev.filter((t) => t.id !== id));
  };

  // Backup & Restore
  const handleResetData = () => {
    setExperiences(INITIAL_EXPERIENCES);
    setResumeTargets(INITIAL_RESUME_TARGETS);
    setUserProfile(INITIAL_USER_PROFILE);
    localStorage.removeItem('digging_club_experiences');
    localStorage.removeItem('digging_club_resumes');
    localStorage.removeItem('digging_club_profile');
    localStorage.removeItem('career_wave_experiences');
    localStorage.removeItem('career_wave_resumes');
    localStorage.removeItem('career_wave_profile');
  };

  const handleExportData = () => {
    const backupObj = {
      experiences,
      resumeTargets,
      userProfile,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digging_club_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.experiences && Array.isArray(parsed.experiences)) {
        setExperiences(parsed.experiences);
      }
      if (parsed.resumeTargets && Array.isArray(parsed.resumeTargets)) {
        setResumeTargets(parsed.resumeTargets);
      }
      if (parsed.userProfile) {
        setUserProfile(parsed.userProfile);
      }
      alert('데이터가 성공적으로 복원되었습니다.');
    } catch (e) {
      alert('유효하지 않은 백업 JSON 파일입니다.');
    }
  };

  const upcomingCount = resumeTargets.filter((r) => r.status !== '마감').length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans selection:bg-[#E2F952] selection:text-black flex flex-col">

      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiDigging={() => setIsAiDiggingOpen(true)}
        onOpenDirectInput={() => setIsDirectInputOpen(true)}
        experienceCount={experiences.length}
        upcomingDeadlineCount={upcomingCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <DashboardView
            userProfile={userProfile}
            experiences={experiences}
            resumeTargets={resumeTargets}
            onOpenAiDigging={() => setIsAiDiggingOpen(true)}
            onOpenDirectInput={() => setIsDirectInputOpen(true)}
            onSelectExperience={(exp) => setSelectedExperienceForDetail(exp)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveView
            experiences={experiences}
            onSelectExperience={(exp) => setSelectedExperienceForDetail(exp)}
            onOpenAiDigging={() => setIsAiDiggingOpen(true)}
            onOpenDirectInput={() => setIsDirectInputOpen(true)}
            onOpenAiDraftModal={(exp) => setSelectedExperienceForDraft({ exp })}
            onDeleteExperience={handleDeleteExperience}
          />
        )}

        {activeTab === 'mypage' && (
          <MyPageView
            userProfile={userProfile}
            onUpdateUserProfile={setUserProfile}
            resumeTargets={resumeTargets}
            onAddResumeTarget={handleAddResumeTarget}
            onUpdateResumeTarget={handleUpdateResumeTarget}
            onDeleteResumeTarget={handleDeleteResumeTarget}
            experiences={experiences}
            onOpenAiDraftModalWithTarget={(exp, qText) => setSelectedExperienceForDraft({ exp, questionText: qText })}
            onResetData={handleResetData}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/60 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-black">Career Wave</span>
            <span>© 2026 경험디깅클럽. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-black">홈</button>
            <button onClick={() => setActiveTab('archive')} className="hover:text-black">경험 아카이브</button>
            <button onClick={() => setActiveTab('mypage')} className="hover:text-black">마이페이지</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExperienceDetailModal
        experience={selectedExperienceForDetail}
        onClose={() => setSelectedExperienceForDetail(null)}
        onOpenAiDraftModal={(exp) => setSelectedExperienceForDraft({ exp })}
        onDeleteExperience={handleDeleteExperience}
      />

      <AiDiggingModal
        isOpen={isAiDiggingOpen}
        onClose={() => setIsAiDiggingOpen(false)}
        onSaveExperience={handleSaveNewExperience}
      />

      <DirectInputModal
        isOpen={isDirectInputOpen}
        onClose={() => setIsDirectInputOpen(false)}
        onSaveExperience={handleSaveNewExperience}
      />

      {selectedExperienceForDraft && (
        <AiDraftModal
          isOpen={!!selectedExperienceForDraft}
          onClose={() => setSelectedExperienceForDraft(null)}
          experience={selectedExperienceForDraft.exp}
          initialQuestionText={selectedExperienceForDraft.questionText}
        />
      )}

    </div>
  );
}
