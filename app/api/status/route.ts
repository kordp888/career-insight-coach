import { aiConfigured } from "@/lib/ai/provider";

/** AI 분석을 쓸 수 있는지만 알려준다. 어떤 설정값도 내보내지 않는다. */
export async function GET() {
  return Response.json({ ai: await aiConfigured() }, { headers: { "Cache-Control": "no-store" } });
}
