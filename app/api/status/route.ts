import { aiConfigured } from "@/lib/ai/provider";

/** AI 연결 여부만 알려준다. 어떤 설정값도 내보내지 않는다. */
export function GET() {
  return Response.json({ ai: aiConfigured() }, { headers: { "Cache-Control": "no-store" } });
}
