'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Producto = { product_id: number; name: string; price: number; stock: number };
type Cliente  = { customer_id: number; name: string };
type Item     = { product_id: number; name: string; price: number; quantity: number };

const Q = (n: number) => 'Q ' + n.toLocaleString('es-GT', { minimumFractionDigits: 2 });

export default function SalesForm({ productos, clientes }: { productos: Producto[]; clientes: Cliente[] }) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState('');
  const [prodId, setProdId]         = useState('');
  const [qty, setQty]               = useState('1');
  const [items, setItems]           = useState<Item[]>([]);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const addItem = () => {
    const p = productos.find(x => x.product_id === parseInt(prodId));
    if (!p) return;
    const q = parseInt(qty);
    if (q < 1 || q > p.stock) { alert(`Stock disponible: ${p.stock}`); return; }
    setItems(prev => {
      const existing = prev.find(x => x.product_id === p.product_id);
      if (existing) return prev.map(x => x.product_id === p.product_id ? { ...x, quantity: x.quantity + q } : x);
      return [...prev, { product_id: p.product_id, name: p.name, price: p.price, quantity: q }];
    });
    setProdId(''); setQty('1');
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(x => x.product_id !== id));

  const total = items.reduce((s, x) => s + x.price * x.quantity, 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { setResult({ type: 'err', msg: 'Agrega al menos un producto.' }); return; }
    if (!customerId) { setResult({ type: 'err', msg: 'Selecciona un cliente.' }); return; }
    setLoading(true); setResult(null);
    try {
      const res = await fetch('/api/panel/venta', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: parseInt(customerId),
          items: items.map(x => ({ product_id: x.product_id, quantity: x.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setResult({ type: 'err', msg: data.detail ?? 'Error al crear la venta' }); return; }
      setResult({ type: 'ok', msg: `Venta #${data.sale_id} creada con éxito via sp_create_sale` });
      setItems([]); setCustomerId('');
      router.refresh();
    } catch { setResult({ type: 'err', msg: 'Error de conexión' }); }
    finally  { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)',
    background: 'var(--surface-2)', color: 'var(--text)', fontSize: '.875rem',
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0, fontSize: '1rem' }}>Nueva venta (sp_create_sale)</h2>

      {result && (
        <div style={{
          marginBottom: '1rem', padding: '10px 14px', borderRadius: 6, fontSize: '.875rem',
          background: result.type === 'ok' ? 'rgba(74,222,128,.1)' : 'rgba(248,113,113,.1)',
          color: result.type === 'ok' ? '#4ade80' : '#f87171',
          border: `1px solid ${result.type === 'ok' ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.3)'}`,
        }}>
          {result.msg}
        </div>
      )}

      <form onSubmit={submit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Cliente</label>
          <select style={{ ...inputStyle, width: '100%' }} value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">— Seleccionar cliente —</option>
            {clientes.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Agregar producto</label>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <select style={{ ...inputStyle, flex: 1 }} value={prodId} onChange={e => setProdId(e.target.value)}>
              <option value="">— Producto —</option>
              {productos.map(p => (
                <option key={p.product_id} value={p.product_id} disabled={p.stock === 0}>
                  {p.name} — {Q(p.price)} (stock: {p.stock})
                </option>
              ))}
            </select>
            <input
              type="number" min="1" value={qty} onChange={e => setQty(e.target.value)}
              style={{ ...inputStyle, width: 70 }}
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={addItem} disabled={!prodId}>
              +
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div style={{ marginBottom: '1rem', background: 'var(--surface-2)', borderRadius: 8,
            border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Producto', 'Cant.', 'Precio', 'Sub.', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(x => (
                  <tr key={x.product_id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 12px' }}>{x.name}</td>
                    <td style={{ padding: '8px 12px' }}>{x.quantity}</td>
                    <td style={{ padding: '8px 12px' }}>{Q(x.price)}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{Q(x.price * x.quantity)}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <button type="button" onClick={() => removeItem(x.product_id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1rem' }}>
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, fontSize: '.9rem', color: 'var(--primary)' }}>
              Total: {Q(total)}
            </div>
          </div>
        )}

        <button type="submit" disabled={loading || items.length === 0} className="btn btn-success"
          style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Creando venta...' : 'Crear venta'}
        </button>
      </form>
    </div>
  );
}
