'use client';

import { useState } from 'react';

export default function RegistroForm({ serverError }: { serverError?: string }) {
  const [clientError, setClientError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError('');
    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirm = (form.elements.namedItem('confirm_password') as HTMLInputElement).value;

    if (!username) {
      e.preventDefault();
      setClientError('El nombre de usuario es requerido.');
      return;
    }
    if (password.length < 6) {
      e.preventDefault();
      setClientError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      e.preventDefault();
      setClientError('Las contraseñas no coinciden.');
      return;
    }
  };

  const error = clientError || serverError;

  return (
    <form action="/api/auth/registro" method="post" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '.5rem' }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>❌</span>
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
        <div className="fg">
          <label>Usuario</label>
          <input name="username" autoComplete="username" required autoFocus />
        </div>
        <div className="fg">
          <label>Contraseña <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(mín. 6 caracteres)</span></label>
          <input name="password" type="password" autoComplete="new-password" required minLength={6} />
        </div>
        <div className="fg">
          <label>Confirmar contraseña</label>
          <input name="confirm_password" type="password" autoComplete="new-password" required />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-success"
        style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}
      >
        Crear cuenta
      </button>
    </form>
  );
}
