type SP = { error?: string; username?: string };

export default function LoginPage({ searchParams }: { searchParams: SP }) {
  const errorMsg = searchParams.error ? decodeURIComponent(searchParams.error) : null;
  const prefillUser = searchParams.username ? decodeURIComponent(searchParams.username) : '';

  const inputErr: React.CSSProperties = errorMsg
    ? { borderColor: '#dc2626', boxShadow: '0 0 0 3px rgba(220,38,38,.12)' }
    : {};

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}></div>
          <h1 style={{ marginBottom: '.25rem' }}>Tienda de Cuchito</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.875rem' }}>Ingresa tus credenciales para continuar</p>
        </div>

        {errorMsg && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '.5rem' }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>❌</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form action="/api/auth/login" method="post">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            <div className="fg">
              <label>Usuario</label>
              <input
                name="username"
                autoComplete="username"
                required
                autoFocus={!prefillUser}
                defaultValue={prefillUser}
                style={prefillUser && errorMsg ? inputErr : {}}
              />
            </div>
            <div className="fg">
              <label>Contraseña</label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                autoFocus={!!prefillUser}
                style={prefillUser && errorMsg ? inputErr : {}}
              />
              {errorMsg && (
                <span style={{ fontSize: '.75rem', color: '#dc2626', marginTop: '.15rem' }}>
                  Verifica tu usuario y contraseña.
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success"
            style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}
          >
            Iniciar sesión
          </button>
        </form>

        <hr style={{ margin: '1.25rem 0', borderColor: 'var(--border)' }} />

        <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--muted)' }}>
          ¿No tienes cuenta?{' '}
          <a href="/registro" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Crear cuenta
          </a>
        </p>

        <p style={{ textAlign: 'center', marginTop: '.75rem', fontSize: '.75rem', color: 'var(--muted)' }}>
          Usuario por defecto: <code>prueba</code> / <code>prueba123</code>
        </p>
      </div>
    </div>
  );
}
