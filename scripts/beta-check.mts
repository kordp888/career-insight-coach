/**
 * 베타 기능 점검. 웹앱의 실제 AI 경로를 화면과 같은 순서·같은 모양으로 호출하고,
 * 화면이 쓰는 응답 검사(validResponse)를 통과하는지 본다. 입력은 전부 합성 예시다.
 *
 *   npm run beta-check                       # 운영 주소
 *   BETA_BASE=http://localhost:3210 npm run beta-check
 */
import { analysisPayload, digPayload, emptyWorkspace, newExperience, validResponse } from "../lib/workspace-data.ts";
import type { CareerWorkspace, InsightCandidate } from "../lib/types.ts";

const BASE = process.env.BETA_BASE || "https://career-insight-coach.vercel.app";

const ws: CareerWorkspace = {
  ...emptyWorkspace(),
  target: { role: "AI Product Manager", company: "합성 핀테크", industry: "핀테크" },
  jd: "주요 업무\n- 사용자 문제 정의와 개선 과제 기획\n- 데이터로 기능 효과 확인\n- 개발·디자인과 협업\n필수 요건\n- 문제 정의 경험\n- 협업 경험\n우대\n- 데이터 분석 도구 사용 경험",
  question: "지원 직무와 관련해 문제를 해결했던 경험을 적어 주세요.",
  maxLength: 700,
};
const e1 = { ...newExperience("synthetic-1"), title: "스터디 일정 투표 앱", situation: "단톡방 투표가 묻혀 참석자를 매번 다시 물었습니다.", role: "기획과 화면 설계를 맡았습니다.", action: "자주 묻는 것을 세 가지로 추리고 종이 화면으로 먼저 시험했습니다.", result: "수치는 없지만 참석 확인을 따로 묻지 않게 됐습니다." };
const e2 = { ...newExperience("synthetic-2"), category: "career" as const, title: "카페 재고 점검표", situation: "마감 재고 확인 방법이 사람마다 달랐습니다.", action: "공유 시트로 품목과 확인 순서를 정리했습니다.", result: "점장님이 다른 지점에도 쓰자고 했습니다." };
ws.experiences = [e1, e2];
ws.selectedExperienceIds = [e1.id, e2.id];

type Row = { feature: string; status: number | string; valid: boolean; seconds: number; note: string };
const rows: Row[] = [];

async function call(feature: string, url: string, payload: Record<string, unknown>): Promise<unknown> {
  const t0 = Date.now();
  let status: number | string = "network";
  let result: unknown = null;
  let note = "";
  try {
    const res = await fetch(BASE + url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(190_000) });
    status = res.status;
    const data = (await res.json().catch(() => ({}))) as { result?: unknown; error?: string };
    result = data.result ?? null;
    note = data.error ?? "";
  } catch (e) {
    note = (e as Error).name;
  }
  const valid = result !== null && validResponse(url, payload, result);
  if (valid) note = `${JSON.stringify(result).length}자`;
  rows.push({ feature, status, valid, seconds: Math.round((Date.now() - t0) / 1000), note });
  console.log(`${valid ? "PASS" : "FAIL"}  ${feature.padEnd(18)} ${String(status).padEnd(8)} ${note}`);
  return valid ? result : null;
}

const status = (await fetch(BASE + "/api/status").then((r) => r.json()).catch(() => ({}))) as { ai?: boolean };
console.log(`대상 ${BASE}  AI 연결 ${status.ai === true ? "켜짐" : "꺼짐"}\n`);

const target = { ...ws.target, jd: ws.jd, references: "" };
const industry = await call("산업 분석", "/api/analyze/industry", target);
if (industry) ws.industry = { source: "ai", data: industry as NonNullable<CareerWorkspace["industry"]>["data"] };
const company = await call("기업 분석", "/api/analyze/company", target);
if (company) { ws.company = { source: "ai", data: company as NonNullable<CareerWorkspace["company"]>["data"] }; ws.companyReviewed = true; }
const job = await call("직무/JD 분석", "/api/analyze/job", target);
if (job) ws.job = { source: "ai", data: job as NonNullable<CareerWorkspace["job"]>["data"] };

await call("경험 보완 질문", "/api/coach/experience", { ...analysisPayload(ws), mode: "questions" });
await call("HOW 대화 한 턴", "/api/coach/experience", digPayload(ws, { ...newExperience("synthetic-3"), dialogue: [{ focus: "story", q: "기억나는 경험 하나를 편하게 말씀해 주세요.", a: "작년에 팀으로 스터디 일정 투표 앱을 만들었어요." }] }));
await call("역량 연결", "/api/generate/insight", { ...analysisPayload(ws), mode: "connect" });
const insight = (await call("인사이트 발견", "/api/generate/insight", analysisPayload(ws))) as { insights: Omit<InsightCandidate, "decision">[] } | null;
if (insight?.insights[0]) ws.insights = [{ ...insight.insights[0], decision: "accepted" }];

const base = analysisPayload(ws, true);
if (ws.insights.length) {
  await call("이력서", "/api/generate/document", { ...base, kind: "resume", stage: "draft", question: ws.question, maxLength: ws.maxLength });
  const bp = (await call("자소서 설계", "/api/generate/document", { ...base, kind: "letter", stage: "blueprint", question: ws.question, maxLength: ws.maxLength })) as { blueprint: unknown } | null;
  if (bp) await call("자소서 초안", "/api/generate/document", { ...base, kind: "letter", stage: "draft", question: ws.question, maxLength: ws.maxLength, blueprint: bp.blueprint });
  else rows.push({ feature: "자소서 초안", status: "건너뜀", valid: false, seconds: 0, note: "설계 실패" });
  await call("포트폴리오", "/api/generate/document", { ...base, kind: "portfolio", stage: "draft", question: ws.question, maxLength: ws.maxLength, experiences: base.experiences.slice(0, 1) });
} else {
  for (const f of ["이력서", "자소서 설계", "자소서 초안", "포트폴리오"]) rows.push({ feature: f, status: "건너뜀", valid: false, seconds: 0, note: "채택할 인사이트 없음" });
}

console.log(`\n| 기능 | HTTP | 결과 | 시간 | 비고 |\n|---|---|---|---|---|`);
for (const r of rows) console.log(`| ${r.feature} | ${r.status} | ${r.valid ? "통과" : "실패"} | ${r.seconds}초 | ${r.note} |`);
console.log(`\n통과 ${rows.filter((r) => r.valid).length} / ${rows.length}`);
