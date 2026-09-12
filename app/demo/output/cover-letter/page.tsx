import type { Metadata } from "next";
import { LetterView } from "@/components/outputs/letter-view";

export const metadata: Metadata = { title: "자소서" };

export default function Page() {
  return <LetterView />;
}
