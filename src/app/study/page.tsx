'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Rating, type Grade } from 'ts-fsrs';
import { BackIcon, CloseIcon, IconButton } from '@/components/IconButton';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type ReviewCard, type Word } from '@/lib/db';
import { dueCards, ensureCard, newWordIds, rateCard } from '@/lib/srs';

interface QueueItem {
  word: Word;
  card: ReviewCard;
}

type SwipeDir = 'again' | 'hard' | 'good' | 'easy';

const DIR_TO_RATING: Record<SwipeDir, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

const DIR_COLOR: Record<SwipeDir, string> = {
  again: 'var(--vv-coral)',
  hard: 'var(--vv-mustard)',
  good: 'var(--vv-sage)',
  easy: 'var(--vv-sky)',
};

const RATE_LABEL: Record<SwipeDir, { label: string; sub: string }> = {
  again: { label: 'Again', sub: '<1m' },
  hard: { label: 'Hard', sub: '6m' },
  good: { label: 'Good', sub: '1d' },
  easy: { label: 'Easy', sub: '4d' },
};

export default function StudyPage() {
  return (
    <Suspense
      fallback={
        <main className="vv-paper flex flex-1 items-center justify-center p-6">
          <p style={{ color: 'var(--vv-ink-3)' }}>불러오는 중…</p>
        </main>
      }
    >
      <StudyPageInner />
    </Suspense>
  );
}

function StudyPageInner() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids');
  const deckParam = searchParams.get('deck');
  const reviewIds = idsParam ? idsParam.split(',').filter(Boolean) : null;

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<{ learned: number; correct: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { settings } = await bootstrap();
        const db = getDb();
        const items: QueueItem[] = [];

        if (reviewIds && reviewIds.length > 0) {
          // 미니 학습 모드: 지정된 단어만 다시 학습
          for (const id of reviewIds) {
            const word = await db.words.get(id);
            if (!word) continue;
            const card = await ensureCard(id);
            items.push({ word, card });
          }
        } else if (deckParam) {
          // 덱 모드: 그 덱의 모든 단어 (frequency 높은 순)
          const deck = await db.decks.get(deckParam);
          if (deck) {
            const words = await db.words.where('id').anyOf(deck.wordIds).toArray();
            words.sort((a, b) => b.frequency - a.frequency);
            for (const word of words) {
              const card = await ensureCard(word.id);
              items.push({ word, card });
            }
          }
        } else {
          // 일반 학습 모드: due + new
          const due = await dueCards(settings.dailyReviewCap);
          const newIds = await newWordIds(settings.dailyNewCards);
          for (const card of due) {
            const word = await db.words.get(card.id);
            if (word) items.push({ word, card });
          }
          for (const id of newIds) {
            const word = await db.words.get(id);
            if (!word) continue;
            const card = await ensureCard(id);
            items.push({ word, card });
          }
        }

        if (cancelled) return;
        setQueue(items);
        if (items.length === 0) {
          setDone({ learned: 0, correct: 0, total: 0 });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
    // reviewIds·deckParam가 URL에서 안정적이라 effect 1회 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const correctRef = useRef(0);

  const handleRate = useCallback(
    async (rating: Grade, durationMs: number) => {
      const item = queue[index];
      if (!item) return;
      await rateCard(item.card, rating, durationMs);
      if (rating !== Rating.Again) correctRef.current += 1;
      if (index + 1 >= queue.length) {
        setDone({
          learned: queue.length,
          correct: correctRef.current,
          total: queue.length,
        });
      } else {
        setIndex((i) => i + 1);
      }
    },
    [queue, index],
  );

  if (error) {
    return (
      <main className="vv-paper flex flex-1 items-center justify-center p-6">
        <p style={{ color: 'var(--vv-coral)' }}>에러: {error}</p>
      </main>
    );
  }

  if (done) {
    return <DoneView learned={done.learned} correct={done.correct} total={done.total} />;
  }

  const item = queue[index];
  if (!item) {
    return (
      <main className="vv-paper flex flex-1 items-center justify-center p-6">
        <p style={{ color: 'var(--vv-ink-3)' }}>준비 중…</p>
      </main>
    );
  }

  return (
    <CardView
      key={index}
      item={item}
      position={index + 1}
      total={queue.length}
      onRate={handleRate}
    />
  );
}

function CardView({
  item,
  position,
  total,
  onRate,
}: {
  item: QueueItem;
  position: number;
  total: number;
  onRate: (rating: Grade, durationMs: number) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number; active: boolean; sx: number; sy: number }>({
    x: 0,
    y: 0,
    active: false,
    sx: 0,
    sy: 0,
  });
  const shownAtRef = useRef(0);

  useEffect(() => {
    shownAtRef.current = Date.now();
  }, []);

  const rate = useCallback(
    (dir: SwipeDir) => {
      const start = shownAtRef.current || Date.now();
      onRate(DIR_TO_RATING[dir], Date.now() - start);
    },
    [onRate],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!revealed) return;
    setDrag({ x: 0, y: 0, active: true, sx: e.clientX, sy: e.clientY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.active) return;
    setDrag((d) => ({ ...d, x: e.clientX - d.sx, y: e.clientY - d.sy }));
  };
  const onPointerUp = () => {
    if (!drag.active) return;
    const { x, y } = drag;
    let dir: SwipeDir | null = null;
    const T = 60;
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > T) dir = x < 0 ? 'again' : 'easy';
    else if (Math.abs(y) > T) dir = y < 0 ? 'good' : 'hard';
    setDrag({ x: 0, y: 0, active: false, sx: 0, sy: 0 });
    if (dir) rate(dir);
  };

  const dx = drag.x;
  const dy = drag.y;
  const rot = dx / 18;
  const dirHint: SwipeDir | null = (() => {
    const T = 30;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > T) return dx < 0 ? 'again' : 'easy';
    if (Math.abs(dy) > T) return dy < 0 ? 'good' : 'hard';
    return null;
  })();
  const dirColor = dirHint ? DIR_COLOR[dirHint] : null;

  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col"
      style={{ background: 'var(--vv-bg)' }}
    >
      {/* header */}
      <div className="flex items-center" style={{ padding: '14px 20px 0', gap: 12 }}>
        <IconButton href="/" ariaLabel="뒤로">
          <BackIcon />
        </IconButton>
        {total <= 30 ? (
          <div className="flex" style={{ flex: 1, gap: 3 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background:
                    i < position - 1
                      ? 'var(--vv-ink)'
                      : i === position - 1
                        ? 'var(--vv-amber)'
                        : 'var(--vv-line)',
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: 'var(--vv-line)',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(position / total) * 100}%`,
                background: 'var(--vv-amber)',
                borderRadius: 2,
                transition: 'width 240ms cubic-bezier(.2,.7,.2,1)',
              }}
            />
          </div>
        )}
        <span
          className="vv-en vv-num"
          style={{
            fontSize: 11,
            color: 'var(--vv-ink-3)',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {position}
          <span style={{ opacity: 0.5 }}>/{total}</span>
        </span>
      </div>

      {/* tags */}
      <div className="flex" style={{ padding: '16px 24px 0', gap: 6, flexWrap: 'wrap' }}>
        {item.word.tags.map((t) => (
          <Tag key={t} kind={t === 'aussie' ? 'aussie' : 'default'}>
            {t}
          </Tag>
        ))}
      </div>

      {/* card */}
      <div
        className="flex"
        style={{ flex: 1, padding: '14px 20px', alignItems: 'stretch', justifyContent: 'center' }}
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="vv-card-in"
          style={{
            width: '100%',
            background: 'var(--vv-surface)',
            borderRadius: 'var(--vv-radius)',
            boxShadow: drag.active ? 'var(--vv-shadow-pop)' : 'var(--vv-shadow-card)',
            padding: '32px 28px 28px',
            display: 'flex',
            flexDirection: 'column',
            transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
            transition: drag.active
              ? 'none'
              : 'transform 280ms cubic-bezier(.2,.7,.2,1), box-shadow 200ms',
            position: 'relative',
            touchAction: 'none',
            cursor: revealed ? 'grab' : 'default',
            userSelect: 'none',
            border: dirColor ? `2px solid ${dirColor}` : '2px solid transparent',
          }}
        >
          {dirHint && dirColor && (
            <div
              className="vv-stamp"
              style={{
                position: 'absolute',
                top: 18,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 14px',
                border: `2px solid ${dirColor}`,
                color: dirColor,
                borderRadius: 8,
                fontSize: 13,
                opacity: Math.min(1, (Math.abs(dx) + Math.abs(dy)) / 120),
                pointerEvents: 'none',
              }}
            >
              {dirHint}
            </div>
          )}

          {/* word block */}
          <div style={{ marginTop: 16 }}>
            <div className="flex" style={{ alignItems: 'center', gap: 8, color: 'var(--vv-ink-3)', fontSize: 11, fontWeight: 600 }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                {item.word.partOfSpeech ?? 'phrase'}
              </span>
            </div>
            <p
              className="vv-en"
              style={{
                fontSize: item.word.term.length > 14 ? 36 : 48,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginTop: 8,
                wordBreak: 'break-word',
              }}
            >
              {item.word.term}
            </p>
            <div
              className="flex"
              style={{ alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}
            >
              <VoiceBtn label="호주" lang="en-AU" word={item.word} />
              <VoiceBtn label="영국" lang="en-GB" word={item.word} />
              <VoiceBtn label="미국" lang="en-US" word={item.word} />
              {item.word.ipa && (
                <span
                  className="vv-mono"
                  style={{
                    fontSize: 13,
                    color: 'var(--vv-ink-2)',
                    marginLeft: 'auto',
                  }}
                >
                  {item.word.ipa}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              margin: '24px 0',
              borderTop: '1px dashed var(--vv-line-2)',
            }}
          />

          {/* meaning + example, gated by reveal */}
          {revealed ? (
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 500 }}>
                {item.word.meaningKo}
              </p>
              {item.word.examples?.[0] && (
                <div
                  style={{
                    marginTop: 18,
                    padding: '14px 16px',
                    background: 'var(--vv-surface-2)',
                    borderRadius: 12,
                    borderLeft: '3px solid var(--vv-amber)',
                  }}
                >
                  <p
                    className="vv-en"
                    style={{ fontSize: 14, lineHeight: 1.45, fontWeight: 500 }}
                  >
                    &ldquo;{item.word.examples[0].en}&rdquo;
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--vv-ink-2)',
                      marginTop: 6,
                      lineHeight: 1.45,
                    }}
                  >
                    {item.word.examples[0].ko}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex"
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--vv-ink-3)' }}>뜻이 떠올랐나요?</p>
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="vv-press"
                style={{
                  padding: '12px 32px',
                  border: '1.5px solid var(--vv-ink)',
                  background: 'transparent',
                  color: 'var(--vv-ink)',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                뜻 보기
              </button>
            </div>
          )}

          {/* swipe hint */}
          {revealed && (
            <div
              className="flex"
              style={{
                justifyContent: 'space-between',
                marginTop: 18,
                color: 'var(--vv-ink-3)',
                fontSize: 10,
                fontWeight: 500,
              }}
            >
              <span>← Again</span>
              <span>↓ Hard</span>
              <span>↑ Good</span>
              <span>Easy →</span>
            </div>
          )}
        </div>
      </div>

      {revealed && (
        <div
          style={{
            padding: '0 20px 22px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}
        >
          {(['again', 'hard', 'good', 'easy'] as SwipeDir[]).map((d) => (
            <RateBtn
              key={d}
              label={RATE_LABEL[d].label}
              sub={RATE_LABEL[d].sub}
              color={DIR_COLOR[d]}
              onClick={() => rate(d)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function RateBtn({
  label,
  sub,
  color,
  onClick,
}: {
  label: string;
  sub: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="vv-press"
      style={{
        padding: '10px 4px',
        border: `1.5px solid ${color}`,
        background: 'transparent',
        color,
        borderRadius: 12,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <span className="vv-en" style={{ fontWeight: 700, fontSize: 13 }}>
        {label}
      </span>
      <span className="vv-en vv-num" style={{ fontSize: 10, opacity: 0.7 }}>
        {sub}
      </span>
    </button>
  );
}

function Tag({
  children,
  kind = 'default',
}: {
  children: React.ReactNode;
  kind?: 'default' | 'aussie';
}) {
  return (
    <span
      className={kind === 'aussie' ? 'vv-chip-aussie' : 'vv-chip-default'}
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.04em',
        padding: '3px 8px',
        borderRadius: 999,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}

function DoneView({
  learned,
  correct,
  total,
}: {
  learned: number;
  correct: number;
  total: number;
}) {
  const accuracy = total > 0 ? correct / total : 0;
  const empty = learned === 0;

  return (
    <main
      className="vv-paper mx-auto flex w-full max-w-md flex-1 flex-col"
      style={{ padding: '24px 24px 24px', boxSizing: 'border-box', overflow: 'hidden' }}
    >
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <IconButton href="/" ariaLabel="닫기">
          <CloseIcon />
        </IconButton>
      </div>

      <div
        className="flex"
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* sun badge */}
        <div style={{ position: 'relative', width: 132, height: 132, marginBottom: 24 }}>
          <svg width="132" height="132" viewBox="0 0 132 132" style={{ position: 'absolute', inset: 0 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = ((i * 30 - 90) * Math.PI) / 180;
              const x1 = 66 + Math.cos(a) * 56;
              const y1 = 66 + Math.sin(a) * 56;
              const x2 = 66 + Math.cos(a) * 64;
              const y2 = 66 + Math.sin(a) * 64;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--vv-amber)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="66" cy="66" r="48" fill="var(--vv-amber)" />
            <path
              d="M50 68 L62 80 L84 56"
              stroke="white"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="vv-stamp" style={{ fontSize: 11, color: 'var(--vv-amber)' }}>
          오늘 할 일 완료
        </p>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginTop: 8,
            letterSpacing: '-0.02em',
          }}
        >
          오늘도 한 걸음 더.
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'var(--vv-ink-2)',
            marginTop: 8,
            lineHeight: 1.5,
            maxWidth: 260,
          }}
        >
          {empty ? (
            <>오늘은 학습할 단어가 없어요. 내일 또 만나요.</>
          ) : (
            <>
              오늘 단어 <b className="vv-num">{learned}</b>개를 끝냈어요.
              <br />
              내일 같은 시간에 만나요.
            </>
          )}
        </p>

        {!empty && (
          <div
            style={{
              marginTop: 28,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
              width: '100%',
              background: 'var(--vv-surface)',
              borderRadius: 'var(--vv-radius)',
              padding: 18,
              boxShadow: 'var(--vv-shadow-card)',
              boxSizing: 'border-box',
            }}
          >
            <MiniStat n={learned} unit="개" label="학습" emphasis />
            <MiniStat n={Math.round(accuracy * 100)} unit="%" label="정답률" />
          </div>
        )}

        <Link
          href="/"
          className="vv-press"
          style={{
            marginTop: 22,
            padding: '13px 36px',
            background: 'var(--vv-ink)',
            color: 'var(--vv-bg)',
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}

function MiniStat({
  n,
  unit,
  label,
  emphasis,
}: {
  n: number;
  unit: string;
  label: string;
  emphasis?: boolean;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="flex" style={{ alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
        <span
          className="vv-en vv-num"
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: emphasis ? 'var(--vv-amber)' : 'var(--vv-ink)',
          }}
        >
          {n}
        </span>
        <span style={{ fontSize: 10, color: 'var(--vv-ink-3)' }}>{unit}</span>
      </div>
      <p
        className="vv-stamp"
        style={{
          fontSize: 10,
          color: 'var(--vv-ink-3)',
          fontWeight: 600,
          letterSpacing: '0.1em',
          marginTop: 4,
        }}
      >
        {label}
      </p>
    </div>
  );
}

type VoiceLang = 'en-AU' | 'en-GB' | 'en-US';

function VoiceBtn({
  label,
  lang,
  word,
}: {
  label: string;
  lang: VoiceLang;
  word: Word;
}) {
  return (
    <button
      type="button"
      onClick={() => speak(word, lang)}
      className="vv-press"
      aria-label={`${label} 발음`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid var(--vv-line-2)',
        background: 'var(--vv-surface-2)',
        color: 'var(--vv-ink-2)',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 5L6 9H2v6h4l5 4zM15.5 12a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}

// Apple/macOS·iOS 우선 음성 화이트리스트.
// 디폴트는 보통 가장 오래된 시스템 음성(en-US Alex 등 노인풍)이 잡혀
// 자연스럽지 않으므로, 알려진 양질 음성 이름을 먼저 매칭.
const PREFERRED_VOICES: Record<VoiceLang, string[]> = {
  'en-AU': ['Karen', 'Catherine', 'Lee'],
  'en-GB': ['Daniel', 'Kate', 'Oliver', 'Serena', 'Arthur'],
  'en-US': ['Samantha', 'Allison', 'Ava', 'Susan', 'Nicky', 'Joelle'],
};

function pickVoice(voices: SpeechSynthesisVoice[], lang: VoiceLang): SpeechSynthesisVoice | undefined {
  const exact = voices.filter((v) => v.lang === lang);
  // iOS Siri 음성 우선 (가장 자연스러움)
  const siri = exact.find((v) => /siri/i.test(v.name));
  if (siri) return siri;
  // 화이트리스트 이름 우선
  for (const name of PREFERRED_VOICES[lang]) {
    const found = exact.find((v) => v.name === name || v.name.startsWith(`${name} `));
    if (found) return found;
  }
  // Enhanced / Premium 음성 우선
  const enhanced = exact.find((v) => /enhanced|premium/i.test(v.name));
  if (enhanced) return enhanced;
  // 정확 매치 첫 번째
  if (exact.length > 0) return exact[0];
  // 같은 언어 계열
  return voices.find((v) => v.lang.startsWith('en'));
}

function speak(word: Word, lang: VoiceLang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(word.term);
  const voices = window.speechSynthesis.getVoices();
  const picked = pickVoice(voices, lang);
  if (picked) u.voice = picked;
  u.lang = lang;
  u.volume = 1.0;
  u.rate = 0.95;
  u.pitch = 1.0;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
