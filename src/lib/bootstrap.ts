import { getDb, type StudyPlan, type UserSettings } from './db';
import { buildDefaultPlan, DEFAULT_GOAL_LABEL } from './plan';
import { seedIfEmpty } from './seed';

export interface BootstrapResult {
  plan: StudyPlan;
  settings: UserSettings;
}

/**
 * Idempotent first-run setup. Safe to call on every page load.
 * - Seeds the cafe deck if `words` is empty.
 * - Creates a default StudyPlan (departure = today + 365d) if none exists.
 * - Creates default UserSettings if none exist.
 * - 마이그레이션: 과거 eager ensureCard로 생성된 뒤 평가되지 않은
 *   "유령 카드"를 제거. 이 카드들은 due가 즉시여서 복습 카운트를
 *   부풀리는 버그의 원인.
 */
export async function bootstrap(): Promise<BootstrapResult> {
  const db = getDb();
  await seedIfEmpty();

  // 평가 안 된 New 카드 정리 (disposition 있는 건 보존 — 사용자가 skipped 표시 가능)
  const orphans = await db.cards
    .where('state')
    .equals(0)
    .filter((c) => c.totalReviews === 0 && !c.disposition)
    .toArray();
  if (orphans.length > 0) {
    await db.cards.bulkDelete(orphans.map((c) => c.id));
  }

  let plan = await db.plans.get('main');
  if (!plan) {
    const defaultDeparture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    plan = buildDefaultPlan(defaultDeparture);
    await db.plans.put(plan);
  } else if (!plan.goalLabel) {
    plan = { ...plan, goalLabel: DEFAULT_GOAL_LABEL };
    await db.plans.put(plan);
  }

  let settings = await db.settings.get('me');
  if (!settings) {
    settings = {
      id: 'me',
      dailyNewCards: 15,
      dailyReviewCap: 100,
      preferredVoice: 'en-AU',
    };
    await db.settings.put(settings);
  }

  return { plan, settings };
}
