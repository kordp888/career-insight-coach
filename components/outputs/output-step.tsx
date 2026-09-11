"use client";

import { StepFooter, StepHeader } from "@/components/dashboard/step-frame";

export function OutputStepHeader() {
  return <StepHeader step="output" desc="발견한 강점과 경험을 세 가지 문서로 연결합니다. 문서를 눌러 열어보세요." />;
}

export function OutputStepFooter() {
  return <StepFooter step="output" nextLabel="이력서부터 보기" nextHref="/demo/output/resume" />;
}
