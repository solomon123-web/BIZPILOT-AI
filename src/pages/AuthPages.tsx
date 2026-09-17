import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { Button, Card, Input, Textarea } from '../components/ui';
import type { BusinessGoal, BusinessProfile } from '../types/business';
import businessService, { mapBusinessToProfile } from '../services/businessService';

const businessTypes = [
  'Restaurant',
  'Bakery',
  'Fashion',
  'Beauty',
  'E-commerce',
  'Technology',
  'Education',
  'Consulting',
  'Logistics',
  'Agriculture',
  'Other',
];

const goalOptions: BusinessGoal[] = [
  'Get more customers',
  'Improve marketing',
  'Build my brand',
  'Improve customer service',
  'Build a website',
  'Increase sales',
];

const defaultProfile: BusinessProfile = {
  businessName: '',
  businessType: '',
  country: '',
  city: '',
  description: '',
  goals: [],
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div className="auth-form auth-form--login">
      <div className="auth-form__header">
        <span className="caption">Welcome back</span>
        <h1 className="h1">Log in</h1>
      </div>

      <form
        className="auth-form__content"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setLoading(true);
          try {
            await auth.login(email, password);
            navigate('/app');
          } catch (err: any) {
            setError(err?.data?.message || 'Invalid email or password.');
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="field">
          <span className="field__label">Email</span>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
        </label>

        <div className="auth-form__meta">
          <label className="checkbox-row">
            <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
            <span>Remember me</span>
          </label>
          <Link to="/login" className="text-link">Forgot password?</Link>
        </div>

        <Button variant="primary" size="lg" type="submit" className="auth-form__submit">
          {loading ? 'Logging in…' : 'Login'}
        </Button>
      </form>

      {error ? <p className="field__error">{error}</p> : null}

      <p className="auth-switch">
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await auth.signup(form.fullName || undefined, form.email, form.password);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form auth-form--signup">
      <div className="auth-form__header">
        <span className="caption">Start for free</span>
        <h1 className="h1">Create account</h1>
      </div>

      <form className="auth-form__content" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Full name</span>
          <Input value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Your name" />
        </label>

        <label className="field">
          <span className="field__label">Email</span>
          <Input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@company.com" />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <Input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Create a password" />
        </label>

        <label className="field">
          <span className="field__label">Confirm password</span>
          <Input type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} placeholder="Confirm your password" />
        </label>

        <Button variant="primary" size="lg" type="submit" className="auth-form__submit">
          {loading ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      {error ? <p className="field__error">{error}</p> : null}

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export function DemoPage() {
  const navigate = useNavigate();

  const handleEnterDemo = () => {
    // Load demo data into workspace context
    const demoData = {
      business: {
        businessName: 'Amaka Cakes',
        businessType: 'Bakery & Cake Business',
        country: 'Nigeria',
        city: 'Lagos',
        description: 'Premium custom cakes and baked goods for celebrations',
        goals: ['Get more customers', 'Improve marketing', 'Build my brand'] as const,
      },
      user: {
        name: 'Amaka Okonkwo',
        email: 'amaka@amakacakes.com',
      },
    };

    // Store demo data in session storage
    sessionStorage.setItem('demoMode', 'true');
    sessionStorage.setItem('demoData', JSON.stringify(demoData));

    // Navigate to app
    navigate('/app');
  };

  return (
    <div className="demo-page-container">
      <div className="demo-banner">
        <div className="demo-banner__content">
          <span className="caption">✨ Demo Mode</span>
          <p className="small">Explore BizPilotAI with our sample workspace</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          to="/signup"
        >
          Create Your Own Workspace
        </Button>
      </div>

      <div className="page-shell">
        <div className="page-hero">
          <div className="page-hero__inner">
            <div className="page-hero__icon">
              <span style={{ fontSize: '2rem' }}>🎂</span>
            </div>
            <h1 className="h1">Amaka Cakes</h1>
            <p className="body" style={{ marginTop: '12px', maxWidth: '500px' }}>
              Premium custom cakes and baked goods for celebrations. This is a demo workspace
              showing how BizPilotAI helps bakery businesses manage marketing, customers, and growth.
            </p>

            <div className="demo-features" style={{ marginTop: '32px', textAlign: 'left' }}>
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-card__icon">📊</div>
                  <h3 className="h3">Sample Customers</h3>
                  <p className="small">4 customer relationships with interaction history</p>
                </div>
                <div className="feature-card">
                  <div className="feature-card__icon">💰</div>
                  <h3 className="h3">Invoice Tracking</h3>
                  <p className="small">Track invoices and manage payments</p>
                </div>
                <div className="feature-card">
                  <div className="feature-card__icon">📱</div>
                  <h3 className="h3">Social Posts</h3>
                  <p className="small">AI-powered marketing content examples</p>
                </div>
              </div>
            </div>

            <div className="page-hero__actions" style={{ marginTop: '32px' }}>
              <Button variant="primary" onClick={handleEnterDemo}>
                Explore Demo Workspace
              </Button>
              <Button variant="ghost" to="/signup">
                Create Your Own Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>(defaultProfile);
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessProfile, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setBusiness } = useWorkspace();

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const currentStepContent = useMemo(() => {
    switch (step) {
      case 1:
        return {
          title: 'What is your business called?',
          placeholder: 'Amaka Cakes',
          value: profile.businessName,
          name: 'businessName',
          type: 'text',
          validate: (value: string) => value.trim().length > 0 || 'Business name is required.',
        };
      case 2:
        return {
          title: 'What type of business is this?',
          placeholder: 'Select a business type',
          value: profile.businessType,
          name: 'businessType',
          type: 'select',
          options: businessTypes,
          validate: (value: string) => value.trim().length > 0 || 'Please select a business type.',
        };
      case 3:
        return {
          title: 'Where is your business located?',
          placeholder: 'Country',
          value: profile.country,
          name: 'country',
          type: 'country',
          validate: (value: string) => value.trim().length > 0 || 'Country is required.',
        };
      case 4:
        return {
          title: 'Tell us about your business.',
          placeholder: 'Describe your business, products, and customers.',
          value: profile.description,
          name: 'description',
          type: 'textarea',
          validate: (value: string) => value.trim().length > 0 || 'Business description is required.',
        };
      case 5:
        return {
          title: 'What is your biggest goal right now?',
          placeholder: 'Select one or more goals',
          value: profile.goals,
          name: 'goals',
          type: 'goals',
          options: goalOptions,
          validate: (value: BusinessGoal[]) => (value.length > 0 ? true : 'Choose at least one goal.'),
        };
      default:
        return {
          title: 'Your BizPilotAI workspace is ready.',
          type: 'complete',
        };
    }
  }, [profile, step]);

  const validateCurrentStep = () => {
    const currentValue = currentStepContent.name ? profile[currentStepContent.name as keyof BusinessProfile] : '';
    const result = currentStepContent.validate ? currentStepContent.validate(currentValue as never) : true;

    if (result !== true) {
      const key = currentStepContent.name as keyof BusinessProfile;
      setErrors((current) => ({ ...current, [key]: result }));
      return false;
    }

    setErrors((current) => ({ ...current, [currentStepContent.name as keyof BusinessProfile]: undefined }));
    return true;
  };

  const updateField = <K extends keyof BusinessProfile>(field: K, value: BusinessProfile[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submitProfile = async () => {
    if (!user) {
      setSubmitError('You need to be signed in to create your business profile.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await businessService.createBusiness(profile);
      const createdBusiness = response?.data?.business ?? null;
      const mappedBusiness = mapBusinessToProfile(createdBusiness);

      if (!mappedBusiness) {
        throw new Error('Business profile could not be created.');
      }

      setBusiness(mappedBusiness);
      navigate('/app');
    } catch (error: any) {
      const message = error?.message || 'Unable to create your business profile right now.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (step === 3) {
      const cityValue = profile.city.trim();
      if (!cityValue) {
        setErrors((current) => ({ ...current, city: 'City is required.' }));
        return;
      }
    }

    if (step < 5 && validateCurrentStep()) {
      setStep((current) => current + 1);
      return;
    }

    if (step === 5 && validateCurrentStep()) {
      setStep(6);
      return;
    }

    if (step === 6 && !isSubmitting) {
      void submitProfile();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const renderStep = () => {
    if (step === 6) {
      return (
        <div className="onboarding-complete">
          <div className="status-icon">
            <ShieldCheck size={32} />
          </div>
          <h2 className="h2">Your BizPilotAI workspace is ready.</h2>
          <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />} onClick={() => void submitProfile()} disabled={isSubmitting}>
            {isSubmitting ? 'Creating workspace…' : 'Enter Workspace'}
          </Button>
          {submitError ? <p className="field__error" style={{ marginTop: '12px' }}>{submitError}</p> : null}
        </div>
      );
    }

    return (
      <div className="onboarding-step">
        <div className="onboarding-step__header">
          <span className="caption">Step {step} of {totalSteps}</span>
          <h2 className="h2">{currentStepContent.title}</h2>
        </div>

        <div className="progress"><span style={{ width: `${progress}%` }} /></div>

        {step === 1 ? (
          <label className="field">
            <span className="field__label">Business name</span>
            <Input
              value={profile.businessName}
              onChange={(event) => updateField('businessName', event.target.value)}
              placeholder={currentStepContent.placeholder}
              aria-invalid={Boolean(errors.businessName)}
            />
            {errors.businessName ? <span className="field__error">{errors.businessName}</span> : null}
          </label>
        ) : null}

        {step === 2 ? (
          <div className="option-grid">
            {businessTypes.map((item) => (
              <button
                key={item}
                type="button"
                className={profile.businessType === item ? 'option-pill option-pill--active' : 'option-pill'}
                onClick={() => updateField('businessType', item)}
              >
                {item}
              </button>
            ))}
            {errors.businessType ? <span className="field__error">{errors.businessType}</span> : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="split-fields">
            <label className="field">
              <span className="field__label">Country</span>
              <Input
                value={profile.country}
                onChange={(event) => updateField('country', event.target.value)}
                placeholder="Country"
                aria-invalid={Boolean(errors.country)}
              />
              {errors.country ? <span className="field__error">{errors.country}</span> : null}
            </label>

            <label className="field">
              <span className="field__label">City</span>
              <Input
                value={profile.city}
                onChange={(event) => updateField('city', event.target.value)}
                placeholder="City"
                aria-invalid={Boolean(errors.city)}
              />
              {errors.city ? <span className="field__error">{errors.city}</span> : null}
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <label className="field">
            <span className="field__label">Business description</span>
            <Textarea
              value={profile.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder={currentStepContent.placeholder}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description ? <span className="field__error">{errors.description}</span> : null}
          </label>
        ) : null}

        {step === 5 ? (
          <div className="option-grid option-grid--stacked">
            {goalOptions.map((goal) => {
              const selected = profile.goals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  className={selected ? 'option-pill option-pill--active' : 'option-pill'}
                  onClick={() => {
                    const nextGoals = selected ? profile.goals.filter((item) => item !== goal) : [...profile.goals, goal];
                    updateField('goals', nextGoals);
                  }}
                >
                  <span>{goal}</span>
                  {selected ? <Check size={16} /> : null}
                </button>
              );
            })}
            {errors.goals ? <span className="field__error">{errors.goals}</span> : null}
          </div>
        ) : null}

        <div className="onboarding-actions">
          {step > 1 && step < 6 ? (
            <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={handleBack}>
              Back
            </Button>
          ) : null}

          <Button variant="primary" size="lg" rightIcon={step < 5 ? <ArrowRight size={18} /> : undefined} onClick={handleContinue} disabled={isSubmitting}>
            {isSubmitting ? 'Working…' : step < 5 ? 'Continue' : step === 5 ? 'Complete setup' : 'Enter Workspace'}
          </Button>
        </div>
        {submitError ? <p className="field__error" style={{ marginTop: '12px' }}>{submitError}</p> : null}
      </div>
    );
  };

  return (
    <div className="onboarding-shell">
      <Card className="onboarding-card">
        {renderStep()}
      </Card>
    </div>
  );
}
