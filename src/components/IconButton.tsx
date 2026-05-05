'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

interface IconButtonProps {
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  children: ReactNode;
}

const STYLE: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 12,
  background: 'var(--vv-surface)',
  color: 'var(--vv-ink-2)',
  border: 'none',
  cursor: 'pointer',
};

const CLASS = 'vv-press grid place-items-center';

export function IconButton({ href, onClick, ariaLabel, children }: IconButtonProps) {
  if (href) {
    return (
      <Link href={href} className={CLASS} style={STYLE} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={CLASS} style={STYLE} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
