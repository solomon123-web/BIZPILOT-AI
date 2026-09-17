import type { HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
}

export function Avatar({ name = 'AI', src, className = '', ...props }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={['avatar', className].filter(Boolean).join(' ')} aria-label={name} {...props}>
      {src ? <img src={src} alt={name} /> : initials}
    </div>
  );
}
