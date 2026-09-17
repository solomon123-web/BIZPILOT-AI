import { Invoice } from '../types/finance';

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    customerId: 'c1',
    items: [
      { id: 'i1', description: 'Custom 5-tier wedding cake', quantity: 1, price: 150000, taxRate: 7.5 },
    ],
    amount: 150000,
    tax: 11250,
    total: 161250,
    date: '2024-08-10',
    dueDate: '2024-09-15',
    status: 'pending',
    notes: 'Deposit received 30%?',
  },
  {
    id: 'INV-002',
    customerId: 'c2',
    items: [
      { id: 'i2', description: '200 cupcakes (bulk)', quantity: 1, price: 280000, taxRate: 7.5 },
    ],
    amount: 280000,
    tax: 21000,
    total: 301000,
    date: '2024-07-20',
    dueDate: '2024-09-10',
    status: 'overdue',
    notes: 'Urgent delivery included.',
  },
  {
    id: 'INV-003',
    customerId: 'c3',
    items: [
      { id: 'i3', description: 'Twin birthday cakes', quantity: 2, price: 47500, taxRate: 7.5 },
    ],
    amount: 95000,
    tax: 7125,
    total: 102125,
    date: '2024-07-05',
    dueDate: '2024-08-25',
    status: 'paid',
    notes: '',
  },
];
