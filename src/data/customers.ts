import { Customer } from '../types/finance';

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Chioma Afu',
    email: 'chioma@email.com',
    phone: '+234 801 234 5678',
    status: 'active',
    lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: 150000,
    notes: 'Wedding planner. Prefers floral designs.',
  },
  {
    id: 'c2',
    name: 'Tunde Adekunle',
    email: 'tunde@email.com',
    phone: '+234 802 345 6789',
    status: 'active',
    lastInteraction: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: 280000,
    notes: 'Corporate client, large cupcake orders.',
  },
  {
    id: 'c3',
    name: 'Nkechi Obi',
    email: 'nkechi@email.com',
    phone: '+234 803 456 7890',
    status: 'pending',
    lastInteraction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: 95000,
    notes: 'Requested custom birthday cake quote.',
  },
  {
    id: 'c4',
    name: 'Kunle Okafor',
    email: 'kunle@email.com',
    phone: '+234 804 567 8901',
    status: 'inactive',
    lastInteraction: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    totalPurchases: 75000,
    notes: 'Stopped ordering after price increase.',
  },
];
