import type { Metadata } from "next";
import { PortfolioView } from "@/components/outputs/portfolio-view";

export const metadata: Metadata = { title: "포트폴리오" };

export default function Page() {
  return <PortfolioView />;
}
