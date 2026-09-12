import type { Metadata } from "next";
import { ExperienceInterview } from "@/components/experience/experience-interview";

export const metadata: Metadata = { title: "경험 정리" };

export default function Page() {
  return <ExperienceInterview />;
}
