export const SITE = {
  name: "커리어코치",
  englishName: "AI Career Insight Coach",
  github: "https://github.com/kordp888/career-insight-coach",
  description:
    "산업·기업·직무를 분석하고 내 경험에서 인사이트를 찾아 이력서, 자기소개서, 포트폴리오로 정리하는 AI 커리어 코치.",
} as const;

export type StepKey = "industry" | "company" | "job" | "experience" | "connect" | "insight" | "output";

/** 제품 흐름. 산업·기업·직무를 먼저 이해한 다음에 경험을 본다. 순서를 바꾸지 않는다. */
export const STEPS: { key: StepKey; no: string; title: string; short: string; desc: string; href: string }[] = [
  { key: "industry", no: "01", title: "산업 분석", short: "산업", desc: "시장 구조와 주요 변화를 이해합니다.", href: "/coach/industry" },
  { key: "company", no: "02", title: "기업 분석", short: "기업", desc: "사업, 제품, 전략과 인재 방향을 살펴봅니다.", href: "/coach/company" },
  { key: "job", no: "03", title: "직무 분석", short: "직무", desc: "주요 업무와 필요한 역량을 정리합니다.", href: "/coach/job" },
  { key: "experience", no: "04", title: "경험 정리", short: "경험", desc: "내가 실제로 했던 행동과 판단을 구조화합니다.", href: "/coach/experience" },
  { key: "connect", no: "05", title: "역량 연결", short: "연결", desc: "직무가 요구하는 역량과 관련 경험을 연결합니다.", href: "/coach/connect" },
  { key: "insight", no: "06", title: "인사이트 발견", short: "인사이트", desc: "경험 속 반복되는 강점과 나만의 관점을 찾습니다.", href: "/coach/insight" },
  { key: "output", no: "07", title: "문서화", short: "결과", desc: "발견한 내용을 이력서·자소서·포트폴리오로 연결합니다.", href: "/coach/output" },
];

export function stepIndex(key: StepKey): number {
  return STEPS.findIndex((s) => s.key === key);
}

export const LEARNING_CONTEXT =
  "SeSAC AI PM 과정에서 학습한 문제정의, 산업·기업·직무 분석, 사용자 관점의 제품 설계 방법론을 바탕으로 개인적으로 확장 설계한 프로젝트입니다.";

export const LEARNING_CONTEXT_EN =
  "Inspired by methodologies learned through the SeSAC AI PM Program. Independently designed and developed.";

export const MY_ROLE = [
  "AI Product Planning",
  "Problem Definition",
  "Career UX Flow Design",
  "Prompt / Skill Product Design",
  "Prototype Planning",
] as const;

export const TRUST_NOTES = [
  "AI가 제안한 내용은 사용자가 직접 확인하고 수정할 수 있습니다.",
  "근거가 없는 성과나 수치는 직접 확인하기 전까지 사용하지 마세요.",
] as const;

export const DEMO_DISCLAIMER =
  "지원 전에 사실과 수치를 직접 확인하세요.";
