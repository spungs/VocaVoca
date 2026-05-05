import { allDecks } from '@/data/decks';

/**
 * 매 부팅마다 호출되는 시드 보강.
 * "비어 있을 때만"이 아니라 "현재 적재량이 코드의 예상량보다 적으면 보강"
 * — 새 덱이 추가됐을 때 기존 사용자도 자동으로 받게 함.
 *
 * bulkPut은 ID 기준 덮어쓰기라 같은 ID 단어는 코드 쪽 정의로 갱신,
 * 학습 상태(cards/logs)는 건드리지 않으므로 진척이 사라지지 않음.
 */
export async function seedIfEmpty() {
  const { getDb } = await import('./db');
  const db = getDb();
  const wordCount = await db.words.count();
  const deckCount = await db.decks.count();

  const allWords = allDecks.flatMap((b) => b.words);
  const decks = allDecks.map((b) => b.deck);

  if (wordCount >= allWords.length && deckCount >= decks.length) return;

  await db.transaction('rw', db.words, db.decks, async () => {
    await db.words.bulkPut(allWords);
    await db.decks.bulkPut(decks);
  });
}
