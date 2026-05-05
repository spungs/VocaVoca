import { getDb, type Disposition, type ReviewCard } from './db';
import { ensureCard } from './srs';

/**
 * 단어의 처분(disposition) 상태 변경.
 * - 'mastered' : 다 외움. 큐에서 영구 제외 (사용자가 복원 가능).
 * - 'skipped'  : 이 단어 안 배움. 큐에서 영구 제외.
 * -  null      : 처분 해제 → 다시 정상 학습 큐에 합류.
 *
 * 카드가 없으면 ensureCard로 빈 카드를 만든 뒤 처분 상태만 부여.
 * FSRS 학습 진척(stability/difficulty 등)은 그대로 보존되므로, 복원 시
 * 이전에 학습하던 데이터를 잃지 않음.
 */
export async function setDisposition(
  wordId: string,
  disposition: Disposition | null,
): Promise<ReviewCard> {
  const card = await ensureCard(wordId);
  const db = getDb();
  const next: ReviewCard = {
    ...card,
    disposition: disposition ?? undefined,
  };
  await db.cards.put(next);
  return next;
}
