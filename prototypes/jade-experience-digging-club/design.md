# design.md - 경험디깅클럽 (Career Wave) 디자인 가이드

## 1. 디자인 컨셉: Editorial Library & Digging Club

**경험디깅클럽 (Career Wave)** - 취업 준비를 위한 경험 아카이빙 & AI 경험 디깅 유틸리티 서비스.

본 디자인 가이드는 사용자의 이전 디자인 변경 요청("올리브 메인컬러, 사진 속 핑크 활용, 어울리는 브라운까지 넣어서 있어보이게 디자인해줘")을 수용하여 완성된 **에디토리얼 라이브러리 (Editorial Library)** 팔레트 규격입니다.
단순하고 차가운 일반 서비스 UI에서 벗어나, 고풍스럽고 세련된 매거진/도서관 분위기를 전달하여 구직자가 자신의 커리어 경험을 깊이 있게 발굴("디깅")할 수 있도록 돕습니다.

---

## 2. 핵심 컬러 팔레트 (Color Tokens)

### 메인 브랜드 & 포인트 컬러
- **Main Olive Green (`#6B7C32`)**:
  - 브랜드 메인 액센트 컬러.
  - 버튼, 활성화된 메인 탭, 아이콘, 주요 배너 포인트에 활용.
  - Hover: `#5A6929`
  - Soft Tint Background: `#F0F4E5` (Border: `#D3DEB4`)
- **Dusty Pink Accent (`#DF8888`)**:
  - 감각적인 핑크 포인트 컬러.
  - 마키 배너 브랜드 칩, 삭제/위험 요소 액션, 포인트 태그 하이라이트에 사용.
  - Hover: `#C56767`
  - Soft Tint Background: `#F9EBEB`
- **Espresso Brown (`#2E2219`)**:
  - 구조 및 고대비 텍스트를 담당하는 깊고 따뜻한 브라운.
  - 순수 검정(#000000) 대신 메인 헤딩, 카드 제목, 모달 타이틀 및 네비게이션 텍스트에 적용.
  - Subtext Brown: `#7D6555`

### 서피스 및 배경 컬러
- **Base Canvas (`#FAF7F2`)**: 따뜻하고 눈이 편안한 크림/오프화이트 바탕.
- **Card / Modal Surface (`#FFFDF9`)**: 깔끔한 에그쉘 화이트 카드 및 레이어 모달 배경.
- **Warm Border (`#E8DEC8`)**: 섹션 구분용 부드러운 모래빛 테두리.

---

## 3. 주요 구성 요소 디자인 규격

1. **Header & Marquee Banner**
   - 올리브 그린 서클 로고 + 에스프레소 브라운 브랜딩.
   - 상단 3개 메인 탭 (경험 아카이브, AI 대화 발굴, 마이페이지) 스위처.
   - 핑크 액센트 칩("HOT JOB")이 어우러진 흘러가는 에스프레소 브라운 마키 배너.

2. **Dashboard & Statistics Cards**
   - 카테고리별 경험 아카이빙 수치 통계 카드.
   - AI 기반 맞춤 자소서 추천 카드.

3. **Archive View & Filter Tabs**
   - 직무 역량 및 활동 종류 필터링 칩.
   - 경험 항목별 STAR 구조화 카드 및 상세 모달 뷰.

4. **AI Conversation Digging Modal & Draft Generator**
   - 실시간 대화형 AI 발굴 인터페이스 (`#FAF7F2` 대화창, `#6B7C32` AI 챗버블).
   - 직무 자소서 문항별 자동 초안 작성 및 완성도 분석 툴.
