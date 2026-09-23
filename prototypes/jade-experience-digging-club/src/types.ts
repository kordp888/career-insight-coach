export type ExperienceCategory =
  | '인턴'
  | '공모전'
  | '팀프로젝트'
  | '동아리'
  | '개인프로젝트'
  | '아르바이트'
  | '기타';

export interface Experience {
  id: string;
  title: string; // 활동명
  category: ExperienceCategory; // 경험 활동 종류
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM 또는 "진행 중"
  taskOrGoal: string; // 과제 / 목표 또는 해결할 문제
  teamAndRole: string; // 참가자 / 팀 구성 & 나의 역할
  workDetails: string; // 수행 업무 내용 및 세부 과정
  knowledgeOrTheory: string; // 적용 지식 / 이론
  skillsUsed: string[]; // 적용 기술 / 도구 및 기술 적용 부분
  finalOutput: string; // 최종 결과물 내용 (정량적/정성적 성과)
  attitudeOrTrait: string; // 수행 과정에서 보여준 성향 및 태도
  tags: string[]; // 직무 역량 태그 (예: 기획, 개발, 디자인, 데이터분석)
  recommendedKeywords: string[]; // AI 추천 키워드 (자소서용)
  summary: string; // 한 줄 핵심 요약
  inputMethod: 'ai_chat' | 'direct';
  createdAt: string;
  updatedAt: string;
}

export interface EssayQuestion {
  id: string;
  questionText: string;
  maxLength?: number;
  matchedExperienceIds: string[];
  answerDraft?: string;
}

export interface ResumeTarget {
  id: string;
  companyName: string; // 기업명 (예: 네이버, 당근, 카카오)
  position: string; // 지원 직무 (예: 서비스 기획자, 프론트엔드 개발자)
  deadline: string; // 마감일시 (YYYY-MM-DDTHH:mm)
  jobUrl: string; // 채용 공고 링크
  questions: EssayQuestion[]; // 자소서 문항들
  pushNotificationEnabled: boolean; // D-1 알림 여부
  status: '작성중' | '제출완료' | '마감';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  targetJob: string;
  email: string;
  experienceGoalCount: number;
  notificationEmailEnabled: boolean;
  browserPushEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  extractedData?: Partial<Experience>;
}
