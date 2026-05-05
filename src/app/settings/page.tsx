'use client';

import { useEffect, useState } from 'react';
import { BackIcon, IconButton } from '@/components/IconButton';
import { bootstrap } from '@/lib/bootstrap';
import { getDb, type StudyPlan, type UserSettings } from '@/lib/db';
import {
  getPermissionState,
  requestNotificationPermission,
  type NotificationPermissionState,
} from '@/lib/notify';
import { buildDefaultPlan, daysUntil } from '@/lib/plan';
import {
  ACCENT_MAP,
  getStoredAccent,
  getStoredTheme,
  setAccent,
  setTheme,
  type Accent,
  type Theme,
} from '@/lib/theme';

const NEW_CARD_OPTIONS = [10, 15, 20, 25];
const REVIEW_CAP_OPTIONS = [50, 100, 150, 200];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'system', label: '시스템' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
];

const ACCENT_OPTIONS: { value: Accent; label: string }[] = [
  { value: 'amber', label: '앰버' },
  { value: 'eucalyptus', label: '유칼립' },
  { value: 'coral', label: '코랄' },
  { value: 'sky', label: '스카이' },
];

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
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
  const [accent, setAccentState] = useState<Accent>(() => getStoredAccent());
  const [notifPerm, setNotifPerm] = useState<NotificationPermissionState>('default');
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
          setNotifPerm(getPermissionState());
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const requestNotif = async () => {
    const result = await requestNotificationPermission();
    setNotifPerm(result);
  };

  const updateTheme = (t: Theme) => {
    setThemeState(t);
    setTheme(t);
  };
  const updateAccent = (a: Accent) => {
    setAccentState(a);
    setAccent(a);
  };

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
    const rebuilt = buildDefaultPlan(next, plan.startedAt, plan.goalLabel);
    setPlan(rebuilt);
    const db = getDb();
    await db.plans.put(rebuilt);
  };

  const updateGoalLabel = async (label: string) => {
    if (!plan) return;
    const next = { ...plan, goalLabel: label };
    setPlan(next);
    const db = getDb();
    await db.plans.put(next);
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
        <IconButton href="/" ariaLabel="뒤로">
          <BackIcon />
        </IconButton>
        <p style={{ fontWeight: 700, fontSize: 15 }}>설정</p>
        <div style={{ width: 34 }} />
      </div>

      {/* 테마 */}
      <Section label="테마">
        <FieldRow title="다크 모드" sub="시스템 자동 / 항상 라이트 / 항상 다크">
          <SegmentedTheme value={theme} onChange={updateTheme} />
        </FieldRow>
        <Divider />
        <FieldRow title="액센트 컬러" sub="시작 버튼·진행률 등 강조 색상">
          <AccentSwatches value={accent} onChange={updateAccent} />
        </FieldRow>
      </Section>

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

      {/* 목표 */}
      <Section label="목표">
        <FieldRow
          title="목표 이름"
          sub="홈 화면에 표시됩니다. 예: 호주 워홀, TOEIC 800점, 어학연수"
        >
          <input
            type="text"
            value={plan.goalLabel}
            maxLength={30}
            placeholder="목표를 입력하세요"
            onChange={(e) => updateGoalLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid var(--vv-line-2)',
              background: 'var(--vv-bg)',
              color: 'var(--vv-ink)',
              fontSize: 14,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </FieldRow>
        <Divider />
        <FieldRow
          title="목표일"
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
              boxSizing: 'border-box',
            }}
          />
        </FieldRow>
      </Section>

      {/* 알림 */}
      <Section label="알림">
        <FieldRow
          title="학습 알림"
          sub="앱 진입 시 그날 학습 분량을 1회 알려줍니다"
        >
          <NotifRow state={notifPerm} onRequest={requestNotif} />
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

function NotifRow({
  state,
  onRequest,
}: {
  state: NotificationPermissionState;
  onRequest: () => void;
}) {
  if (state === 'unsupported') {
    return (
      <p style={{ fontSize: 12, color: 'var(--vv-ink-3)' }}>
        이 브라우저는 알림을 지원하지 않아요. iOS는 홈 화면에 추가한 PWA에서만 알림이
        활성화됩니다.
      </p>
    );
  }
  if (state === 'granted') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          background: 'var(--vv-eucalyptus-soft)',
          color: 'var(--vv-eucalyptus)',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span>✓</span>
        <span>알림 켜짐</span>
      </div>
    );
  }
  if (state === 'denied') {
    return (
      <p style={{ fontSize: 12, color: 'var(--vv-ink-3)', lineHeight: 1.5 }}>
        브라우저에서 알림이 차단됨. 주소창의 자물쇠 아이콘 → 사이트 설정에서 알림을
        허용으로 바꿔주세요.
      </p>
    );
  }
  return (
    <button
      type="button"
      onClick={onRequest}
      className="vv-press"
      style={{
        padding: '10px 14px',
        border: 'none',
        background: 'var(--vv-amber)',
        color: 'white',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      알림 켜기
    </button>
  );
}

function SegmentedTheme({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (v: Theme) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${THEME_OPTIONS.length}, 1fr)`,
        gap: 6,
      }}
    >
      {THEME_OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="vv-press"
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
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function AccentSwatches({
  value,
  onChange,
}: {
  value: Accent;
  onChange: (v: Accent) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {ACCENT_OPTIONS.map((opt) => {
        const active = opt.value === value;
        const c = ACCENT_MAP[opt.value].lightPrimary;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="vv-press"
            aria-label={opt.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '8px 4px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: c,
                boxShadow: active
                  ? `0 0 0 3px var(--vv-bg), 0 0 0 5px ${c}`
                  : '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'box-shadow 160ms ease',
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--vv-ink)' : 'var(--vv-ink-3)',
              }}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

