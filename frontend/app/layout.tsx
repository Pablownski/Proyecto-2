import './globals.css';
import type { ReactNode } from 'react';

export const metadata = { title: 'Tienda Dashboard' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
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
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
