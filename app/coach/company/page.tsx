import type { Metadata } from "next";
import { CompanyView } from "@/components/analysis/company-view";

export const metadata: Metadata = { title: "기업 분석" };

export default function Page() {
  return <CompanyView />;
}
