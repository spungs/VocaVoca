'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type Deck, type StudyPlan, type UserSettings } from '@/lib/db';
import { maybeNotifyToday, setBadge } from '@/lib/notify';
import { daysSinceStart, daysUntil, totalWeeksToTarget, weekSinceStart } from '@/lib/plan';
import { dueCards, newWordIds } from '@/lib/srs';
import { computeStreak } from '@/lib/streak';

interface HomeState {
  plan: StudyPlan;
  settings: UserSettings;
  decks: Deck[];
  deckProgress: Record<string, number>;
  dueCount: number;
  newCount: number;
  totalCards: number;
  totalLearned: number;
  streak: number;
}

const DECK_ICON: Record<string, string> = {
  cafe: '☕',
  hostel: '🏨',
  daily: '💬',
  farm: '🌾',
  sharehouse: '🏠',
  admin: '📄',
  slang: '🦘',
};

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
        const deckProgress: Record<string, number> = {};
        await Promise.all(
          decks.map(async (deck) => {
            const learned = await db.cards.where('id').anyOf(deck.wordIds).count();
            deckProgress[deck.id] = learned;
          }),
        );
        const totalLearned = Object.values(deckProgress).reduce((a, b) => a + b, 0);
        const streak = await computeStreak();
        if (cancelled) return;
        setState({
          plan,
          settings,
          decks,
          deckProgress,
          dueCount: due.length,
          newCount: fresh.length,
          totalCards,
          totalLearned,
          streak,
        });
        // PWA 배지 + 포그라운드 알림 (홈 진입 시 1회)
        setBadge(due.length + fresh.length);
        maybeNotifyToday(due.length, fresh.length);
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
        <p style={{ color: 'var(--vv-coral)' }}>초기화 실패: {error}</p>
      </main>
    );
  }

  if (!state) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p style={{ color: 'var(--vv-ink-3)' }}>불러오는 중…</p>
      </main>
    );
  }

  const dDay = daysUntil(state.plan.targetDate);
  const totalWeeks = totalWeeksToTarget(state.plan);
  const currentWeek = weekSinceStart(state.plan.startedAt);
  const dayN = daysSinceStart(state.plan.startedAt);
  const totalWordsAvailable = state.decks.reduce((a, d) => a + d.wordIds.length, 0);
  const totalDue = state.newCount + state.dueCount;
  const progressEstMin = Math.max(2, Math.round(totalDue * 0.35));
  const totalProgress = state.totalCards > 0 ? state.totalLearned / Math.max(1, totalWordsAvailable) : 0;
  const hasTarget = dDay !== null;
  const hasGoalLabel = state.plan.goalLabel.trim().length > 0;

  return (
    <main className="vv-paper mx-auto flex w-full max-w-md flex-1 flex-col" style={{ paddingTop: 24, paddingBottom: 28 }}>
      {/* header */}
      <div className="flex items-center justify-between" style={{ padding: '12px 24px 0' }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <div
            className="grid place-items-center font-extrabold"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--vv-ink)',
              color: 'var(--vv-bg)',
              fontSize: 14,
            }}
          >
            V
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>VocaVoca</span>
        </div>
        <div className="flex" style={{ gap: 6 }}>
          <Link
            href="/stats"
            className="vv-press grid place-items-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'var(--vv-surface)',
              color: 'var(--vv-ink-2)',
              boxShadow: 'var(--vv-shadow-card)',
            }}
            aria-label="통계"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 4 4 5-5" />
            </svg>
          </Link>
          <Link
            href="/settings"
            className="vv-press grid place-items-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'var(--vv-surface)',
              color: 'var(--vv-ink-2)',
              boxShadow: 'var(--vv-shadow-card)',
            }}
            aria-label="설정"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* hero */}
      <div style={{ padding: '20px 24px 0' }}>
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p
              className="vv-stamp"
              style={{ fontSize: 11, fontWeight: 600, color: 'var(--vv-ink-3)' }}
            >
              {hasTarget ? '목표까지' : '학습 진행'}
            </p>
            <div className="flex" style={{ alignItems: 'baseline', gap: 4, marginTop: 2 }}>
              <span
                className="vv-en vv-num"
                style={{ fontSize: 64, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em' }}
              >
                {hasTarget ? `D−${dDay}` : `DAY ${dayN}`}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--vv-ink-2)', marginTop: 6 }}>
              {hasGoalLabel && <span style={{ fontWeight: 600 }}>{state.plan.goalLabel}</span>}
              {hasGoalLabel && <span style={{ color: 'var(--vv-ink-3)' }}> · </span>}
              <span style={{ color: 'var(--vv-ink-3)' }}>주 </span>
              <span className="vv-num" style={{ fontWeight: 600 }}>
                {currentWeek}
              </span>
              {totalWeeks !== null && (
                <span style={{ color: 'var(--vv-ink-3)' }}>/{totalWeeks}</span>
              )}
            </p>
          </div>
          <div
            className="flex"
            style={{
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: 'var(--vv-surface)',
              borderRadius: 999,
              boxShadow: 'var(--vv-shadow-card)',
            }}
          >
            <span className="vv-flicker" style={{ fontSize: 18 }}>🔥</span>
            <span className="vv-num" style={{ fontWeight: 700, fontSize: 15 }}>{state.streak}</span>
            <span style={{ fontSize: 12, color: 'var(--vv-ink-3)' }}>일</span>
          </div>
        </div>

        {/* progress bar (목표일 있을 때만) */}
        {hasTarget && totalWeeks !== null && (
          <div
            style={{
              marginTop: 16,
              height: 6,
              borderRadius: 999,
              background: 'var(--vv-line)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (currentWeek / totalWeeks) * 100)}%`,
                background: 'var(--vv-ink)',
                borderRadius: 999,
              }}
            />
          </div>
        )}
      </div>

      {/* today card */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          style={{
            background: 'var(--vv-ink)',
            color: 'var(--vv-bg)',
            borderRadius: 'var(--vv-radius)',
            padding: '20px 22px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--vv-shadow-pop)',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              right: -30,
              top: -30,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'var(--vv-amber)',
              opacity: 0.18,
            }}
          />
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p
                className="vv-stamp"
                style={{ fontSize: 10, fontWeight: 700, opacity: 0.7 }}
              >
                오늘의 학습
              </p>
              <p style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                {totalDue > 0 ? `약 ${progressEstMin}분이면 끝나요` : '오늘 할 일 없음'}
              </p>
            </div>
            <Ring size={42} stroke={4} value={state.totalLearned > 0 ? totalProgress : 0} />
          </div>

          <div className="flex" style={{ gap: 24, marginTop: 22, alignItems: 'baseline' }}>
            <Stat n={state.newCount} label="신규" accent="var(--vv-amber)" />
            <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)' }} />
            <Stat n={state.dueCount} label="복습" accent="var(--vv-eucalyptus)" />
          </div>

          <Link
            href="/study"
            className="vv-press flex"
            style={{
              marginTop: 22,
              width: '100%',
              padding: '14px 20px',
              background: totalDue > 0 ? 'var(--vv-amber)' : 'var(--vv-ink-3)',
              color: 'white',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              position: 'relative',
              zIndex: 1,
              pointerEvents: totalDue > 0 ? 'auto' : 'none',
            }}
          >
            {totalDue > 0 ? '시작하기' : '내일 다시 만나요'}
            {totalDue > 0 && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </Link>
        </div>
      </div>

      {/* decks */}
      <div style={{ padding: '24px 24px 0' }}>
        <div className="flex" style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <p
            className="vv-stamp"
            style={{ fontSize: 11, fontWeight: 700, color: 'var(--vv-ink-3)' }}
          >
            덱
          </p>
          <span style={{ fontSize: 12, color: 'var(--vv-ink-3)' }}>{state.decks.length}개</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {state.decks.map((deck, idx) => (
            <DeckRow
              key={deck.id}
              deck={deck}
              learned={state.deckProgress[deck.id] ?? 0}
              idx={idx}
            />
          ))}
        </div>
      </div>

      {/* footer ledger */}
      <div
        className="flex"
        style={{
          padding: '24px 24px 0',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--vv-ink-3)',
        }}
      >
        <span>
          보유 단어{' '}
          <span className="vv-num" style={{ color: 'var(--vv-ink-2)', fontWeight: 600 }}>
            {totalWordsAvailable}
          </span>
        </span>
        <span>
          학습 시작{' '}
          <span className="vv-num" style={{ color: 'var(--vv-ink-2)', fontWeight: 600 }}>
            {state.totalLearned}
          </span>
          {totalWordsAvailable > 0 && ` · ${Math.round((state.totalLearned / totalWordsAvailable) * 100)}%`}
        </span>
      </div>
    </main>
  );
}

function Stat({ n, label, accent }: { n: number; label: string; accent: string }) {
  return (
    <div>
      <div className="flex" style={{ alignItems: 'baseline', gap: 4 }}>
        <span
          className="vv-en vv-num"
          style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {n}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>개</span>
      </div>
      <p
        className="vv-stamp"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.14em',
          marginTop: 4,
          color: accent,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function Ring({
  size = 44,
  stroke = 4,
  value = 0,
  color,
}: {
  size?: number;
  stroke?: number;
  value?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        stroke="rgba(255,255,255,0.18)"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        stroke={color || 'var(--vv-amber)'}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(1, Math.max(0, value)))}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function DeckRow({ deck, learned, idx }: { deck: Deck; learned: number; idx: number }) {
  const phaseColors = [
    'var(--vv-amber)',
    'var(--vv-eucalyptus)',
    'var(--vv-sky)',
    'var(--vv-mustard)',
    'var(--vv-coral)',
  ];
  const c = phaseColors[idx % phaseColors.length];
  const total = deck.wordIds.length;
  return (
    <Link
      href={`/decks/${deck.id}`}
      className="vv-press flex"
      style={{
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        background: 'var(--vv-surface)',
        borderRadius: 'var(--vv-radius-sm)',
        boxShadow: 'var(--vv-shadow-card)',
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        className="grid place-items-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--vv-surface-2)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 22 }}>{DECK_ICON[deck.id] ?? '📘'}</span>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: c,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{deck.title}</p>
        </div>
        <div className="flex" style={{ alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span
            className="vv-en vv-num"
            style={{ fontSize: 11, color: 'var(--vv-ink-3)' }}
          >
            {learned}/{total}
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: 'var(--vv-line-2)',
            }}
          />
          <span style={{ fontSize: 11, color: 'var(--vv-ink-3)' }}>
            약 {deck.estimatedHours}시간
          </span>
        </div>
      </div>
      <div
        style={{
          width: 56,
          height: 6,
          borderRadius: 999,
          background: 'var(--vv-line)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${total > 0 ? (learned / total) * 100 : 0}%`,
            height: '100%',
            background: c,
          }}
        />
      </div>
    </Link>
  );
}
