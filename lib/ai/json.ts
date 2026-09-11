/** 모델 응답 텍스트에서 JSON 객체를 꺼내고, 필드를 안전한 문자열로 읽는다. */

export function extractObject(text: string): Record<string, unknown> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const value: unknown = JSON.parse(match[0]);
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** 화면에 그대로 나가는 글이다. 줄표는 쉼표로, 공백은 정리한다. */
export function tidy(value: unknown, max = 600): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s*[—–]\s*/g, ", ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function tidyList(value: unknown, maxItems = 6, maxLen = 160): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => tidy(v, maxLen)).filter(Boolean).slice(0, maxItems);
}

export function inputText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
