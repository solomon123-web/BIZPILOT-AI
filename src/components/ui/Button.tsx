import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ButtonSize, ButtonVariant } from '../../types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  to?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, children, className, disabled, to, type = 'button', ...props },
  ref,
) {
  const classes = ['button', `button--${variant}`, `button--${size}`, className ?? ''].filter(Boolean).join(' ');
  const content = (
    <>
      {loading ? <Loader2 className="button__spinner" size={16} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-busy={loading}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} aria-busy={loading} {...props}>
      {content}
    </button>
  );
});
