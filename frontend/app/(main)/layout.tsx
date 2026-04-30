import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const username = cookies().get('username')?.value;

  return (
    <>
      <nav>
        <a href="/" className="brand">Tienda</a>
        <a href="/ventas">Ventas</a>
        <a href="/detalle">Detalle</a>
        <a href="/productos">Productos</a>
        <a href="/gestion-clientes">Clientes</a>
        <a href="/clientes">Top Clientes</a>
        <a href="/ranking">Ranking</a>
        <a href="/top-productos">Top Prod.</a>
        <a href="/ventas-detalle">Bulto</a>
        <a href="/reporte">Reporte</a>
        {username && (
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <span style={{ color: 'rgba(255,255,255,.7)', fontSize: '.8rem' }}>👤 {username}</span>
            <form action="/api/auth/logout" method="post" style={{ margin: 0 }}>
              <button type="submit" className="btn btn-ghost btn-sm" style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>
                Salir
              </button>
            </form>
          </span>
        )}
      </nav>
      <main>{children}</main>
    </>
  );
}
