'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  mode: 'crear' | 'editar';
  id?: number;
  initial?: { name: string; email: string; phone: string };
}

interface Fields { name: string; email: string; phone: string }

export default function ClienteForm({ mode, id, initial }: Props) {
  const router = useRouter();

  const [fields, setFields] = useState<Fields>({
    name:  initial?.name  ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
  });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields(f => ({ ...f, [k]: e.target.value }));
      setErrors(er => ({ ...er, [k]: '' }));
    };

  const validate = (): Partial<Fields> => {
    const errs: Partial<Fields> = {};
    if (!fields.name.trim())
      errs.name = 'El nombre es obligatorio';
    else if (fields.name.trim().length < 2)
      errs.name = 'Mínimo 2 caracteres';
    if (!fields.email.trim())
      errs.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = 'Ingresa un email válido';
    if (!fields.phone.trim())
      errs.phone = 'El teléfono es obligatorio';
    else if (!/^\d{7,15}$/.test(fields.phone.replace(/\s/g, '')))
      errs.phone = 'Solo dígitos, entre 7 y 15 caracteres';
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
      const res = await fetch('/api/admin/cliente', {
        method: mode === 'crear' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, ...(mode === 'editar' ? { id } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.detail ?? 'Error al guardar');
      } else {
        const msg = mode === 'crear' ? 'Cliente creado exitosamente' : 'Cliente actualizado exitosamente';
        router.push(`/admin/gestion-clientes?success=${encodeURIComponent(msg)}`);
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
          <label>Nombre completo *</label>
          <input value={fields.name} onChange={set('name')} placeholder="Ej. Juan Pérez" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="fg">
          <label>Email *</label>
          <input type="email" value={fields.email} onChange={set('email')} placeholder="correo@ejemplo.com" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="fg">
          <label>Teléfono *</label>
          <input type="tel" value={fields.phone} onChange={set('phone')} placeholder="55001122" />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
          {loading ? 'Guardando...' : mode === 'crear' ? 'Guardar' : 'Actualizar'}
        </button>
        <a href="/admin/gestion-clientes" className="btn btn-ghost btn-sm">Cancelar</a>
      </div>
    </form>
  );
}
