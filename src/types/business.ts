export type BusinessGoal =
  | 'Get more customers'
  | 'Improve marketing'
  | 'Build my brand'
  | 'Improve customer service'
  | 'Build a website'
  | 'Increase sales';

export interface BusinessProfile {
  id?: string;
  businessName: string;
  businessType: string;
  country: string;
  city: string;
  description: string;
  goals: BusinessGoal[];
}
