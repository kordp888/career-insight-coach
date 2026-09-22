import {
  ArrowRight, Building, ChartColumn, FilePenLine, FileText, GraduationCap, KeyRound, Lightbulb, Link2,
  MessageSquareText, PenLine, Presentation, Quote, Sparkles, UserRound, Copy, Search, Shapes,
} from "lucide-react";
import { ButtonLink, GithubMark } from "@/components/ui/button";
import { Chip } from "@/components/ui/card";
import { HeroMockup } from "@/components/landing/hero-mockup";
import { LetterPreview, PortfolioPreview, ResumePreview } from "@/components/outputs/doc-previews";
import { LEARNING_CONTEXT, LEARNING_CONTEXT_EN, MY_ROLE, SITE, STEPS } from "@/lib/site";

const STEP_ICONS = [UserRound, ChartColumn, Building, FileText, Link2, Lightbulb, FilePenLine];

const PROBLEMS = [
  { no: "01", title: "비슷해지는 AI 문장", icon: Copy },
  { no: "02", title: "직무 이해 없이 자소서부터 작성", icon: Search },
  { no: "03", title: "실제 경험보다 표현에 집중", icon: PenLine },
  { no: "04", title: "자신의 강점을 발견하기 어려움", icon: Shapes },
];

const OUTPUTS = [
  { title: "이력서", sub: "직무와 연결되는 핵심 경험을 명확하게 정리", preview: <ResumePreview /> },
  { title: "자소서", sub: "질문에 맞는 경험과 핵심 메시지 구조화", preview: <LetterPreview /> },
  { title: "포트폴리오", sub: "문제 → 판단 → 실행 → 결과가 보이는 프로젝트 이야기", preview: <PortfolioPreview /> },
];

const AUDIENCES = [
  {
    title: "취업 준비생",
    icon: GraduationCap,
    items: ["경험을 제대로 정리", "직무와 연결되는 강점 발견", "기업별 문서 작성 기반 확보", "면접까지 이어지는 이야기 구축"],
  },
  {
    title: "강사 / 취업 컨설턴트",
    icon: Presentation,
    items: ["학생의 직무 이해도 확인", "경험 정리가 부족한 지점 확인", "반복 첨삭 부담 감소", "학생 스스로 사고하는 코칭 지원"],
  },
];

function SectionTitle({ kicker, title, desc, center = false }: { kicker?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker && <p className="text-sm font-semibold text-brand">{kicker}</p>}
      <h2 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-navy sm:text-[34px]">{title}</h2>
      {desc && <p className="mt-3 text-[16px] leading-relaxed text-ink-3 sm:text-[17px]">{desc}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* 히어로 */}
      <section className="overflow-hidden bg-gradient-to-b from-white to-canvas">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pb-28 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-ink-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden="true" /> 실제 AI 분석 기능을 사용할 수 있습니다.
            </p>
            <h1 className="mt-6 text-[36px] font-bold leading-[1.22] tracking-tight text-navy sm:text-[46px] lg:text-[44px] xl:text-[52px]">
              <span className="whitespace-nowrap">AI가 대신 쓰는 게 아니라,</span>
              <br />
              <span className="text-brand">당신의 경험에서 더 좋은 답을 발견하도록.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-[18px]">
              산업·기업·직무를 먼저 이해하고, 실제 경험과 판단 과정을 구조화해 직무와 연결되는 강점을 발견하도록 돕습니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/coach" className="h-12 px-6 text-[16px]">
                커리어 분석 시작하기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={SITE.github} external variant="secondary" className="h-12 px-6 text-[16px]">
                <GithubMark /> GitHub
              </ButtonLink>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* 문제 */}
      <section id="problem" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
        <SectionTitle kicker="문제" title="왜 필요한가요?" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map(({ no, title, icon: Icon }) => (
            <li key={no} className="flex flex-col gap-5 rounded-card border border-line bg-white p-6 transition-shadow duration-200 hover:shadow-soft">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-soft-blue text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-[13px] font-bold tabular-nums text-ink-3">{no}</span>
              </div>
              <h3 className="text-[18px] font-bold leading-snug text-navy">{title}</h3>
            </li>
          ))}
        </ul>
      </section>

      {/* 핵심 인사이트 */}
      <section id="insight" className="bg-soft-blue">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-24">
          <Quote className="mx-auto h-9 w-9 text-brand" aria-hidden="true" />
          <blockquote className="mt-6 text-[26px] font-bold leading-snug tracking-tight text-navy sm:text-[36px]">
            AI가 답을 대신 만드는 것보다,
            <br className="hidden sm:block" /> 자신의 경험에서 <span className="text-brand">더 좋은 답을 발견하도록</span> 돕는 것이 더 가치 있습니다.
          </blockquote>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
            경험을 먼저 꺼내고, 산업과 직무를 이해한 관점으로 그 경험을 다시 바라봅니다.
          </p>
        </div>
      </section>

      {/* 과정 */}
      <section id="process" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
        <SectionTitle kicker="과정" title="인사이트 발견 과정" desc="기억나는 경험부터 꺼내고, 지원하려는 산업과 기업과 직무를 이해한 뒤 다시 경험으로 돌아옵니다." />
        <ol className="relative mt-12 grid gap-3 lg:grid-cols-7 lg:gap-2">
          <div aria-hidden="true" className="absolute left-[27px] top-4 hidden h-[calc(100%-2rem)] w-px bg-line max-lg:block" />
          <div aria-hidden="true" className="absolute left-[7%] right-[7%] top-[27px] hidden h-px bg-line lg:block" />
          {STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={s.key} className="relative flex gap-4 rounded-card border border-line bg-white p-4 lg:flex-col lg:items-center lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0 lg:text-center">
                <span className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[16px] border border-line bg-white text-brand shadow-soft">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="lg:px-1">
                  <p className="text-[12px] font-bold tabular-nums text-brand">{s.no}</p>
                  <h3 className="mt-0.5 text-[17px] font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-3">{s.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 제품 미리보기 */}
      <section className="bg-canvas">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <SectionTitle kicker="Career Workspace" title="질문에 답하다 보면 강점이 보입니다." desc="경험을 한 번에 적지 않고, 질문 하나씩 꺼내 정리합니다. 정리가 끝나면 직무와 이어지는 강점을 함께 찾습니다." />
            <ButtonLink href="/coach" className="mt-8 h-12 px-6 text-[16px]">
              커리어 분석 시작하기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div aria-hidden="true" className="relative space-y-4">
            <div className="rounded-card-lg border border-line bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-3">
                <MessageSquareText className="h-4 w-4 text-brand" /> 경험 정리 · 3 / 5
              </div>
              <p className="mt-3 text-[20px] font-bold leading-snug text-navy">어떤 선택을 했나요?</p>
              <div className="mt-4 rounded-input border border-line bg-canvas p-4 text-[15px] leading-relaxed text-ink-2">
                모든 피드백을 자동 분석하기보다 반복적으로 등장하는 핵심 문제를 먼저 구조화했습니다.
              </div>
            </div>
            <div className="rounded-card-lg border border-brand/20 bg-white p-6 shadow-soft sm:ml-10">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-brand">
                <Lightbulb className="h-4 w-4" /> 이 경험에서 보이는 강점
              </div>
              <p className="mt-3 text-[20px] font-bold leading-snug text-navy">복잡한 문제를 검증 가능한 단위로 구조화하는 능력</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["문제 정의", "MVP 사고", "사용자 이해"].map((c) => <Chip key={c}>{c}</Chip>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 결과물 */}
      <section id="outputs" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
        <SectionTitle kicker="결과물" title="발견한 내용을 세 가지 문서로 연결합니다." />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {OUTPUTS.map((o) => (
            <li key={o.title} className="flex flex-col rounded-card-lg border border-line bg-white p-6">
              <h3 className="text-[20px] font-bold text-navy">{o.title}</h3>
              <p className="mt-1.5 text-[15px] text-ink-3">{o.sub}</p>
              <div className="mt-6 rounded-[18px] bg-canvas p-5">{o.preview}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* 대상 */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <SectionTitle kicker="대상" title="누구에게 필요한가요?" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {AUDIENCES.map(({ title, icon: Icon, items }) => (
              <article key={title} className="rounded-card-lg border border-line bg-white p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-soft-blue text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-[20px] font-bold text-navy">{title}</h3>
                </div>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {items.map((it) => (
                    <li key={it} className="rounded-[12px] bg-canvas px-4 py-3 text-[15px] font-medium text-ink-2">{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 프로젝트 배경 */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle kicker="프로젝트 배경" title="방법론에서 출발한 개인 프로젝트" />
            <p className="mt-5 text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">{LEARNING_CONTEXT}</p>
            <p className="mt-3 text-[13px] text-ink-3">{LEARNING_CONTEXT_EN}</p>
          </div>
          <div className="rounded-card-lg border border-line bg-white p-7">
            <h3 className="text-[18px] font-bold text-navy">맡은 역할</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {MY_ROLE.map((r) => (
                <li key={r}><Chip tone="plain">{r}</Chip></li>
              ))}
            </ul>
            <ButtonLink href="/about" variant="secondary" className="mt-7">
              프로젝트 자세히 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 공개 저장소 */}
      <section className="bg-canvas">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-20 sm:px-8 md:grid-cols-[1.4fr_1fr] lg:py-24">
          <article className="rounded-card-lg border border-line bg-white p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-navy text-white">
              <GithubMark className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-[24px] font-bold text-navy">공개 저장소</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-ink-2">
              공개 저장소에는 웹앱 화면, 제품 개요, 템플릿과 예시 데이터가 포함됩니다.
            </p>
            <ButtonLink href={SITE.github} external variant="secondary" className="mt-6">
              GitHub에서 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </article>
          <article className="rounded-card-lg border border-dashed border-line-strong bg-white p-7">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-soft-purple text-violet">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-soft-orange px-2.5 py-1 text-xs font-semibold text-amber">향후 지원 예정</span>
            </div>
            <h2 className="mt-5 text-[20px] font-bold text-navy">BYOK · Bring Your Own Key</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-3">
              직접 고른 AI 제공사와 본인의 API 키를 연결하는 방식입니다. 면접 준비도 다음 버전에서 다룹니다.
            </p>
          </article>
        </div>
      </section>

      {/* 마지막 행동 유도 */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="rounded-card-lg bg-navy px-6 py-14 text-center sm:px-12">
          <h2 className="text-[28px] font-bold leading-snug tracking-tight text-white sm:text-[38px]">
            당신의 경험에서
            <br />
            더 좋은 답을 발견해보세요.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/coach" className="h-12 px-6 text-[16px]">
              커리어 분석 시작하기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-btn border border-white/25 px-6 text-[16px] font-semibold text-white transition-colors duration-150 hover:bg-white/10"
            >
              <GithubMark /> GitHub 보기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
