/**
 * Meta OAuth & API client
 * Handles Meta OAuth flow and API requests securely on the backend.
 * Never passes credentials to the frontend.
 */

import env from '../../config/env.js';

const META_GRAPH_API_VERSION = 'v19.0';
const META_AUTH_BASE = 'https://www.facebook.com';
const META_GRAPH_BASE = `https://graph.instagram.com/${META_GRAPH_API_VERSION}`;
const META_GRAPH_FACEBOOK_BASE = `https://graph.facebook.com/${META_GRAPH_API_VERSION}`;

export interface MetaOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export const getMetaOAuthConfig = (): MetaOAuthConfig => {
  const clientId = env.META_APP_ID;
  const clientSecret = env.META_APP_SECRET;
  const redirectUri = env.META_REDIRECT_URI;

  if (!clientId || !clientSecret) {
    throw new Error('Meta OAuth credentials not configured. Set META_APP_ID and META_APP_SECRET.');
  }

  return { clientId, clientSecret, redirectUri };
};

export const generateMetaAuthorizationUrl = (state: string, nonce: string): string => {
  const config = getMetaOAuthConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'instagram_basic,instagram_graph_api,pages_read_engagement,pages_manage_posts,pages_read_user_content',
    state,
    nonce,
    response_type: 'code',
  });

  return `${META_AUTH_BASE}/v19.0/dialog/oauth?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string): Promise<{ access_token: string; expires_in: number }> => {
  const config = getMetaOAuthConfig();

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    code,
  });

  const response = await fetch(`${META_GRAPH_FACEBOOK_BASE}/oauth/access_token`, {
    method: 'POST',
    body: params,
  });

  if (!response.ok) {
    const errBody: any = await response.json().catch(() => ({}));
    throw new Error(`Meta OAuth token exchange failed: ${errBody.error?.message || response.statusText}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  return data;
};

export const getAuthorizedPages = async (accessToken: string): Promise<{ id: string; name: string }[]> => {
  const response = await fetch(`${META_GRAPH_FACEBOOK_BASE}/me/accounts?access_token=${accessToken}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch authorized pages: ${response.statusText}`);
  }

  const data = (await response.json()) as { data: { id: string; name: string }[] };
  return data.data || [];
};

export const getInstagramBusinessAccounts = async (
  pageAccessToken: string,
  pageId: string,
): Promise<{ id: string; username: string; name: string }[]> => {
  try {
    const response = await fetch(
      `${META_GRAPH_FACEBOOK_BASE}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram business account: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      instagram_business_account?: { id: string; username?: string };
    };

    if (!data.instagram_business_account) {
      return [];
    }

    return [
      {
        id: data.instagram_business_account.id,
        username: data.instagram_business_account.username || 'Instagram',
        name: data.instagram_business_account.username || 'Instagram Business Account',
      },
    ];
  } catch (error) {
    console.error('Error fetching Instagram business account:', error);
    return [];
  }
};

export const getPageInfo = async (pageId: string, accessToken: string): Promise<{ id: string; name: string }> => {
  const response = await fetch(`${META_GRAPH_FACEBOOK_BASE}/${pageId}?access_token=${accessToken}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch page info: ${response.statusText}`);
  }

  const data = (await response.json()) as { id: string; name: string };
  return data;
};

export const getInstagramAccountInfo = async (accountId: string, accessToken: string): Promise<{ id: string; username: string }> => {
  const response = await fetch(`${META_GRAPH_BASE}/${accountId}?fields=id,username&access_token=${accessToken}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Instagram account info: ${response.statusText}`);
  }

  const data = (await response.json()) as { id: string; username: string };
  return data;
};

export const isConfigured = (): boolean => {
  return !!(env.META_APP_ID && env.META_APP_SECRET);
};

export default {
  generateMetaAuthorizationUrl,
  exchangeCodeForToken,
  getAuthorizedPages,
  getInstagramBusinessAccounts,
  getPageInfo,
  getInstagramAccountInfo,
  getMetaOAuthConfig,
  isConfigured,
};
