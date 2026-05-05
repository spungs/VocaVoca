'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { State } from 'ts-fsrs';
import { BackIcon, IconButton } from '@/components/IconButton';
import { bootstrap } from '@/lib/bootstrap';
import {
  getDb,
  type Deck,
  type Disposition,
  type ReviewCard,
  type Word,
} from '@/lib/db';
import { setDisposition } from '@/lib/disposition';

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
  cardMap: Map<string, ReviewCard>;
}

interface DotInfo {
  color: string;
  label: string;
}

function dotFor(card: ReviewCard | undefined): DotInfo {
  if (!card) return { color: 'var(--vv-line-2)', label: '새 단어' };
  if (card.disposition === 'mastered') return { color: 'var(--vv-sky)', label: '다 외움' };
  if (card.disposition === 'skipped') return { color: 'var(--vv-coral)', label: '제외' };
  return { color: 'var(--vv-eucalyptus)', label: '학습 중' };
}

function statusText(card: ReviewCard | undefined): string {
  if (!card) return '아직 학습 시작 전';
  if (card.disposition === 'mastered') return '다 외움 (큐에서 제외됨)';
  if (card.disposition === 'skipped') return '제외됨 (큐에서 제외됨)';
  if (card.state === State.Learning || card.state === State.Relearning) return '학습 중';
  if (card.state === State.Review) return `복습 중 · ${Math.round(card.stability)}일 안정성`;
  return '학습 중';
}

export default function DeckPage() {
  const params = useParams<{ id: string }>();
  const deckId = params?.id;
  const [state, setState] = useState<DeckPageState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

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
        const cardMap = new Map(cards.map((c) => [c.id, c]));
        if (!cancelled) setState({ deck, words, cardMap });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deckId]);

  const handleSetDisposition = async (
    wordId: string,
    disposition: Disposition | null,
  ) => {
    const next = await setDisposition(wordId, disposition);
    setState((prev) => {
      if (!prev) return prev;
      const newMap = new Map(prev.cardMap);
      newMap.set(wordId, next);
      return { ...prev, cardMap: newMap };
    });
    setSelectedWordId(null);
  };

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

  const { deck, words, cardMap } = state;
  const total = words.length;
  const activeCount = [...cardMap.values()].filter((c) => !c.disposition).length;
  const progress = total > 0 ? activeCount / total : 0;
  const icon = DECK_ICON[deck.id] ?? '📘';
  const selectedWord = selectedWordId ? words.find((w) => w.id === selectedWordId) : null;
  const selectedCard = selectedWordId ? cardMap.get(selectedWordId) : undefined;

  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col"
      style={{ background: 'var(--vv-bg)', paddingTop: 24, paddingBottom: 28 }}
    >
      {/* header */}
      <div className="flex items-center justify-between" style={{ padding: '0 20px' }}>
        <IconButton href="/" ariaLabel="뒤로">
          <BackIcon />
        </IconButton>
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
              {activeCount}
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
        <div
          className="flex"
          style={{
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <p
            className="vv-stamp"
            style={{ fontSize: 11, fontWeight: 700, color: 'var(--vv-ink-3)' }}
          >
            단어 {total}개
          </p>
          <span style={{ fontSize: 11, color: 'var(--vv-ink-3)' }}>탭하여 관리</span>
        </div>
        <div
          style={{
            background: 'var(--vv-surface)',
            borderRadius: 'var(--vv-radius-sm)',
            boxShadow: 'var(--vv-shadow-card)',
            overflow: 'hidden',
          }}
        >
          {words.map((w, i) => {
            const card = cardMap.get(w.id);
            const dot = dotFor(card);
            const isAussie = w.tags.includes('aussie');
            const isSkipped = card?.disposition === 'skipped';
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWordId(w.id)}
                className="vv-press flex"
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '12px 14px',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: i < words.length - 1 ? '1px solid var(--vv-line)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'inherit',
                  opacity: isSkipped ? 0.55 : 1,
                }}
                aria-label={`${w.term} — ${dot.label}`}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    marginTop: 8,
                    flexShrink: 0,
                    background: dot.color,
                  }}
                  title={dot.label}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="flex"
                    style={{ alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}
                  >
                    <span
                      className="vv-en"
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: isSkipped ? 'line-through' : 'none',
                      }}
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--vv-ink-3)"
                  strokeWidth="2.2"
                  style={{ flexShrink: 0, marginTop: 4 }}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {selectedWord && (
        <WordSheet
          word={selectedWord}
          card={selectedCard}
          onClose={() => setSelectedWordId(null)}
          onSetDisposition={handleSetDisposition}
        />
      )}
    </main>
  );
}

function WordSheet({
  word,
  card,
  onClose,
  onSetDisposition,
}: {
  word: Word;
  card: ReviewCard | undefined;
  onClose: () => void;
  onSetDisposition: (wordId: string, disposition: Disposition | null) => void;
}) {
  const dot = dotFor(card);
  const isMastered = card?.disposition === 'mastered';
  const isSkipped = card?.disposition === 'skipped';
  const isDisposed = isMastered || isSkipped;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'vv-fade-in 200ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="vv-card-in"
        style={{
          width: '100%',
          maxWidth: 448,
          background: 'var(--vv-surface)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '12px 22px 28px',
          boxShadow: 'var(--vv-shadow-pop)',
        }}
      >
        {/* drag handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: 'var(--vv-line-2)',
            margin: '0 auto 18px',
          }}
        />

        {/* word info */}
        <div style={{ paddingBottom: 14, borderBottom: '1px solid var(--vv-line)' }}>
          <p
            className="vv-en"
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textDecoration: isSkipped ? 'line-through' : 'none',
            }}
          >
            {word.term}
          </p>
          {word.ipa && (
            <p
              className="vv-mono"
              style={{ fontSize: 13, color: 'var(--vv-ink-2)', marginTop: 4 }}
            >
              {word.ipa}
            </p>
          )}
          <p style={{ fontSize: 14, color: 'var(--vv-ink-2)', marginTop: 8, lineHeight: 1.5 }}>
            {word.meaningKo}
          </p>
        </div>

        {/* status */}
        <div
          className="flex"
          style={{
            alignItems: 'center',
            gap: 8,
            padding: '14px 0',
            fontSize: 12,
            color: 'var(--vv-ink-3)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: dot.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: 'var(--vv-ink-2)', fontWeight: 600 }}>{statusText(card)}</span>
        </div>

        {/* actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isDisposed ? (
            <button
              type="button"
              onClick={() => onSetDisposition(word.id, null)}
              className="vv-press"
              style={{
                padding: '14px 16px',
                border: 'none',
                background: 'var(--vv-amber)',
                color: 'white',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              ↻ 다시 학습 큐에 넣기
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onSetDisposition(word.id, 'mastered')}
                className="vv-press flex"
                style={{
                  padding: '14px 16px',
                  border: '1.5px solid var(--vv-sky)',
                  background: 'transparent',
                  color: 'var(--vv-sky)',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>✓</span>
                <span>다 외웠어요 (안 보기)</span>
              </button>
              <button
                type="button"
                onClick={() => onSetDisposition(word.id, 'skipped')}
                className="vv-press flex"
                style={{
                  padding: '14px 16px',
                  border: '1.5px solid var(--vv-coral)',
                  background: 'transparent',
                  color: 'var(--vv-coral)',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>✗</span>
                <span>이 단어 제외</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="vv-press"
            style={{
              padding: '14px 16px',
              border: 'none',
              background: 'transparent',
              color: 'var(--vv-ink-3)',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
