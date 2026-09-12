export type Source = "sample" | "ai";

export interface Target {
  role: string;
  company: string;
  industry: string;
}

export interface IndustryResult {
  structure: string;
  changes: string[];
  impact: string;
  details: string[];
}

export interface CompanyResult {
  overview: string;
  business: string;
  product: string;
  direction: string;
  roleLink: string;
  questions?: string[];
}

export interface JobResult {
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

export interface InventoryExperience extends ExperienceAnswers {
  id: string;
  category: "project" | "career";
  period: string;
  situation: string;
  action: string;
  learning: string;
  evidence: string;
  technologies: string;
  research: string;
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
export interface CareerWorkspace {
  schemaVersion: 2;
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
  outputs: WorkspaceOutputs;
}
