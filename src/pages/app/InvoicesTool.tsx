import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../components/app/PageContainer';
import { Input, Button, Card, Select } from '../../components/ui';
import customerService, { type CustomerRecord } from '../../services/customerService';
import invoiceService, { type InvoiceRecord } from '../../services/invoiceService';

const emptyForm = {
  customerId: '',
  description: '',
  quantity: '1',
  price: '0',
  taxRate: '0',
  dueDate: '',
  status: 'pending',
  notes: '',
};

export function InvoicesTool() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [selected, setSelected] = useState<InvoiceRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadCustomers = async () => {
    const response = await customerService.getCustomers();
    return response?.data?.customers ?? [];
  };

  const loadInvoices = async () => {
    const response = await invoiceService.getInvoices();
    return response?.data?.invoices ?? [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [nextCustomers, nextInvoices] = await Promise.all([loadCustomers(), loadInvoices()]);
        setCustomers(nextCustomers);
        setInvoices(nextInvoices);
      } catch (err: any) {
        setError(err?.message || 'Unable to load invoices.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const customersMap = useMemo(() => {
    const map: Record<string, CustomerRecord> = {};
    customers.forEach((customer) => {
      map[customer.id] = customer;
    });
    return map;
  }, [customers]);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (!query) return true;

      const q = query.toLowerCase();
      const customerName = customersMap[inv.customerId || '']?.name || '';
      return inv.number.toLowerCase().includes(q) || customerName.toLowerCase().includes(q);
    });
  }, [customersMap, invoices, query, statusFilter]);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setCreating(true);
    setSuccess(null);
    setError(null);
  };

  const openEditForm = (invoice: InvoiceRecord) => {
    const firstItem = invoice.items?.[0];
    setSelected(invoice);
    setEditingId(invoice.id);
    setForm({
      customerId: invoice.customerId || '',
      description: firstItem?.description || '',
      quantity: String(firstItem?.quantity || 1),
      price: String(firstItem?.unitPrice || 0),
      taxRate: String(firstItem?.taxRate || 0),
      dueDate: invoice.dueDate ? invoice.dueDate.slice(0, 10) : '',
      status: String(invoice.status || 'pending'),
      notes: invoice.notes || '',
    });
    setCreating(true);
    setSuccess(null);
    setError(null);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setCreating(false);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const customerId = form.customerId.trim();
    const description = form.description.trim();
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    const taxRate = Number(form.taxRate || 0);

    if (!customerId) {
      setError('Please select a customer.');
      return;
    }

    if (!description) {
      setError('Item description is required.');
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) {
      setError('Quantity and price must be valid values.');
      return;
    }

    const payload = {
      customerId,
      status: form.status,
      dueDate: form.dueDate || undefined,
      notes: form.notes.trim() || undefined,
      items: [{
        description,
        quantity,
        unitPrice: price,
        taxRate,
      }],
    };

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let response;
      if (editingId) {
        response = await invoiceService.updateInvoice(editingId, payload);
        const updatedInvoice = response?.data?.invoice;
        if (updatedInvoice) {
          setInvoices((current) => current.map((invoice) => invoice.id === editingId ? updatedInvoice : invoice));
          setSelected(updatedInvoice);
          setSuccess('Invoice updated successfully.');
        }
      } else {
        response = await invoiceService.createInvoice(payload);
        const createdInvoice = response?.data?.invoice;
        if (createdInvoice) {
          setInvoices((current) => [createdInvoice, ...current]);
          setSelected(createdInvoice);
          setSuccess('Invoice created successfully.');
        }
      }

      resetForm();
    } catch (err: any) {
      setError(err?.message || 'Unable to save invoice.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (invoice: InvoiceRecord) => {
    if (!window.confirm(`Delete ${invoice.number}?`)) return;

    try {
      setError(null);
      setSuccess(null);
      await invoiceService.deleteInvoice(invoice.id);
      setInvoices((current) => current.filter((item) => item.id !== invoice.id));
      if (selected?.id === invoice.id) {
        setSelected(null);
      }
      setSuccess('Invoice deleted.');
    } catch (err: any) {
      setError(err?.message || 'Unable to delete invoice.');
    }
  };

  const handleQuickStatusUpdate = async (status: 'paid' | 'pending' | 'overdue') => {
    if (!selected) return;

    try {
      setError(null);
      setSuccess(null);
      const response = await invoiceService.updateInvoice(selected.id, { status });
      const updatedInvoice = response?.data?.invoice;
      if (updatedInvoice) {
        setInvoices((current) => current.map((invoice) => invoice.id === selected.id ? updatedInvoice : invoice));
        setSelected(updatedInvoice);
        setSuccess(`Invoice marked as ${status}.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to update invoice status.');
    }
  };

  return (
    <PageContainer>
      <div className="section-header">
        <h2 className="h2">Invoices</h2>
        <p className="body">Create and manage invoices. Track payment status and due dates.</p>
      </div>

      <div className="two-col-grid">
        <div className="left-col">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Input placeholder="Search invoices or customer" value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
            <Select value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'paid' | 'pending' | 'overdue')}>
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </Select>
            <Button onClick={openCreateForm}>Create Invoice</Button>
          </div>

          {creating && (
            <Card style={{ marginBottom: 12 }}>
              <form onSubmit={handleSubmit} className="stack">
                <label className="label">Customer</label>
                <Select value={form.customerId} onChange={(e) => setForm((current) => ({ ...current, customerId: e.target.value }))} required>
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </Select>

                <label className="label">Item description</label>
                <Input value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} required />

                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label className="label">Quantity</label>
                    <Input value={form.quantity} onChange={(e) => setForm((current) => ({ ...current, quantity: e.target.value }))} type="number" min="1" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="label">Price</label>
                    <Input value={form.price} onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))} type="number" min="0" step="0.01" />
                  </div>
                </div>

                <label className="label">Tax %</label>
                <Input value={form.taxRate} onChange={(e) => setForm((current) => ({ ...current, taxRate: e.target.value }))} type="number" min="0" step="0.01" />

                <label className="label">Status</label>
                <Select value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </Select>

                <label className="label">Due date</label>
                <Input value={form.dueDate} onChange={(e) => setForm((current) => ({ ...current, dueDate: e.target.value }))} type="date" />

                <label className="label">Notes</label>
                <Input value={form.notes} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} />

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update Invoice' : 'Create Invoice'}</Button>
                  <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}

          {error ? <div className="field__error" style={{ marginBottom: 12 }}>{error}</div> : null}
          {success ? <div className="field__success" style={{ marginBottom: 12 }}>{success}</div> : null}

          {loading ? (
            <div className="empty">Loading invoices…</div>
          ) : (
            <div className="list">
              {filtered.map((inv) => (
                <div key={inv.id} className={`list-item ${selected?.id === inv.id ? 'active' : ''}`} onClick={() => setSelected(inv)}>
                  <div>
                    <div className="h4">{inv.number}</div>
                    <div className="small" style={{ color: 'var(--color-text-muted)' }}>{customersMap[inv.customerId || '']?.name || 'Unknown customer'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="small">₦{Number(inv.total || 0).toLocaleString()}</div>
                    <div className={`badge badge--${inv.status || 'pending'}`}>{inv.status || 'pending'}</div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="empty">No invoices found</div>}
            </div>
          )}
        </div>

        <div className="right-col">
          {!selected && !loading && (
            <Card>
              <h3 className="h3">Select an invoice</h3>
              <p className="body">View invoice details, send reminders, and mark as paid.</p>
            </Card>
          )}

          {selected && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="h2">{selected.number}</h2>
                  <div className="small">{customersMap[selected.customerId || '']?.name || 'Unknown customer'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="small">Due {selected.dueDate ? new Date(selected.dueDate).toLocaleDateString() : '-'}</div>
                  <div className="h3">₦{Number(selected.total || 0).toLocaleString()}</div>
                </div>
              </div>

              <section style={{ marginTop: 12 }}>
                <h4 className="h4">Items</h4>
                <div>
                  {(selected.items || []).map((it, index) => (
                    <div key={`${selected.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <div className="body">{it.description}</div>
                        <div className="small">{it.quantity} × ₦{Number(it.unitPrice || 0).toLocaleString()}</div>
                      </div>
                      <div className="body">₦{(Number(it.quantity || 0) * Number(it.unitPrice || 0)).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={{ marginTop: 12 }}>
                <h4 className="h4">Summary</h4>
                <div className="summary-row"><span>Subtotal</span><span>₦{Number(selected.amount || 0).toLocaleString()}</span></div>
                <div className="summary-row"><span>Tax</span><span>₦{Number(selected.tax || 0).toLocaleString()}</span></div>
                <div className="summary-row"><strong>Total</strong><strong>₦{Number(selected.total || 0).toLocaleString()}</strong></div>
              </section>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button onClick={() => openEditForm(selected)}>Edit</Button>
                <Button onClick={() => void handleQuickStatusUpdate('paid')}>Mark paid</Button>
                <Button variant="ghost" onClick={() => handleDelete(selected)}>Delete</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default InvoicesTool;
