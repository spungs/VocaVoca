import { getDb, type StudyPlan, type UserSettings } from './db';
import { buildDefaultPlan } from './plan';
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
 */
export async function bootstrap(): Promise<BootstrapResult> {
  const db = getDb();
  await seedIfEmpty();

  let plan = await db.plans.get('main');
  if (!plan) {
    const defaultDeparture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    plan = buildDefaultPlan(defaultDeparture);
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
