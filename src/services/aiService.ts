import type { BusinessProfile } from '../types/business';
import api from './api';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export const suggestedPrompts = [
  'Create an Instagram post',
  'Help me get more customers',
  'Write a customer reply',
  'Create a weekend promotion',
  'Give me content ideas',
  'Help me improve my business',
];

export async function generateAiResponse(
  prompt: string,
  business: BusinessProfile | null,
  history?: ChatMessage[],
): Promise<string> {
  try {
    const payload = {
      message: prompt,
      businessName: business?.businessName,
      businessType: business?.businessType,
      city: business?.city,
      country: business?.country,
      messages: history?.map((m) => ({ role: m.role, content: m.content })) ?? undefined,
    };

    const response = await api.post<{ success: boolean; message: string }>('/ai/chat', payload);

    if (response.success && response.message) {
      return response.message;
    }

    return response.message || 'Unable to generate response from AI.';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred while generating AI response.';
    console.error('AI Service Error:', message);
    throw error;
  }
}

export async function generateMarketing(platform: string, goal: string, tone: string, business?: BusinessProfile) {
  const name = business?.businessName ?? 'Your Business';
  const caption = `${name} — ${goal} ${platform} post in a ${tone} tone.`;
  const content = `Introducing a new seasonal treat from ${name}. Handcrafted and perfect for celebrations.`;
  const cta = 'Order now';
  const hashtags = ['#bakery', '#cakes', `${(business?.businessName || 'brand').replace(/\s+/g, '')}`];
  return { caption, content, cta, hashtags };
}

export interface MarketingResult {
  caption: string;
  content: string;
  cta: string;
  hashtags: string[];
}

export async function generateContentIdeas(business?: BusinessProfile) {
  const name = business?.businessName ?? 'Your Business';
  return [
    `Show a behind-the-scenes video of making ${name}'s best-selling cake.`,
    `Share a customer testimonial with before/after photos.`,
    `Create a "Meet the Baker" post introducing the team.`,
  ];
}

export async function generateBranding(business?: BusinessProfile) {
  const name = business?.businessName ?? 'Your Business';
  return {
    brandName: `${name} Co.`,
    tagline: 'Handcrafted goodness for every occasion',
    description: `${name} creates premium custom cakes and baked goods for celebrations. We focus on flavor, detail, and customer delight.`,
    voice: 'Warm, friendly, and professional',
    socialBio: `${name} — premium custom cakes. Order online or visit our shop.`,
    colorDirection: 'Warm neutrals with a pop of coral or hibiscus',
    typography: 'Serif headline + clean sans body',
  };
}

export interface BrandingResult {
  brandName: string;
  tagline: string;
  description: string;
  voice: string;
  socialBio: string;
  colorDirection: string;
  typography: string;
}

export async function generateCustomerReply(message: string, tone: string, business?: BusinessProfile) {
  const name = business?.businessName ?? 'Our bakery';
  if (message.toLowerCase().includes('how much')) {
    return `Thanks for asking! ${name} birthday cakes start at NGN 10,000 for a small 6-inch design. For custom designs or tiers, prices vary — tell us the date and theme, and we'll send a custom quote.`;
  }
  if (tone === 'Short' || tone === 'short') {
    return `Thanks — we can do that. Prices start at NGN 10,000.`;
  }
  return `Hi! Thanks for reaching out to ${name}. We offer a range of cakes starting from NGN 10,000. Share your event date and preferred design, and we'll prepare a tailored quote.`;
}

export const defaultExport = {
  suggestedPrompts,
  generateAiResponse,
  generateMarketing,
  generateContentIdeas,
  generateBranding,
  generateCustomerReply,
};

export default defaultExport;
