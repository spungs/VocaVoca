# VocaVoca Task

> 기준일: 2026-05-05
> 호주 워홀 출국까지 약 12개월. PWA 1차 MVP를 점진적으로 살찌우는 단계.

---

## ✅ 완료

### 데이터·시드 (커밋 `f0c95e2`)
- `src/data/decks/{cafe,hostel,index}.ts` — Cafe 80개, Hostel 80개
- `src/lib/seed.ts` 리팩터: `allDecks` 순회로 `bulkPut`
- `Word.partOfSpeech`에 `'phrasal-verb'` 추가
- 홈 화면에 덱별 학습 진행도 표시 (`learned/total`)

### VocaVoca Redesign 디자인 적용 (커밋 `8491ae4`)
- 디자인 토큰 (warm cream + amber + eucalyptus 팔레트, 라이트/다크 변수)
- Pretendard·Inter·JetBrains Mono 폰트 셋업
- 홈 (`/`): D-day hero(64px) + 🔥 스트릭 칩 + 다크 톡카드 + 시나리오 덱 행
- 학습 (`/study`): 큰 단어(48px) + IPA + en-AU 발음 버튼,
  분절 진행바, 4방향 스와이프 (← Again ↓ Hard ↑ Good Easy →) 컬러 스탬프, 4-color 평가 버튼
- 완료: SVG 태양 뱃지 + 학습/정답률 미니 통계
- `/stats` 신규 라우트: 이번 주 hero + 14일 막대 + 단계별 진행 + 자주 틀리는 단어
- `src/lib/streak.ts`: 연속 학습일 계산 헬퍼

### 부가 작업
- `/settings` 페이지: 학습 분량(신규/복습) segmented, 음성(en-AU/GB/US) 라디오,
  출국일 date picker (변경 시 plan 재생성, startedAt 보존), 학습 진척 초기화 (cards/logs만 비움, 단어/덱 유지)
- `daily` 덱 80개: 인사·교통·쇼핑·식사·날씨·의료·사교·일상 슬랭 (호주 컨텍스트 유지)

---

## ⏳ 남은 작업

### 1. 추가 시나리오 덱 (4개)
plan.ts에 정의돼 있으나 콘텐츠 미작성:
- [ ] **farm** (job-specific) — 농장·picking·packing 어휘 ~80개
- [ ] **sharehouse** (job-specific) — 셰어하우스 룸메이트·집세·집주인 ~80개
- [ ] **admin** (social) — 관공서·은행·계약 ~80개
- [ ] **slang** (social) — 호주 슬랭 종합 (다른 덱과 중복 주의) ~60개

### 2. 다크 모드 / 액센트 토글
- 현재는 `prefers-color-scheme` 자동만 따름
- 디자인의 Tweaks 패널 대응 = 인앱 토글 (light/dark/system) + accent 4종(amber/eucalyptus/coral/sky)
- 위치: `/settings`에 섹션 추가

### 3. PWA 알림
- `UserSettings.notifyAt` 필드는 있으나 미사용
- Web Push? Local notifications API? 보통 PWA는 시간 기반 알림이 까다로워 우선순위 낮음
- 선택지: 단순 "오늘 할 일 있어요" 배지 (badging API) 부터 시작

### 4. 자주 틀리는 단어 → 학습 진입
- `/stats`에서 단어 행 클릭 시 해당 단어만 학습할 수 있는 mini 큐 진입

### 5. 검증·운영
- [ ] 모바일 실기 테스트 (사용자 진행 중) — 스와이프, en-AU TTS, PWA 설치, 다크 모드
- [ ] FSRS 파라미터 튜닝 (지금은 ts-fsrs 기본값) — 본인 데이터로 학습 후 적용

---

## 파일 트리 (현재)

```
src/
├── app/
│   ├── globals.css            ✅ 디자인 토큰
│   ├── layout.tsx             ✅ Inter + JetBrains Mono
│   ├── page.tsx               ✅ 홈 리디자인
│   ├── stats/page.tsx         ✅ 통계 리포트
│   ├── settings/page.tsx      ✅ 설정 페이지
│   └── study/page.tsx         ✅ 학습 + 스와이프 + 완료
├── data/
│   └── decks/
│       ├── index.ts           ✅ allDecks 배럴
│       ├── cafe.ts            ✅ 80개
│       ├── hostel.ts          ✅ 80개
│       └── daily.ts           ✅ 80개
└── lib/
    ├── db.ts
    ├── srs.ts
    ├── plan.ts                ✅ buildDefaultPlan(date, startedAt?)
    ├── seed.ts                ✅ allDecks 사용
    ├── streak.ts              ✅ 연속 학습일
    └── bootstrap.ts
```

---

## 참고
- `AGENTS.md`: Next.js 16 breaking changes — 새 기능 작업 전 `node_modules/next/dist/docs/` 확인
- 기술 스택: pnpm + Next.js 16 + Tailwind 4 + React 19 strict + Dexie + ts-fsrs
- React 19 주의: 렌더 중 `Date.now()`/`Math.random()` 금지 → `useCallback`으로 감싸 의도 명시
- 디자인 핸드오프 번들: `/tmp/vocavoca-design/vocavoca/` (chats + project HTML)
