# 공동 작업 가이드

AI Career Insight Coach는 공개 저장소입니다. 제품 화면, 공개 인터페이스와 합성
예시만 커밋합니다. 실제 지원자 정보, API 키, 비공개 프롬프트와 내부 평가 기준은
올리지 않습니다.

## 시작

```bash
git clone https://github.com/kordp888/career-insight-coach.git
cd career-insight-coach
npm ci
git switch develop
git pull --ff-only origin develop
git switch -c feature/<github-id>/<work>
```

브랜치 이름은 작업자와 범위가 드러나게 작성합니다.

```text
feature/minsu/experience-editor
fix/jiyun/mobile-navigation
docs/minsu/api-contract
```

## 작업 흐름

1. `develop` 최신 상태에서 작업 브랜치를 만듭니다.
2. 한 브랜치에는 하나의 목적만 담습니다.
3. 로컬 검사를 실행합니다.
4. 작업 브랜치를 origin에 push합니다.
5. `develop`을 대상으로 Pull Request를 엽니다.
6. 통합 검증이 끝난 `develop`만 `main`으로 승격합니다.

```bash
npm test
npm run lint
npm run build
git push -u origin HEAD
```

Production 반영 PR은 `develop`에서 `main`으로 만듭니다. `main` push나 수동
Vercel 배포는 하지 않습니다. GitHub와 연결된 Vercel 자동 배포를 사용합니다.

## 커밋

커밋 메시지는 변경 목적을 바로 확인할 수 있게 작성합니다.

```text
feat: 경험 편집 순서 이동 추가
fix: 모바일 단계 탐색 오버플로 수정
docs: 공개 API 입력 예시 보완
test: 문서 생성 조건 회귀 테스트 추가
```

## 공개 저장소 안전 기준

다음 내용은 커밋하지 않습니다.

- API 키, 비밀번호, 인증 토큰과 `.env` 파일
- 실제 이름, 연락처, 생년월일, 지원서와 채용공고 비공개 자료
- 비공개 시스템 프롬프트와 모델 선택 규칙
- 내부 평가식, 임곗값, 검수·승인 로직
- 운영 자동화의 내부 구조

Pull Request를 만들기 전에 아래 검사를 실행합니다.

```bash
git diff --check
git grep -n "POTENS_API_KEY="
git grep -n "OPENAI_API_KEY="
git grep -n "ANTHROPIC_API_KEY="
git grep -n "sk-"
```

발견된 문자열이 문서의 금지 예시인지 실제 값인지 직접 확인합니다. 실제 비밀값이
있으면 push하지 말고 저장소 관리자에게 알립니다.

## 리뷰 기준

리뷰에서는 사용자 입력을 지어내지 않는지, AI 실패 시 예시 데이터로 자동
전환하지 않는지, 모바일과 키보드 탐색이 유지되는지 확인합니다. 화면 변경에는
합성 데이터로 만든 스크린샷이나 재현 절차를 PR에 첨부합니다.
