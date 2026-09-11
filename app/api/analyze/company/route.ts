import { runTask } from "@/lib/ai/respond";
import { companyTask } from "@/lib/ai/tasks";

export const maxDuration = 60;

export async function POST(request: Request) {
  return runTask(request, companyTask);
}
