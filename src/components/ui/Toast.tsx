import type { ReactNode } from 'react';

export interface ToastProps {
  children: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}

export function Toast({ children, tone = 'default' }: ToastProps) {
  return <div className={['toast', `toast--${tone}`].filter(Boolean).join(' ')}>{children}</div>;
}
