import { runTask } from "@/lib/ai/respond";

export const maxDuration = 60;

export async function POST(request: Request) {
  return runTask(request, "job");
}
