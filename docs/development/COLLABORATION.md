# 브랜치와 배포 운영

## 브랜치 구조

```text
main
└── develop
    ├── feature/<github-id>/<work>
    ├── fix/<github-id>/<work>
    └── docs/<github-id>/<work>
```

`main`은 Production 기준입니다. `develop`은 여러 작업을 합치는 통합
브랜치입니다. 공동 작업자는 개인 작업 브랜치에 push하고 `develop`으로 Pull
Request를 보냅니다.

## 권한

| 대상 | 권한 | 방식 |
|---|---|---|
| 저장소 관리자 | Admin | 설정, 병합, 배포 상태 확인 |
| 공동 작업자 | Write | 작업 브랜치 생성·push, PR 작성 |
| 외부 기여자 | Read | Fork 후 PR |

Write 권한은 GitHub 사용자명을 확인한 뒤 저장소 관리자가 초대합니다. 공동
작업자는 `main`에 직접 push하지 않습니다.

## 병합 흐름

```text
작업 브랜치
→ PR to develop
→ CI와 리뷰
→ develop 통합
→ PR from develop to main
→ CI와 최종 확인
→ main 병합
→ Vercel Git 자동 Production 배포
```

작업 PR은 squash merge를 기본으로 사용합니다. Production PR에는 사용자 영향,
검증 결과와 되돌리는 방법을 적습니다.

## 충돌 방지

같은 파일을 동시에 수정해야 하면 PR을 열기 전에 담당 범위를 나눕니다. 먼저
병합된 변경을 다음 작업 브랜치에 반영합니다.

```bash
git fetch origin
git rebase origin/develop
```

공유된 브랜치에는 force push하지 않습니다. 개인 작업 브랜치에서 rebase가
필요하면 기존 리뷰가 무효가 될 수 있음을 PR에 알립니다.

## 배포

Pull Request에는 Vercel Preview가 자동 생성됩니다. `main` 병합은 Vercel
Production 배포를 자동으로 시작합니다. CLI 수동 배포는 사용하지 않습니다.

배포 완료 후 다음을 확인합니다.

```bash
curl -fsS https://career-insight-coach.vercel.app/api/version
curl -fsS https://career-insight-coach.vercel.app/api/status
```

`/api/version` 커밋이 GitHub `main`과 다르면 배포 완료로 처리하지 않습니다.
