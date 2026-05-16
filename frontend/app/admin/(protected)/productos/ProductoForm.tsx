'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  mode: 'crear' | 'editar';
  id?: number;
  categorias: [number, string][];
  proveedores: [number, string][];
  initial?: {
    name: string;
    description: string;
    price: string;
    stock: string;
    category_id: string;
    supplier_id: string;
  };
}

interface Fields {
  name: string;
  description: string;
  price: string;
  stock: string;
  category_id: string;
  supplier_id: string;
}

export default function ProductoForm({ mode, id, categorias, proveedores, initial }: Props) {
  const router = useRouter();

  const [fields, setFields] = useState<Fields>({
    name:        initial?.name        ?? '',
    description: initial?.description ?? '',
    price:       initial?.price       ?? '',
    stock:       initial?.stock       ?? '',
    category_id: initial?.category_id ?? '',
    supplier_id: initial?.supplier_id ?? '',
  });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFields(f => ({ ...f, [k]: e.target.value }));
      setErrors(er => ({ ...er, [k]: '' }));
    };

  const validate = (): Partial<Fields> => {
    const errs: Partial<Fields> = {};
    if (!fields.name.trim())
      errs.name = 'El nombre es obligatorio';
    else if (fields.name.trim().length < 2)
      errs.name = 'Mínimo 2 caracteres';
    if (!fields.price || Number(fields.price) <= 0)
      errs.price = 'El precio debe ser mayor a 0';
    if (fields.stock === '' || Number(fields.stock) < 0)
      errs.stock = 'El stock no puede ser negativo';
    if (!fields.category_id)
      errs.category_id = 'Selecciona una categoría';
    if (!fields.supplier_id)
      errs.supplier_id = 'Selecciona un proveedor';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/producto', {
        method: mode === 'crear' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          price:       Number(fields.price),
          stock:       Number(fields.stock),
          category_id: Number(fields.category_id),
          supplier_id: Number(fields.supplier_id),
          ...(mode === 'editar' ? { id } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.detail ?? 'Error al guardar');
      } else {
        const msg = mode === 'crear' ? 'Producto creado exitosamente' : 'Producto actualizado exitosamente';
        router.push(`/admin/productos?success=${encodeURIComponent(msg)}`);
        router.refresh();
      }
    } catch {
      setServerError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{serverError}</div>
      )}
      <div className="form-grid">
        <div className="fg">
          <label>Nombre *</label>
          <input value={fields.name} onChange={set('name')} placeholder="Ej. Laptop HP 15" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="fg">
          <label>Precio (Q) *</label>
          <input type="number" step="0.01" min="0" value={fields.price} onChange={set('price')} placeholder="0.00" />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="fg">
          <label>Stock *</label>
          <input type="number" min="0" value={fields.stock} onChange={set('stock')} placeholder="0" />
          {errors.stock && <span className="field-error">{errors.stock}</span>}
        </div>

        <div className="fg">
          <label>Categoría *</label>
          <select value={fields.category_id} onChange={set('category_id')}>
            <option value="">Seleccionar…</option>
            {categorias.map(([cid, name]) => (
              <option key={cid} value={cid}>{name}</option>
            ))}
          </select>
          {errors.category_id && <span className="field-error">{errors.category_id}</span>}
        </div>

        <div className="fg">
          <label>Proveedor *</label>
          <select value={fields.supplier_id} onChange={set('supplier_id')}>
            <option value="">Seleccionar…</option>
            {proveedores.map(([pid, name]) => (
              <option key={pid} value={pid}>{name}</option>
            ))}
          </select>
          {errors.supplier_id && <span className="field-error">{errors.supplier_id}</span>}
        </div>

        <div className="fg" style={{ gridColumn: '1 / -1' }}>
          <label>Descripción</label>
          <input value={fields.description} onChange={set('description')} placeholder="Descripción del producto" />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
          {loading ? 'Guardando...' : mode === 'crear' ? 'Guardar' : 'Actualizar'}
        </button>
        <a href="/admin/productos" className="btn btn-ghost btn-sm">Cancelar</a>
      </div>
    </form>
  );
}
