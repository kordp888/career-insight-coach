import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import overview from "@/assets/ai-career-insight-coach-overview.png";
import { ButtonLink, GithubMark } from "@/components/ui/button";
import { Chip } from "@/components/ui/card";
import { LEARNING_CONTEXT, LEARNING_CONTEXT_EN, MY_ROLE, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "프로젝트",
  description: "커리어코치 프로젝트의 문제, 인사이트, 제품 결정, 역할을 정리했습니다.",
};

const BLOCKS = [
  {
    label: "문제",
    title: "AI가 바로 쓰면 지원자의 경험과 판단이 평준화됩니다.",
    body: "빠르게 문장을 만들 수는 있지만, 기업과 직무를 이해하지 않은 채 쓰면 서로 다른 경험이 비슷한 표현으로 바뀝니다.",
  },
  {
    label: "인사이트",
    title: "답을 대신 만드는 것보다 발견하도록 돕는 편이 더 가치 있습니다.",
    body: "지원자가 자기 경험에서 직무와 이어지는 지점을 스스로 찾으면, 이력서·자소서·면접이 같은 이야기로 이어집니다.",
  },
  {
    label: "제품 결정",
    title: "문서 생성을 출발점에 두지 않았습니다.",
    body: "산업, 기업, 직무를 먼저 살펴보고 경험을 정리한 뒤, 역량 연결과 인사이트를 거쳐서야 문서로 넘어가도록 흐름을 설계했습니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="text-sm font-semibold text-brand">프로젝트</p>
      <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-tight text-navy sm:text-[42px]">
        {SITE.name}
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
        산업·기업·직무를 이해하고 실제 경험에서 직무와 연결되는 인사이트를 발견하도록 돕는 AI 커리어 코칭 웹앱입니다. 분석 결과를 직접 확인하고 수정할 수 있습니다.
      </p>

      <figure className="mt-10 overflow-hidden rounded-card-lg border border-line bg-canvas">
        <Image
          src={overview}
          alt="커리어코치 소개 인포그래픽. 문제, 핵심 인사이트, 산업 분석부터 문서화까지의 해결 방식, 이력서·자소서·포트폴리오 결과물을 정리한 이미지"
          placeholder="blur"
          sizes="(max-width: 896px) 100vw, 896px"
          className="h-auto w-full"
        />
      </figure>

      <div className="mt-14 space-y-5">
        {BLOCKS.map((b) => (
          <section key={b.label} className="rounded-card-lg border border-line bg-white p-7">
            <p className="text-sm font-semibold text-brand">{b.label}</p>
            <h2 className="mt-2 text-[22px] font-bold leading-snug text-navy">{b.title}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{b.body}</p>
          </section>
        ))}

        <section className="rounded-card-lg border border-line bg-white p-7">
          <p className="text-sm font-semibold text-brand">나의 역할</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {MY_ROLE.map((r) => (
              <li key={r}><Chip tone="plain">{r}</Chip></li>
            ))}
          </ul>
        </section>

        <section className="rounded-card-lg border border-line bg-soft-blue p-7">
          <p className="text-sm font-semibold text-brand">학습 맥락</p>
          <p className="mt-3 text-[16px] leading-relaxed text-ink">{LEARNING_CONTEXT}</p>
          <p className="mt-2 text-[13px] text-ink-3">{LEARNING_CONTEXT_EN}</p>
        </section>
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/coach" className="h-12 px-6">
          커리어 분석 시작하기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href={SITE.github} external variant="secondary" className="h-12 px-6">
          <GithubMark /> GitHub 보기
        </ButtonLink>
      </div>
    </div>
  );
}
