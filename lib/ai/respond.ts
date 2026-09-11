import "server-only";
import { complete, ProviderError } from "./provider";
import type { Task } from "./tasks";

/**
 * 모든 AI 라우트가 같이 쓰는 응답 처리.
 * 사용자에게는 짧은 오류 코드만 돌려준다. 내부 오류 내용은 내보내지 않는다.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const recent = new Map<string, number[]>();

/** 인스턴스 메모리 기준의 가벼운 사용량 제한. 공개 데모에서 과도한 호출을 줄이는 용도다. */
function overLimit(ip: string): boolean {
  const now = Date.now();
  const kept = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  kept.push(now);
  recent.set(ip, kept);
  if (recent.size > 5000) recent.clear();
  return kept.length > MAX_REQUESTS;
}

function reply(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function runTask<I, O>(request: Request, task: Task<I, O>): Promise<Response> {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return reply({ error: "forbidden" }, 403);

  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (overLimit(ip)) return reply({ error: "busy" }, 429);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return reply({ error: "bad_request" }, 400);
  }

  const input = task.readInput(payload);
  if (!input) return reply({ error: "empty_input" }, 400);

  try {
    const text = await complete(task.instruction(input));
    // 제공사 응답에 깨진 글자(U+FFFD)가 섞이는 경우가 있다(실측 19회 중 1회). 화면에 내보내지 않는다.
    if (text.includes("\uFFFD")) return reply({ error: "unreadable" }, 502);
    const result = task.readOutput(text);
    if (!result) return reply({ error: "unreadable" }, 502);
    return reply({ result });
  } catch (e) {
    if (e instanceof ProviderError && e.kind === "not_configured") return reply({ error: "not_configured" }, 503);
    return reply({ error: "provider" }, 502);
  }
}
