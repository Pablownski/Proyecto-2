'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const ADMIN_LINKS = [
  { href: '/admin',                    label: 'Dashboard'    },
  { href: '/admin/productos',          label: 'Productos'    },
  { href: '/admin/ventas',             label: 'Ventas'       },
  { href: '/admin/detalle',            label: 'Detalle'      },
  { href: '/admin/clientes',           label: 'Top Clientes' },
  { href: '/admin/gestion-clientes',   label: 'Clientes'     },
  { href: '/admin/ranking',            label: 'Ranking'      },
  { href: '/admin/reporte',            label: 'Reporte'      },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="admin-nav">
        {/* ── Top bar ── */}
        <div className="admin-nav-bar">
          <span className="admin-brand">Admin</span>

          {/* Desktop links — hidden on mobile */}
          <div className="admin-nav-links">
            {ADMIN_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <span style={{ marginLeft: 'auto' }}>
              <form action={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/admin/logout`} method="post" className="admin-logout-form">
                <button type="submit" style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,.35)',
                  color: '#fff',
                  borderRadius: 7,
                  padding: '6px 14px',
                  fontSize: '.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}>
                  Cerrar sesión
                </button>
              </form>
            </span>
          </div>

          {/* Hamburger — hidden on desktop */}
          <button
            className={`admin-hamburger${open ? ' is-open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            <span className="hb-bar" />
            <span className="hb-bar" />
            <span className="hb-bar" />
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        {open && (
          <div className="admin-drawer">
            {ADMIN_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={close}>{label}</Link>
            ))}
            <div className="nav-drawer-divider" />
            <form action={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/admin/logout`} method="post" className="admin-logout-form">
              <button type="submit" className="admin-drawer-logout">
                Cerrar sesión
              </button>
            </form>
          </div>
        )}
      </nav>

      <main style={{ maxWidth: 1100, margin: '1.25rem auto', padding: '0 1rem' }}>
        {children}
      </main>
    </>
  );
}
