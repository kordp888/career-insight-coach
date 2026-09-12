"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { ButtonLink, GithubMark } from "@/components/ui/button";
import { Logo } from "./logo";

const NAV = [
  { href: "/#process", label: "제품 소개" },
  { href: "/coach", label: "Career Workspace" },
  { href: "/about", label: "프로젝트" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav aria-label="주 메뉴" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-btn px-3 py-2 text-[15px] font-medium text-ink-2 hover:bg-soft-blue hover:text-ink">
              {n.label}
            </Link>
          ))}
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-btn px-3 py-2 text-[15px] font-medium text-ink-2 hover:bg-soft-blue hover:text-ink">
            <GithubMark /> GitHub
          </a>
        </nav>
        <div className="hidden md:block">
          <ButtonLink href="/coach">커리어 분석 시작하기</ButtonLink>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-btn text-ink md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="모바일 메뉴" className="border-t border-line bg-white px-5 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-btn px-2 text-[17px] font-medium text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-2 rounded-btn px-2 text-[17px] font-medium text-ink">
                <GithubMark /> GitHub
              </a>
            </li>
          </ul>
          <ButtonLink href="/coach" className="mt-3 w-full">
            커리어 분석 시작하기
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
