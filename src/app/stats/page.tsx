'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Rating } from 'ts-fsrs';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type ReviewLog, type StudyPlan, type PhaseName } from '@/lib/db';
import { currentPhase } from '@/lib/plan';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface PhaseStat {
  name: PhaseName;
  label: string;
  done: number;
  total: number;
  color: string;
  current: boolean;
}

interface MissedWord {
  id: string;
  term: string;
  meaningKo: string;
  miss: number;
}

interface StatsState {
  weekTotalUnique: number;
  weekDeltaPct: number | null;
  daysSeries: number[];
  phases: PhaseStat[];
  missed: MissedWord[];
}

const PHASE_LABEL: Record<PhaseName, string> = {
  survival: '입문 단어',
  'job-specific': '중급 단어',
  social: '고급 / 시험',
};

const PHASE_COLOR: Record<PhaseName, string> = {
  survival: 'var(--vv-amber)',
  'job-specific': 'var(--vv-eucalyptus)',
  social: 'var(--vv-sky)',
};

function dayBucket(ts: number, refStart: number): number {
  return Math.floor((ts - refStart) / MS_PER_DAY);
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function uniqueCount(logs: ReviewLog[]): number {
  return new Set(logs.map((l) => l.cardId)).size;
}

async function loadStats(plan: StudyPlan): Promise<StatsState> {
  const db = getDb();
  const allLogs = await db.logs.toArray();

  const todayStart = startOfDay(Date.now());
  const weekStart = todayStart - 6 * MS_PER_DAY;
  const prevWeekStart = weekStart - 7 * MS_PER_DAY;
  const fortnightStart = todayStart - 13 * MS_PER_DAY;

  const thisWeek = allLogs.filter((l) => l.reviewedAt >= weekStart);
  const prevWeek = allLogs.filter((l) => l.reviewedAt >= prevWeekStart && l.reviewedAt < weekStart);

  const weekTotalUnique = uniqueCount(thisWeek);
  const prevWeekUnique = uniqueCount(prevWeek);
  const weekDeltaPct = prevWeekUnique === 0 ? null : Math.round(((weekTotalUnique - prevWeekUnique) / prevWeekUnique) * 100);

  const daysSeries = Array(14).fill(0) as number[];
  for (const l of allLogs) {
    if (l.reviewedAt < fortnightStart) continue;
    const idx = dayBucket(l.reviewedAt, fortnightStart);
    if (idx >= 0 && idx < 14) daysSeries[idx] += 1;
  }

  // phase stats
  const decks = await db.decks.toArray();
  const deckMap = new Map(decks.map((d) => [d.id, d]));
  const cardIds = new Set((await db.cards.toArray()).map((c) => c.id));
  const cur = currentPhase(plan);

  const phases: PhaseStat[] = plan.phases.map((p) => {
    let total = 0;
    let done = 0;
    for (const deckId of p.deckIds) {
      const deck = deckMap.get(deckId);
      if (!deck) continue;
      total += deck.wordIds.length;
      for (const wid of deck.wordIds) if (cardIds.has(wid)) done += 1;
    }
    return {
      name: p.name,
      label: PHASE_LABEL[p.name],
      done,
      total,
      color: PHASE_COLOR[p.name],
      current: p.name === cur.name,
    };
  });

  // missed words
  const missCount = new Map<string, number>();
  for (const l of allLogs) {
    if (l.rating === Rating.Again) {
      missCount.set(l.cardId, (missCount.get(l.cardId) ?? 0) + 1);
    }
  }
  const sorted = [...missCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const missed: MissedWord[] = [];
  for (const [id, miss] of sorted) {
    const word = await db.words.get(id);
    if (word) missed.push({ id, term: word.term, meaningKo: word.meaningKo, miss });
  }

  return { weekTotalUnique, weekDeltaPct, daysSeries, phases, missed };
}

export default function StatsPage() {
  const [state, setState] = useState<StatsState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { plan } = await bootstrap();
        const stats = await loadStats(plan);
        if (!cancelled) setState(stats);
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
        <p style={{ color: 'var(--vv-coral)' }}>에러: {error}</p>
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

  const max = Math.max(1, ...state.daysSeries);
  const labels = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col"
      style={{ background: 'var(--vv-bg)', paddingTop: 24, paddingBottom: 28 }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '0 20px' }}
      >
        <Link
          href="/"
          className="vv-press grid place-items-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            background: 'var(--vv-surface)',
            color: 'var(--vv-ink-2)',
          }}
          aria-label="뒤로"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <p style={{ fontWeight: 700, fontSize: 15 }}>학습 리포트</p>
        <div style={{ width: 34 }} />
      </div>

      {/* hero */}
      <div style={{ padding: '20px 24px 0' }}>
        <p
          className="vv-stamp"
          style={{ fontSize: 11, fontWeight: 700, color: 'var(--vv-ink-3)' }}
        >
          이번 주
        </p>
        <div className="flex" style={{ alignItems: 'baseline', gap: 8, marginTop: 4 }}>
          <span
            className="vv-en vv-num"
            style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            {state.weekTotalUnique}
          </span>
          <span style={{ fontSize: 14, color: 'var(--vv-ink-2)' }}>단어 학습</span>
        </div>
        {state.weekDeltaPct !== null && (
          <div className="flex" style={{ alignItems: 'center', gap: 6, marginTop: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                background:
                  state.weekDeltaPct >= 0
                    ? 'var(--vv-eucalyptus-soft)'
                    : 'var(--vv-amber-soft)',
                color: state.weekDeltaPct >= 0 ? 'var(--vv-eucalyptus)' : 'var(--vv-amber)',
                borderRadius: 4,
              }}
            >
              {state.weekDeltaPct >= 0 ? '↑' : '↓'} {Math.abs(state.weekDeltaPct)}%
            </span>
            <span style={{ fontSize: 11, color: 'var(--vv-ink-3)' }}>지난주 대비</span>
          </div>
        )}
      </div>

      {/* bar chart */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          style={{
            background: 'var(--vv-surface)',
            borderRadius: 'var(--vv-radius)',
            padding: 18,
            boxShadow: 'var(--vv-shadow-card)',
          }}
        >
          <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--vv-ink-2)' }}>
              일별 학습량
            </span>
            <span style={{ fontSize: 11, color: 'var(--vv-ink-3)' }}>최근 14일</span>
          </div>
          <div className="flex" style={{ alignItems: 'flex-end', gap: 4, height: 100 }}>
            {state.daysSeries.map((d, i) => (
              <div
                key={i}
                className="flex"
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${(d / max) * 88}px`,
                    minHeight: 2,
                    background:
                      i === state.daysSeries.length - 1 ? 'var(--vv-amber)' : 'var(--vv-ink)',
                    borderRadius: 3,
                    opacity: d === 0 ? 0.15 : 1,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex" style={{ justifyContent: 'space-between', marginTop: 8 }}>
            {labels.concat(labels).map((l, i) => (
              <span
                key={i}
                style={{
                  fontSize: 9,
                  color: 'var(--vv-ink-3)',
                  flex: 1,
                  textAlign: 'center',
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* phase progress */}
      <div style={{ padding: '20px 24px 0' }}>
        <p
          className="vv-stamp"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--vv-ink-3)',
            marginBottom: 12,
          }}
        >
          단계별 진행
        </p>
        {state.phases.map((p) => (
          <div
            key={p.name}
            style={{
              background: 'var(--vv-surface)',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 8,
              boxShadow: 'var(--vv-shadow-card)',
              border: p.current ? `1.5px solid ${p.color}` : '1.5px solid transparent',
            }}
          >
            <div
              className="flex"
              style={{ justifyContent: 'space-between', alignItems: 'baseline' }}
            >
              <div className="flex" style={{ alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{p.label}</span>
                {p.current && (
                  <span
                    className="vv-stamp"
                    style={{
                      fontSize: 9,
                      color: p.color,
                      padding: '1px 6px',
                      border: `1px solid ${p.color}`,
                      borderRadius: 3,
                    }}
                  >
                    NOW
                  </span>
                )}
              </div>
              <span
                className="vv-en vv-num"
                style={{ fontSize: 11, color: 'var(--vv-ink-3)' }}
              >
                <b style={{ color: 'var(--vv-ink)' }}>{p.done}</b>/{p.total}
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                height: 5,
                borderRadius: 999,
                background: 'var(--vv-line)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${p.total > 0 ? (p.done / p.total) * 100 : 0}%`,
                  height: '100%',
                  background: p.color,
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* missed words */}
      <div style={{ padding: '20px 24px 0' }}>
        <p
          className="vv-stamp"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--vv-ink-3)',
            marginBottom: 12,
          }}
        >
          자주 틀리는 단어
        </p>
        {state.missed.length === 0 ? (
          <div
            style={{
              background: 'var(--vv-surface)',
              borderRadius: 'var(--vv-radius-sm)',
              padding: '20px 14px',
              boxShadow: 'var(--vv-shadow-card)',
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--vv-ink-3)',
            }}
          >
            아직 데이터가 부족해요. 학습을 더 진행해 보세요.
          </div>
        ) : (
          <div
            style={{
              background: 'var(--vv-surface)',
              borderRadius: 'var(--vv-radius-sm)',
              padding: 4,
              boxShadow: 'var(--vv-shadow-card)',
            }}
          >
            {state.missed.map((m, i, a) => (
              <div
                key={m.id}
                className="flex"
                style={{
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderBottom: i < a.length - 1 ? '1px solid var(--vv-line)' : 'none',
                }}
              >
                <div
                  className="grid place-items-center"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'var(--vv-amber-soft)',
                    color: 'var(--vv-amber)',
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                >
                  {m.miss}×
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="vv-en" style={{ fontSize: 14, fontWeight: 600 }}>
                    {m.term}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'var(--vv-ink-3)',
                      marginTop: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.meaningKo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
