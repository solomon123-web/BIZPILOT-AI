import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Input, Button, Card, Select } from '../../components/ui';
import customerService, { type CustomerRecord } from '../../services/customerService';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
};

export function CustomersTool() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selected, setSelected] = useState<CustomerRecord | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getCustomers();
      const nextCustomers = response?.data?.customers ?? [];
      setCustomers(nextCustomers);
      if (selected && !nextCustomers.some((customer) => customer.id === selected.id)) {
        setSelected(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const status = 'active';
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q);
    });
  }, [customers, query, statusFilter]);

  const resetForm = () => {
    setForm(emptyForm);
    setAdding(false);
    setEditingId(null);
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setAdding(true);
    setSuccess(null);
    setError(null);
  };

  const openEditForm = (customer: CustomerRecord) => {
    setSelected(customer);
    setEditingId(customer.id);
    setForm({
      name: customer.name ?? '',
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      notes: customer.notes ?? '',
    });
    setAdding(true);
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    if (!name) {
      setError('Customer name is required.');
      return;
    }

    const payload = {
      name,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (editingId) {
        const response = await customerService.updateCustomer(editingId, payload);
        const updatedCustomer = response?.data?.customer;
        if (updatedCustomer) {
          setCustomers((current) => current.map((customer) => customer.id === editingId ? updatedCustomer : customer));
          setSelected(updatedCustomer);
          setSuccess('Customer updated successfully.');
        }
      } else {
        const response = await customerService.createCustomer(payload);
        const createdCustomer = response?.data?.customer;
        if (createdCustomer) {
          setCustomers((current) => [createdCustomer, ...current]);
          setSelected(createdCustomer);
          setSuccess('Customer created successfully.');
        }
      }

      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Unable to save customer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (customer: CustomerRecord) => {
    if (!window.confirm(`Delete ${customer.name}?`)) return;

    try {
      setError(null);
      setSuccess(null);
      await customerService.deleteCustomer(customer.id);
      setCustomers((current) => current.filter((item) => item.id !== customer.id));
      if (selected?.id === customer.id) {
        setSelected(null);
      }
      setSuccess('Customer deleted.');
    } catch (err: any) {
      setError(err?.message || 'Unable to delete customer.');
    }
  };

  return (
    <PageContainer>
      <div className="section-header">
        <h2 className="h2">Customers</h2>
        <p className="body">Manage your customer list, interactions and notes.</p>
      </div>

      <div className="two-col-grid">
        <div className="left-col">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Input placeholder="Search customers" value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
            <Select value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </Select>
            <Button onClick={openCreateForm}>Add</Button>
          </div>

          {adding && (
            <Card style={{ marginBottom: 12 }}>
              <form onSubmit={handleSubmit} className="stack">
                <label className="label">Name</label>
                <Input name="name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} required />
                <label className="label">Email</label>
                <Input name="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
                <label className="label">Phone</label>
                <Input name="phone" value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} />
                <label className="label">Address</label>
                <Input name="address" value={form.address} onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))} />
                <label className="label">Notes</label>
                <Input name="notes" value={form.notes} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</Button>
                  <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}

          {error ? <div className="field__error" style={{ marginBottom: 12 }}>{error}</div> : null}
          {success ? <div className="field__success" style={{ marginBottom: 12 }}>{success}</div> : null}

          {loading ? (
            <div className="empty">Loading customers…</div>
          ) : (
            <div className="list">
              {filtered.map((c) => (
                <div key={c.id} className={`list-item ${selected?.id === c.id ? 'active' : ''}`} onClick={() => setSelected(c)}>
                  <div>
                    <div className="h4">{c.name}</div>
                    <div className="small" style={{ color: 'var(--color-text-muted)' }}>{c.email || c.phone || 'No contact info'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="small">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</div>
                    <div className="badge">active</div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="empty">No customers found</div>}
            </div>
          )}
        </div>

        <div className="right-col">
          {!selected && !loading && (
            <Card>
              <h3 className="h3">Select a customer</h3>
              <p className="body">Choose a customer from the list to view details and history.</p>
            </Card>
          )}

          {selected && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="h2">{selected.name}</h2>
                  <div className="small">{selected.email || 'No email'} • {selected.phone || 'No phone'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="small">Created</div>
                  <div className="h3">{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '-'}</div>
                </div>
              </div>

              <section style={{ marginTop: 12 }}>
                <h4 className="h4">Contact</h4>
                <p className="body">Email: {selected.email || '—'}</p>
                <p className="body">Phone: {selected.phone || '—'}</p>
                <p className="body">Address: {selected.address || '—'}</p>
              </section>

              <section style={{ marginTop: 12 }}>
                <h4 className="h4">Notes</h4>
                <p className="body">{selected.notes || 'No notes yet.'}</p>
              </section>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button onClick={() => openEditForm(selected)}>Edit</Button>
                <Button variant="ghost" onClick={() => handleDelete(selected)}>Delete</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default CustomersTool;
