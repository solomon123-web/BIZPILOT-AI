import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Gauge,
  Globe,
  MessageSquareText,
  Rocket,
  Sparkles,
  Wand2,
} from 'lucide-react';

export const socialProofCategories = ['Retail', 'Food', 'Fashion', 'Beauty', 'Services', 'E-commerce'];

export const featureItems = [
  {
    title: 'AI Business Assistant',
    description: 'Your intelligent business companion for daily operations, planning, and execution.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'AI Marketing',
    description: 'Create social content, campaigns, offers, and positioning ideas in one flow.',
    icon: Rocket,
  },
  {
    title: 'AI Branding',
    description: 'Shape a consistent brand voice and visual identity that stands out in the market.',
    icon: Wand2,
  },
  {
    title: 'Customer Replies',
    description: 'Generate professional, clear, and on-brand responses to customer messages faster.',
    icon: MessageSquareText,
  },
  {
    title: 'Website Builder',
    description: 'Turn your business goals into a polished website with AI-guided structure and copy.',
    icon: Globe,
  },
  {
    title: 'Business Management',
    description: 'Keep customers, invoices, and core business info organized without adding admin overhead.',
    icon: Building2,
  },
];

export const teamMembers = [
  { name: 'AI Business Assistant', role: 'Strategy and operations', icon: BriefcaseBusiness },
  { name: 'AI Marketing Assistant', role: 'Campaigns and growth', icon: Sparkles },
  { name: 'AI Branding Assistant', role: 'Brand identity and messaging', icon: BadgeCheck },
  { name: 'AI Customer Support Assistant', role: 'Replies and service quality', icon: MessageSquareText },
  { name: 'AI Website Builder', role: 'Sites and landing pages', icon: Globe },
  { name: 'AI Business Advisor', role: 'Insights and recommendations', icon: BarChart3 },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For exploring BizPilotAI.',
    highlight: false,
    features: ['1 workspace', 'Core AI tools', 'Basic business templates', 'Email support'],
  },
  {
    name: 'Growth',
    price: '$39',
    description: 'For growing businesses.',
    highlight: true,
    features: ['Unlimited projects', 'Advanced AI workflows', 'Marketing and branding tools', 'Customer response automation'],
  },
  {
    name: 'Pro',
    price: '$79',
    description: 'For businesses that need more advanced AI assistance.',
    highlight: false,
    features: ['Everything in Growth', 'Priority AI processing', 'Team collaboration', 'Custom business dashboards'],
  },
];

export const testimonials = [
  {
    quote:
      'BizPilotAI has replaced three fragmented tools for us. Our marketing, customer replies, and planning now flow from one place.',
    name: 'Maya Torres',
    role: 'Owner, Northline Studio',
  },
  {
    quote:
      'The AI assistant helps us respond faster and stay consistent. It feels like having an operations partner without adding headcount.',
    name: 'Daniel Brooks',
    role: 'Founder, Harbor & Co.',
  },
  {
    quote:
      'We launched a cleaner brand and website in a week. The content and positioning support were surprisingly strong.',
    name: 'Aisha Khan',
    role: 'Director, Luma Market',
  },
];

export const footerGroups = [
  {
    title: 'Product',
    links: ['Features', 'How It Works', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Customers', 'Careers'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security'],
  },
];

export const steps = [
  {
    number: '01',
    title: 'Tell BizPilotAI about your business.',
    description: 'Share your brand, goals, and customer context so the system understands how you work.',
    icon: Gauge,
  },
  {
    number: '02',
    title: 'Let your AI team create and manage business tasks.',
    description: 'Automate marketing, support, branding, and business planning across the workflow.',
    icon: ArrowRight,
  },
  {
    number: '03',
    title: 'Use the insights and generated work to grow.',
    description: 'Turn recommendations into faster decisions, better execution, and more consistent output.',
    icon: Sparkles,
  },
];
