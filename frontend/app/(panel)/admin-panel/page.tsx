export const dynamic = 'force-dynamic';

import Link from 'next/link';

async function fetchJSON(url: string, fallback: any = null) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return fallback;
    return res.json();
  } catch { return fallback; }
}

export default async function AdminPanelPage() {
  const stats = await fetchJSON(`${process.env.API_URL}/stats/resumen`, {
    total_ventas: 0, ingresos_totales: 0, total_productos: 0, total_clientes: 0,
  });

  const Q = (n: number) => 'Q ' + Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2 });

  const STATS = [
    { label: 'Ventas totales',    value: stats.total_ventas,                color: '#a5b4fc' },
    { label: 'Ingresos totales',  value: Q(stats.ingresos_totales),          color: '#4ade80' },
    { label: 'Productos',         value: stats.total_productos,              color: '#fbbf24' },
    { label: 'Clientes',          value: stats.total_clientes,               color: '#f87171' },
  ];

  const SECTIONS = [
    {
      href:  '/inventory',
      label: 'Inventario',
      desc:  'Gestionar productos, categorías y stock.',
      color: '#a5b4fc',
    },
    {
      href:  '/sales',
      label: 'Ventas',
      desc:  'Registrar nuevas ventas vía sp_create_sale.',
      color: '#4ade80',
    },
    {
      href:  '/reports',
      label: 'Reportes',
      desc:  'Reporte por rango de fechas y cancelación de ventas.',
      color: '#fbbf24',
    },
    {
      href:  '/customers',
      label: 'Clientes',
      desc:  'Gestionar clientes vía ORM y sp_create_customer.',
      color: '#f87171',
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Panel de Administración</h1>
        <p style={{ margin: '.25rem 0 0', color: 'var(--muted)', fontSize: '.875rem' }}>
          admin_role — acceso completo al sistema
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {STATS.map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color, marginBottom: '.35rem' }}>
              {value}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Secciones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {SECTIONS.map(({ href, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card"
              style={{
                borderLeft: `4px solid ${color}`,
                cursor: 'pointer',
                transition: 'background .15s',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', color, marginBottom: '.4rem' }}>
                {label}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.875rem' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
