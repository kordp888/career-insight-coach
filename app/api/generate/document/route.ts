import { runTask } from "@/lib/ai/respond";
import { documentTask } from "@/lib/ai/tasks";

export const maxDuration = 60;

export async function POST(request: Request) {
  return runTask(request, documentTask);
}
