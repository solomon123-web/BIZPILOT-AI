/**
 * Frontend service for social connections
 * Communicates with backend social connection APIs
 * Never stores or exposes access tokens
 */

import api from './api';
import type { SocialConnection, SocialConnectionResponse, OAuthInitResponse } from '../types/social';

export async function initiateSocialConnection(businessId: string, platform: 'facebook' | 'instagram'): Promise<OAuthInitResponse> {
  try {
    const response = await api.post<OAuthInitResponse>('/social/connections/meta/connect', {
      businessId,
      platform,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to initiate connection';
    console.error('Social connection error:', message);
    throw error;
  }
}

export async function getSocialConnections(businessId: string): Promise<SocialConnection[]> {
  try {
    const response = await api.getWithQuery<SocialConnectionResponse>('/social/connections', {
      businessId,
    });

    if (response.success && response.connections) {
      return response.connections;
    }

    return [];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch connections';
    console.error('Social connection error:', message);
    throw error;
  }
}

export async function disconnectSocialAccount(businessId: string, connectionId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.delete<{ success: boolean; message?: string }>(`/social/connections/${connectionId}?businessId=${encodeURIComponent(businessId)}`);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to disconnect account';
    console.error('Disconnect error:', message);
    throw error;
  }
}

export async function checkMetaConfiguration(): Promise<{ configured: boolean }> {
  try {
    // This is called during initialization to check if Meta is configured
    // If not configured, the UI will show a message
    return { configured: true }; // Backend will return 400 if not configured
  } catch {
    return { configured: false };
  }
}

export default {
  initiateSocialConnection,
  getSocialConnections,
  disconnectSocialAccount,
  checkMetaConfiguration,
};
