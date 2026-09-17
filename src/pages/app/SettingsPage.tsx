import { useState, useEffect } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Card, Button, Input, Select, Spinner } from '../../components/ui';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import socialService from '../../services/socialService';
import type { SocialConnection } from '../../types/social';

const sections = ['Account', 'Business', 'Social Accounts', 'Notifications', 'AI Preferences', 'Billing', 'Security'] as const;

type Section = typeof sections[number];

export function SettingsPage() {
  const { business, isDemoMode } = useWorkspace();
  const [active, setActive] = useState<Section>('Account');
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (active === 'Social Accounts' && business?.businessName && !isDemoMode) {
      loadConnections();
    }
  }, [active, business, isDemoMode]);

  const loadConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using a placeholder businessId for demo
      const conn = await socialService.getSocialConnections(business?.businessName || 'default');
      setConnections(conn);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load connections';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectFacebook = async () => {
    if (isDemoMode) {
      setError('Social connections are not available in Demo Mode.');
      return;
    }
    if (!business?.businessName) {
      setError('No business selected');
      return;
    }
    try {
      setConnecting(true);
      setError(null);
      const result = await socialService.initiateSocialConnection(business.businessName, 'facebook');
      if (result.authUrl) {
        // Redirect to Meta OAuth
        window.location.href = result.authUrl;
      } else {
        setError(result.message || 'Failed to initiate connection');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!business?.businessName) return;
    if (!window.confirm('Are you sure you want to disconnect this account?')) return;

    try {
      setLoading(true);
      await socialService.disconnectSocialAccount(business.businessName, connectionId);
      await loadConnections();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Disconnect failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const facebookConnection = connections.find((c) => c.platform === 'facebook');
  const instagramConnection = connections.find((c) => c.platform === 'instagram');

  return (
    <PageContainer>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="h2">Settings</h2>
          <p className="body">Manage your account, business settings, and preferences.</p>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-nav">
          {sections.map((s) => (
            <div key={s} className={`settings-nav-item ${active === s ? 'active' : ''}`} onClick={() => setActive(s)}>
              {s}
            </div>
          ))}
        </aside>

        <main className="settings-main">
          {active === 'Account' && (
            <Card>
              <h3 className="h3">Profile</h3>
              <div className="stack">
                <label className="label">Full name</label>
                <Input defaultValue="Amaka Okonkwo" />
                <label className="label">Email</label>
                <Input defaultValue="amaka@amakacakes.com" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button>Save</Button>
                </div>
              </div>
            </Card>
          )}

          {active === 'Business' && (
            <Card>
              <h3 className="h3">Business</h3>
              <div className="stack">
                <label className="label">Business name</label>
                <Input defaultValue="Amaka Cakes" />
                <label className="label">Description</label>
                <Input defaultValue="Premium custom cakes and baked goods" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button>Save</Button>
                </div>
              </div>
            </Card>
          )}

          {active === 'Notifications' && (
            <Card>
              <h3 className="h3">Notifications</h3>
              <div className="stack">
                <label className="label">Email notifications</label>
                <Select>
                  <option>All</option>
                  <option>Important</option>
                  <option>None</option>
                </Select>
                <label className="label">SMS notifications</label>
                <Select>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </Select>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button>Save</Button>
                </div>
              </div>
            </Card>
          )}

          {active === 'AI Preferences' && (
            <Card>
              <h3 className="h3">AI Preferences</h3>
              <div className="stack">
                <label className="label">Tone</label>
                <Select>
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Casual</option>
                </Select>
                <label className="label">Response length</label>
                <Select>
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                </Select>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button>Save</Button>
                </div>
              </div>
            </Card>
          )}

          {active === 'Social Accounts' && (
            <>
              {isDemoMode && (
                <Card>
                  <div className="stack">
                    <p className="body">Social integrations are not available in Demo Mode. Sign in with a real account to connect social media.</p>
                  </div>
                </Card>
              )}
              {!isDemoMode && (
                <>
                  {error && (
                    <Card>
                      <p className="body" style={{ color: '#d32f2f' }}>{error}</p>
                    </Card>
                  )}
                  <Card>
                    <h3 className="h3">Connected Accounts</h3>
                    <p className="body">Connect your business social media accounts so BizPilotAI can manage your presence.</p>
                    <div className="stack" style={{ marginTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
                        <div>
                          <p className="label">Facebook Pages</p>
                          {facebookConnection ? (
                            <div>
                              <p className="small">{facebookConnection.accountName} ({facebookConnection.status})</p>
                              {facebookConnection.tokenExpiresAt && (
                                <p className="small">Expires: {new Date(facebookConnection.tokenExpiresAt).toLocaleDateString()}</p>
                              )}
                            </div>
                          ) : (
                            <p className="small">Not connected</p>
                          )}
                        </div>
                        {facebookConnection ? (
                          <Button
                            variant="ghost"
                            onClick={() => handleDisconnect(facebookConnection.id)}
                            disabled={loading || connecting}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={handleConnectFacebook}
                            disabled={loading || connecting}
                          >
                            {connecting ? 'Connecting...' : 'Connect'}
                          </Button>
                        )}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                        <div>
                          <p className="label">Instagram Business</p>
                          {instagramConnection ? (
                            <div>
                              <p className="small">@{instagramConnection.accountName} ({instagramConnection.status})</p>
                              {instagramConnection.tokenExpiresAt && (
                                <p className="small">Expires: {new Date(instagramConnection.tokenExpiresAt).toLocaleDateString()}</p>
                              )}
                            </div>
                          ) : (
                            <p className="small">Not connected</p>
                          )}
                        </div>
                        {instagramConnection ? (
                          <Button
                            variant="ghost"
                            onClick={() => handleDisconnect(instagramConnection.id)}
                            disabled={loading || connecting}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={handleConnectFacebook}
                            disabled={loading || connecting}
                          >
                            {connecting ? 'Connecting...' : 'Connect'}
                          </Button>
                        )}
                      </div>
                      {loading && <Spinner />}
                    </div>
                  </Card>
                </>
              )}
            </>
          )}
          {active === 'Billing' && (
            <Card>
              <h3 className="h3">Billing</h3>
              <div className="stack">
                <p className="body">Current plan: Starter</p>
                <p className="small">Next renewal: 2024-09-01</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button>Change Plan</Button>
                </div>
              </div>
            </Card>
          )}

          {active === 'Security' && (
            <Card>
              <h3 className="h3">Security</h3>
              <div className="stack">
                <label className="label">Change password</label>
                <Input type="password" />
                <label className="label">Two-factor authentication</label>
                <Select>
                  <option>Disabled</option>
                  <option>SMS</option>
                </Select>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button>Save</Button>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </PageContainer>
  );
}

export default SettingsPage;
