import { getDb } from './db';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * 연속 학습일 수. 오늘 또는 어제까지 매일 1회 이상 review가 있으면 카운트.
 * 오늘 아직 학습 전이라도 어제 이전까지 연속이면 streak가 끊기지 않음.
 */
export async function computeStreak(): Promise<number> {
  const db = getDb();
  const logs = await db.logs.orderBy('reviewedAt').reverse().toArray();
  if (logs.length === 0) return 0;

  const days = new Set<string>();
  for (const log of logs) days.add(dayKey(log.reviewedAt));

  const now = Date.now();
  const todayKey = dayKey(now);
  let cursor = now;
  if (!days.has(todayKey)) cursor -= MS_PER_DAY;

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor -= MS_PER_DAY;
  }
  return streak;
}
