import Link from 'next/link';
type SP = { error?: string };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const error = sp.error ? decodeURIComponent(sp.error) : null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0e1a',
    }}>
      <div style={{
        background: '#1e1b4b',
        border: '1px solid #312e81',
        borderRadius: 12,
        padding: '2.5rem',
        width: '100%',
        maxWidth: 380,
        boxShadow: '0 8px 32px rgba(0,0,0,.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#fcd34d', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
            Admin Panel
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.85rem', marginTop: '.4rem' }}>
            Acceso restringido — solo administradores
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,.2)',
            border: '1px solid rgba(220,38,38,.5)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: '1.25rem',
            color: '#fca5a5',
            fontSize: '.875rem',
          }}>
            {error}
          </div>
        )}

        <form action={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/admin/login`} method="post">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
              <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Usuario
              </label>
              <input
                name="username"
                required
                autoFocus
                autoComplete="username"
                style={{
                  background: 'rgba(255,255,255,.08)',
                  border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: 7,
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '.875rem',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
              <label style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                style={{
                  background: 'rgba(255,255,255,.08)',
                  border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: 7,
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '1.5rem',
              background: '#fcd34d',
              color: '#1e1b4b',
              border: 'none',
              borderRadius: 7,
              padding: '10px',
              fontWeight: 800,
              fontSize: '.9rem',
              cursor: 'pointer',
            }}
          >
            Ingresar como administrador
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.8rem', color: 'rgba(255,255,255,.3)' }}>
          <Link href="/login" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>
            ← Volver al login de usuario
          </Link>
        </p>
      </div>
    </div>
  );
}
