'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StockAjuste({ productId, nombre, stockActual }: {
  productId: number; nombre: string; stockActual: number;
}) {
  const router   = useRouter();
  const [delta, setDelta]   = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]       = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    const d = parseInt(delta);
    if (isNaN(d) || d === 0) { setMsg('Ingresa un número distinto de 0'); setLoading(false); return; }
    try {
      const res  = await fetch('/api/panel/stock', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, delta: d }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.detail ?? 'Error'); return; }
      setMsg(`Stock actualizado (sp_update_stock)`);
      setDelta('');
      router.refresh();
    } catch { setMsg('Error de conexión'); }
    finally  { setLoading(false); }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{nombre} — stock: <strong>{stockActual}</strong></span>
      <input
        type="number" placeholder="Δ stock (+ o -)"
        value={delta} onChange={e => setDelta(e.target.value)}
        style={{ width: 120, padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)',
          background: 'var(--surface-2)', color: 'var(--text)', fontSize: '.8rem' }}
      />
      <button type="submit" disabled={loading} className="btn btn-ghost btn-sm">
        {loading ? '...' : 'Ajustar'}
      </button>
      {msg && <span style={{ fontSize: '.75rem', color: msg.includes('actualiz') ? '#4ade80' : '#f87171' }}>{msg}</span>}
    </form>
  );
}
