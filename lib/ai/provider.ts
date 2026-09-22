import "server-only";

/**
 * AI 분석 어댑터. 요청을 보내고, 응답을 꺼내고, 오류를 한 가지 모양으로 올린다.
 *
 * 분석은 다시ON5060 서비스의 코치 API가 처리한다. 이 저장소에는 API 키도,
 * 분석 지시문도 없다. 서버 라우트만 이 어댑터를 부르므로 브라우저는 어댑터 주소를 모른다.
 */

/** 코치 API 주소. 미리보기 배포를 겨냥해 시험할 때만 환경 변수로 바꾼다. */
const COACH_URL = process.env.COACH_URL || "https://dasion-app.vercel.app/api/coach";
const TIMEOUT_MS = 165_000;

export type TaskName = "industry" | "company" | "job" | "experience" | "insight" | "document";

export type ProviderErrorKind = "not_configured" | "empty_input" | "busy" | "upstream";

export class ProviderError extends Error {
  constructor(public readonly kind: ProviderErrorKind) {
    super(kind);
  }
}

export async function runCoachTask(task: TaskName, input: unknown, user: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(COACH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-coach-user": user },
      body: JSON.stringify({ task, input }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new ProviderError("upstream");
  }
  const data = (await res.json().catch(() => ({}))) as { result?: unknown; error?: string };
  if (res.ok && data.result && typeof data.result === "object") return data.result;
  if (res.status === 503 && data.error === "not_configured") throw new ProviderError("not_configured");
  if (res.status === 400) throw new ProviderError("empty_input");
  if (res.status === 429) throw new ProviderError("busy");
  console.error(`[ai] coach status ${res.status}`);
  throw new ProviderError("upstream");
}

let cached: { value: boolean; at: number } | null = null;

/** AI 분석을 쓸 수 있는지. 1분 동안 결과를 재사용한다. */
export async function aiConfigured(): Promise<boolean> {
  if (cached && Date.now() - cached.at < 60_000) return cached.value;
  try {
    const res = await fetch(COACH_URL, { signal: AbortSignal.timeout(4000), cache: "no-store" });
    const data = (await res.json()) as { ai?: boolean };
    cached = { value: res.ok && data.ai === true, at: Date.now() };
  } catch {
    cached = { value: false, at: Date.now() };
  }
  return cached.value;
}
