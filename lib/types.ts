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
}

export interface JobResult {
  summary: string;
  responsibilities: string[];
  core: string[];
  preferred: string[];
  perspective: string[];
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
