'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Rating, State } from 'ts-fsrs';
import { BackIcon, IconButton } from '@/components/IconButton';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type ReviewCard, type ReviewLog } from '@/lib/db';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface CardBreakdown {
  learning: number;
  review: number;
  mastered: number;
  skipped: number;
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
  breakdown: CardBreakdown;
  totalCards: number;
  totalWords: number;
  missed: MissedWord[];
}

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

function summarize(cards: ReviewCard[]): CardBreakdown {
  const out: CardBreakdown = { learning: 0, review: 0, mastered: 0, skipped: 0 };
  for (const c of cards) {
    if (c.disposition === 'mastered') out.mastered += 1;
    else if (c.disposition === 'skipped') out.skipped += 1;
    else if (c.state === State.Review) out.review += 1;
    else out.learning += 1;
  }
  return out;
}

async function loadStats(): Promise<StatsState> {
  const db = getDb();
  const allLogs = await db.logs.toArray();
  const allCards = await db.cards.toArray();
  const totalWords = await db.words.count();

  const todayStart = startOfDay(Date.now());
  const weekStart = todayStart - 6 * MS_PER_DAY;
  const prevWeekStart = weekStart - 7 * MS_PER_DAY;
  const fortnightStart = todayStart - 13 * MS_PER_DAY;

  const thisWeek = allLogs.filter((l) => l.reviewedAt >= weekStart);
  const prevWeek = allLogs.filter((l) => l.reviewedAt >= prevWeekStart && l.reviewedAt < weekStart);

  const weekTotalUnique = uniqueCount(thisWeek);
  const prevWeekUnique = uniqueCount(prevWeek);
  const weekDeltaPct =
    prevWeekUnique === 0 ? null : Math.round(((weekTotalUnique - prevWeekUnique) / prevWeekUnique) * 100);

  const daysSeries = Array(14).fill(0) as number[];
  for (const l of allLogs) {
    if (l.reviewedAt < fortnightStart) continue;
    const idx = dayBucket(l.reviewedAt, fortnightStart);
    if (idx >= 0 && idx < 14) daysSeries[idx] += 1;
  }

  const breakdown = summarize(allCards);

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

  return {
    weekTotalUnique,
    weekDeltaPct,
    daysSeries,
    breakdown,
    totalCards: allCards.length,
    totalWords,
    missed,
  };
}

export default function StatsPage() {
  const [state, setState] = useState<StatsState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await bootstrap();
        const stats = await loadStats();
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
  const newCount = Math.max(0, state.totalWords - state.totalCards);
  const breakdownRows: { key: keyof CardBreakdown | 'new'; label: string; color: string; n: number }[] = [
    { key: 'new', label: '새 단어', color: 'var(--vv-line-2)', n: newCount },
    { key: 'learning', label: '학습 중', color: 'var(--vv-eucalyptus)', n: state.breakdown.learning },
    { key: 'review', label: '복습', color: 'var(--vv-amber)', n: state.breakdown.review },
    { key: 'mastered', label: '마스터', color: 'var(--vv-sky)', n: state.breakdown.mastered },
    { key: 'skipped', label: '제외', color: 'var(--vv-coral)', n: state.breakdown.skipped },
  ];
  const breakdownTotal = breakdownRows.reduce((a, r) => a + r.n, 0);

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
        <IconButton href="/" ariaLabel="뒤로">
          <BackIcon />
        </IconButton>
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

      {/* card breakdown */}
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
          단어 상태
        </p>
        <div
          style={{
            background: 'var(--vv-surface)',
            borderRadius: 'var(--vv-radius-sm)',
            padding: 16,
            boxShadow: 'var(--vv-shadow-card)',
          }}
        >
          {/* stacked bar */}
          {breakdownTotal > 0 && (
            <div
              className="flex"
              style={{
                height: 8,
                borderRadius: 999,
                background: 'var(--vv-line)',
                overflow: 'hidden',
                marginBottom: 14,
              }}
            >
              {breakdownRows.map((r) =>
                r.n > 0 ? (
                  <div
                    key={r.key}
                    style={{
                      width: `${(r.n / breakdownTotal) * 100}%`,
                      background: r.color,
                      height: '100%',
                    }}
                    title={`${r.label} ${r.n}`}
                  />
                ) : null,
              )}
            </div>
          )}
          {/* legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {breakdownRows.map((r) => (
              <div
                key={r.key}
                className="flex"
                style={{ alignItems: 'center', gap: 10, fontSize: 13 }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: r.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, color: 'var(--vv-ink-2)' }}>{r.label}</span>
                <span
                  className="vv-en vv-num"
                  style={{ fontWeight: 700, color: 'var(--vv-ink)' }}
                >
                  {r.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* missed words */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          className="flex"
          style={{
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <p
            className="vv-stamp"
            style={{ fontSize: 11, fontWeight: 700, color: 'var(--vv-ink-3)' }}
          >
            자주 틀리는 단어
          </p>
          {state.missed.length > 0 && (
            <Link
              href={`/study?ids=${state.missed.map((m) => m.id).join(',')}`}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--vv-amber)',
                textDecoration: 'none',
              }}
            >
              전체 다시 학습 →
            </Link>
          )}
        </div>
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
              <Link
                key={m.id}
                href={`/study?ids=${m.id}`}
                className="vv-press flex"
                style={{
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderBottom: i < a.length - 1 ? '1px solid var(--vv-line)' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--vv-ink-3)"
                  strokeWidth="2.2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
