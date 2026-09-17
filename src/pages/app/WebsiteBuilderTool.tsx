import { useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Button, Input, Textarea, Select } from '../../components/ui';
import { generateWebsite, GeneratedWebsite, WebsiteStyle } from '../../services/websiteService';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export function WebsiteBuilderTool() {
  const { business } = useWorkspace();
  const [name, setName] = useState(business?.businessName ?? '');
  const [description, setDescription] = useState(business?.description ?? '');
  const [servicesInput, setServicesInput] = useState('Custom Cakes, Cupcakes, Orders');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(business?.city ?? '');
  const [style, setStyle] = useState<WebsiteStyle>('Modern');
  const [preview, setPreview] = useState<GeneratedWebsite | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const services = servicesInput.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await generateWebsite({ name, description, services, contact: { phone, email }, location, style });
      setPreview(res);
    } catch (e) {
      setPreview(null);
      alert('Failed to generate website preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => generate();

  return (
    <PageContainer>
      <div className="section-header">
        <h2 className="h2">Website Builder</h2>
        <p className="body">A guided website generator powered by AI. Fill the form, generate a preview, and publish your site.</p>
      </div>

      <div className="builder-grid">
        <div className="builder-form">
          <label className="label">Business name</label>
          <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />

          <label className="label">Business description</label>
          <Textarea value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={3} />

          <label className="label">Services (comma separated)</label>
          <Input value={servicesInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServicesInput(e.target.value)} />

          <label className="label">Contact phone</label>
          <Input value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} />

          <label className="label">Contact email</label>
          <Input value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

          <label className="label">Location</label>
          <Input value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />

          <label className="label">Website style</label>
          <Select value={style} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStyle(e.target.value as WebsiteStyle)}>
            <option>Modern</option>
            <option>Elegant</option>
            <option>Minimal</option>
            <option>Bold</option>
            <option>Luxury</option>
          </Select>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={generate} disabled={loading}>Generate</Button>
            <Button variant="ghost" onClick={regenerate} disabled={loading}>Regenerate</Button>
            <Button variant="ghost" onClick={() => setPreview(null)}>Edit</Button>
            <Button variant="ghost" onClick={() => alert('Publish placeholder')}>Publish</Button>
          </div>
        </div>

        <div className="builder-preview">
          {!preview && (
            <div className="empty-state">
              <p className="body">No preview yet. Generate a website to see a live preview.</p>
            </div>
          )}

          {preview && (
            <div className="site-preview">
              <header className="site-hero">
                <h1>{preview.hero.headline}</h1>
                <p>{preview.hero.description}</p>
                <Button variant="primary">{preview.hero.cta}</Button>
              </header>

              <section className="site-services">
                <h2 className="h2">Services</h2>
                <div>
                  {preview.services.map((s: { title: string; description: string }) => (
                    <div key={s.title} className="site-service-card">
                      <h3 className="h3">{s.title}</h3>
                      <p className="body">{s.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="site-about">
                <h2 className="h2">{preview.about.heading}</h2>
                <p className="body">{preview.about.body}</p>
              </section>

              <footer className="site-contact">
                <h3 className="h3">Contact</h3>
                <p className="body">{preview.contact.phone} — {preview.contact.email}</p>
                <p className="small">{preview.contact.address}</p>
              </footer>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default WebsiteBuilderTool;
