# VocaVoca Task — 단어 콘텐츠 채우기 & 시드 배선

> 기준일: 2026-05-05
> 컨텍스트: `/effort high` 모드로 카페 12 → 80개 + 호스텔 80개 단어 콘텐츠 작성을 시작했고,
> 현재 단어 파일은 다 작성됐지만 시드 로더가 아직 새 데이터를 사용하지 않는 상태.

---

## ✅ 완료

### 1. Cafe 덱 80개 단어 큐레이션
- 파일: `src/data/decks/cafe.ts`
- 카테고리 구성:
  - 메뉴/음료 15개
  - 사이즈 6개
  - 우유/모디파이어 10개
  - 푸드 12개
  - 서비스 표현 17개
  - 도구/매장 10개
  - 직장 슬랭 10개
- 패턴: `export const cafeDeck = { deck, words }`
- 호주 한정 어휘는 `aussie` 태그.

### 2. Hostel 덱 80개 단어 큐레이션
- 파일: `src/data/decks/hostel.ts`
- 카테고리 구성:
  - 체크인 12개
  - 룸/베드 10개
  - 시설 15개
  - 규칙 8개
  - 컴플레인 10개
  - 결제 5개
  - 사교 10개
  - 호주식 슬랭 10개
- 핵심 표현 포함: "How ya going?", "no worries", "mate", "Where are you from?"

---

## ⏳ 남은 작업

### 3. 데이터 구조 리팩터링 — `src/data/decks/*` 배선 (Task #11)
**왜 중요**: 현재 `src/lib/seed.ts`는 여전히 인라인 카페 12개 단어만 가지고 있어,
80×2 단어 콘텐츠가 작성됐어도 앱이 사용하지 않음.

해야 할 것:
- [ ] `src/data/decks/index.ts` 배럴 export 생성
  ```ts
  import { cafeDeck } from './cafe';
  import { hostelDeck } from './hostel';
  export const allDecks = [cafeDeck, hostelDeck];
  ```
- [ ] `src/lib/seed.ts` 리팩터:
  - 인라인 `seedWords` / `seedDecks` 제거
  - `import { allDecks } from '@/data/decks'`
  - `seedIfEmpty()`에서 `allDecks` 순회하며 `db.words.bulkPut` / `db.decks.bulkPut`
  - 각 deck의 `wordIds`는 자체 `words` 배열에서 추출

### 4. 홈 화면 업데이트 (Task #14)
파일: `src/app/page.tsx`

해야 할 것:
- [ ] 두 번째 덱(hostel) 노출 — `db.decks.orderBy('scenarioOrder')` 가 자동 처리하므로 데이터만 들어가면 됨
- [ ] 덱별 학습 진행도 표시 (예: "12 / 80 학습됨")
  - `db.cards.where('id').anyOf(deck.wordIds).count()` 같은 쿼리 필요
  - 또는 `state` 통과시 `Map<deckId, learnedCount>` 형태로 미리 계산

### 5. 검증 & 커밋 (Task #15)
- [ ] 중복 word ID 검증 (160개 ID 중 중복 없음 확인)
  - 스크립트 또는 빌드 시 콘솔 검증
- [ ] `pnpm lint` — React 19 strict 규칙 통과 확인
- [ ] `pnpm build` — Next.js 16 + Turbopack 빌드 통과 확인
- [ ] 변경 파일 커밋
  - 커밋 메시지 후보: `feat: 카페·호스텔 덱 80×2 단어 + 시드 배선`

---

## 파일 트리 (현재 → 최종)

```
src/
├── data/
│   └── decks/
│       ├── cafe.ts          ✅ 80 entries
│       ├── hostel.ts        ✅ 80 entries
│       └── index.ts         ⏳ 배럴 export 필요
└── lib/
    ├── seed.ts              ⏳ 인라인 12개 → allDecks 사용으로 리팩터
    ├── db.ts                (수정 없음)
    ├── srs.ts               (수정 없음)
    └── plan.ts              (수정 없음)
```

---

## 참고
- `AGENTS.md`: Next.js 16 breaking changes — 새 기능 작업 전 `node_modules/next/dist/docs/` 확인
- 기술 스택: pnpm + Next.js 16 + Tailwind 4 + React 19 strict + Dexie + ts-fsrs
- React 19 주의: 렌더 중 `Date.now()`/`Math.random()` 금지, useEffect setState 회피
