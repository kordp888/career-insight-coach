"use client";
import { useSyncExternalStore } from "react";
import { SAMPLE_TARGET, SAMPLE_INDUSTRY, SAMPLE_COMPANY, SAMPLE_JOB, SAMPLE_JD, SAMPLE_EXPERIENCE, SAMPLE_INSIGHT } from "./samples";
import { applyWorkspacePatch, emptyWorkspace, newExperience, parseWorkspace } from "./workspace-data";
import type { CareerWorkspace } from "./types";
export type Workspace = CareerWorkspace;
const DEFAULT = emptyWorkspace();
const KEY = "career-coach-workspace-v2";
let state = DEFAULT;
let loaded = false;
let revision = 0;
export const workspaceRevision = () => revision;
let lastSavedAt = 0;
let storageWarning = "";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());
const key = (mode: CareerWorkspace["mode"]) => KEY + "-" + mode;
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const mode = localStorage.getItem(KEY + "-mode") === "sample" ? "sample" : "actual";
    const raw = localStorage.getItem(key(mode));
    state = raw ? parseWorkspace(raw) : emptyWorkspace(mode);
  } catch { state = emptyWorkspace(); storageWarning = "저장된 정보를 불러오지 못했습니다. 설정에서 내보낸 파일을 불러와 주세요."; }
}
function persist() {
  revision++;
  try { localStorage.setItem(key(state.mode), JSON.stringify(state)); localStorage.setItem(KEY + "-mode", state.mode); lastSavedAt = Date.now(); storageWarning = ""; }
  catch { storageWarning = "브라우저 저장 공간을 사용할 수 없습니다. 설정에서 데이터를 내보내 주세요."; }
  emit();
}
function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }
export function useWorkspace() { return useSyncExternalStore(subscribe, () => { load(); return state; }, () => DEFAULT); }
export function useHydrated() { return useSyncExternalStore(subscribe, () => true, () => false); }
export function useStorageWarning() { return useSyncExternalStore(subscribe, () => storageWarning, () => ""); }
export function useLastSavedAt() { return useSyncExternalStore(subscribe, () => lastSavedAt, () => 0); }
export function updateWorkspace(patch: Partial<CareerWorkspace>) { load(); state = applyWorkspacePatch(state, patch); persist(); }
export function replaceWorkspace(next: CareerWorkspace) { state = parseWorkspace(JSON.stringify(next)); loaded = true; persist(); }
export function switchToActual() { load(); try { const raw = localStorage.getItem(key("actual")); state = raw ? parseWorkspace(raw) : emptyWorkspace(); } catch { state = emptyWorkspace(); } persist(); }
export function startSample() {
  load();
  const exp = { ...newExperience("sample-1"), ...SAMPLE_EXPERIENCE };
  state = { ...emptyWorkspace("sample"), target: { ...SAMPLE_TARGET }, industry: { source: "sample", data: SAMPLE_INDUSTRY }, company: { source: "sample", data: SAMPLE_COMPANY }, companyReviewed: true, jd: SAMPLE_JD, job: { source: "sample", data: SAMPLE_JOB }, experiences: [exp], selectedExperienceIds: [exp.id], insights: [{ ...SAMPLE_INSIGHT, id: "sample-insight", story: "예시 경험에서 판단 기준을 구체화한 과정입니다.", experienceIds: [exp.id], decision: "pending" }] };
  persist();
}
export function resetWorkspace() {
  revision++;
  state = emptyWorkspace(); loaded = true;
  try { for (const k of [key("actual"), key("sample"), KEY + "-mode", "career-coach-workspace-v1"]) localStorage.removeItem(k); lastSavedAt = Date.now(); storageWarning = ""; } catch { storageWarning = "브라우저 저장 정보를 삭제하지 못했습니다."; }
  emit();
}
