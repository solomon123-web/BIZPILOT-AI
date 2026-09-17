import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export function PageContainer({
  children,
  maxWidth = 'xl',
  padding = true,
}: PageContainerProps) {
  return (
    <div className={`page-container page-container--${maxWidth}${padding ? ' page-container--padded' : ''}`}>
      {children}
    </div>
  );
}
