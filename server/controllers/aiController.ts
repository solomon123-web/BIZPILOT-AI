import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import env from '../config/env.js';
import https from 'https';
import { prisma } from '../config/prisma.js';
import businessService from '../services/businessService.js';
// `node-fetch` is used at runtime to supply a fetch that can accept an https.Agent forcing IPv4.
// @ts-ignore - runtime-only import; types are not required here and `skipLibCheck` is enabled.
import fetch from 'node-fetch';

const chatSchema = z.object({
  message: z.string().min(1).max(5000),
  // optional conversation history: array of { role, content }
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(0).max(10000),
    }),
  ).optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

type ChatRequest = z.infer<typeof chatSchema>;

// Create an HTTPS agent that forces IPv4 (family: 4) to avoid IPv6 DNS/connect issues on some machines.
const ipv4Agent = new https.Agent({ family: 4 });

// Wrap node-fetch to always use the IPv4 agent.
const fetchWithIPv4 = (url: any, init?: any) => {
  const merged = { ...(init || {}), agent: init?.agent ?? ipv4Agent };
  return fetch(url as any, merged as any) as any;
};

const client = new OpenAI({
  apiKey: env.AI_API_KEY,
  fetch: fetchWithIPv4,
});

const buildPrompt = (
  userMessage: string,
  business: Partial<ChatRequest> | undefined,
  history?: { role: 'user' | 'assistant'; content: string }[],
  productSummary?: string,
): string => {
  let systemInstruction = `You are BizPilotAI, an intelligent general-purpose AI business assistant.\n\nYour primary purpose is to help business owners and users think, learn, create, plan, analyze, write, research, solve problems, and make better decisions. You can answer general knowledge questions as well as business-related questions. Provide practical, clear, actionable answers when the question is business-related. When you do not know something, be honest about uncertainty rather than inventing facts. Be conversational, helpful, clear, and professional.`;

  if (business?.businessName || business?.businessType || business?.city || business?.country) {
    systemInstruction += `\n\nBusiness Context:`;
    if (business?.businessName) systemInstruction += `\n- Business Name: ${business.businessName}`;
    if (business?.businessType) systemInstruction += `\n- Business Type: ${business.businessType}`;
    if (business?.city || business?.country) {
      const location = [business?.city, business?.country].filter(Boolean).join(', ');
      systemInstruction += `\n- Location: ${location}`;
    }
    systemInstruction += `\n\nUse this context to provide personalized, relevant advice when appropriate. Do not restrict answering general questions because they are outside the business domain.`;
  }

  if (productSummary) {
    systemInstruction += `\n\nAuthenticated Business Product Context:\n${productSummary}`;
  }

  let prompt = systemInstruction + '\n\n';

  if (history && history.length > 0) {
    // include recent history (limit to last 8 messages)
    const recent = history.slice(-8);
    for (const msg of recent) {
      const who = msg.role === 'user' ? 'User' : 'Assistant';
      prompt += `${who}: ${msg.content}\n`;
    }
    prompt += '\n';
  }

  prompt += `User: ${userMessage}`;

  return prompt;
};

const getAuthenticatedBusinessContext = async (req: Request) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    return { business: null, products: [] as any[] };
  }

  const businesses = await businessService.getBusinessesByOwner(userId);
  const business = businesses[0] ?? null;

  if (!business) {
    return { business: null, products: [] as any[] };
  }

  const products = await prisma.product.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: 'desc' },
  });

  return { business, products };
};

export const getBusinessContext = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { business, products } = await getAuthenticatedBusinessContext(req);

    return res.status(200).json({
      success: true,
      data: {
        business,
        products,
        summary: business
          ? `Business: ${business.name}. ${products.length} products/services recorded.`
          : 'No business assigned to this user yet.',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = chatSchema.parse(req.body);
    const { business, products } = await getAuthenticatedBusinessContext(req);

    const history = parsed.messages?.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })) ?? undefined;

    const productSummary = products.length > 0
      ? products
          .map((product) => `${product.name} (${product.type}, ${product.status}, ${product.currency} ${Number(product.price ?? 0).toFixed(2)})`)
          .join('; ')
      : 'No products or services are currently attached to this business.';

    const prompt = buildPrompt(parsed.message, {
      ...parsed,
      businessName: parsed.businessName ?? business?.name,
      businessType: parsed.businessType ?? undefined,
      city: parsed.city ?? undefined,
      country: parsed.country ?? undefined,
    }, history, productSummary);

    if (!env.AI_API_KEY || !env.AI_API_KEY.trim()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is unavailable. No API key is configured.',
      });
    }

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
    });

    const message = response.output_text ?? 'Unable to generate response.';

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request format.',
      });
    }

    if (error instanceof Error) {
      console.error('OpenAI Error:', error.message);
      console.error('OpenAI Full Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Unable to generate AI response. Please try again.',
      });
    }

    next(error);
  }
};

export default {
  chat,
  getBusinessContext,
};
