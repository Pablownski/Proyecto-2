import { cookies } from 'next/headers';
import Link from 'next/link';
import type { ReactNode } from 'react';

const ROLE_LINKS: Record<string, { href: string; label: string }[]> = {
  admin:            [
    { href: '/admin-panel', label: 'Dashboard'  },
    { href: '/inventory',   label: 'Inventario' },
    { href: '/sales',       label: 'Ventas'     },
    { href: '/reports',     label: 'Reportes'   },
    { href: '/customers',   label: 'Clientes'   },
  ],
  inventory:        [{ href: '/inventory', label: 'Inventario' }],
  sales:            [{ href: '/sales',     label: 'Ventas'     }],
  reporting:        [{ href: '/reports',   label: 'Reportes'   }],
  customer_service: [{ href: '/customers', label: 'Clientes'   }],
};

const ROLE_LABEL: Record<string, string> = {
  admin:            'Admin',
  inventory:        'Inventario',
  sales:            'Ventas',
  reporting:        'Reportes',
  customer_service: 'Atención al Cliente',
};

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const role     = cookieStore.get('user_role')?.value ?? '';
  const username = cookieStore.get('username')?.value  ?? '';
  const links    = ROLE_LINKS[role] ?? [];
  const bp       = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return (
    <>
      <nav style={{
        background: '#1a1d35',
        borderBottom: '1px solid rgba(255,255,255,.1)',
        padding: '0 1.5rem',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: '1.5rem',
          height: 56,
        }}>
          <span style={{ color: '#a5b4fc', fontWeight: 800, fontSize: '.95rem', whiteSpace: 'nowrap' }}>
            Panel — {ROLE_LABEL[role] ?? role}
          </span>

          <div style={{ display: 'flex', gap: '.25rem', flex: 1 }}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: 'rgba(255,255,255,.75)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: '.875rem',
                  fontWeight: 500,
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'rgba(255,255,255,.45)', fontSize: '.8rem' }}>{username}</span>
            <form action={`${bp}/api/auth/logout`} method="post">
              <button
                type="submit"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,.3)',
                  color: 'rgba(255,255,255,.8)',
                  borderRadius: 6,
                  padding: '5px 13px',
                  fontSize: '.8rem',
                  cursor: 'pointer',
                }}
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '1.5rem auto', padding: '0 1.5rem' }}>
        {children}
      </main>
    </>
  );
}
