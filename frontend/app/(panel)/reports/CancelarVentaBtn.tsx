'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelarVentaBtn({ saleId }: { saleId: number }) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm(`¿Cancelar la venta #${saleId}? Se restaurará el stock.`)) return;
    setLoading(true);
    try {
      const res  = await fetch('/api/panel/cancelar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sale_id: saleId }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.detail ?? 'Error'); return; }
      router.refresh();
    } catch { alert('Error de conexión'); }
    finally  { setLoading(false); }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="btn btn-ghost btn-sm"
      style={{ fontSize: '.75rem', padding: '4px 10px', borderColor: '#f87171', color: '#f87171' }}
    >
      {loading ? '...' : 'Cancelar'}
    </button>
  );
}
