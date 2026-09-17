import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
