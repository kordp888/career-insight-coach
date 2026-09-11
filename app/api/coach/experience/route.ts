import { runTask } from "@/lib/ai/respond";
import { experienceTask } from "@/lib/ai/tasks";

export const maxDuration = 60;

export async function POST(request: Request) {
  return runTask(request, experienceTask);
}
