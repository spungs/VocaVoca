'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Rating, type Grade } from 'ts-fsrs';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type ReviewCard, type Word } from '@/lib/db';
import { dueCards, ensureCard, newWordIds, rateCard } from '@/lib/srs';

interface QueueItem {
  word: Word;
  card: ReviewCard;
}

export default function StudyPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { settings } = await bootstrap();
        const db = getDb();
        const due = await dueCards(settings.dailyReviewCap);
        const newIds = await newWordIds(settings.dailyNewCards);
        const items: QueueItem[] = [];
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
        if (cancelled) return;
        setQueue(items);
        if (items.length === 0) setDone(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRate = useCallback(
    async (rating: Grade, durationMs: number) => {
      const item = queue[index];
      if (!item) return;
      await rateCard(item.card, rating, durationMs);
      if (index + 1 >= queue.length) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [queue, index],
  );

  if (error) {
    return <Centered><p className="text-rose-600">에러: {error}</p></Centered>;
  }

  if (done) {
    return (
      <Centered>
        <p className="text-2xl">🎉</p>
        <p className="text-zinc-600 dark:text-zinc-400">오늘 할 일 끝!</p>
        <Link
          href="/"
          className="rounded-xl bg-zinc-900 px-5 py-2 text-sm text-white dark:bg-white dark:text-zinc-900"
        >
          홈으로
        </Link>
      </Centered>
    );
  }

  const item = queue[index];
  if (!item) return <Centered><p className="text-zinc-400">준비 중…</p></Centered>;

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
  const shownAtRef = useRef(0);

  useEffect(() => {
    shownAtRef.current = Date.now();
  }, []);

  const rate = (rating: Grade) => {
    const start = shownAtRef.current || Date.now();
    onRate(rating, Date.now() - start);
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col p-4">
      <header className="flex items-center justify-between text-xs text-zinc-500">
        <Link href="/" className="px-2 py-1">✕</Link>
        <span className="tabular-nums">
          {position} / {total}
        </span>
        <button
          type="button"
          onClick={() => speak(item.word)}
          className="px-2 py-1"
          aria-label="발음 듣기"
        >
          🔊
        </button>
      </header>

      <section className="mt-6 flex flex-1 flex-col items-center justify-center">
        <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-3xl font-semibold">{item.word.term}</p>
          {item.word.ipa && (
            <p className="mt-2 font-mono text-sm text-zinc-500">{item.word.ipa}</p>
          )}
          {revealed ? (
            <div className="mt-6 space-y-4 text-left">
              <p className="text-base">{item.word.meaningKo}</p>
              {item.word.examples[0] && (
                <div className="rounded-xl bg-zinc-50 p-3 text-sm dark:bg-zinc-800">
                  <p>“{item.word.examples[0].en}”</p>
                  <p className="mt-1 text-zinc-500">{item.word.examples[0].ko}</p>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-8 rounded-full border border-zinc-300 px-5 py-2 text-sm dark:border-zinc-700"
            >
              보여주기
            </button>
          )}
        </div>
      </section>

      {revealed && (
        <div className="mt-6 grid grid-cols-4 gap-2">
          <RateButton label="Again" tone="rose" onClick={() => rate(Rating.Again)} />
          <RateButton label="Hard" tone="amber" onClick={() => rate(Rating.Hard)} />
          <RateButton label="Good" tone="emerald" onClick={() => rate(Rating.Good)} />
          <RateButton label="Easy" tone="sky" onClick={() => rate(Rating.Easy)} />
        </div>
      )}
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      {children}
    </main>
  );
}

function RateButton({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: 'rose' | 'amber' | 'emerald' | 'sky';
  onClick: () => void;
}) {
  const toneClass = {
    rose: 'bg-rose-500 hover:bg-rose-600',
    amber: 'bg-amber-500 hover:bg-amber-600',
    emerald: 'bg-emerald-500 hover:bg-emerald-600',
    sky: 'bg-sky-500 hover:bg-sky-600',
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl py-3 text-xs font-medium text-white ${toneClass}`}
    >
      {label}
    </button>
  );
}

function speak(word: Word) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(word.term);
  const voices = window.speechSynthesis.getVoices();
  const auVoice = voices.find((v) => v.lang === 'en-AU');
  if (auVoice) u.voice = auVoice;
  u.lang = 'en-AU';
  window.speechSynthesis.speak(u);
}
