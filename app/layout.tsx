import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://career-insight-coach.vercel.app"),
  title: {
    default: `${SITE.name} | AI PM 포트폴리오`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: "AI가 대신 쓰는 게 아니라, 당신의 경험에서 더 좋은 답을 발견하도록.",
    type: "website",
    locale: "ko_KR",
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image", title: SITE.name },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-white focus:px-4 focus:py-3 focus:shadow-soft">
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
