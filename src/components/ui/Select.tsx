import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className = '', children, ...props }, ref) {
  return (
    <select ref={ref} className={['select', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </select>
  );
});
