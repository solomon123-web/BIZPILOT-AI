import type { ReactNode } from 'react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export function ErrorState({ title = 'Something went wrong', message = 'Please try again later.', action }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div>
        <h3 className="h3">{title}</h3>
        <p className="body">{message}</p>
      </div>
      {action}
    </div>
  );
}
