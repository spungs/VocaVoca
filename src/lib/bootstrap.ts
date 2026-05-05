import { getDb, type StudyPlan, type UserSettings } from './db';
import { buildDefaultPlan } from './plan';
import { seedIfEmpty } from './seed';

export interface BootstrapResult {
  plan: StudyPlan;
  settings: UserSettings;
}

interface LegacyPlan extends StudyPlan {
  departureDate?: number;
  phases?: unknown[];
}

/**
 * Idempotent first-run setup. Safe to call on every page load.
 * - 시드 콘텐츠 보강 (덱 추가 시 자동).
 * - 기본 StudyPlan / UserSettings 생성.
 * - Legacy plan(phases·departureDate) 마이그레이션.
 * - 평가 안 된 유령 카드(state=New, totalReviews=0) 정리.
 */
export async function bootstrap(): Promise<BootstrapResult> {
  const db = getDb();
  await seedIfEmpty();

  // 평가 안 된 유령 카드 정리
  const orphans = await db.cards
    .where('state')
    .equals(0)
    .filter((c) => c.totalReviews === 0 && !c.disposition)
    .toArray();
  if (orphans.length > 0) {
    await db.cards.bulkDelete(orphans.map((c) => c.id));
  }

  // Plan 로딩 + 마이그레이션
  let plan = (await db.plans.get('main')) as LegacyPlan | undefined;
  if (!plan) {
    plan = buildDefaultPlan();
    await db.plans.put(plan);
  } else {
    // legacy → new shape 마이그레이션
    const hasLegacyFields = 'departureDate' in plan || 'phases' in plan;
    if (hasLegacyFields) {
      const migrated: StudyPlan = {
        id: 'main',
        goalLabel: plan.goalLabel ?? '',
        startedAt: plan.startedAt,
      };
      if (typeof plan.departureDate === 'number') {
        migrated.targetDate = plan.departureDate;
      }
      plan = migrated;
      await db.plans.put(plan);
    }
  }

  let settings = await db.settings.get('me');
  if (!settings) {
    settings = {
      id: 'me',
      dailyNewCards: 15,
      dailyReviewCap: 100,
    };
    await db.settings.put(settings);
  }

  return { plan, settings };
}
