"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building, ChartColumn, FilePenLine, FileText, FileUser, House, KeyRound, Lightbulb, Link2, Menu,
  MicVocal, PanelsTopLeft, Settings, UserRound, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { DEMO_DISCLAIMER, TRUST_NOTES } from "@/lib/site";
import {WorkspaceNotice} from "./workspace-notice";
import {useWorkspace} from "@/lib/workspace";

type NavItem = { href: string; label: string; icon: LucideIcon };

const GROUPS: { title?: string; items: NavItem[] }[] = [
  { items: [{ href: "/coach", label: "홈", icon: House }] },
  { title: "나의 경험", items: [{ href: "/coach/experience", label: "경험 정리", icon: UserRound }] },
  {
    title: "지원할 곳",
    items: [
      { href: "/coach/industry", label: "산업 분석", icon: ChartColumn },
      { href: "/coach/company", label: "기업 분석", icon: Building },
      { href: "/coach/job", label: "직무 분석", icon: FileText },
    ],
  },
  {
    title: "연결",
    items: [
      { href: "/coach/connect", label: "역량 연결", icon: Link2 },
      { href: "/coach/insight", label: "인사이트", icon: Lightbulb },
    ],
  },
  {
    title: "결과",
    items: [
      { href: "/coach/output/resume", label: "이력서", icon: FileUser },
      { href: "/coach/output/cover-letter", label: "자소서", icon: FilePenLine },
      { href: "/coach/output/portfolio", label: "포트폴리오", icon: PanelsTopLeft },
    ],
  },
];

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="space-y-6">
        {GROUPS.map((g, gi) => (
          <div key={gi}>
            {g.title && <p className="px-3 pb-2 text-[12px] font-semibold text-ink-3">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-2.5 rounded-btn px-3 text-[15px] transition-colors duration-150 ${
                        active ? "bg-soft-blue font-semibold text-brand" : "text-ink-2 hover:bg-canvas hover:text-ink"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-0.5 border-t border-line pt-4">
        <Link
          href="/coach/settings"
          onClick={onNavigate}
          aria-current={pathname === "/coach/settings" ? "page" : undefined}
          className={`flex min-h-11 items-center gap-2.5 rounded-btn px-3 text-[15px] ${
            pathname === "/coach/settings" ? "bg-soft-blue font-semibold text-brand" : "text-ink-2 hover:bg-canvas hover:text-ink"
          }`}
        >
          <Settings className="h-[18px] w-[18px]" aria-hidden="true" /> 설정
        </Link>
        <p className="flex min-h-10 items-center gap-2.5 px-3 text-[14px] text-ink-3">
          <KeyRound className="h-4 w-4" aria-hidden="true" /> BYOK <span className="ml-auto text-[11px]">예정</span>
        </p>
        <p className="flex min-h-10 items-center gap-2.5 px-3 text-[14px] text-ink-3">
          <MicVocal className="h-4 w-4" aria-hidden="true" /> 면접 준비 <span className="ml-auto text-[11px]">v0.2</span>
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const ws=useWorkspace();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-dvh bg-canvas">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col overflow-y-auto border-r border-line bg-white px-3 py-5 lg:flex">
        <div className="px-2 pb-6">
          <Logo />
        </div>
        <nav aria-label="커리어 메뉴" className="flex flex-1 flex-col">
          <NavList pathname={pathname} />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/95 px-4 backdrop-blur lg:hidden">
          <Logo compact />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-btn text-ink"
            aria-label="커리어 메뉴 열기"
            aria-expanded={open}
            aria-controls="demo-drawer"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="커리어 메뉴">
            <button type="button" aria-label="메뉴 닫기" className="absolute inset-0 bg-navy/30" onClick={() => setOpen(false)} />
            <nav id="demo-drawer" className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col overflow-y-auto bg-white px-3 py-4">
              <div className="flex items-center justify-between px-2 pb-4">
                <span className="text-[15px] font-bold text-navy">메뉴</span>
                <button type="button" className="flex h-11 w-11 items-center justify-center rounded-btn" aria-label="메뉴 닫기" onClick={() => setOpen(false)}>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
            </nav>
          </div>
        )}

        <main id="main" className="flex-1">
          <div key={ws.mode} className="mx-auto w-full max-w-[960px] px-4 pb-10 pt-6 sm:px-8 sm:pt-10 lg:pb-16"><WorkspaceNotice />{children}</div>
        </main>

        <footer className="border-t border-line bg-white px-4 py-5 sm:px-8">
          <div className="mx-auto max-w-[960px] space-y-1 text-[13px] leading-relaxed text-ink-3">
            {TRUST_NOTES.map((t) => <p key={t}>{t}</p>)}
            <p>{DEMO_DISCLAIMER}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
