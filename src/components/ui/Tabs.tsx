import type { ReactNode } from 'react';

export interface TabsProps {
  tabs: Array<{ label: string; value: string; content?: ReactNode; active?: boolean }>;
}

export function Tabs({ tabs }: TabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="Navigation tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={['tabs__trigger', tab.active ? 'tabs__trigger--active' : ''].filter(Boolean).join(' ')}
          role="tab"
          aria-selected={tab.active ?? false}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
