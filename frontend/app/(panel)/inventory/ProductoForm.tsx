'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Cat  = { category_id: number; name: string };
type Prov = { supplier_id: number; name: string };

interface Props {
  mode: 'crear' | 'editar';
  id?: number;
  categorias: Cat[];
  proveedores: Prov[];
  initial?: {
    name: string; description: string; price: string;
    stock: string; category_id: string; supplier_id: string;
  };
}

export default function ProductoForm({ mode, id, categorias, proveedores, initial }: Props) {
  const router  = useRouter();
  const [form, setForm] = useState(initial ?? {
    name: '', description: '', price: '', stock: '', category_id: '', supplier_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const body = {
      name: form.name, description: form.description,
      price: parseFloat(form.price), stock: parseInt(form.stock),
      category_id: parseInt(form.category_id), supplier_id: parseInt(form.supplier_id),
    };
    try {
      const res = await fetch('/api/panel/producto', {
        method:  mode === 'crear' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(mode === 'editar' ? { id, ...body } : body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail ?? 'Error'); return; }
      router.push('/inventory?success=1');
      router.refresh();
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
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
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Precio (Q)</label>
        <input style={inputStyle} type="number" step="0.01" value={form.price} onChange={set('price')} required />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Descripción</label>
        <textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
          value={form.description} onChange={set('description')} rows={2} required />
      </div>
      <div>
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Stock</label>
        <input style={inputStyle} type="number" value={form.stock} onChange={set('stock')} required />
      </div>
      <div>
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Categoría</label>
        <select style={inputStyle} value={form.category_id} onChange={set('category_id')} required>
          <option value="">— Seleccionar —</option>
          {categorias.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Proveedor</label>
        <select style={inputStyle} value={form.supplier_id} onChange={set('supplier_id')} required>
          <option value="">— Seleccionar —</option>
          {proveedores.map(p => <option key={p.supplier_id} value={p.supplier_id}>{p.name}</option>)}
        </select>
      </div>
      <div style={{ gridColumn: '1/-1', display: 'flex', gap: '.75rem' }}>
        <button type="submit" disabled={loading} className="btn btn-success btn-sm">
          {loading ? 'Guardando...' : mode === 'crear' ? 'Crear producto' : 'Guardar cambios'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm"
          onClick={() => { router.push('/inventory'); router.refresh(); }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
