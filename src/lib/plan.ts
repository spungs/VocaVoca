import type { StudyPlan } from './db';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

export function buildDefaultPlan(
  startedAt: number = Date.now(),
  goalLabel: string = '',
  targetDate?: number,
): StudyPlan {
  const plan: StudyPlan = {
    id: 'main',
    goalLabel,
    startedAt,
  };
  if (typeof targetDate === 'number') plan.targetDate = targetDate;
  return plan;
}

/** 목표일까지 남은 일수. targetDate 없으면 null. */
export function daysUntil(timestamp: number | undefined): number | null {
  if (typeof timestamp !== 'number') return null;
  return Math.max(0, Math.ceil((timestamp - Date.now()) / MS_PER_DAY));
}

/** 학습 시작일 이후 경과 일수 (1일차부터 시작하도록 +1). */
export function daysSinceStart(startedAt: number): number {
  return Math.max(1, Math.floor((Date.now() - startedAt) / MS_PER_DAY) + 1);
}

/** 학습 시작일 이후 경과 주차 (1주차부터). */
export function weekSinceStart(startedAt: number): number {
  return Math.max(1, Math.floor((Date.now() - startedAt) / MS_PER_WEEK) + 1);
}

/** 목표일까지 총 주차 수. targetDate 없으면 null. */
export function totalWeeksToTarget(plan: StudyPlan): number | null {
  if (typeof plan.targetDate !== 'number') return null;
  return Math.max(
    1,
    Math.ceil((plan.targetDate - plan.startedAt) / MS_PER_WEEK),
  );
}
