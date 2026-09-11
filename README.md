# AI Career Insight Coach

> 자소서를 대신 써주는 AI가 아니라,
> 지원할 곳을 먼저 이해하고 자신의 실제 경험에서
> 직무와 연결되는 강점을 발견하도록 돕는 AI Career Coach.

![AI Career Insight Coach](assets/ai-career-insight-coach-overview.png)

## Live Demo

**[career-insight-coach.vercel.app](https://career-insight-coach.vercel.app)**

산업·기업·직무 분석부터 경험 정리, 인사이트 발견, 이력서·자소서·포트폴리오까지 하나의 흐름으로 체험할 수 있는 AI 커리어 코칭 웹앱입니다.

## Problem

- AI가 바로 문장을 만들면 지원자마다 다른 경험이 비슷한 표현으로 바뀔 수 있습니다.
- 직무를 충분히 이해하지 않은 채 자소서부터 쓰는 경우가 많습니다.
- 실제 판단과 행동보다 문장을 그럴듯하게 만드는 데 집중하기 쉽습니다.
- 지원자가 자기 경험 안에서 직무와 연결되는 강점을 스스로 찾기 어렵습니다.

## How It Works

커리어코치는 AI에게 바로 자소서를 써달라고 요청하지 않습니다. 지원할 곳을 먼저 이해하고, 그 다음 내 경험에서 근거를 찾고, 마지막에 문서로 연결합니다.

```text
사용자
  ↓
커리어코치 웹앱
  ↓
서버 API
  ↓
AI 코치
  ↓
분석 결과
  ↓
사용자 확인·수정
  ↓
이력서 · 자기소개서 · 포트폴리오
```

### 실제 동작 흐름

1. 사용자가 지원 직무, 기업, 채용공고와 자신의 경험을 입력합니다.
2. 웹앱이 입력 내용을 서버 API로 전달합니다.
3. 서버가 필요한 분석을 AI 코치에 요청합니다.
4. AI가 산업·기업·직무와 사용자의 경험을 구조화합니다.
5. 사용자가 분석 결과를 직접 확인하고 수정합니다.
6. 확인한 내용을 이력서·자소서·포트폴리오로 연결합니다.

## Product Flow

1. 산업 분석
2. 기업 분석
3. 직무 / JD 분석
4. 경험 정리
5. 역량 연결
6. 인사이트 발견
7. 문서화: 이력서 · 자기소개서 · 포트폴리오

면접 준비는 아직 구현하지 않았습니다. [Roadmap](#roadmap)에 있습니다.

## Architecture

내부 프롬프트, 평가 기준, 승인 로직은 공개하지 않습니다. 구조만 보여드립니다.

```text
[Browser]
사용자 입력
   │
   ├── 진행 상태 저장 → localStorage
   │
   ▼
[Next.js Web App]
화면 / UX
   │
   ▼
[Server API]
입력 확인 / AI 요청 전달
   │
   ▼
[AI Coach]
분석 / 경험 연결 / 초안 생성
   │
   ▼
[Server API]
   │
   ▼
[Web App]
사용자 확인 / 수정 / 최종 활용
```

### Why This Architecture?

- AI 결과를 정답으로 취급하지 않습니다. 사용자가 직접 확인하고 수정합니다.
- AI 연결을 브라우저에 직접 노출하지 않습니다. 요청은 서버를 거칩니다.
- 진행 상태는 브라우저에 저장합니다. 같은 브라우저에서 이어서 작업할 수 있습니다.
- AI 없이도 전체 흐름을 확인할 수 있습니다. 가상 예시 데이터를 제공합니다.
- 공개 저장소에는 실제 지원자의 개인정보와 비공개 제품 로직을 포함하지 않습니다.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- AI API
- Vercel
- Browser localStorage

## 웹앱 로컬 실행

```bash
npm install
npm run dev
```

AI 분석은 서버 API를 거쳐 처리합니다. 이 저장소에는 API 키와 분석 지시문이 없고, 환경 변수 설정도 필요하지 않습니다. AI를 쓸 수 없는 경우에도 가상 예시로 모든 화면을 볼 수 있습니다.

## My Role

- AI Product Planning
- Problem Definition
- Career UX Flow Design
- AI Coaching Flow Design
- Prototype Development
- Web Deployment

## Learning Context

SeSAC AI PM 과정에서 학습한 문제정의, 산업·기업·직무 분석, 사용자 관점의 제품 설계 방법론을 바탕으로 개인적으로 확장 설계한 프로젝트입니다.

> Inspired by methodologies learned through the SeSAC AI PM Program. Independently designed and developed.

## Public Resources

| 경로 | 내용 |
|---|---|
| `assets/` | 프로젝트 소개 이미지 |
| `docs/product-overview.md` | 공개 가능한 제품 개요 |
| `templates/experience-journal.md` | 경험 정리 템플릿 |
| `templates/portfolio-case-study.md` | 포트폴리오 Case Study 템플릿 |
| `examples/fictional-candidate.md` | 가상 지원자 예시 |
| `app/`, `components/`, `lib/` | 공개 웹앱(Next.js) 화면과 가상 데모 데이터 |

## Demo Data Policy

공개 예시는 실제 지원자의 개인정보가 아닌 fictional sample data만 사용합니다. 이 저장소에는 실제 지원자의 이력서, 자기소개서, 연락처, 기업별 지원 기록을 포함하지 않습니다.

## Roadmap

- 면접 준비 기능은 아직 구현하지 않았습니다.
- BYOK(Bring Your Own Key)는 아직 구현하지 않았습니다. 사용자가 직접 AI provider와 API 키를 연결하는 방식을 검토 중입니다.

자세한 계획은 [ROADMAP.md](ROADMAP.md)에 있습니다.

## License

[MIT License](LICENSE). 이 저장소에 실제로 포함된 공개 파일에 한해 적용됩니다.
