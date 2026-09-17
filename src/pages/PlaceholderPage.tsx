import type { ReactNode } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui';

interface PlaceholderPageProps {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function PlaceholderPage({ title, description, eyebrow = 'Foundation', action }: PlaceholderPageProps) {
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        <div className="page-hero__badge">{eyebrow}</div>
        <div className="page-hero__icon">
          <Sparkles size={18} />
        </div>
        <h1 className="display">{title}</h1>
        <p className="body body--large">{description}</p>

        <div className="page-hero__actions">
          {action ?? (
            <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
              View workspace
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
