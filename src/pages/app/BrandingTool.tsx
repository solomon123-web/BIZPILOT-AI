import { useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button } from '../../components/ui';
import aiService, { BrandingResult } from '../../services/aiService';
import { LoadingState } from '../../components/ui/LoadingState';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export function BrandingTool() {
  const { business } = useWorkspace();
  const [result, setResult] = useState<BrandingResult | null>(null);

  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await aiService.generateBranding(business ?? undefined);
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
        <h2 className="h2">Branding Assistant</h2>
        <p className="body">Generate brand name, tagline, voice, social bio and recommendations.</p>
      </div>

      <div className="branding-grid">
        <div className="branding-controls">
          <Button variant="primary" onClick={generate}>Generate Brand Ideas</Button>
        </div>
        <div className="branding-output">
          {loading && <LoadingState message="Generating brand ideas…" />}
          {!loading && !result && <div className="empty-state">No branding generated yet</div>}
          {!loading && result && (
            <div>
              <h3 className="h3">Brand Name</h3>
              <p className="body">{result.brandName}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Tagline</h3>
              <p className="body">{result.tagline}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Description</h3>
              <p className="body">{result.description}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Voice</h3>
              <p className="body">{result.voice}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Social Bio</h3>
              <p className="body">{result.socialBio}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Color Direction</h3>
              <p className="body">{result.colorDirection}</p>

              <h3 className="h3" style={{ marginTop: 12 }}>Typography</h3>
              <p className="body">{result.typography}</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default BrandingTool;
