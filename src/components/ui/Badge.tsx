import type { HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Badge({ className = '', children, ...props }: BadgeProps) {
  return (
    <span className={['badge', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
}
