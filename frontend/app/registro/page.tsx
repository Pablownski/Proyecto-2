import RegistroForm from './RegistroForm';

type SP = { error?: string };

export default function RegistroPage({ searchParams }: { searchParams: SP }) {
  const errorMsg = searchParams.error ? decodeURIComponent(searchParams.error) : undefined;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🏪</div>
          <h1 style={{ marginBottom: '.25rem' }}>Crear cuenta</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.875rem' }}>Completa los campos para registrarte</p>
        </div>

        <RegistroForm serverError={errorMsg} />

        <hr style={{ margin: '1.25rem 0', borderColor: 'var(--border)' }} />

        <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
