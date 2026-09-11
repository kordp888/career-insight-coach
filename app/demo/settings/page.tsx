import type { Metadata } from "next";
import { SettingsView } from "@/components/dashboard/settings-view";

export const metadata: Metadata = { title: "설정" };

export default function Page() {
  return <SettingsView />;
}
