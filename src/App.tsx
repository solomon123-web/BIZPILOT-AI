import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout, AuthLayout, PublicLayout } from './layouts';
import ProtectedRoute from './components/ProtectedRoute';
import { DemoPage, LoginPage, OnboardingPage, SignupPage } from './pages/AuthPages';
import { LandingPage } from './pages/LandingPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import {
  HomePage,
  AIAssistantPage,
  MarketingPage,
  BrandingPage,
  WebsiteBuilderPage,
  CustomerRepliesPage,
  CustomersPage,
  InvoicesPage,
  AnalyticsPage,
  SettingsPage,
} from './pages/app/AppPages';
import { useAuth } from './contexts/AuthContext';
import { useWorkspace } from './contexts/WorkspaceContext';

function OnboardingGate() {
  const { user, loading } = useAuth();
  const { business, isDemoMode } = useWorkspace();

  if (loading) return null;
  if (user && !isDemoMode && business) {
    return <Navigate to="/app" replace />;
  }

  return <OnboardingPage />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/features"
          element={
            <PlaceholderPage
              title="Features"
              description="Core product capabilities and workflow blocks for growing teams."
            />
          }
        />
        <Route
          path="/pricing"
          element={
            <PlaceholderPage
              title="Pricing"
              description="Flexible plans built for lean operators and scaling teams."
            />
          }
        />
        <Route
          path="/about"
          element={
            <PlaceholderPage
              title="About"
              description="Purpose-built systems for operational clarity and entrepreneurial momentum."
            />
          }
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/onboarding" element={<OnboardingGate />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/app" element={<HomePage />} />
        <Route path="/app/assistant" element={<AIAssistantPage />} />
        <Route path="/app/marketing" element={<MarketingPage />} />
        <Route path="/app/branding" element={<BrandingPage />} />
        <Route path="/app/website-builder" element={<WebsiteBuilderPage />} />
        <Route path="/app/customer-replies" element={<CustomerRepliesPage />} />
        <Route path="/app/customers" element={<CustomersPage />} />
        <Route path="/app/invoices" element={<InvoicesPage />} />
        <Route path="/app/analytics" element={<AnalyticsPage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
