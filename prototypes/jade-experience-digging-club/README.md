# Experience Digging Club, Jade Prototype

Jade가 제안한 경험 발굴·정리 UI를 통합 검토하기 위한 독립 프로토타입입니다.
Career Insight Coach의 Production 코드와 분리되어 있습니다.

## 현재 범위

- 경험 대시보드와 아카이브
- 대화형 경험 발굴 화면
- 직접 입력 화면
- 자소서 문항과 경험 연결 화면
- 브라우저 저장, 내보내기와 불러오기

화면의 초기 데이터는 합성 예시입니다. AI 서버 구현과 비공개 지시문은 공개
저장소에 포함하지 않습니다. AI 요청은 현재 `503` 오류를 반환하며 예시 결과로
자동 전환하지 않습니다.

## 실행

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

## 통합 원칙

이 디렉터리를 Production 앱에 그대로 병합하지 않습니다. 필요한 화면과
상호작용을 작업 단위로 옮기고, 기존 Career Coach 데이터 구조와 공개 API
계약에 맞춘 뒤 각각 Pull Request로 검증합니다.
