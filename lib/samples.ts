/**
 * 예시 데이터. 실제 인물·기업·수치가 아니다.
 * 퍼센트, 매출, 사용자 수 같은 숫자를 넣지 않는다.
 */
import type {
  CompanyResult, ExperienceAnswers, ExperiencePart, IndustryResult, InsightResult,
  JobResult, PortfolioBlocks, Target,
} from "./types";

export const SAMPLE_PERSON = "김지연";

export const SAMPLE_TARGET: Target = {
  role: "AI Product Manager",
  company: "Sample Labs",
  industry: "B2B SaaS",
};

export const SAMPLE_INDUSTRY: IndustryResult = {
  structure: "여러 팀이 함께 쓰는 업무 도구를 구독형으로 제공하는 시장입니다.",
  changes: [
    "AI 기능이 독립 제품보다 기존 업무 흐름 안으로 통합",
    "자동화보다 실제 업무 효율 개선이 중요",
    "제품 사용 데이터 기반 개선 중요성 증가",
  ],
  impact: "AI 기능을 따로 만드는 능력보다 사용자의 업무 흐름 안에서 문제를 찾는 능력이 더 중요해집니다.",
  details: [
    "구매자와 실제 사용자가 다른 경우가 많아, 두 쪽의 문제를 함께 봐야 합니다.",
    "도입보다 계속 쓰게 만드는 일이 제품의 과제가 됩니다.",
  ],
};

export const SAMPLE_COMPANY: CompanyResult = {
  overview: "업무 데이터를 기반으로 팀의 반복 업무를 줄이는 B2B SaaS 기업(가상)",
  business: "여러 팀이 함께 쓰는 업무 도구를 구독형으로 제공한다고 가정합니다.",
  product: "흩어진 업무 기록을 모아 반복되는 작업을 찾아 주는 협업 도구입니다.",
  direction: "AI 기능을 따로 떼어 내기보다 이미 쓰는 업무 화면 안에 넣는 방향입니다.",
  roleLink: "사용자의 반복 업무를 문제로 정의하고, 작은 AI 기능으로 검증할 사람을 찾는다고 볼 수 있습니다.",
};

export const SAMPLE_JD =
  "- 사용자 문제 정의\n- AI 기능 기획\n- 데이터 기반 제품 개선\n- 개발·디자인 협업\n- MVP 실험";

export const SAMPLE_JOB: JobResult = {
  summary: "사용자 문제를 정의하고 AI 기능을 작은 실험으로 검증해 제품을 개선하는 역할",
  responsibilities: ["사용자 문제 정의", "AI 기능 기획", "데이터 기반 제품 개선", "개발·디자인 협업", "MVP 실험"],
  core: ["문제 정의", "제품 사고", "AI 이해", "사용자 이해"],
  preferred: ["협업", "실험"],
  perspective: [
    "기능 목록보다 사용자의 실제 불편에서 출발하는지",
    "큰 기능을 작게 나눠 먼저 확인하는지",
  ],
};

export const SAMPLE_EXPERIENCE: ExperienceAnswers = {
  title: "사용자 피드백 분석 도구",
  problem: "사용자 의견이 여러 채널에 흩어져 제품 개선 우선순위를 정하기 어려웠습니다.",
  role: "서비스 기획을 맡아 사용자 인터뷰와 피드백 유형 정리를 했습니다.",
  choice: "모든 피드백을 자동 분석하기보다 반복적으로 등장하는 핵심 문제를 먼저 구조화했습니다.",
  reason: "양이 많은 의견보다 반복되는 불편이 먼저 고칠 곳을 알려 준다고 봤습니다.",
  result: "팀이 우선 검토해야 할 문제 영역을 빠르게 확인할 수 있는 프로토타입을 완성했습니다.",
};

export const SAMPLE_CONNECT: Record<string, ExperiencePart> = {
  "문제 정의": "choice",
  "제품 사고": "reason",
  "AI 이해": "none",
  "사용자 이해": "role",
  "협업": "none",
  "실험": "result",
};

export const SAMPLE_INSIGHT: InsightResult = {
  strength: "복잡한 문제를 검증 가능한 단위로 구조화하는 능력",
  evidence:
    "전체 기능을 한 번에 구현하기보다 반복적으로 등장하는 사용자 문제를 먼저 분리하고, 검증 가능한 프로토타입으로 만든 과정이 이 경험에서 나타납니다.",
  roleLink: "AI Product Manager에게 필요한 문제 정의와 MVP 사고 방식과 연결해볼 수 있습니다.",
  competencies: ["문제 정의", "MVP 사고", "사용자 이해", "제품 판단"],
};

export const SAMPLE_RESUME_BULLETS = [
  "사용자 피드백이 분산된 문제를 정의하고, 반복적으로 등장하는 핵심 이슈를 구조화해 제품 개선 우선순위 확인용 프로토타입을 기획했습니다.",
];

export const SAMPLE_LETTER_QUESTION = "지원 직무와 관련해 문제를 해결했던 경험을 구체적으로 적어 주세요.";

export const SAMPLE_LETTER_DRAFT =
  "사용자 의견이 여러 채널에 흩어져 있어 무엇부터 고칠지 정하기 어려운 상황이었습니다. 저는 모든 의견을 한 번에 분석하기보다, 반복해서 나오는 불편을 먼저 묶어 보기로 했습니다. 인터뷰와 피드백 유형 정리를 거쳐 주요 불편 구간을 정의했고, 팀이 먼저 검토할 문제 영역을 확인할 수 있는 프로토타입을 만들었습니다. 이 경험에서 복잡한 문제를 검증할 수 있는 작은 단위로 나누는 방식을 익혔고, AI Product Manager로서 사용자 문제를 정의하고 작은 실험으로 확인하는 일에 쓰고 싶습니다.";

export const SAMPLE_PORTFOLIO: PortfolioBlocks = {
  intro: "흩어진 사용자 의견에서 먼저 고칠 문제를 찾는 프로토타입",
  problem: "사용자 의견이 여러 채널에 흩어져 무엇부터 고칠지 정하기 어려웠습니다.",
  insight: "의견의 양보다 반복해서 나오는 불편이 우선순위를 알려 줍니다.",
  decision: "전부 자동 분석하기 전에 반복되는 핵심 문제부터 구조화했습니다.",
  execution: "인터뷰, 피드백 유형 정리, 불편 구간 정의를 거쳐 프로토타입을 만들었습니다.",
  result: "팀이 먼저 검토할 문제 영역을 빠르게 확인할 수 있게 되었습니다.",
  learning: "작게 나눠 확인하면 논의가 의견이 아닌 근거에서 시작됩니다.",
};
