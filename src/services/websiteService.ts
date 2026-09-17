import type { BusinessProfile } from '../types/business';

function wait(ms = 600) {
  return new Promise((res) => setTimeout(res, ms));
}

export type WebsiteStyle = 'Modern' | 'Elegant' | 'Minimal' | 'Bold' | 'Luxury';

export interface GeneratedWebsite {
  hero: { headline: string; description: string; cta: string };
  services: Array<{ title: string; description: string }>;
  about: { heading: string; body: string };
  contact: { phone?: string; email?: string; address?: string };
}

export async function generateWebsite(
  data: {
    name: string;
    description?: string;
    services?: string[];
    contact?: { phone?: string; email?: string };
    location?: string;
    style?: WebsiteStyle;
  },
  business?: BusinessProfile,
): Promise<GeneratedWebsite> {
  await wait(700);

  const name = data.name || business?.businessName || 'Your Business';
  const style = data.style || 'Modern';

  const hero = {
    headline: `${name} — ${style} & Delicious`,
    description: data.description || `We create beautiful custom cakes and baked goods for every celebration. Handcrafted with premium ingredients and a passion for design.`,
    cta: 'Order Now',
  };

  const services = (data.services && data.services.length > 0
    ? data.services
    : ['Custom Cakes', 'Cupcakes & Desserts', 'Corporate Orders']).map((s) => ({ title: s, description: `Professional ${s.toLowerCase()} tailored to your event.` }));

  const about = {
    heading: `About ${name}`,
    body: data.description || `Founded with a love for baking and celebration, ${name} crafts memorable cakes for weddings, birthdays, and special events. We focus on quality, flavor, and beautiful presentation.`,
  };

  const contact = {
    phone: data.contact?.phone || business?.businessName ? '+234 800 000 0000' : undefined,
    email: data.contact?.email || business?.businessName ? 'hello@yourbusiness.com' : undefined,
    address: data.location || business?.city || undefined,
  };

  return { hero, services, about, contact };
}

export default { generateWebsite };
