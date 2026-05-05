/**
 * PWA 알림·배지 헬퍼.
 *
 * 백엔드 푸시 서버 없이 가능한 범위만 다룸:
 *   - Badge API (`navigator.setAppBadge`) — 설치된 PWA 아이콘에 숫자
 *   - Notification API — 앱이 열려 있을 때 즉시 발사
 *
 * 백그라운드 정기 푸시(앱 닫혀 있을 때)는 Web Push + 서버가 필요해
 * 현 단계에선 미지원.
 */

type BadgeNav = Navigator & {
  setAppBadge?: (n?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

const STORAGE_LAST_NOTIFIED = 'vv:lastNotifiedDay';

function dayKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function setBadge(count: number): void {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as BadgeNav;
  if (count > 0 && nav.setAppBadge) {
    nav.setAppBadge(count).catch(() => {});
  } else if (nav.clearAppBadge) {
    nav.clearAppBadge().catch(() => {});
  }
}

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function getPermissionState(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  const result = await Notification.requestPermission();
  return result;
}

/**
 * 홈 진입 시 오늘 학습 분량이 남아 있으면 1회 알림.
 * 같은 날 이미 알림을 한 번 띄웠으면 다시 띄우지 않음 (도배 방지).
 */
export function maybeNotifyToday(dueCount: number, newCount: number): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  const total = dueCount + newCount;
  if (total <= 0) return;

  const today = dayKey();
  if (window.localStorage.getItem(STORAGE_LAST_NOTIFIED) === today) return;

  try {
    new Notification('VocaVoca · 오늘 학습', {
      body: `복습 ${dueCount}개 · 신규 ${newCount}개. 약 ${Math.max(2, Math.round(total * 0.35))}분이면 끝나요.`,
      tag: 'vv-daily',
      icon: '/icon.svg',
      silent: false,
    });
    window.localStorage.setItem(STORAGE_LAST_NOTIFIED, today);
  } catch {
    // 사파리 등에서 PWA 미설치 상태에서 throw하는 경우가 있어 무시
  }
}
