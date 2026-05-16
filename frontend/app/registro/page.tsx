import Link from 'next/link';
import RegistroForm from './RegistroForm';

type SP = { error?: string };

export default async function RegistroPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : undefined;

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
        maxWidth: 420,
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
            Crear cuenta
          </h1>
          <p style={{ color: '#5a6485', fontSize: '.85rem' }}>
            Completa los campos para registrarte
          </p>
        </div>

        <RegistroForm serverError={errorMsg} />

        <div style={{ height: 1, background: 'rgba(124,111,250,.12)', margin: '1.5rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '.875rem', color: '#5a6485' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ color: '#a89dfc', fontWeight: 600, textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
