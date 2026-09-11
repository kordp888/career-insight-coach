import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/app-shell";

export const metadata: Metadata = {
  title: { default: "데모", template: "%s | 커리어코치" },
  description: "산업 분석부터 문서화까지 커리어코치의 흐름을 직접 체험해보세요.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
