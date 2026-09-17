import type { ReactNode } from 'react';
import { Spinner } from './Spinner';

export interface LoadingStateProps {
  message?: string;
  action?: ReactNode;
}

export function LoadingState({ message = 'Loading…', action }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Spinner />
      <p className="body">{message}</p>
      {action}
    </div>
  );
}
