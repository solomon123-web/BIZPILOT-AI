import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div>
        <h3 className="h3">{title}</h3>
        {description ? <p className="body">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
