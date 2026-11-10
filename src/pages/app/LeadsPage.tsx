import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button, Card } from '../../components/ui';
import leadService, { type LeadRecord } from '../../services/leadService';

export function LeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await leadService.getLeads();
        setLeads(response?.data?.leads ?? []);
      } catch (err: any) {
        setError(err?.message || 'Unable to load leads.');
      } finally {
        setLoading(false);
      }
    };

    void loadLeads();
  }, []);

  return (
    <PageContainer>
      <div className="section-header">
        <div>
          <h2 className="h2">Leads</h2>
          <p className="body">Track incoming prospects and follow-ups for your business.</p>
        </div>
      </div>

      {error ? <div className="field__error" style={{ marginBottom: 12 }}>{error}</div> : null}

      {loading ? (
        <div className="empty">Loading leads…</div>
      ) : leads.length === 0 ? (
        <div className="empty">No leads yet.</div>
      ) : (
        <div className="list" style={{ display: 'grid', gap: 12 }}>
          {leads.map((lead) => (
            <Card key={lead.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div className="h4">{lead.name || 'Unnamed lead'}</div>
                  <div className="small" style={{ color: 'var(--color-text-muted)' }}>{lead.email || 'No email'} • {lead.phone || 'No phone'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge">{lead.status || 'NEW'}</span>
                  <Button variant="ghost" size="sm">Follow up</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default LeadsPage;
