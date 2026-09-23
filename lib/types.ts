export type Source = "sample" | "ai";

export interface Target {
  role: string;
  company: string;
  industry: string;
}

/** 분석 결과에 공통으로 붙는 심화 항목. 옛 저장 데이터에는 없을 수 있어 선택이다. */
export interface AnalysisDepth {
  summary?: string;
  social?: string;
  personalQuestions?: string[];
}

export interface IndustryResult extends AnalysisDepth {
  structure: string;
  changes: string[];
  impact: string;
  details: string[];
}

export interface CompanyResult extends AnalysisDepth {
  overview: string;
  business: string;
  product: string;
  direction: string;
  roleLink: string;
  questions?: string[];
}

export interface JobResult extends AnalysisDepth {
  summary: string;
  responsibilities: string[];
  core: string[];
  preferred: string[];
  perspective: string[];
  keywords?: string[];
  questions?: string[];
}

export interface ExperienceAnswers {
  title: string;
  problem: string;
  role: string;
  choice: string;
  reason: string;
  result: string;
}

export interface ExperienceSummary {
  oneLine: string;
  problem: string;
  role: string;
  action: string;
  reason: string;
  result: string;
}

export type ExperiencePart = "problem" | "role" | "choice" | "reason" | "result" | "none";

export interface InsightResult {
  strength: string;
  evidence: string;
  roleLink: string;
  competencies: string[];
}

export interface ResumeFields {
  experience: string;
  role: string;
  action: string;
  result: string;
  relevance: string;
}

export interface LetterStructure {
  question: string;
  claim: string;
  experience: string;
}

export interface PortfolioBlocks {
  intro: string;
  problem: string;
  insight: string;
  decision: string;
  execution: string;
  result: string;
  learning: string;
}

export type DocKind = "resume" | "letter" | "portfolio";

export interface Sourced<T> {
  data: T;
  source: Source;
}

/** HOW 대화의 질문 초점. story 는 첫 이야기, none 은 초점 없음. */
export type DigFocus = "story" | "situation" | "role" | "choice" | "steps" | "work" | "revision" | "result" | "limit" | "none";
/** 대화 한 턴. q 는 코치 질문, a 는 사용자 답변(사용자 진술). a 가 비면 아직 답하지 않은 질문이다. */
export interface DialogueTurn { focus: DigFocus; q: string; a: string }
/** HOW 대화 응답. */
export interface DigResponse { question: string; focus: DigFocus; note: string; title: string; done: boolean }

export interface InventoryExperience extends ExperienceAnswers {
  id: string;
  category: "project" | "career";
  period: string;
  situation: string;
  action: string;
  learning: string;
  /** 첨부 근거. 사용자가 제공한 자료·산출물 설명이며 주장과의 연결은 별도 확인 */
  evidence: string;
  technologies: string;
  research: string;
  /** 사용자 진술(답변)과 코치 질문의 기록 */
  dialogue: DialogueTurn[];
  /** AI 해석. 확정된 사용자 이력이 아니며 분석 입력에도 넣지 않는다 */
  aiNotes: string[];
}
export interface ExperienceQuestion { experienceId: string; questions: string[] }
export interface Connection { competency: string; experienceIds: string[]; reason: string; questions: string[]; label: string }
export interface InsightCandidate extends InsightResult {
  id: string;
  story: string;
  experienceIds: string[];
  decision: "pending" | "accepted" | "rejected";
}
export interface Blueprint { intent: string; claim: string; evidence: string; experienceIds: string[]; structure: string[] }
export interface ResumeSections { skills: string[]; career: string[]; projects: string[]; education: string[]; technologies: string[] }
export interface CaseStudy extends PortfolioBlocks { research: string; roleLink: string }
export interface WorkspaceOutputs { resume?: ResumeSections; blueprint?: Blueprint; letter?: string; portfolio?: CaseStudy }
/** 산업·기업·직무가 나에게 갖는 의미. 사용자가 직접 쓴 말만 담는다. */
export interface MeaningAnswers { industry: string; company: string; job: string }
export interface CareerWorkspace {
  schemaVersion: 3;
  mode: "actual" | "sample";
  target: Target;
  industry?: Sourced<IndustryResult>;
  company?: Sourced<CompanyResult>;
  companyReferences: string;
  companyReviewed: boolean;
  jd: string;
  job?: Sourced<JobResult>;
  experiences: InventoryExperience[];
  selectedExperienceIds: string[];
  questions: ExperienceQuestion[];
  connections: Connection[];
  insights: InsightCandidate[];
  question: string;
  maxLength: number;
  profile: { education: string; technologies: string };
  meaning: MeaningAnswers;
  outputs: WorkspaceOutputs;
}
