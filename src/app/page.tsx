'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type Deck, type StudyPlan, type UserSettings } from '@/lib/db';
import { currentPhase, daysUntil } from '@/lib/plan';
import { dueCards, newWordIds } from '@/lib/srs';

interface HomeState {
  plan: StudyPlan;
  settings: UserSettings;
  decks: Deck[];
  deckProgress: Record<string, number>;
  dueCount: number;
  newCount: number;
  totalCards: number;
  currentWeek: number;
}

export default function HomePage() {
  const [state, setState] = useState<HomeState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { plan, settings } = await bootstrap();
        const db = getDb();
        const decks = await db.decks.orderBy('scenarioOrder').toArray();
        const due = await dueCards(settings.dailyReviewCap);
        const fresh = await newWordIds(settings.dailyNewCards);
        const totalCards = await db.cards.count();
        const currentWeek = Math.floor(
          (Date.now() - plan.startedAt) / (7 * 24 * 60 * 60 * 1000),
        );
        const deckProgress: Record<string, number> = {};
        await Promise.all(
          decks.map(async (deck) => {
            const learned = await db.cards.where('id').anyOf(deck.wordIds).count();
            deckProgress[deck.id] = learned;
          }),
        );
        if (cancelled) return;
        setState({
          plan,
          settings,
          decks,
          deckProgress,
          dueCount: due.length,
          newCount: fresh.length,
          totalCards,
          currentWeek,
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p className="text-rose-600">초기화 실패: {error}</p>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p className="text-zinc-400">불러오는 중…</p>
      </main>
    );
  }

  const dDay = daysUntil(state.plan.departureDate);
  const phase = currentPhase(state.plan);
  const phaseLabel: Record<typeof phase.name, string> = {
    survival: '생존 영어',
    'job-specific': '직무 영어',
    social: '사회 영어',
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 p-6">
      <header className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">VocaVoca</p>
          <h1 className="text-3xl font-semibold tracking-tight">D-{dDay}</h1>
          <p className="text-sm text-zinc-500">
            현재 단계 · {phaseLabel[phase.name]} (주 {state.currentWeek} / {phase.endWeek})
          </p>
        </div>
        <Link
          href="/settings"
          className="rounded-full px-3 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          설정
        </Link>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs uppercase tracking-widest text-zinc-500">오늘 할 일</p>
        <div className="mt-3 flex items-baseline gap-6">
          <Stat label="신규" value={state.newCount} />
          <Stat label="복습" value={state.dueCount} />
        </div>
        <Link
          href="/study"
          className="mt-5 block rounded-xl bg-zinc-900 py-3 text-center text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          시작하기
        </Link>
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">시나리오</p>
        <ul className="space-y-2">
          {state.decks.map((deck) => {
            const learned = state.deckProgress[deck.id] ?? 0;
            const total = deck.wordIds.length;
            return (
              <li
                key={deck.id}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-sm font-medium">{deck.title}</p>
                <p className="text-xs text-zinc-500">
                  {learned}/{total} 학습됨 · 예상 {deck.estimatedHours}시간
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="mt-auto pt-4 text-center text-xs text-zinc-400">
        보유 카드 {state.totalCards}개 · v0.1
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
