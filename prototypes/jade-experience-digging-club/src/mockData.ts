import { Experience, ResumeTarget, UserProfile } from './types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "김취준",
  targetJob: "서비스 기획 / Product Owner",
  email: "chwijun.kim@example.com",
  experienceGoalCount: 8,
  notificationEmailEnabled: true,
  browserPushEnabled: true,
};

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    title: "대학생 IT 커뮤니티 앱 UX/UI 리뉴얼 프로젝트",
    category: "팀프로젝트",
    startDate: "2024-03",
    endDate: "2024-06",
    taskOrGoal: "기존 앱의 복잡한 온보딩과 게시글 탐색 저해 요인을 개선하여 D1 리텐션을 20% 이상 향상시키는 목표 설정",
    teamAndRole: "기획자 1명(본인), 디자이너 1명, 프론트엔드 2명, 백엔드 1명 / PM 및 리드 기획 역할 수행",
    workDetails: "사용자 15명 대상 정성 인터뷰 진행 및 페르소나 도출. Figma를 활용한 와이어프레임 작성, 온보딩 단계를 5단계에서 2단계로 축소하는 동선 개편, 유저 테스트를 통한 UX 사용성 검증",
    knowledgeOrTheory: "UT(User Testing) 방법론, Double Diamond 프로세스, 정보 구조도(IA) 설계 이론",
    skillsUsed: ["Figma", "GA4 유저 이탈 경로 분석", "Slack/Notion 협업"],
    finalOutput: "온보딩 이탈률 42% 감소, D1 리텐션 28% 달성 (목표 초과), 앱스토어 평점 3.8에서 4.6으로 상승",
    attitudeOrTrait: "데이터에 기반한 주도적 문제 해결력, 팀원 간 시각차를 조율하는 적극적 소통 역량",
    tags: ["기획/PM", "UI/UX", "데이터분석", "문제해결"],
    recommendedKeywords: ["사용자 인터뷰", "Figma 와이어프레임", "온보딩 이탈률 42% 감소", "리텐션 28% 향상", "데이터 기반 개선"],
    summary: "유저 인터뷰와 GA4 데이터를 바탕으로 온보딩 구조를 개편하여 D1 리텐션을 28% 향상시킨 IT 커뮤니티 앱 PM 경험",
    inputMethod: "ai_chat",
    createdAt: "2024-06-20T10:00:00Z",
    updatedAt: "2024-06-20T10:00:00Z",
  },
  {
    id: "exp-2",
    title: "스타트업 B2B SaaS 마케팅 & 서비스 기획 인턴",
    category: "인턴",
    startDate: "2024-07",
    endDate: "2024-12",
    taskOrGoal: "신규 고객 유입을 위한 랜딩페이지 A/B 테스트 및 B2B 리드 전환율 극대화",
    teamAndRole: "마케팅/기획팀 인턴 / 랜딩페이지 콘텐츠 기획 및 A/B 테스트 담당",
    workDetails: "기존 랜딩페이지의 CTA 버튼 위치 및 카피라이팅 변경. 3가지 변인으로 A/B 테스트 설계 후 4주간 관찰. 고객 맞춤형 B2B 제안서 템플릿 제작",
    knowledgeOrTheory: "A/B 테스팅 통계적 유의성 검증, 퍼널 분석(AARRR), B2B 세일즈 퍼널",
    skillsUsed: ["Amplitude", "Google Tag Manager", "SQL 데이터 추출"],
    finalOutput: "랜딩페이지 전환율(CVR) 3.2% -> 7.8%로 2.4배 상승, 월간 유망 리드(MQL) 120건 신규 확보",
    attitudeOrTrait: "성과 집착적 가설 검증 태도, 집요한 데이터 추적 능력",
    tags: ["기획/PM", "마케팅", "데이터분석", "성장/GTM"],
    recommendedKeywords: ["A/B 테스트", "AARRR 퍼널 분석", "전환율 2.4배 상승", "SQL 추출", "B2B 제안서"],
    summary: "랜딩페이지 A/B 테스팅과 CTA 최적화로 B2B 리드 전환율을 2.4배 개선한 마케팅/기획 인턴 경험",
    inputMethod: "direct",
    createdAt: "2024-12-15T14:30:00Z",
    updatedAt: "2024-12-15T14:30:00Z",
  },
  {
    id: "exp-3",
    title: "공공데이터 활용 AI 아이디어 공모전 (우수상 수상)",
    category: "공모전",
    startDate: "2024-01",
    endDate: "2024-02",
    taskOrGoal: "소상공인 상권 분석 및 상권 위험도 예측 AI 플랫폼 서비스 기획",
    teamAndRole: "팀장 (4인 팀) / 아이디어 발상, 데이터 가공 기획, 발표 자료 작성 및 모의 피칭",
    workDetails: "서울시 소상공인 매출 데이터와 유동인구 API를 결합한 상권 시각화 모델 기획. 상권 위험 지수 산출 로직 설계 및 멘토링 피드백 반영",
    knowledgeOrTheory: "빅데이터 가공 모델링, 공공 API 활용 알고리즘, SWOT 분석",
    skillsUsed: ["Python (Pandas)", "Tableau 시각화", "Pitch Deck 작성"],
    finalOutput: "전국 120개 팀 중 최종 3위 '우수상' 수상 (상금 200만원 및 시장 표창)",
    attitudeOrTrait: "한계를 뛰어넘는 도전 정신, 명확하고 설득력 있는 스토리텔링 리더십",
    tags: ["기획/PM", "공모전", "데이터분석", "AI/빅데이터"],
    recommendedKeywords: ["공공데이터 API", "Tableau 시각화", "우수상 수상", "상권 예측 알고리즘", "피칭 스토리텔링"],
    summary: "서울시 공공데이터를 가공한 소상공인 상권 분석 AI 모델을 기획하여 전국 공모전 우수상을 수상한 경험",
    inputMethod: "ai_chat",
    createdAt: "2024-02-28T09:00:00Z",
    updatedAt: "2024-02-28T09:00:00Z",
  }
];

export const INITIAL_RESUME_TARGETS: ResumeTarget[] = [
  {
    id: "res-1",
    companyName: "네이버 (NAVER)",
    position: "서비스 기획 / Product Manager 신입",
    deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), // 2일 뒤 마감
    jobUrl: "https://recruit.navercorp.com",
    pushNotificationEnabled: true,
    status: "작성중",
    createdAt: "2026-07-25T10:00:00Z",
    questions: [
      {
        id: "q-1",
        questionText: "데이터를 기반으로 문제를 정의하고 해결방안을 도출한 대표 경험을 작성해주세요. (1,000자 이내)",
        maxLength: 1000,
        matchedExperienceIds: ["exp-1", "exp-2"],
        answerDraft: "[데이터로 유저 이탈 원인을 찾고, D1 리텐션을 28% 향상시키다]\n\n대학생 IT 커뮤니티 프로젝트 추진 당시...",
      },
      {
        id: "q-2",
        questionText: "타인과의 협업 과정에서 시각 차이로 갈등이 발생했을 때, 이를 해결한 사례를 기술해주세요. (800자 이내)",
        maxLength: 800,
        matchedExperienceIds: ["exp-1"],
        answerDraft: "",
      }
    ]
  },
  {
    id: "res-2",
    companyName: "당근 (Karrot)",
    position: "서비스 기획자 (Product Owner) 신입/경력",
    deadline: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16), // 5일 뒤 마감
    jobUrl: "https://about.daangn.com/jobs",
    pushNotificationEnabled: true,
    status: "작성중",
    createdAt: "2026-07-26T11:00:00Z",
    questions: [
      {
        id: "q-3",
        questionText: "당근의 핵심 가치 중 본인과 가장 잘 맞는 경험을 구체적으로 서술해 주세요. (1,000자 이내)",
        maxLength: 1000,
        matchedExperienceIds: ["exp-2", "exp-3"],
        answerDraft: "",
      }
    ]
  }
];
