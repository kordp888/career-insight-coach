import type { Metadata } from "next";
import { OutputCards } from "@/components/outputs/output-overview";
import { OutputStepHeader, OutputStepFooter } from "@/components/outputs/output-step";

export const metadata: Metadata = { title: "문서화" };

export default function Page() {
  return (
    <div className="space-y-6">
      <OutputStepHeader />
      <OutputCards />
      <OutputStepFooter />
    </div>
  );
}
