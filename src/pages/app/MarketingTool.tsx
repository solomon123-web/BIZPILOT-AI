import { useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button, Select } from '../../components/ui';
import aiService, { MarketingResult } from '../../services/aiService';
import { LoadingState } from '../../components/ui/LoadingState';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export function MarketingTool() {
  const { business } = useWorkspace();
  const [platform, setPlatform] = useState('Instagram');
  const [goal, setGoal] = useState('Promotion');
  const [tone, setTone] = useState('Friendly');
  const [result, setResult] = useState<MarketingResult | null>(null);

  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await aiService.generateMarketing(platform, goal, tone, business ?? undefined);
      setResult(res);
    } catch (e) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="section-header">
        <h2 className="h2">Social Media Generator</h2>
        <p className="body">Generate captions, content, CTAs and hashtags for social posts.</p>
      </div>

      <div className="tool-grid">
        <div className="tool-controls">
          <label className="label">Platform</label>
          <Select value={platform} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatform(e.target.value)}>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>TikTok</option>
            <option>LinkedIn</option>
            <option>X</option>
          </Select>

          <label className="label">Goal</label>
          <Select value={goal} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGoal(e.target.value)}>
            <option>Promotion</option>
            <option>Awareness</option>
            <option>Engagement</option>
            <option>Sales</option>
          </Select>

          <label className="label">Tone</label>
          <Select value={tone} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTone(e.target.value)}>
            <option>Professional</option>
            <option>Friendly</option>
            <option>Luxury</option>
            <option>Playful</option>
            <option>Bold</option>
          </Select>

          <Button variant="primary" onClick={generate} style={{ marginTop: 12 }}>
            Generate
          </Button>
        </div>

        <div className="tool-output">
          {loading && <LoadingState message="Generating content…" />}
          {!loading && !result && <div className="empty-state">No results yet</div>}
          {!loading && result && (
            <div>
              <h3 className="h3">Caption</h3>
              <p className="body">{result.caption}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Content</h3>
              <p className="body">{result.content}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>CTA</h3>
              <p className="body">{result.cta}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Hashtags</h3>
              <p className="body">{result.hashtags.join(' ')}</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default MarketingTool;
