/**
 * Social connection controller
 * Handles OAuth flow, connection management, and list/disconnect endpoints
 */

import { type Request, type Response, type NextFunction } from 'express';
import { randomBytes } from 'crypto';
import metaClient from '../integrations/meta/metaClient.js';
import socialConnectionService from '../services/socialConnectionService.js';
import businessService from '../services/businessService.js';
import activityService from '../services/activityService.js';

const OAUTH_STATE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export const initiateMetaConnection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ success: false, message: 'Missing businessId' });
    }

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) {
      return res.status(403).json({ success: false, message: 'Business not found or access denied' });
    }

    // Check if Meta is configured
    if (!metaClient.isConfigured()) {
      return res.status(400).json({
        success: false,
        code: 'META_NOT_CONFIGURED',
        message: 'Meta integration is not configured. Please set META_APP_ID and META_APP_SECRET.',
      });
    }

    // Generate OAuth state and nonce
    const state = randomBytes(32).toString('hex');
    const nonce = randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + OAUTH_STATE_EXPIRY_MS);

    // Store OAuth state in database
    await socialConnectionService.createOAuthState(state, businessId, 'facebook', nonce, expiresAt);

    // Generate Meta authorization URL
    const authUrl = metaClient.generateMetaAuthorizationUrl(state, nonce);

    // Log activity
    await activityService.logActivity(businessId, 'SOCIAL_ACCOUNT_CONNECT_STARTED', {
      platform: 'facebook',
      initiatedBy: user.id,
    });

    return res.status(200).json({
      success: true,
      authUrl,
      state,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      return res.status(400).json({
        success: false,
        code: 'META_NOT_CONFIGURED',
        message: 'Meta integration is not configured.',
      });
    }
    next(error);
  }
};

export const handleMetaCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, error: oauthError, error_description } = req.query;

    // Handle OAuth denial
    if (oauthError) {
      const errorMsg = typeof error_description === 'string' ? error_description : String(oauthError);
      return res.redirect(`/?oauth_error=${encodeURIComponent(errorMsg)}`);
    }

    let stateStr: string | undefined;
    if (Array.isArray(state) && typeof state[0] === 'string') stateStr = state[0];
    else if (typeof state === 'string') stateStr = state;

    let codeStr: string | undefined;
    if (Array.isArray(code) && typeof code[0] === 'string') codeStr = code[0];
    else if (typeof code === 'string') codeStr = code;

    if (!codeStr || !stateStr) {
      return res.status(400).json({ success: false, message: 'Missing code or state' });
    }

    // Validate OAuth state
    const oauthState = await socialConnectionService.getOAuthState(stateStr);
    if (!oauthState) {
      return res.status(403).json({ success: false, message: 'Invalid or expired OAuth state' });
    }

    // Check expiry
    if (new Date() > oauthState.expiresAt) {
      await socialConnectionService.deleteOAuthState(stateStr);
      return res.status(403).json({ success: false, message: 'OAuth state expired' });
    }

    try {
      // Exchange code for access token
      const tokenData = await metaClient.exchangeCodeForToken(codeStr);

      // Get authorized pages
      const pages = await metaClient.getAuthorizedPages(tokenData.access_token);

      if (pages.length === 0) {
        await socialConnectionService.deleteOAuthState(stateStr);
        return res.redirect('/?oauth_error=no_authorized_pages');
      }

      const businessId = oauthState.businessId;
      const connectedAccounts = [];

      // Create connections for each authorized page
      for (const page of pages) {
        // Check for duplicate connection
        const existing = await socialConnectionService.getSocialConnectionByPlatformAndAccount(businessId, 'facebook', page.id);

        if (existing) {
          // Update existing connection
          const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
          await socialConnectionService.updateSocialConnectionToken(existing.id, businessId, tokenData.access_token, tokenExpiresAt);
          connectedAccounts.push(existing);
        } else {
          // Create new connection
          const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
          const connection = await socialConnectionService.createSocialConnection(
            businessId,
            'facebook',
            page.id,
            page.name,
            'page',
            tokenData.access_token,
            tokenExpiresAt,
            ['pages_read_engagement', 'pages_manage_posts'],
            { pageId: page.id, pageName: page.name },
          );
          connectedAccounts.push(connection);

          // Try to get connected Instagram account
          try {
            const igAccounts = await metaClient.getInstagramBusinessAccounts(tokenData.access_token, page.id);

            for (const igAccount of igAccounts) {
              const igExisting = await socialConnectionService.getSocialConnectionByPlatformAndAccount(
                businessId,
                'instagram',
                igAccount.id,
              );

              if (!igExisting) {
                const igConnection = await socialConnectionService.createSocialConnection(
                  businessId,
                  'instagram',
                  igAccount.id,
                  igAccount.username,
                  'business_account',
                  tokenData.access_token,
                  tokenExpiresAt,
                  ['instagram_basic', 'instagram_graph_api'],
                  { pageId: page.id, pageName: page.name, username: igAccount.username },
                );
                connectedAccounts.push(igConnection);
              }
            }
          } catch (igError) {
            // Instagram account retrieval is optional
            console.error('Failed to retrieve Instagram account:', igError);
          }
        }
      }

      // Log success
      await activityService.logActivity(businessId, 'SOCIAL_ACCOUNT_CONNECTED', {
        platform: 'facebook',
        accountCount: connectedAccounts.length,
        accounts: connectedAccounts.map((a) => ({ platform: a.platform, name: a.accountName })),
      });

      // Clean up OAuth state
      await socialConnectionService.deleteOAuthState(stateStr);

      // Redirect to success page
      return res.redirect('/?social_connected=true');
    } catch (exchangeError) {
      await socialConnectionService.deleteOAuthState(stateStr);

      const errorMsg = exchangeError instanceof Error ? exchangeError.message : 'Connection failed';
      await activityService.logActivity(oauthState.businessId, 'SOCIAL_ACCOUNT_CONNECTION_FAILED', {
        platform: 'facebook',
        error: errorMsg,
      });

      return res.redirect(`/?oauth_error=${encodeURIComponent(errorMsg)}`);
    }
  } catch (error) {
    next(error);
  }
};

export const listSocialConnections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { businessId } = req.query;

    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing businessId' });
    }

    const business = await businessService.getBusinessById(businessId, user.id);
    if (!business) {
      return res.status(403).json({ success: false, message: 'Business not found or access denied' });
    }

    const connections = await socialConnectionService.getSocialConnections(businessId);

    // Return connections without access tokens
    const safeConnections = connections.map((c: any) => ({
      id: c.id,
      platform: c.platform,
      accountName: c.accountName,
      accountType: c.accountType,
      status: c.status,
      tokenExpiresAt: c.tokenExpiresAt,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      // Do NOT return accessTokenRef or accessToken
    }));

    return res.status(200).json({ success: true, connections: safeConnections });
  } catch (error) {
    next(error);
  }
};

export const disconnectSocialAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const connectionId = Array.isArray(id) ? String(id[0]) : String(id);
    const { businessId } = req.query;

    if (!businessId || typeof businessId !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing businessId' });
    }

    let businessIdStr: string;
    if (Array.isArray(businessId)) businessIdStr = businessId[0] as string;
    else businessIdStr = businessId as string;

    const business = await businessService.getBusinessById(businessIdStr, user.id);
    if (!business) {
      return res.status(403).json({ success: false, message: 'Business not found or access denied' });
    }
    const connection = await socialConnectionService.getSocialConnectionById(connectionId, businessIdStr);
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found' });
    }

    await socialConnectionService.deleteSocialConnection(connectionId, businessIdStr);

    // Log disconnection
    await activityService.logActivity(businessIdStr, 'SOCIAL_ACCOUNT_DISCONNECTED', {
      platform: connection.platform,
      accountName: connection.accountName,
      disconnectedBy: user.id,
    });

    return res.status(200).json({ success: true, message: 'Account disconnected' });
  } catch (error) {
    next(error);
  }
};

export default {
  initiateMetaConnection,
  handleMetaCallback,
  listSocialConnections,
  disconnectSocialAccount,
};
