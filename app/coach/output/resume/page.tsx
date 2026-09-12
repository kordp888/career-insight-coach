import type { Metadata } from "next";
import { ResumeView } from "@/components/outputs/resume-view";

export const metadata: Metadata = { title: "이력서" };

export default function Page() {
  return <ResumeView />;
}
