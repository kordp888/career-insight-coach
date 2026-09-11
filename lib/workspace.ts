"use client";

import { useSyncExternalStore } from "react";
import { SAMPLE_TARGET } from "./samples";
import type {
  CompanyResult, ExperienceAnswers, ExperiencePart, ExperienceSummary, IndustryResult,
  InsightResult, JobResult, LetterStructure, PortfolioBlocks, ResumeFields, Sourced, Target,
} from "./types";

/**
 * 데모 작업 공간. 이 브라우저의 localStorage 에만 저장한다. 서버로 보내지 않는다.
 */

export interface Workspace {
  target: Target;
  industry?: Sourced<IndustryResult>;
  company?: Sourced<CompanyResult>;
  jd: string;
  job?: Sourced<JobResult>;
  experience: ExperienceAnswers;
  experienceSummary?: Sourced<ExperienceSummary>;
  connect: Record<string, ExperiencePart>;
  insight?: Sourced<InsightResult>;
  resume?: ResumeFields;
  resumeBullets?: Sourced<string[]>;
  letter?: LetterStructure;
  letterDraft?: Sourced<string>;
  portfolio?: Sourced<PortfolioBlocks>;
}

export const EMPTY_EXPERIENCE: ExperienceAnswers = { title: "", problem: "", role: "", choice: "", reason: "", result: "" };

const DEFAULT: Workspace = {
  target: { role: SAMPLE_TARGET.role, company: "", industry: "" },
  jd: "",
  experience: EMPTY_EXPERIENCE,
  connect: {},
};

const KEY = "career-coach-workspace-v1";
let state: Workspace = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...(JSON.parse(raw) as Partial<Workspace>) };
  } catch {
    state = DEFAULT;
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Workspace {
  load();
  return state;
}

function getServerSnapshot(): Workspace {
  return DEFAULT;
}

export function updateWorkspace(patch: Partial<Workspace>) {
  load();
  state = { ...state, ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* 저장 공간이 없어도 이번 화면 흐름은 계속된다 */
  }
  emit();
}

export function resetWorkspace() {
  state = DEFAULT;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
  emit();
}

export function useWorkspace(): Workspace {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 브라우저 상태를 읽기 시작했는지. 서버 렌더와 첫 화면에서는 false. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
