import type { Metadata } from "next";
import { ConnectView } from "@/components/insight/connect-view";

export const metadata: Metadata = { title: "역량 연결" };

export default function Page() {
  return <ConnectView />;
}
