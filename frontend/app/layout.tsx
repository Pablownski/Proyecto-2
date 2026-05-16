import './globals.css';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { SessionProvider } from './context/SessionContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

export const metadata = { title: 'Tienda Dashboard' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value ?? null;
  return (
    <html lang="es">
      <body>
        <SessionProvider initialUsername={username}>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
