'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteClienteBtn({ id }: { id: number }) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este cliente?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/panel/cliente', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) { router.refresh(); }
      else {
        const d = await res.json();
        alert(d.detail ?? 'Error al eliminar');
      }
    } catch { alert('Error de conexión'); }
    finally  { setLoading(false); }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-ghost btn-sm"
      style={{ fontSize: '.75rem', padding: '4px 10px', borderColor: '#f87171', color: '#f87171' }}
    >
      {loading ? '...' : 'Eliminar'}
    </button>
  );
}
