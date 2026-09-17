import React, { useEffect, useRef, useState } from 'react';
import { generateAiResponse, suggestedPrompts } from '../../services/aiService';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { Button, Textarea } from '../ui';
import { Copy, RefreshCw, Trash2, Send } from 'lucide-react';

type Message = { id: string; role: 'user' | 'assistant'; content: string; ts: number };

function id() {
  return Math.random().toString(36).slice(2, 9);
}

export function Assistant() {
  const { business, user } = useWorkspace();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const key = `conversation:${business?.businessName ?? 'default'}`;
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const key = `conversation:${business?.businessName ?? 'default'}`;
    sessionStorage.setItem(key, JSON.stringify(messages));
    // scroll to bottom
    setTimeout(() => listRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 30);
  }, [messages, business]);

  const send = async (text?: string) => {
    const prompt = (text ?? input).trim();
    if (!prompt) return;
    const u = { id: id(), role: 'user' as const, content: prompt, ts: Date.now() };
    const nextMessages = [...messages, u];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setLastPrompt(prompt);
    try {
      const history = nextMessages.map((m) => ({ id: m.id, role: m.role, content: m.content, timestamp: new Date(m.ts).toISOString() }));
      const response = await generateAiResponse(prompt, business ?? null, history);
      const m = { id: id(), role: 'assistant' as const, content: response, ts: Date.now() };
      setMessages((s) => [...s, m]);
    } catch (e) {
      const err = { id: id(), role: 'assistant' as const, content: 'Sorry, something went wrong.', ts: Date.now() };
      setMessages((s) => [...s, err]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const regenerate = async () => {
    if (!lastPrompt) return;
    setLoading(true);
    try {
      const history = messages.map((m) => ({ id: m.id, role: m.role, content: m.content, timestamp: new Date(m.ts).toISOString() }));
      const response = await generateAiResponse(lastPrompt, business ?? null, history);
      const m = { id: id(), role: 'assistant' as const, content: response, ts: Date.now() };
      setMessages((s) => [...s, m]);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  };

  const clear = () => {
    setMessages([]);
  };

  return (
    <div className="assistant-shell">
      <div className="assistant__meta">
        <div>
          <p className="label">Workspace</p>
          <h3 className="h3">{business?.businessName ?? 'Demo Workspace'}</h3>
          <p className="small">{business?.businessType} {business?.city || business?.country ? `— ${[business?.city, business?.country].filter(Boolean).join(', ')}` : ''}</p>
        </div>
        <div className="assistant__meta-actions">
          <Button variant="ghost" size="sm" onClick={regenerate} disabled={!lastPrompt} aria-label="Regenerate last response">
            <RefreshCw size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={clear} disabled={messages.length === 0} aria-label="Clear conversation history">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="assistant__body" ref={listRef}>
        {messages.length === 0 && (
          <div className="assistant__empty">
            <h3 className="h3">Hi {user?.name?.split(' ')[0] ?? 'there'}! 👋</h3>
            <p className="body">I'm your BizPilotAI assistant. What would you like to work on today?</p>
            <div className="suggested-prompts">
              {suggestedPrompts.map((p) => (
                <button key={p} type="button" className="suggested-prompt" onClick={() => send(p)}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`chat-row chat-row--${m.role}`}>
            <div className="chat-bubble">
              <div className="chat-bubble__content">{m.content}</div>
              {m.role === 'assistant' && (
                <button type="button" className="chat-copy" onClick={() => copy(m.content)} aria-label="Copy response">
                  <Copy size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-row chat-row--assistant">
            <div className="chat-bubble chat-bubble--loading">Thinking…</div>
          </div>
        )}
      </div>

      <div className="assistant__input">
        <Textarea
          placeholder="Ask BizPilotAI anything — e.g. 'Create an Instagram post'"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
        />
        <div className="assistant__input-actions">
          <div className="assistant__suggestions">
            {suggestedPrompts.slice(0, 3).map((p) => (
              <button key={p} type="button" className="suggested-prompt--small" onClick={() => send(p)}>{p}</button>
            ))}
          </div>
          <Button variant="primary" onClick={() => send()} disabled={loading || !input.trim()}>
            <Send size={16} />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Assistant;
