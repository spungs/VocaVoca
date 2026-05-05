export type Theme = 'light' | 'dark' | 'system';
export type Accent = 'amber' | 'eucalyptus' | 'coral' | 'sky';

const STORAGE_THEME = 'vv:theme';
const STORAGE_ACCENT = 'vv:accent';

interface AccentColor {
  lightPrimary: string;
  lightSoft: string;
  darkPrimary: string;
  darkSoft: string;
}

export const ACCENT_MAP: Record<Accent, AccentColor> = {
  amber: { lightPrimary: '#E8743C', lightSoft: '#FCE6D6', darkPrimary: '#F08651', darkSoft: '#3A2418' },
  eucalyptus: { lightPrimary: '#5B7553', lightSoft: '#DDE5D2', darkPrimary: '#8FAE82', darkSoft: '#25301F' },
  coral: { lightPrimary: '#D9534F', lightSoft: '#F8DAD8', darkPrimary: '#E26B66', darkSoft: '#3A1E1C' },
  sky: { lightPrimary: '#3F7BA8', lightSoft: '#D6E4F0', darkPrimary: '#6BA0CC', darkSoft: '#1B2A38' },
};

function isValidTheme(v: unknown): v is Theme {
  return v === 'light' || v === 'dark' || v === 'system';
}

function isValidAccent(v: unknown): v is Accent {
  return v === 'amber' || v === 'eucalyptus' || v === 'coral' || v === 'sky';
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const v = window.localStorage.getItem(STORAGE_THEME);
  return isValidTheme(v) ? v : 'system';
}

export function getStoredAccent(): Accent {
  if (typeof window === 'undefined') return 'amber';
  const v = window.localStorage.getItem(STORAGE_ACCENT);
  return isValidAccent(v) ? v : 'amber';
}

function isDarkActive(theme: Theme): boolean {
  if (typeof window === 'undefined') return false;
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyAll() {
  if (typeof document === 'undefined') return;
  const theme = getStoredTheme();
  const accent = getStoredAccent();
  const html = document.documentElement;
  html.classList.remove('vv-light', 'vv-dark');
  if (theme === 'light') html.classList.add('vv-light');
  else if (theme === 'dark') html.classList.add('vv-dark');
  const a = ACCENT_MAP[accent];
  const dark = isDarkActive(theme);
  html.style.setProperty('--vv-amber', dark ? a.darkPrimary : a.lightPrimary);
  html.style.setProperty('--vv-amber-soft', dark ? a.darkSoft : a.lightSoft);
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_THEME, theme);
  applyAll();
}

export function setAccent(accent: Accent): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_ACCENT, accent);
  applyAll();
}
