import type { HTMLAttributes, ReactNode } from 'react';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Dropdown({ className = '', children, ...props }: DropdownProps) {
  return (
    <div className={['dropdown', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
