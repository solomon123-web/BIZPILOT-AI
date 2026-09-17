export type Period = 7 | 30 | 90 | 365;

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

export interface SeriesPoint {
  date: string; // ISO date
  value: number;
}

export interface AnalyticsResult {
  revenue: SeriesPoint[];
  customers: SeriesPoint[];
  engagement: SeriesPoint[]; // engagement score
  totalRevenue: number;
  totalCustomers: number;
  growthPercent: number;
  topContentType: string;
}

function seedRandom(seed: number) {
  return function () {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

export function generateAnalytics(period: Period): AnalyticsResult {
  const now = new Date();
  const days = period;
  const rand = seedRandom(period);

  const revenue: SeriesPoint[] = range(days).map((i) => {
    const date = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    const base = 20000 + rand() * 40000; // 20k-60k
    const trend = 1 + (i / days) * (rand() * 0.2); // small up/down trend
    const value = Math.round(base * trend);
    return { date: date.toISOString().slice(0, 10), value };
  });

  const customers: SeriesPoint[] = range(days).map((i) => {
    const date = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    const value = Math.round(1 + rand() * 5 + (i / days) * 2);
    return { date: date.toISOString().slice(0, 10), value };
  });

  const engagement: SeriesPoint[] = range(days).map((i) => {
    const date = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    const value = Math.round(20 + rand() * 80 + (i / days) * 10);
    return { date: date.toISOString().slice(0, 10), value };
  });

  const totalRevenue = revenue.reduce((s, r) => s + r.value, 0);
  const totalCustomers = customers.reduce((s, c) => s + c.value, 0);
  const growthPercent = Math.round((rand() * 20 - 5) * 10) / 10; // -5% to +15%

  const contentTypes = ['Promotional', 'Educational', 'Behind-the-scenes', 'Testimonial'];
  const topContentType = contentTypes[Math.floor(rand() * contentTypes.length)];

  return { revenue, customers, engagement, totalRevenue, totalCustomers, growthPercent, topContentType };
}
