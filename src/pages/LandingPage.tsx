import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductPreview } from '../components/marketing/ProductPreview';
import { Button, Card } from '../components/ui';
import { featureItems, pricingPlans, socialProofCategories, steps, teamMembers, testimonials } from '../data/marketing';

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-header">
      <span className="caption">{eyebrow}</span>
      <h2 className="h2">{title}</h2>
      <p className="body body--large">{description}</p>
    </div>
  );
}

export function LandingPage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-section__content">
          <span className="badge">AI-powered operations</span>
          <h1 className="display">Run your business with an AI team.</h1>
          <p className="body body--large">
            BizPilotAI helps you market your business, build your brand, respond to customers, create content, and make better business decisions — all from one intelligent workspace.
          </p>
          <div className="hero-actions">
            <Button variant="primary" rightIcon={<ArrowRight size={16} />} to="/signup">
              Get Started
            </Button>
            <Button variant="outline" rightIcon={<ChevronRight size={16} />} to="/login">
              Try Demo
            </Button>
          </div>

          <div className="hero-meta">
            <div>
              <strong>3x</strong>
              <span>faster execution</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>AI coverage</span>
            </div>
            <div>
              <strong>1 hub</strong>
              <span>for your business</span>
            </div>
          </div>
        </div>

        <div className="hero-section__preview">
          <ProductPreview />
        </div>
      </section>

      <section className="trust-bar">
        <p className="caption">Built for ambitious small businesses.</p>
        <div className="trust-bar__grid" aria-label="Business categories">
          {socialProofCategories.map((category) => (
            <span key={category} className="trust-pill">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="content-section" id="features">
        <SectionHeader
          eyebrow="Features"
          title="Your business operations, streamlined with AI."
          description="Everything needed to market, operate, and grow a modern business — without siloed tools or scattered work."
        />

        <div className="feature-grid">
          {featureItems.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="feature-card">
              <div className="feature-card__icon">
                <Icon size={20} />
              </div>
              <div className="feature-card__body">
                <h3 className="h3">{title}</h3>
                <p className="body">{description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-section content-section--muted" id="how-it-works">
        <SectionHeader
          eyebrow="How it works"
          title="A simple system built for momentum."
          description="Start with your business context and let the workflow accelerate from there."
        />

        <div className="steps-grid">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <Card key={number} className="step-card">
              <span className="step-card__number">{number}</span>
              <div className="step-card__icon">
                <Icon size={18} />
              </div>
              <h3 className="h3">{title}</h3>
              <p className="body">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-section" id="about">
        <SectionHeader
          eyebrow="AI team"
          title="Your operations run on a complete AI team."
          description="Each specialist works together to support growth, creation, communication, and operational clarity."
        />

        <div className="team-grid">
          {teamMembers.map(({ name, role, icon: Icon }) => (
            <Card key={name} className="team-card">
              <div className="team-card__icon">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="h3">{name}</h3>
                <p className="small">{role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-section content-section--muted" id="pricing">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans for every stage of growth."
          description="Choose a plan that matches your business today, then scale when your needs expand."
        />

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={plan.highlight ? 'pricing-card pricing-card--featured' : 'pricing-card'}>
              <div className="pricing-card__header">
                <span className="caption">{plan.name}</span>
                {plan.highlight ? <span className="badge">Most popular</span> : null}
              </div>
              <div className="pricing-card__price">
                <strong>{plan.price}</strong>
                <span>/mo</span>
              </div>
              <p className="body">{plan.description}</p>
              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? 'primary' : 'outline'} to="/signup">
                {plan.name === 'Free' ? 'Get started' : 'Choose plan'}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-section" id="testimonials">
        <SectionHeader
          eyebrow="Testimonials"
          title="Business owners rely on BizPilotAI to move faster."
          description="Real operators use the platform to keep strategy, marketing, and customer experience aligned."
        />

        <div className="testimonial-grid">
          {testimonials.map(({ quote, name, role }) => (
            <Card key={name} className="testimonial-card">
              <div className="testimonial-card__stars" aria-label="Five star review">
                {'★★★★★'}
              </div>
              <p className="body">“{quote}”</p>
              <div className="testimonial-card__author">
                <div className="avatar">{name.charAt(0)}</div>
                <div>
                  <strong>{name}</strong>
                  <span>{role}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta__inner">
          <div>
            <span className="caption">Ready to scale</span>
            <h2 className="h2">Your business deserves an AI team.</h2>
          </div>
          <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />} to="/signup">
            Start Building Your Business
          </Button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__top">
          <div>
            <div className="brand" aria-label="BizPilotAI home">
              <span className="brand__mark">B</span>
              <span className="brand__text">BizPilotAI</span>
            </div>
            <p className="small">Business systems, AI-powered.</p>
          </div>

          <div className="site-footer__links">
            {[
              { title: 'Product', links: ['Features', 'How It Works', 'Pricing'] },
              { title: 'Company', links: ['About', 'Customers', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
            ].map((group) => (
              <div key={group.title}>
                <span className="label">{group.title}</span>
                <ul>
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link to="/">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="site-footer__bottom">
          <span className="small">© 2026 BizPilotAI</span>
          <div className="social-links">
            <Link to="/">X</Link>
            <Link to="/">LinkedIn</Link>
            <Link to="/">Instagram</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
