import type { Deck, Word } from './db';

// First-pass seed: 12 high-priority cafe terms. We'll grow each deck to 80~120 later.
export const seedWords: Word[] = [
  {
    id: 'cafe-flat-white',
    term: 'flat white',
    ipa: '/flæt waɪt/',
    meaningKo: '에스프레소 + 미세 거품 우유 (호주식 라떼)',
    partOfSpeech: 'noun',
    examples: [
      { en: 'Can I get a flat white, please?', ko: '플랫화이트 한 잔 주세요.' },
    ],
    tags: ['cafe', 'menu', 'aussie'],
    frequency: 100,
  },
  {
    id: 'cafe-long-black',
    term: 'long black',
    ipa: '/lɒŋ blæk/',
    meaningKo: '에스프레소 위에 뜨거운 물을 부은 호주식 아메리카노',
    partOfSpeech: 'noun',
    examples: [{ en: 'A long black to go, thanks.', ko: '롱블랙 테이크아웃이요.' }],
    tags: ['cafe', 'menu', 'aussie'],
    frequency: 95,
  },
  {
    id: 'cafe-piccolo',
    term: 'piccolo',
    ipa: '/ˈpɪkəloʊ/',
    meaningKo: '리스트레토에 우유를 살짝 더한 작은 라떼',
    partOfSpeech: 'noun',
    examples: [{ en: 'Two piccolos, please.', ko: '피콜로 두 잔 주세요.' }],
    tags: ['cafe', 'menu', 'aussie'],
    frequency: 80,
  },
  {
    id: 'cafe-for-here',
    term: 'for here',
    meaningKo: '매장에서 드세요? (= dine in)',
    partOfSpeech: 'phrase',
    examples: [{ en: 'For here or to-go?', ko: '매장이세요, 테이크아웃이세요?' }],
    tags: ['cafe', 'service'],
    frequency: 98,
  },
  {
    id: 'cafe-to-go',
    term: 'to-go',
    meaningKo: '포장 (= take-away, 호주는 take-away가 더 흔함)',
    partOfSpeech: 'phrase',
    examples: [{ en: 'I’ll have it to-go.', ko: '테이크아웃 할게요.' }],
    tags: ['cafe', 'service'],
    frequency: 97,
  },
  {
    id: 'cafe-anything-else',
    term: 'Anything else?',
    meaningKo: '더 필요하신 거 있으세요?',
    partOfSpeech: 'phrase',
    examples: [
      { en: 'Anything else for you today?', ko: '오늘 더 필요하신 거 있으세요?' },
    ],
    tags: ['cafe', 'service', 'frozen-phrase'],
    frequency: 96,
  },
  {
    id: 'cafe-tap-or-insert',
    term: 'tap or insert',
    meaningKo: '카드 태그할까요, 꽂으실까요?',
    partOfSpeech: 'phrase',
    examples: [{ en: 'Tap or insert?', ko: '태그하실래요, 꽂으실래요?' }],
    tags: ['cafe', 'payment', 'aussie'],
    frequency: 90,
  },
  {
    id: 'cafe-eftpos',
    term: 'EFTPOS',
    ipa: '/ˈɛftpɒs/',
    meaningKo: '호주의 카드결제 단말기/방식 (Electronic Funds Transfer at Point of Sale)',
    partOfSpeech: 'noun',
    examples: [{ en: 'Sorry, EFTPOS only.', ko: '죄송해요, 카드만 받아요.' }],
    tags: ['cafe', 'payment', 'aussie'],
    frequency: 85,
  },
  {
    id: 'cafe-decaf',
    term: 'decaf',
    ipa: '/ˈdiːkæf/',
    meaningKo: '디카페인',
    partOfSpeech: 'adjective',
    examples: [{ en: 'A decaf flat white, please.', ko: '디카페인 플랫화이트요.' }],
    tags: ['cafe', 'modifier'],
    frequency: 88,
  },
  {
    id: 'cafe-oat-milk',
    term: 'oat milk',
    meaningKo: '귀리 우유 (호주에서 매우 흔함)',
    partOfSpeech: 'noun',
    examples: [{ en: 'Can I swap to oat milk?', ko: '오트 밀크로 바꿀 수 있을까요?' }],
    tags: ['cafe', 'modifier'],
    frequency: 92,
  },
  {
    id: 'cafe-extra-shot',
    term: 'extra shot',
    meaningKo: '에스프레소 한 샷 추가',
    partOfSpeech: 'phrase',
    examples: [{ en: 'With an extra shot.', ko: '샷 추가해 주세요.' }],
    tags: ['cafe', 'modifier'],
    frequency: 87,
  },
  {
    id: 'cafe-smoko',
    term: 'smoko',
    ipa: '/ˈsmoʊkoʊ/',
    meaningKo: '담배 휴식 → 일반 짧은 휴식 (호주 직장 슬랭)',
    partOfSpeech: 'slang',
    examples: [{ en: 'I’m off on smoko.', ko: '잠깐 쉬고 올게요.' }],
    tags: ['cafe', 'aussie', 'slang'],
    frequency: 70,
  },
];

export const seedDecks: Deck[] = [
  {
    id: 'cafe',
    title: '카페 / 첫 출근',
    description: '호주 카페에서 주문 받고 응대할 때 가장 자주 쓰는 표현',
    scenarioOrder: 1,
    estimatedHours: 3,
    wordIds: seedWords.filter((w) => w.tags.includes('cafe')).map((w) => w.id),
  },
];

export async function seedIfEmpty() {
  const { getDb } = await import('./db');
  const db = getDb();
  const wordCount = await db.words.count();
  if (wordCount > 0) return;
  await db.transaction('rw', db.words, db.decks, async () => {
    await db.words.bulkPut(seedWords);
    await db.decks.bulkPut(seedDecks);
  });
}
