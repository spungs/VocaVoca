# VocaVoca Task

> 기준일: 2026-05-05
> 호주 워홀 출국까지 약 12개월. PWA 1차 MVP 콘텐츠·UX 골조 완성 단계.

---

## ✅ 완료

### 콘텐츠 (7/7 덱, 560개 단어)
| 덱 | 단어 | 단계 | 커밋 |
|---|---|---|---|
| cafe | 80 | survival | `f0c95e2` |
| hostel | 80 | survival | `f0c95e2` |
| daily | 80 | survival | `c97143e` |
| farm | 80 | job-specific | `3ae8b3f` |
| sharehouse | 80 | job-specific | `ae02df4` |
| admin | 80 | social | `76ff793` |
| slang | 80 | social | `eb22178` |

- cross-deck 중복 ID/term 0건
- `partOfSpeech`에 `'phrasal-verb'` 추가
- `seed.ts`가 `allDecks` 배럴을 순회해 `bulkPut`

### UX / 디자인 (claude.ai/design 핸드오프 적용)
- 디자인 토큰 (warm cream + amber + eucalyptus, light/dark)
- Pretendard·Inter·JetBrains Mono
- 홈: D-day hero(64px) + 🔥 스트릭 칩 + 다크 톡카드 + 시나리오 덱
- 학습: 큰 단어(48px) + IPA + en-AU 발음, 4방향 스와이프 (← Again ↓ Hard ↑ Good Easy →) 컬러 스탬프, 4-color 평가 버튼
- 완료: SVG 태양 뱃지 + 학습/정답률 미니 통계
- `/stats`: 이번 주 hero + 14일 막대 차트 + 단계별 진행 + 자주 틀리는 단어
- `/settings`: 학습 분량·음성·목표·출국일·진척 초기화·**테마 토글**

### 부가 기능
- 자주 틀리는 단어 → 미니 학습 진입 (`/study?ids=...`)
- 다크 모드 / 액센트 인앱 토글 (시스템·라이트·다크 + amber/eucalyptus/coral/sky), localStorage + FOUC 방지 inline script
- 사용자 입력 목표 라벨 (`StudyPlan.goalLabel` — "호주 워홀" / "TOEIC 800" 등)
- 연속 학습일 (`computeStreak()` — 오늘/어제 기준 거꾸로 누적)

### 버그 픽스
- TTS가 `settings.preferredVoice` 무시하던 문제 (`4b3f549`)
- TTS 버튼이 IPA 없는 단어에선 가려지던 문제 (`c7d9c6c`)
- 하이드레이션 mismatch — `<html>`에 `suppressHydrationWarning` (`97552b5`)
- React 19 `Date.now()` 순수성 룰 — `useCallback`으로 감싸 의도 명시

---

## ⏳ 남은 작업

### 1. 모바일 실기 검증 (사용자 측)
- 폰에서 `http://192.168.219.101:3000` 접속해 점검
- 스와이프 제스처, en-AU TTS, 다크 모드 전환, PWA 설치 흐름
- 호주 슬랭 덱 단어가 어색하지 않은지 (구식·욕설성 표현 잡아내기)

### 2. PWA 알림
- `UserSettings.notifyAt` 필드는 있으나 미사용
- 옵션:
  - 단순: Notification API + setTimeout (브라우저 활성 시만 동작)
  - 본격: Web Push API + Service Worker + VAPID 키 (서버 필요)
  - PWA badge: 오늘 할 일 N 표시 (Badge API)
- 호주 워홀까지 12개월이라 일일 복습 알림이 가장 가성비 좋음

### 3. FSRS 파라미터 튜닝
- 지금은 ts-fsrs 기본값
- 본인 학습 데이터(logs) 1~2개월 쌓인 후 `ts-fsrs/optimizer`로 개인화

### 4. 스크린샷·PWA 메타데이터
- `/public`에 앱 아이콘 (현재 V 글자 placeholder), splash screen
- `manifest.ts`의 `icons`/`screenshots` 채우기

### 5. 콘텐츠 큐레이션 후속
- 슬랭 덱 빈도 검증 (정말 자주 듣는지 vs 죽은 표현)
- 각 단어의 example 다양성 (현재 1~2개) — 본인 학습 후 부족한 단어 보강
- audioUrl: 직접 녹음한 호주식 발음 추가 가능 (장기)

---

## 파일 트리 (현재)

```
src/
├── app/
│   ├── globals.css            ✅ 디자인 토큰
│   ├── layout.tsx             ✅ Inter+JetBrains Mono + theme init script
│   ├── page.tsx               ✅ 홈 (D-day, 스트릭, 시나리오 덱)
│   ├── stats/page.tsx         ✅ 통계 리포트
│   ├── settings/page.tsx      ✅ 설정 (테마 포함)
│   └── study/page.tsx         ✅ 학습 + 스와이프 + 완료 (?ids 미니 학습)
├── data/
│   └── decks/
│       ├── index.ts           ✅ allDecks 배럴 (7개)
│       ├── cafe.ts            ✅ 80
│       ├── hostel.ts          ✅ 80
│       ├── daily.ts           ✅ 80
│       ├── farm.ts            ✅ 80
│       ├── sharehouse.ts      ✅ 80
│       ├── admin.ts           ✅ 80
│       └── slang.ts           ✅ 80
└── lib/
    ├── db.ts                  ✅ Dexie 스키마
    ├── srs.ts                 ✅ FSRS 래퍼
    ├── plan.ts                ✅ buildDefaultPlan(date, startedAt?, goalLabel?)
    ├── seed.ts                ✅ allDecks 순회
    ├── streak.ts              ✅ 연속 학습일
    ├── theme.ts               ✅ light/dark/system + accent
    └── bootstrap.ts           ✅ 1회 셋업 + plan goalLabel 마이그레이션
```

---

## 참고
- `AGENTS.md`: Next.js 16 breaking changes — 새 기능 작업 전 `node_modules/next/dist/docs/` 확인
- 기술 스택: pnpm + Next.js 16 + Tailwind 4 + React 19 strict + Dexie + ts-fsrs
- React 19 주의: 렌더 중 `Date.now()`/`Math.random()` 금지 → `useCallback`으로 감싸 의도 명시. effect 안 setState도 회피 (lazy initializer 사용).
- 디자인 핸드오프 번들: `/tmp/vocavoca-design/vocavoca/`
