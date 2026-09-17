import { BusinessProfile } from '../types/business';

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  lastContact: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface DemoInvoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

export interface DemoMarketingPost {
  id: string;
  platform: string;
  content: string;
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface DemoWorkspace {
  id: string;
  business: BusinessProfile;
  user: { name: string; email: string };
  customers: DemoCustomer[];
  invoices: DemoInvoice[];
  marketingPosts: DemoMarketingPost[];
  analytics: {
    totalRevenue: number;
    totalCustomers: number;
    monthlyGrowth: number;
    activeInvoices: number;
  };
}

export const demoBusiness: BusinessProfile = {
  businessName: 'Amaka Cakes',
  businessType: 'Bakery & Cake Business',
  country: 'Nigeria',
  city: 'Lagos',
  description: 'Premium custom cakes and baked goods for celebrations',
  goals: ['Get more customers', 'Improve marketing', 'Build my brand'],
};

export const demoUser = {
  name: 'Amaka Okonkwo',
  email: 'amaka@amakacakes.com',
};

export const demoCustomers: DemoCustomer[] = [
  {
    id: '1',
    name: 'Chioma Afu',
    email: 'chioma@email.com',
    phone: '+234 801 234 5678',
    businessType: 'Wedding Planner',
    lastContact: '2 days ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'Tunde Adekunle',
    email: 'tunde@email.com',
    phone: '+234 802 345 6789',
    businessType: 'Event Organizer',
    lastContact: '1 week ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'Nkechi Obi',
    email: 'nkechi@email.com',
    phone: '+234 803 456 7890',
    businessType: 'Corporate',
    lastContact: '3 days ago',
    status: 'pending',
  },
  {
    id: '4',
    name: 'Kunle Okafor',
    email: 'kunle@email.com',
    phone: '+234 804 567 8901',
    businessType: 'Birthday Party Host',
    lastContact: '2 weeks ago',
    status: 'inactive',
  },
];

export const demoInvoices: DemoInvoice[] = [
  {
    id: 'INV001',
    clientName: 'Chioma Afu - Wedding Cake',
    amount: 150000,
    dueDate: '2024-09-15',
    status: 'pending',
    description: 'Custom 5-tier wedding cake with fondant work',
  },
  {
    id: 'INV002',
    clientName: 'Tunde Adekunle - Corporate Event',
    amount: 280000,
    dueDate: '2024-09-10',
    status: 'overdue',
    description: '200 cupcakes for corporate event',
  },
  {
    id: 'INV003',
    clientName: 'Nkechi Obi - Birthday Cakes',
    amount: 95000,
    dueDate: '2024-08-25',
    status: 'paid',
    description: 'Twin birthday celebration cakes',
  },
  {
    id: 'INV004',
    clientName: 'Kunle Okafor - Party Cake',
    amount: 75000,
    dueDate: '2024-08-20',
    status: 'paid',
    description: 'Chocolate cake with custom decoration',
  },
];

export const demoMarketingPosts: DemoMarketingPost[] = [
  {
    id: 'POST001',
    platform: 'Instagram',
    content: 'New flavor alert! 🎂✨ Introducing our signature Hibiscus-Lemon cake...',
    publishedAt: '2 days ago',
    engagement: {
      likes: 245,
      comments: 32,
      shares: 18,
    },
  },
  {
    id: 'POST002',
    platform: 'Instagram',
    content: 'Weekend specials! Get 20% off on cupcake boxes this Saturday 🧁',
    publishedAt: '5 days ago',
    engagement: {
      likes: 189,
      comments: 24,
      shares: 12,
    },
  },
  {
    id: 'POST003',
    platform: 'Facebook',
    content: 'Behind the scenes of creating our latest wedding masterpiece...',
    publishedAt: '1 week ago',
    engagement: {
      likes: 156,
      comments: 18,
      shares: 8,
    },
  },
];

export const demoWorkspace: DemoWorkspace = {
  id: 'demo-amaka-cakes',
  business: demoBusiness,
  user: demoUser,
  customers: demoCustomers,
  invoices: demoInvoices,
  marketingPosts: demoMarketingPosts,
  analytics: {
    totalRevenue: 600000,
    totalCustomers: 4,
    monthlyGrowth: 32,
    activeInvoices: 2,
  },
};
