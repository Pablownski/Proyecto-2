'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  mode: 'crear' | 'editar';
  id?: number;
  initial?: { name: string; email: string; phone: string };
}

export default function ClienteForm({ mode, id, initial }: Props) {
  const router  = useRouter();
  const [form, setForm]     = useState(initial ?? { name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/panel/cliente', {
        method:  mode === 'crear' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(mode === 'editar' ? { id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail ?? 'Error'); return; }
      router.push('/customers?success=1');
      router.refresh();
    } catch { setError('Error de conexión'); }
    finally  { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 6,
    border: '1px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text)', fontSize: '.875rem',
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      {error && (
        <div style={{ gridColumn: '1/-1', color: '#f87171', background: 'rgba(248,113,113,.1)',
          borderRadius: 6, padding: '8px 12px', fontSize: '.875rem' }}>
          {error}
        </div>
      )}
      <div>
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Nombre</label>
        <input style={inputStyle} value={form.name} onChange={set('name')} required />
      </div>
      <div>
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Teléfono</label>
        <input style={inputStyle} value={form.phone} onChange={set('phone')} />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Email</label>
        <input style={inputStyle} type="email" value={form.email} onChange={set('email')} required />
      </div>
      <div style={{ gridColumn: '1/-1', display: 'flex', gap: '.75rem' }}>
        <button type="submit" disabled={loading} className="btn btn-success btn-sm">
          {loading ? 'Guardando...' : mode === 'crear'
            ? 'Crear cliente (sp_create_customer)'
            : 'Guardar cambios (ORM)'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm"
          onClick={() => { router.push('/customers'); router.refresh(); }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
