import "server-only";
import { extractObject, inputText, tidy, tidyList } from "./json";
import type {
  CompanyResult, DocKind, ExperienceSummary, IndustryResult, InsightResult, JobResult,
  PortfolioBlocks,
} from "../types";

/**
 * 공개 저장소용 최소 지시문. 무엇을 어떤 모양으로 돌려받을지만 적는다.
 * 모든 결과는 사용자가 화면에서 확인하고 고치는 초안이다.
 */

export interface Task<TInput, TOutput> {
  name: string;
  readInput(body: unknown): TInput | null;
  instruction(input: TInput): string;
  readOutput(text: string): TOutput | null;
}

const COMMON = [
  "너는 취업 준비생이 산업·기업·직무를 이해하고 자신의 경험을 돌아보도록 돕는 커리어 코치다.",
  "한국어 존댓말로 짧게 쓴다. 과장하지 않는다. 확인되지 않은 수치, 순위, 합격 가능성을 쓰지 않는다.",
  "사용자가 주지 않은 경험이나 성과를 만들어 내지 않는다.",
  "반드시 요청한 JSON 객체 하나만 출력한다.",
].join("\n");

const body = (b: unknown) => (b && typeof b === "object" ? (b as Record<string, unknown>) : {});

export const industryTask: Task<{ industry: string; role: string }, IndustryResult> = {
  name: "industry",
  readInput(b) {
    const x = body(b);
    const industry = inputText(x.industry, 80);
    return industry ? { industry, role: inputText(x.role, 80) } : null;
  },
  instruction: ({ industry, role }) => `${COMMON}

산업: ${industry}
지원 직무: ${role || "(미정)"}

이 산업을 처음 공부하는 지원자에게 설명한다. 일반적으로 알려진 내용만 쓰고, 최신 뉴스나 특정 기업의 비공개 정보는 추측하지 않는다.
{"structure":"시장 구조 한두 문장","changes":["주요 변화 한 줄",".."],"impact":"지원 직무에 미치는 영향 한두 문장","details":["더 알아볼 점 한 줄",".."]}
changes 는 3개, details 는 2개.`,
  readOutput(text) {
    const o = extractObject(text);
    if (!o) return null;
    const r = { structure: tidy(o.structure), changes: tidyList(o.changes, 3), impact: tidy(o.impact), details: tidyList(o.details, 3) };
    return r.structure && r.changes.length ? r : null;
  },
};

export const companyTask: Task<{ company: string; industry: string; role: string }, CompanyResult> = {
  name: "company",
  readInput(b) {
    const x = body(b);
    const company = inputText(x.company, 80);
    return company ? { company, industry: inputText(x.industry, 80), role: inputText(x.role, 80) } : null;
  },
  instruction: ({ company, industry, role }) => `${COMMON}

기업: ${company}
산업: ${industry || "(미정)"}
지원 직무: ${role || "(미정)"}

널리 알려진 정보만 쓴다. 잘 모르는 기업이면 확인이 필요하다고 솔직하게 쓰고, 사업 내용을 지어내지 않는다.
{"overview":"기업 개요 한 문장","business":"핵심 사업 한두 문장","product":"제품/서비스 한두 문장","direction":"최근 방향 한두 문장","roleLink":"지원 직무와의 연결 한두 문장"}`,
  readOutput(text) {
    const o = extractObject(text);
    if (!o) return null;
    const r = { overview: tidy(o.overview), business: tidy(o.business), product: tidy(o.product), direction: tidy(o.direction), roleLink: tidy(o.roleLink) };
    return r.overview ? r : null;
  },
};

export const jobTask: Task<{ jd: string; role: string; company: string }, JobResult> = {
  name: "job",
  readInput(b) {
    const x = body(b);
    const jd = inputText(x.jd, 4000);
    return jd ? { jd, role: inputText(x.role, 80), company: inputText(x.company, 80) } : null;
  },
  instruction: ({ jd, role, company }) => `${COMMON}

지원 직무: ${role || "(미정)"}
기업: ${company || "(미정)"}
채용공고 내용:
"""
${jd}
"""

채용공고에 적힌 내용을 바탕으로 정리한다. 공고에 없는 요구사항을 만들지 않는다.
{"summary":"직무 한 줄 요약","responsibilities":["주요 업무",".."],"core":["핵심 역량(짧은 명사구)",".."],"preferred":["우대 역량",".."],"perspective":["이 직무에서 중요하게 보는 관점 한 줄",".."]}
responsibilities 최대 5개, core 최대 5개, preferred 최대 4개, perspective 2개.`,
  readOutput(text) {
    const o = extractObject(text);
    if (!o) return null;
    const r = {
      summary: tidy(o.summary),
      responsibilities: tidyList(o.responsibilities, 5),
      core: tidyList(o.core, 5, 30),
      preferred: tidyList(o.preferred, 4, 30),
      perspective: tidyList(o.perspective, 3),
    };
    return r.summary && r.core.length ? r : null;
  },
};

type ExperienceInput = { role: string; title: string; problem: string; roleText: string; choice: string; reason: string; result: string };

function readExperience(x: Record<string, unknown>): ExperienceInput {
  return {
    role: inputText(x.role, 80),
    title: inputText(x.title, 80),
    problem: inputText(x.problem, 800),
    roleText: inputText(x.roleText, 800),
    choice: inputText(x.choice, 800),
    reason: inputText(x.reason, 800),
    result: inputText(x.result, 800),
  };
}

const experienceBlock = (e: ExperienceInput) => `경험 이름: ${e.title || "(없음)"}
해결하려던 문제: ${e.problem || "(답하지 않음)"}
맡은 역할: ${e.roleText || "(답하지 않음)"}
한 선택: ${e.choice || "(답하지 않음)"}
그렇게 판단한 이유: ${e.reason || "(답하지 않음)"}
결과: ${e.result || "(답하지 않음)"}`;

const hasExperience = (e: ExperienceInput) => Boolean(e.problem || e.choice || e.result);

export const experienceTask: Task<ExperienceInput, ExperienceSummary> = {
  name: "experience",
  readInput: (b) => {
    const e = readExperience(body(b));
    return hasExperience(e) ? e : null;
  },
  instruction: (e) => `${COMMON}

지원자가 답한 경험:
${experienceBlock(e)}

답한 내용만으로 경험을 정리한다. 답하지 않은 칸은 빈 문자열로 둔다. 새 사실을 더하지 않는다.
{"oneLine":"경험 한 줄 소개","problem":"","role":"","action":"","reason":"","result":""}`,
  readOutput(text) {
    const o = extractObject(text);
    if (!o) return null;
    const r = { oneLine: tidy(o.oneLine, 160), problem: tidy(o.problem), role: tidy(o.role), action: tidy(o.action), reason: tidy(o.reason), result: tidy(o.result) };
    return r.oneLine ? r : null;
  },
};

type InsightInput = ExperienceInput & { competencies: string[] };

export const insightTask: Task<InsightInput, InsightResult> = {
  name: "insight",
  readInput(b) {
    const x = body(b);
    const e = readExperience(x);
    if (!hasExperience(e)) return null;
    return { ...e, competencies: Array.isArray(x.competencies) ? x.competencies.map((c) => inputText(c, 30)).filter(Boolean).slice(0, 8) : [] };
  },
  instruction: (e) => `${COMMON}

지원 직무: ${e.role || "(미정)"}
직무에서 중요하게 보는 역량: ${e.competencies.join(", ") || "(없음)"}

지원자가 답한 경험:
${experienceBlock(e)}

이 경험에서 드러나는 강점 하나를 찾는다. 성격 진단처럼 단정하지 말고 "이 경험에서는 ~이 나타납니다", "~와 연결해볼 수 있습니다"처럼 쓴다. 점수나 퍼센트를 쓰지 않는다.
{"strength":"강점을 30자 이내 명사구로(예: 복잡한 문제를 작은 단위로 나누는 능력)","evidence":"경험 속 근거 두 문장 이내","roleLink":"지원 직무와의 연결 한 문장","competencies":["관련 역량(짧은 명사구)",".."]}
competencies 최대 4개.`,
  readOutput(text) {
    const o = extractObject(text);
    if (!o) return null;
    const r = { strength: tidy(o.strength, 80), evidence: tidy(o.evidence), roleLink: tidy(o.roleLink), competencies: tidyList(o.competencies, 4, 30) };
    return r.strength && r.evidence ? r : null;
  },
};

export type DocumentOutput =
  | { kind: "resume"; bullets: string[] }
  | { kind: "letter"; draft: string }
  | { kind: "portfolio"; blocks: PortfolioBlocks };

type DocumentInput = ExperienceInput & { kind: DocKind; strength: string; question: string; claim: string };

export const documentTask: Task<DocumentInput, DocumentOutput> = {
  name: "document",
  readInput(b) {
    const x = body(b);
    const kind = x.kind === "resume" || x.kind === "letter" || x.kind === "portfolio" ? x.kind : null;
    const e = readExperience(x);
    if (!kind || !hasExperience(e)) return null;
    return { ...e, kind, strength: inputText(x.strength, 120), question: inputText(x.question, 300), claim: inputText(x.claim, 200) };
  },
  instruction(e) {
    const head = `${COMMON}

지원 직무: ${e.role || "(미정)"}
발견한 강점: ${e.strength || "(없음)"}

지원자가 답한 경험:
${experienceBlock(e)}
`;
    if (e.kind === "resume") {
      return `${head}
이력서 경력란에 넣을 문장을 쓴다. 한 문장에 역할, 행동, 결과가 보이게 쓰고 "~했습니다"로 끝낸다. 수치는 지원자가 준 것만 쓴다.
{"bullets":["문장",".."]}
bullets 는 2~3개.`;
    }
    if (e.kind === "letter") {
      return `${head}
자기소개서 문항: ${e.question || "(없음)"}
핵심 주장: ${e.claim || e.strength || "(없음)"}

상황, 문제, 판단, 행동, 결과, 직무 연결 순서로 한 문단 초안을 쓴다. 500자 이내.
{"draft":"초안"}`;
    }
    return `${head}
포트폴리오 한 편의 각 칸을 한두 문장으로 채운다.
{"intro":"프로젝트를 소개하는 40자 이내 한 구절","problem":"","insight":"","decision":"나의 판단","execution":"실행","result":"","learning":"배운 점"}`;
  },
  readOutput(text) {
    const o = extractObject(text);
    if (!o) return null;
    if ("bullets" in o) {
      const bullets = tidyList(o.bullets, 3, 240);
      return bullets.length ? { kind: "resume", bullets } : null;
    }
    if ("draft" in o) {
      const draft = tidy(o.draft, 900);
      return draft ? { kind: "letter", draft } : null;
    }
    const blocks: PortfolioBlocks = {
      intro: tidy(o.intro, 160), problem: tidy(o.problem), insight: tidy(o.insight), decision: tidy(o.decision),
      execution: tidy(o.execution), result: tidy(o.result), learning: tidy(o.learning),
    };
    return blocks.intro ? { kind: "portfolio", blocks } : null;
  },
};
