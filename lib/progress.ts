import type { StepKey } from "./site";
import type { Workspace } from "./workspace";

export function answeredCount(ws: Workspace): number {
  return ws.experiences.filter(e=>e.title && (e.problem||e.action||e.choice||e.result||e.dialogue.some(t=>t.a))).length;
}

export function isDone(ws: Workspace, key: StepKey): boolean {
  switch (key) {
    case "industry": return Boolean(ws.industry);
    case "company": return Boolean(ws.company);
    case "job": return Boolean(ws.job);
    case "experience": return answeredCount(ws) > 0;
    case "connect": return ws.connections.length > 0;
    case "insight": return ws.insights.some(i=>i.decision==="accepted");
    case "output": return Boolean(ws.outputs.resume || ws.outputs.letter || ws.outputs.portfolio);
  }
}
