import { runTask } from "@/lib/ai/respond";
import { industryTask } from "@/lib/ai/tasks";

export const maxDuration = 60;

export async function POST(request: Request) {
  return runTask(request, industryTask);
}
