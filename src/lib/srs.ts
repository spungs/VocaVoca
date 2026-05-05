import { fsrs, createEmptyCard, Rating, type FSRS, type Grade } from 'ts-fsrs';
import {
  fromFSRSCard,
  getDb,
  toFSRSCard,
  type ReviewCard,
  type ReviewLog,
} from './db';

let _scheduler: FSRS | null = null;
function scheduler(): FSRS {
  if (!_scheduler) _scheduler = fsrs();
  return _scheduler;
}

/** Ensure a ReviewCard row exists for the given word id; create one if not. */
export async function ensureCard(wordId: string): Promise<ReviewCard> {
  const db = getDb();
  const existing = await db.cards.get(wordId);
  if (existing) return existing;
  const empty = createEmptyCard();
  const now = Date.now();
  const card = fromFSRSCard(wordId, empty, { firstSeenAt: now, totalReviews: 0 });
  await db.cards.put(card);
  return card;
}

/** Apply a rating to a card and persist the new state + log. */
export async function rateCard(
  card: ReviewCard,
  rating: Grade,
  durationMs: number,
): Promise<ReviewCard> {
  const db = getDb();
  const result = scheduler().next(toFSRSCard(card), new Date(), rating);
  const next = fromFSRSCard(card.id, result.card, {
    firstSeenAt: card.firstSeenAt,
    totalReviews: card.totalReviews + 1,
    lastReviewedAt: Date.now(),
  });
  const log: ReviewLog = {
    cardId: card.id,
    rating,
    reviewedAt: Date.now(),
    durationMs,
    scheduledDays: result.card.scheduled_days,
    prevState: card.state,
  };
  await db.transaction('rw', db.cards, db.logs, async () => {
    await db.cards.put(next);
    await db.logs.add(log);
  });
  return next;
}

/** Cards whose due date has passed. disposition이 설정된 카드는 제외. */
export async function dueCards(limit: number): Promise<ReviewCard[]> {
  const db = getDb();
  return db.cards
    .where('due')
    .belowOrEqual(new Date())
    .filter((c) => !c.disposition)
    .limit(limit)
    .toArray();
}

/**
 * Words that don't yet have a ReviewCard, ordered by frequency desc, limited.
 * 카드가 있는 단어는 모두 제외 (disposition 단어 포함 — 일단 처분된 단어는 신규 큐에 다시 안 들어감).
 */
export async function newWordIds(limit: number): Promise<string[]> {
  const db = getDb();
  const cardIds = new Set((await db.cards.toCollection().primaryKeys()) as string[]);
  const words = await db.words.orderBy('frequency').reverse().toArray();
  const out: string[] = [];
  for (const w of words) {
    if (cardIds.has(w.id)) continue;
    out.push(w.id);
    if (out.length >= limit) break;
  }
  return out;
}

export { Rating };
