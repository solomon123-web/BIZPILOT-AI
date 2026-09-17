import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import env from '../config/env.js';
import https from 'https';
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

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = chatSchema.parse(req.body);

    const history = parsed.messages?.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })) ?? undefined;

    const prompt = buildPrompt(parsed.message, parsed, history);

    const response = await client.responses.create({
      model: 'gpt-5.6-luna',
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
      // Log full error for debugging (network issues, API errors)
      // This will not expose secrets to the client.
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
};
