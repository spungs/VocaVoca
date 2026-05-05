'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type StudyPlan, type UserSettings } from '@/lib/db';
import { buildDefaultPlan, daysUntil } from '@/lib/plan';

const VOICE_OPTIONS: { value: UserSettings['preferredVoice']; label: string }[] = [
  { value: 'en-AU', label: '호주식 (en-AU)' },
  { value: 'en-GB', label: '영국식 (en-GB)' },
  { value: 'en-US', label: '미국식 (en-US)' },
];

const NEW_CARD_OPTIONS = [10, 15, 20, 25];
const REVIEW_CAP_OPTIONS = [50, 100, 150, 200];

function toDateInputValue(ts: number): string {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await bootstrap();
        if (!cancelled) {
          setSettings(result.settings);
          setPlan(result.plan);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = async (patch: Partial<UserSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    const db = getDb();
    await db.settings.put(next);
  };

  const updateDeparture = async (dateStr: string) => {
    if (!plan) return;
    const next = new Date(dateStr);
    if (Number.isNaN(next.getTime())) return;
    const rebuilt = buildDefaultPlan(next, plan.startedAt);
    setPlan(rebuilt);
    const db = getDb();
    await db.plans.put(rebuilt);
  };

  const resetProgress = async () => {
    setResetting(true);
    try {
      const db = getDb();
      await db.transaction('rw', db.cards, db.logs, async () => {
        await db.cards.clear();
        await db.logs.clear();
      });
      setResetConfirm(false);
    } finally {
      setResetting(false);
    }
  };

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p style={{ color: 'var(--vv-coral)' }}>에러: {error}</p>
      </main>
    );
  }

  if (!settings || !plan) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <p style={{ color: 'var(--vv-ink-3)' }}>불러오는 중…</p>
      </main>
    );
  }

  const dDay = daysUntil(plan.departureDate);

  return (
    <main
      className="mx-auto flex w-full max-w-md flex-1 flex-col"
      style={{ background: 'var(--vv-bg)', paddingTop: 24, paddingBottom: 28 }}
    >
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
        <p style={{ fontWeight: 700, fontSize: 15 }}>설정</p>
        <div style={{ width: 34 }} />
      </div>

      {/* 학습 분량 */}
      <Section label="학습 분량">
        <FieldRow
          title="신규 단어"
          sub="하루에 처음 보는 단어 수"
        >
          <SegmentedNumber
            value={settings.dailyNewCards}
            options={NEW_CARD_OPTIONS}
            onChange={(v) => updateSettings({ dailyNewCards: v })}
          />
        </FieldRow>
        <Divider />
        <FieldRow
          title="복습 한도"
          sub="하루 복습 카드 최대 개수"
        >
          <SegmentedNumber
            value={settings.dailyReviewCap}
            options={REVIEW_CAP_OPTIONS}
            onChange={(v) => updateSettings({ dailyReviewCap: v })}
          />
        </FieldRow>
      </Section>

      {/* 발음 */}
      <Section label="발음">
        <FieldRow title="음성 (TTS)" sub="단어 카드의 🔊 버튼이 사용할 영어 음성">
          <RadioGroup
            value={settings.preferredVoice}
            options={VOICE_OPTIONS}
            onChange={(v) => updateSettings({ preferredVoice: v })}
          />
        </FieldRow>
      </Section>

      {/* 목표일 */}
      <Section label="목표일">
        <FieldRow
          title="호주 출국일"
          sub={`현재 D−${dDay}`}
        >
          <input
            type="date"
            value={toDateInputValue(plan.departureDate)}
            onChange={(e) => updateDeparture(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid var(--vv-line-2)',
              background: 'var(--vv-bg)',
              color: 'var(--vv-ink)',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
          />
        </FieldRow>
      </Section>

      {/* 데이터 */}
      <Section label="데이터">
        <FieldRow
          title="학습 진척 초기화"
          sub="단어·덱은 유지하고 학습 카드와 기록만 비웁니다"
        >
          {!resetConfirm ? (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="vv-press"
              style={{
                padding: '10px 14px',
                border: '1px solid var(--vv-coral)',
                color: 'var(--vv-coral)',
                background: 'transparent',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              초기화
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={resetProgress}
                disabled={resetting}
                className="vv-press"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: 'none',
                  background: 'var(--vv-coral)',
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: resetting ? 'progress' : 'pointer',
                  opacity: resetting ? 0.6 : 1,
                }}
              >
                {resetting ? '초기화 중…' : '정말 삭제'}
              </button>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="vv-press"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid var(--vv-line-2)',
                  background: 'transparent',
                  color: 'var(--vv-ink-2)',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
            </div>
          )}
        </FieldRow>
      </Section>

      <div
        style={{
          padding: '24px 24px 0',
          fontSize: 11,
          color: 'var(--vv-ink-3)',
          textAlign: 'center',
        }}
      >
        VocaVoca · v0.1
      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
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
        {label}
      </p>
      <div
        style={{
          background: 'var(--vv-surface)',
          borderRadius: 'var(--vv-radius-sm)',
          boxShadow: 'var(--vv-shadow-card)',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FieldRow({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: '14px 16px' }}>
      <p style={{ fontSize: 14, fontWeight: 600 }}>{title}</p>
      {sub && (
        <p style={{ fontSize: 11, color: 'var(--vv-ink-3)', marginTop: 2 }}>{sub}</p>
      )}
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--vv-line)' }} />;
}

function SegmentedNumber({
  value,
  options,
  onChange,
}: {
  value: number;
  options: number[];
  onChange: (v: number) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        gap: 6,
      }}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="vv-press vv-num"
            style={{
              padding: '10px 0',
              border: '1px solid',
              borderColor: active ? 'var(--vv-ink)' : 'var(--vv-line-2)',
              background: active ? 'var(--vv-ink)' : 'transparent',
              color: active ? 'var(--vv-bg)' : 'var(--vv-ink-2)',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function RadioGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="vv-press"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              border: '1px solid',
              borderColor: active ? 'var(--vv-amber)' : 'var(--vv-line-2)',
              background: active ? 'var(--vv-amber-soft)' : 'transparent',
              color: active ? 'var(--vv-amber)' : 'var(--vv-ink-2)',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: active ? 'var(--vv-amber)' : 'var(--vv-line-2)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    inset: 3,
                    borderRadius: '50%',
                    background: 'var(--vv-amber)',
                  }}
                />
              )}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
