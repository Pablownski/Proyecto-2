'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from '../context/SessionContext';
import { useCart } from '../context/CartContext';
import type { ReactNode } from 'react';

const NAV_LINKS = [
  { href: '/productos', label: 'Productos' },
  { href: '/carrito',   label: 'Carrito'   },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const { username, logout } = useSession();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <nav className="main-nav">
        {/* ── Top bar ── */}
        <div className="nav-bar">
          <Link href="/" className="brand" onClick={close}>Tienda</Link>

          {/* Hamburger — hidden on desktop via CSS */}
          <button
            className={`nav-hamburger${open ? ' is-open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            <span className="hb-bar" />
            <span className="hb-bar" />
            <span className="hb-bar" />
          </button>

          {/* Desktop links — hidden on mobile via CSS */}
          <div className="nav-links">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} style={{ position: 'relative' }}>
                {label}
                {label === 'Carrito' && itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </Link>
            ))}
            {username ? (
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <span style={{ color: 'rgba(255,255,255,.65)', fontSize: '.8rem' }}>{username}</span>
                <button
                  onClick={logout}
                  className="btn btn-ghost btn-sm"
                  style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}
                >
                  Salir
                </button>
              </span>
            ) : (
              <Link href="/login" className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {open && (
          <div className="nav-drawer">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={close}>
                {label}
                {label === 'Carrito' && itemCount > 0 && (
                  <span style={{
                    background: '#fcd34d', color: '#1e1b4b',
                    borderRadius: 999, fontSize: '.65rem', fontWeight: 800,
                    minWidth: 18, height: 18, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                  }}>
                    {itemCount}
                  </span>
                )}
              </Link>
            ))}
            <div className="nav-drawer-divider" />
            {username ? (
              <>
                <span className="nav-drawer-user">{username}</span>
                <button
                  onClick={() => { close(); logout(); }}
                  className="nav-drawer-logout"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login" onClick={close} style={{ padding: '.75rem 1rem', color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: '.9rem' }}>
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </nav>

      <main>{children}</main>
    </>
  );
}
