type SP = { error?: string; username?: string };

export default async function LoginPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : null;
  const prefillUser = sp.username ? decodeURIComponent(sp.username) : '';

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(124,111,250,.25)',
    borderRadius: 8,
    padding: '10px 13px',
    color: '#dde4f5',
    fontSize: '.875rem',
    outline: 'none',
    width: '100%',
    transition: 'border-color .15s, box-shadow .15s',
  };

  const inputErrStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: 'rgba(248,113,113,.5)',
    boxShadow: '0 0 0 3px rgba(248,113,113,.1)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#07091a',
      padding: '1rem',
    }}>
      <div style={{
        background: '#0d0f22',
        border: '1px solid rgba(124,111,250,.2)',
        borderRadius: 14,
        padding: '2.5rem',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 8px 40px rgba(0,0,0,.55)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(124,111,250,.12)',
            border: '1px solid rgba(124,111,250,.25)',
            borderRadius: 10,
            padding: '8px 18px',
            marginBottom: '1rem',
          }}>
            <span style={{ color: '#f5a623', fontWeight: 800, fontSize: '1rem', letterSpacing: '.04em' }}>
              TIENDA
            </span>
          </div>
          <h1 style={{ color: '#dde4f5', fontSize: '1.4rem', fontWeight: 800, marginBottom: '.3rem' }}>
            Iniciar sesión
          </h1>
          <p style={{ color: '#5a6485', fontSize: '.85rem' }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(248,113,113,.1)',
            border: '1px solid rgba(248,113,113,.3)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: '1.25rem',
            color: '#fca5a5',
            fontSize: '.875rem',
          }}>
            {errorMsg}
          </div>
        )}

        <form action={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/auth/login`} method="post">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
              <label style={{ color: '#5a6485', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Usuario
              </label>
              <input
                name="username"
                autoComplete="username"
                required
                autoFocus={!prefillUser}
                defaultValue={prefillUser}
                style={prefillUser && errorMsg ? inputErrStyle : inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
              <label style={{ color: '#5a6485', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus={!!prefillUser}
                style={prefillUser && errorMsg ? inputErrStyle : inputStyle}
              />
              {errorMsg && (
                <span style={{ fontSize: '.75rem', color: '#f87171', marginTop: '.1rem' }}>
                  Verifica tu usuario y contraseña.
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '1.5rem',
              background: 'linear-gradient(135deg, #7c6ffa, #6355e0)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '11px',
              fontWeight: 700,
              fontSize: '.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124,111,250,.35)',
              transition: 'opacity .15s',
            }}
          >
            Entrar
          </button>
        </form>

        <div style={{ height: 1, background: 'rgba(124,111,250,.12)', margin: '1.5rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '.875rem', color: '#5a6485' }}>
          ¿No tienes cuenta?{' '}
          <a href="/registro" style={{ color: '#a89dfc', fontWeight: 600, textDecoration: 'none' }}>
            Crear cuenta
          </a>
        </p>

        <p style={{ textAlign: 'center', marginTop: '.75rem', fontSize: '.8rem' }}>
          <a href="/admin/login" style={{ color: 'rgba(245,166,35,.5)', textDecoration: 'none', fontSize: '.75rem' }}>
            Acceso admin
          </a>
        </p>
      </div>
    </div>
  );
}
