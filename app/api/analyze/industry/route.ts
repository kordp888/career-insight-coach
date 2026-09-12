import { runTask } from "@/lib/ai/respond";

export const maxDuration = 180;

export async function POST(request: Request) {
  return runTask(request, "industry");
}
