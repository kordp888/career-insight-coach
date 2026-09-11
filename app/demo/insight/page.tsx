import type { Metadata } from "next";
import { InsightView } from "@/components/insight/insight-view";

export const metadata: Metadata = { title: "인사이트 발견" };

export default function Page() {
  return <InsightView />;
}
