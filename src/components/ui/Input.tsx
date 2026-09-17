import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={['input', className].filter(Boolean).join(' ')} {...props} />;
});
