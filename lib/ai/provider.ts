import "server-only";

/**
 * 포텐스 API 어댑터. 요청을 보내고, 응답 텍스트를 꺼내고, 오류를 한 가지 모양으로 올린다.
 *
 * 계약(실제 연동에서 확인): POST https://ai.potens.ai/api/chat
 *   헤더 Authorization: Bearer <POTENS_API_KEY>
 *   본문 {"prompt": string, "model": string}
 *   응답 {"message": string, ...}
 *
 * 키는 서버 환경 변수에서만 읽는다. 브라우저 번들에 들어가지 않는다.
 */

const POTENS_URL = "https://ai.potens.ai/api/chat";
const MODEL = "claude-5-sonnet";
const TIMEOUT_MS = 45_000;

export type ProviderErrorKind = "not_configured" | "upstream" | "empty";

export class ProviderError extends Error {
  constructor(public readonly kind: ProviderErrorKind) {
    super(kind);
  }
}

export function aiConfigured(): boolean {
  return Boolean(process.env.POTENS_API_KEY);
}

export async function complete(prompt: string): Promise<string> {
  const key = process.env.POTENS_API_KEY;
  if (!key) throw new ProviderError("not_configured");

  let res: Response;
  try {
    res = await fetch(POTENS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ prompt, model: MODEL }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new ProviderError("upstream");
  }
  if (!res.ok) {
    // 상태 코드만 남긴다. 응답 본문과 헤더는 로그에도 남기지 않는다.
    console.error(`[ai] provider status ${res.status}`);
    throw new ProviderError("upstream");
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new ProviderError("empty");
  }
  const message = data && typeof data === "object" ? (data as { message?: unknown }).message : undefined;
  if (typeof message !== "string" || !message.trim()) throw new ProviderError("empty");
  return message;
}
