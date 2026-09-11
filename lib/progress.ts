import type { StepKey } from "./site";
import type { Workspace } from "./workspace";

export function answeredCount(ws: Workspace): number {
  const e = ws.experience;
  return [e.problem, e.role, e.choice, e.reason, e.result].filter((v) => v.trim()).length;
}

export function isDone(ws: Workspace, key: StepKey): boolean {
  switch (key) {
    case "industry": return Boolean(ws.industry);
    case "company": return Boolean(ws.company);
    case "job": return Boolean(ws.job);
    case "experience": return answeredCount(ws) >= 3;
    case "connect": return Object.keys(ws.connect).length > 0;
    case "insight": return Boolean(ws.insight);
    case "output": return Boolean(ws.resumeBullets || ws.letterDraft || ws.portfolio);
  }
}
