export const dynamic = 'force-dynamic';

export default function Home({ searchParams }: { searchParams: { success?: string; rollback?: string } }) {
  const success = searchParams.success === '1';
  const rollbackMsg = searchParams.rollback ? decodeURIComponent(searchParams.rollback) : null;

  return (
    <>
      <div className="hero">
        <h1>Tienda de Cuchito</h1>
        <p>Consulta ventas, productos, clientes y reportes en tiempo real.</p>
      </div>

      {success && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, padding: '12px 18px', marginBottom: '1rem', color: '#065f46', fontWeight: 500 }}>
          Transacción completada — venta creada y stock actualizado correctamente.
        </div>
      )}

      {rollbackMsg && (
        <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '12px 18px', marginBottom: '1rem', color: '#92400e' }}>
          <strong>ROLLBACK ejecutado.</strong>
          <p style={{ marginTop: 4, fontSize: '.85rem', fontFamily: 'monospace' }}>{rollbackMsg}</p>
          <p style={{ marginTop: 6, fontSize: '.8rem' }}>Ningún cambio quedó guardado en la base de datos.</p>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {[
          { href: '/ventas',        label: 'Ventas',              desc: 'Historial con cliente y empleado' },
          { href: '/detalle',       label: 'Detalle de Ventas',   desc: 'Productos por venta con subtotales' },
          { href: '/productos',     label: 'Productos',           desc: 'Catálogo con categoría y proveedor' },
          { href: '/ranking',       label: 'Ranking',             desc: 'Productos más vendidos (CTE)' },
          { href: '/clientes',      label: 'Clientes Top',        desc: 'Clientes con mayor gasto' },
          { href: '/top-productos', label: 'Top Productos',       desc: 'Subquery: productos con ventas > 5' },
          { href: '/reporte',       label: 'Reporte (VIEW)',      desc: 'Vista consolidada de ventas' },
        ].map(({ href, label, desc }) => (
          <a key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <div style={{ fontWeight: 600, marginBottom: '.2rem' }}>{label}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{desc}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="card">
        <h2>Transacciones</h2>
        <p style={{ color: 'var(--muted)', fontSize: '.875rem', marginBottom: '1.25rem' }}>
          Ambas operaciones usan <code>BEGIN / COMMIT / ROLLBACK</code> explícito en PostgreSQL.
        </p>
        <div className="form-row">
          <form action="/api/crear-venta" method="post">
            <button type="submit" className="btn btn-success">✚ Crear Venta</button>
          </form>
          <form action="/api/rollback-demo" method="post">
            <button type="submit" className="btn" style={{ background: '#dc2626' }}>
              Forzar Rollback (demo)
            </button>
          </form>
        </div>
        <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.75rem' }}>
          <strong>Forzar Rollback:</strong> inserta una venta válida, luego intenta un detalle con quantity = -1
          (viola CHECK constraint) → el INSERT anterior se revierte automáticamente.
        </p>
      </div>
    </>
  );
}
