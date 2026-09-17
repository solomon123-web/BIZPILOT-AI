/**
 * Social media connection types
 * Shared between frontend and backend
 */

export type SocialPlatform = 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'linkedin' | 'x' | 'email';

export type SocialConnectionStatus = 'connected' | 'expired' | 'disconnected' | 'error' | 'reconnect_required';

export interface SocialConnection {
  id: string;
  platform: SocialPlatform;
  accountName: string | null;
  accountType: string | null;
  status: SocialConnectionStatus;
  tokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SocialConnectionResponse {
  success: boolean;
  connections?: SocialConnection[];
  message?: string;
  code?: string;
}

export interface OAuthInitResponse {
  success: boolean;
  authUrl?: string;
  state?: string;
  message?: string;
  code?: string;
}
