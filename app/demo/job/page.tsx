import type { Metadata } from "next";
import { JobView } from "@/components/analysis/job-view";

export const metadata: Metadata = { title: "직무 분석" };

export default function Page() {
  return <JobView />;
}
