import type { PlanPhase, StudyPlan } from './db';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

export function buildDefaultPlan(departureDate: Date): StudyPlan {
  const startedAt = Date.now();
  const totalWeeks = Math.max(
    8,
    Math.floor((departureDate.getTime() - startedAt) / MS_PER_WEEK),
  );

  // 4M / 5M / 3M ≈ 17 / 22 / 13 weeks for a 52-week timeline; scale proportionally
  const survivalEnd = Math.floor(totalWeeks * (17 / 52));
  const jobEnd = Math.floor(totalWeeks * (39 / 52));

  const phases: PlanPhase[] = [
    {
      name: 'survival',
      startWeek: 0,
      endWeek: survivalEnd,
      deckIds: ['cafe', 'hostel', 'daily'],
      targetWordsPerDay: 15,
    },
    {
      name: 'job-specific',
      startWeek: survivalEnd,
      endWeek: jobEnd,
      deckIds: ['farm', 'sharehouse'],
      targetWordsPerDay: 12,
    },
    {
      name: 'social',
      startWeek: jobEnd,
      endWeek: totalWeeks,
      deckIds: ['admin', 'slang'],
      targetWordsPerDay: 8,
    },
  ];

  return {
    id: 'main',
    departureDate: departureDate.getTime(),
    startedAt,
    phases,
  };
}

export function daysUntil(timestamp: number): number {
  return Math.max(0, Math.ceil((timestamp - Date.now()) / MS_PER_DAY));
}

export function currentPhase(plan: StudyPlan): PlanPhase {
  const elapsedWeeks = (Date.now() - plan.startedAt) / MS_PER_WEEK;
  return (
    plan.phases.find((p) => elapsedWeeks >= p.startWeek && elapsedWeeks < p.endWeek) ??
    plan.phases[plan.phases.length - 1]
  );
}
