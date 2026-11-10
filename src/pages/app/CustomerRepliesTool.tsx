import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button, Textarea, Select } from '../../components/ui';
import aiService from '../../services/aiService';
import api from '../../services/api';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface ConversationRecord {
  id: string;
  businessId: string;
  platform: string;
  externalId: string;
  externalUserId?: string | null;
  customerName?: string | null;
  lastMessageAt?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
  messages?: Array<{ id: string; direction: string; content: string; senderName?: string | null; createdAt?: string; }>; 
}

export function CustomerRepliesTool() {
  const { business } = useWorkspace();
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessId = business?.id ?? localStorage.getItem('bizpilot_current_business_id') ?? '';

  useEffect(() => {
    const loadConversations = async () => {
      if (!businessId) {
        setConversations([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; conversations: ConversationRecord[] }>(`/conversations?businessId=${encodeURIComponent(businessId)}`);
        setConversations(response?.conversations ?? []);
        if (response?.conversations?.[0]?.id) {
          setSelectedConversationId(response.conversations[0].id);
        }
      } catch (err: any) {
        setError(err?.message || 'Unable to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    void loadConversations();
  }, [businessId]);

  const selectedConversation = useMemo(
    () => conversations.find((conv) => conv.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  );

  const generate = async () => {
    if (!selectedConversation) {
      return;
    }

    const payload = `Customer: ${selectedConversation.messages?.slice(-1)[0]?.content ?? 'No message'}\nBusiness context: ${business?.businessName ?? 'Your business'}.`;
    const r = await aiService.generateCustomerReply(payload, tone, business ?? undefined);
    setReply(r);
  };

  const sendReply = async () => {
    if (!selectedConversation || !message.trim() || !businessId) {
      return;
    }

    try {
      setSending(true);
      setError(null);
      const response = await api.post<{ success: boolean; message: { id: string; content: string } }>(`/conversations/messages`, {
        businessId,
        conversationId: selectedConversation.id,
        direction: 'outbound',
        content: message.trim(),
        senderName: business?.businessName ?? 'BizPilotAI',
      });

      if (response?.success) {
        setMessage('');
        setReply(null);
        const refreshed = await api.get<{ success: boolean; conversations: ConversationRecord[] }>(`/conversations?businessId=${encodeURIComponent(businessId)}`);
        setConversations(refreshed?.conversations ?? []);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to send the reply.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageContainer>
      <div className="section-header">
        <div>
          <h2 className="h2">Customer Replies</h2>
          <p className="body">Review real customer conversations and send approved replies.</p>
        </div>
      </div>

      {error ? <div className="field__error" style={{ marginBottom: 12 }}>{error}</div> : null}

      {!businessId ? (
        <div className="empty">Select a business to load conversations.</div>
      ) : loading ? (
        <div className="empty">Loading messages…</div>
      ) : conversations.length === 0 ? (
        <div className="empty">No customer conversations yet. Connect WhatsApp or a supported social channel to begin receiving messages.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) minmax(0, 1fr)', gap: 16 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            {conversations.map((conversation) => (
              <button
                type="button"
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                style={{
                  border: selectedConversationId === conversation.id ? '1px solid #1d4ed8' : '1px solid #dfe5f1',
                  borderRadius: 12,
                  background: selectedConversationId === conversation.id ? '#eff6ff' : '#fff',
                  padding: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div className="h4" style={{ marginBottom: 4 }}>{conversation.customerName || conversation.externalUserId || 'Customer'}</div>
                <div className="small" style={{ color: 'var(--color-text-muted)' }}>{conversation.platform}</div>
                <div className="small" style={{ marginTop: 6 }}>{conversation.messages?.slice(-1)[0]?.content || 'No recent message'}</div>
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {selectedConversation && (
              <>
                <div className="card" style={{ padding: 16 }}>
                  <div className="h4" style={{ marginBottom: 12 }}>{selectedConversation.customerName || 'Customer'}</div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {(selectedConversation.messages ?? []).map((item) => (
                      <div key={item.id} style={{
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: item.direction === 'outbound' ? '#dcfce7' : '#f8fafc',
                        marginLeft: item.direction === 'outbound' ? 48 : 0,
                        marginRight: item.direction === 'inbound' ? 48 : 0,
                      }}>
                        <div className="small" style={{ color: 'var(--color-text-muted)' }}>{item.direction}</div>
                        <div>{item.content}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: 16 }}>
                  <label className="label">Tone</label>
                  <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option>Friendly</option>
                    <option>Professional</option>
                    <option>Short</option>
                    <option>Persuasive</option>
                  </Select>

                  <div style={{ marginTop: 12 }}>
                    <Button variant="primary" onClick={generate}>Generate AI suggestion</Button>
                  </div>

                  {reply && (
                    <div style={{ marginTop: 12 }}>
                      <div className="h4">Suggested reply</div>
                      <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{reply}</div>
                    </div>
                  )}

                  <div style={{ marginTop: 12 }}>
                    <label className="label">Reply</label>
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Button variant="primary" onClick={sendReply} disabled={sending || !message.trim()}>{sending ? 'Sending…' : 'Approve & Send'}</Button>
                    <Button variant="ghost" onClick={() => setMessage(reply ?? '')}>Use suggestion</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default CustomerRepliesTool;
