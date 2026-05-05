import { allDecks } from '@/data/decks';

export async function seedIfEmpty() {
  const { getDb } = await import('./db');
  const db = getDb();
  const wordCount = await db.words.count();
  if (wordCount > 0) return;

  const allWords = allDecks.flatMap((b) => b.words);
  const decks = allDecks.map((b) => b.deck);

  await db.transaction('rw', db.words, db.decks, async () => {
    await db.words.bulkPut(allWords);
    await db.decks.bulkPut(decks);
  });
}
