import dotenv from 'dotenv';

dotenv.config();

const readEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];

  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (fallback !== undefined) {
    return fallback;
  }

  return '';
};

const env = {
  PORT: Number(readEnv('PORT', '5000')) || 5000,
  DATABASE_URL: readEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/bizpilotai?schema=public'),
  JWT_SECRET: readEnv('JWT_SECRET', 'development-secret-change-me'),
  JWT_EXPIRES_IN: readEnv('JWT_EXPIRES_IN', '1h'),
  CLIENT_URL: readEnv('CLIENT_URL', 'http://localhost:5173'),
  // Support both AI_API_KEY and OPENAI_API_KEY environment names.
  // Many dev scripts (e.g. test-openai.js) use OPENAI_API_KEY, so allow that as a fallback.
  AI_API_KEY: readEnv('AI_API_KEY', process.env.OPENAI_API_KEY),
  OPENAI_API_KEY: readEnv('OPENAI_API_KEY', readEnv('AI_API_KEY')),
  // Meta OAuth configuration.
  META_APP_ID: readEnv('META_APP_ID', ''),
  META_APP_SECRET: readEnv('META_APP_SECRET', ''),
  META_REDIRECT_URI: readEnv('META_REDIRECT_URI', 'http://localhost:5000/api/social/meta/callback'),
  // WhatsApp Business Platform configuration.
  WHATSAPP_VERIFY_TOKEN: readEnv('WHATSAPP_VERIFY_TOKEN', ''),
  WHATSAPP_APP_SECRET: readEnv('WHATSAPP_APP_SECRET', ''),
  WHATSAPP_ACCESS_TOKEN: readEnv('WHATSAPP_ACCESS_TOKEN', ''),
  WHATSAPP_PHONE_NUMBER_ID: readEnv('WHATSAPP_PHONE_NUMBER_ID', ''),
  WHATSAPP_BUSINESS_ACCOUNT_ID: readEnv('WHATSAPP_BUSINESS_ACCOUNT_ID', ''),
  // Object storage abstraction configuration.
  OBJECT_STORAGE_PROVIDER: readEnv('OBJECT_STORAGE_PROVIDER', 'local'),
  OBJECT_STORAGE_BUCKET: readEnv('OBJECT_STORAGE_BUCKET', 'bizpilot-local-uploads'),
  OBJECT_STORAGE_PUBLIC_BASE_URL: readEnv('OBJECT_STORAGE_PUBLIC_BASE_URL', 'http://localhost:5000/uploads'),
  // Platform-specific config placeholders.
  SHOPIFY_APP_KEY: readEnv('SHOPIFY_APP_KEY', ''),
  SHOPIFY_APP_SECRET: readEnv('SHOPIFY_APP_SECRET', ''),
  SHOPIFY_REDIRECT_URI: readEnv('SHOPIFY_REDIRECT_URI', 'http://localhost:5000/api/shopify/oauth/callback'),
  TIKTOK_CLIENT_KEY: readEnv('TIKTOK_CLIENT_KEY', ''),
  TIKTOK_CLIENT_SECRET: readEnv('TIKTOK_CLIENT_SECRET', ''),
  TIKTOK_REDIRECT_URI: readEnv('TIKTOK_REDIRECT_URI', 'http://localhost:5000/api/tiktok/oauth/callback'),
};

// Ensure Prisma (which reads process.env at runtime) can access DATABASE_URL
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.DATABASE_URL;
}

export default env;
