'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type Deck, type Word } from '@/lib/db';

const DECK_ICON: Record<string, string> = {
  cafe: '☕',
  hostel: '🏨',
  daily: '💬',
  farm: '🌾',
  sharehouse: '🏠',
  admin: '📄',
  slang: '🦘',
};

interface DeckPageState {
  deck: Deck;
  words: Word[];
  learnedIds: Set<string>;
}

export default function DeckPage() {
  const params = useParams<{ id: string }>();
  const deckId = params?.id;
  const [state, setState] = useState<DeckPageState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deckId) return;
    let cancelled = false;
    (async () => {
      try {
        await bootstrap();
        const db = getDb();
        const deck = await db.decks.get(deckId);
        if (!deck) {
          if (!cancelled) setError('덱을 찾을 수 없어요.');
          return;
        }
        const words = await db.words.where('id').anyOf(deck.wordIds).toArray();
        words.sort((a, b) => b.frequency - a.frequency);
        const cards = await db.cards.where('id').anyOf(deck.wordIds).toArray();
        const learnedIds = new Set(cards.map((c) => c.id));
        if (!cancelled) setState({ deck, words, learnedIds });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deckId]);

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p style={{ color: 'var(--vv-coral)' }}>{error}</p>
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

  const { deck, words, learnedIds } = state;
  const total = words.length;
  const learned = learnedIds.size;
  const progress = total > 0 ? learned / total : 0;
  const icon = DECK_ICON[deck.id] ?? '📘';

  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col"
      style={{ background: 'var(--vv-bg)', paddingTop: 24, paddingBottom: 28 }}
    >
      {/* header */}
      <div className="flex items-center justify-between" style={{ padding: '0 20px' }}>
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
        <p style={{ fontWeight: 700, fontSize: 15 }}>덱 미리보기</p>
        <div style={{ width: 34 }} />
      </div>

      {/* hero */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          className="flex"
          style={{
            alignItems: 'center',
            gap: 14,
            padding: '20px',
            background: 'var(--vv-surface)',
            borderRadius: 'var(--vv-radius)',
            boxShadow: 'var(--vv-shadow-card)',
          }}
        >
          <div
            className="grid place-items-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'var(--vv-surface-2)',
              fontSize: 28,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 17, fontWeight: 700 }}>{deck.title}</p>
            <p
              style={{
                fontSize: 12,
                color: 'var(--vv-ink-3)',
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              {deck.description}
            </p>
          </div>
        </div>

        {/* progress */}
        <div
          className="flex"
          style={{
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: 14,
            fontSize: 12,
            color: 'var(--vv-ink-3)',
          }}
        >
          <span>
            <span className="vv-en vv-num" style={{ color: 'var(--vv-ink)', fontWeight: 700 }}>
              {learned}
            </span>
            <span className="vv-en vv-num">/{total}</span> 학습 시작 ·{' '}
            <span className="vv-num">{Math.round(progress * 100)}%</span>
          </span>
          <span>약 {deck.estimatedHours}시간</span>
        </div>
        <div
          style={{
            marginTop: 6,
            height: 5,
            borderRadius: 999,
            background: 'var(--vv-line)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: 'var(--vv-amber)',
              borderRadius: 999,
            }}
          />
        </div>

        <Link
          href={`/study?deck=${deck.id}`}
          className="vv-press flex"
          style={{
            marginTop: 16,
            width: '100%',
            padding: '14px 20px',
            background: 'var(--vv-amber)',
            color: 'white',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          이 덱 학습하기
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      {/* word list */}
      <div style={{ padding: '24px 24px 0' }}>
        <p
          className="vv-stamp"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--vv-ink-3)',
            marginBottom: 10,
          }}
        >
          단어 {total}개
        </p>
        <div
          style={{
            background: 'var(--vv-surface)',
            borderRadius: 'var(--vv-radius-sm)',
            boxShadow: 'var(--vv-shadow-card)',
            overflow: 'hidden',
          }}
        >
          {words.map((w, i) => {
            const isLearned = learnedIds.has(w.id);
            const isAussie = w.tags.includes('aussie');
            return (
              <div
                key={w.id}
                className="flex"
                style={{
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '12px 14px',
                  borderBottom: i < words.length - 1 ? '1px solid var(--vv-line)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    marginTop: 8,
                    flexShrink: 0,
                    background: isLearned ? 'var(--vv-eucalyptus)' : 'var(--vv-line-2)',
                  }}
                  title={isLearned ? '학습 시작됨' : '새 단어'}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="flex"
                    style={{ alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}
                  >
                    <span
                      className="vv-en"
                      style={{ fontSize: 14, fontWeight: 700 }}
                    >
                      {w.term}
                    </span>
                    {w.ipa && (
                      <span
                        className="vv-mono"
                        style={{ fontSize: 11, color: 'var(--vv-ink-3)' }}
                      >
                        {w.ipa}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--vv-ink-2)',
                      marginTop: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    {w.meaningKo}
                  </p>
                </div>
                {isAussie && (
                  <span
                    className="vv-chip-aussie"
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 999,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    AU
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
