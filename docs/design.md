# VocaVoca 설계 v0.1

> 2026-05-05 작성. 호주 워킹홀리데이(2027-05 출국 예정)를 대비한 영단어 암기 PWA.

## 목표

1년 뒤 호주 워홀에서 생존 가능한 영어 회화 어휘를 효율적으로 암기. 핵심 가설: **"회화의 1차 병목은 어휘량"**, 그리고 **워홀이라는 좁은 도메인은 일반 단어 앱이 정조준하지 않는다.**

## 차별화 축 (3개 통합)

1. **시나리오 기반 덱(deck)** — 카페/팜워크/호스텔/셰어하우스/관공서/일상의 6개 시나리오. 단어 + 호주식 표현 1~2개를 한 카드에.
2. **출국 D-day 역산 학습 플랜** — 12개월을 `생존(4M) → 직무별(5M) → 사회(3M)` 구간으로 자동 분배.
3. **호주 영어 기준** — `colour`, `arvo`, `mate`, `bottle-o` 같은 호주 특이성 명시. en-AU TTS 우선.

## 경쟁 앱 매트릭스

| 앱 | SRS | 강점 | VocaVoca 기회 |
|---|---|---|---|
| Anki | FSRS | 알고리즘, 무료 | UI 낡음, 콘텐츠 큐레이션 0 |
| Quizlet | 약함 | 라이브러리 | SRS 깊이 부족 |
| Memrise | 자체 | 게이미피케이션 | 호주 영어 코스 빈약 |
| Drops | 자체 | 5분 시각 UX | 5분 잠금이 답답 |
| WordUp | 빈도순 | Knowledge Map | 시나리오 없음 |

**차용**: Drops 5분 세션, WordUp 빈도순, Anki FSRS, Memrise 원어민 음성
**회피**: Quizlet 무한 카드, Anki 설정 노출, Drops 강제 stop

## 시나리오별 단어 카테고리 (출시 시 시나리오당 80~120개로 확장)

1. **Cafe / Hospitality** — 호주 메뉴(`flat white`, `long black`, `piccolo`, `magic`), `for here / to-go`, 변형 요청, 응대 정형구, EFTPOS
2. **Farm Work / Fruit Picking** — `picking/packing/pruning`, `bin/bucket`, `piece rate / hourly rate`, `smoko`, 88일 비자 용어
3. **Hostel / Backpacker** — `dorm`, `bunk`, `linen`, 슬랭(`mate`, `arvo`, `heaps`, `cheers`)
4. **Renting / Share House** — `lease`, `bond`, `inspection`, `condition report`, `bills included`
5. **관공서 / 행정 / 의료** — `TFN`, `Medicare`, `super`, `BSB`, `bulk-billed`, `chemist`
6. **일상 / 호주 슬랭** — `How ya going?`, `Yeah nah`, `arvo/servo/bottle-o/Macca's`

## 기술 스택

- **프레임워크**: Next.js 15 + App Router + TypeScript + Tailwind
- **로컬 저장**: Dexie (IndexedDB 래퍼)
- **SRS**: `ts-fsrs` (FSRS는 SM-2 대비 같은 유지율에서 복습 20-30% 감소)
- **PWA**: Serwist (next-pwa 후속, 활발히 유지보수됨)
- **TTS**: 브라우저 `SpeechSynthesis` (en-AU) → 부족하면 사전 생성 음성으로 보완
- **푸시**: Web Push API (iOS는 16.4+ 홈 화면 추가 필수)

## 데이터 모델

```ts
interface Word {
  id: string;
  term: string;
  ipa?: string;
  meaningKo: string;
  partOfSpeech?: 'noun' | 'verb' | 'phrase' | 'slang' | 'idiom';
  audioUrl?: string;
  imageUrl?: string;
  examples: { en: string; ko: string }[];
  tags: string[];        // ['cafe', 'aussie-slang']
  frequency: number;     // 시나리오 내부 우선순위
}

interface Deck {
  id: string;
  title: string;
  description: string;
  scenarioOrder: number; // D-day 학습 순서
  estimatedHours: number;
  wordIds: string[];
}

interface ReviewCard {
  id: string;            // == Word.id
  fsrs: import('ts-fsrs').Card;  // due, stability, difficulty, state, ...
  firstSeenAt: number;
  lastReviewedAt?: number;
  totalReviews: number;
}

interface ReviewLog {
  id?: number;
  cardId: string;
  rating: 1 | 2 | 3 | 4; // Again/Hard/Good/Easy
  reviewedAt: number;
  durationMs: number;
  scheduledDays: number;
  prevState: number;
}

interface StudyPlan {
  id: 'main';
  departureDate: number;
  startedAt: number;
  phases: {
    name: 'survival' | 'job-specific' | 'social';
    startWeek: number;
    endWeek: number;
    deckIds: string[];
    targetWordsPerDay: number;
  }[];
}

interface UserSettings {
  id: 'me';
  dailyNewCards: number;     // default 15
  dailyReviewCap: number;    // default 100
  preferredVoice: 'en-AU' | 'en-GB' | 'en-US';
  notifyAt?: string;         // '08:30'
  fsrsParams?: number[];
}
```

**Dexie 스토어 인덱스**

```
words:    'id, *tags, frequency'
decks:    'id, scenarioOrder'
cards:    'id, fsrs.due, fsrs.state, lastReviewedAt'
logs:     '++id, cardId, reviewedAt'
plans:    'id'
settings: 'id'
```

## 화면 플로우

```
온보딩 → 플랜 생성 → 홈 → 학습/복습 → 통계
                       ↓
                   덱 탐색
```

핵심 화면:
- **홈**: D-day, 스트릭, 오늘 신규/복습 수, 시작 버튼, 시나리오 진행률
- **학습/복습**: 카드 앞면(단어/IPA) → 보여주기 → 뒷면(뜻/예문) → Again/Hard/Good/Easy
- **덱 탐색**: 시나리오별 카드, 잠금/완료 상태
- **통계**: 일일 그래프, 보유 카드 수, 평균 정답률

## MVP 범위 (1차, 2~3주)

- ☐ 온보딩 + 출국일 입력 → 자동 플랜
- ☐ 시나리오 덱 2개 (Cafe, Hostel) × 80단어 = 160단어 시드
- ☐ 학습/복습 화면 + FSRS 4단계
- ☐ 오프라인 동작 (Service Worker + Dexie)
- ☐ en-AU 브라우저 TTS
- ☐ 홈 대시보드 + 스트릭

**보류 (2차)**: 푸시, 클라우드 동기화, AI 챗, 이미지/영상, 시나리오 +4개

## 데이터 출처 후보

- NGSL (New General Service List) — 일반 빈도, CC-BY-SA
- 시나리오 어휘는 직접 큐레이션 + Tenants' Union NSW, Study Australia, Hostelworld 가이드 참조
- 음성: 우선 브라우저 TTS, 차후 ElevenLabs/Google TTS pre-gen
