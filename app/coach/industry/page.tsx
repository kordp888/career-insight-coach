import type { Metadata } from "next";
import { IndustryView } from "@/components/analysis/industry-view";

export const metadata: Metadata = { title: "산업 분석" };

export default function Page() {
  return <IndustryView />;
}
