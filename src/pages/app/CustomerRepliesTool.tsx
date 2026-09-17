import { useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button, Textarea, Select } from '../../components/ui';
import aiService from '../../services/aiService';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export function CustomerRepliesTool() {
  const { business } = useWorkspace();
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [reply, setReply] = useState<string | null>(null);

  const generate = async () => {
    const r = await aiService.generateCustomerReply(message, tone, business ?? undefined);
    setReply(r);
  };

  return (
    <PageContainer>
      <div className="section-header">
        <h2 className="h2">Customer Replies</h2>
        <p className="body">Write replies to customer inquiries using AI.</p>
      </div>

      <div className="reply-grid">
        <div className="reply-controls">
          <label className="label">Incoming message</label>
          <Textarea value={message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)} rows={4} />

          <label className="label">Tone</label>
          <Select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option>Friendly</option>
            <option>Professional</option>
            <option>Short</option>
            <option>Persuasive</option>
          </Select>

          <Button variant="primary" onClick={generate} style={{ marginTop: 12 }}>Generate Reply</Button>
        </div>

        <div className="reply-output">
          {!reply && <div className="empty-state">No reply yet</div>}
          {reply && (
            <div>
              <h3 className="h3">Suggested Reply</h3>
              <p className="body">{reply}</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default CustomerRepliesTool;
