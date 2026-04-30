export const dynamic = 'force-dynamic';

import ErrorCard from '../../components/ErrorCard';

async function getData(): Promise<any[] | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/top-productos`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const data = await getData();
  if (!data) return <ErrorCard />;
  return (
    <>
      <h1>Top Productos</h1>
      <div className="alert alert-warn" style={{ marginBottom: '1rem' }}>
        <strong>Subquery con IN:</strong> productos cuyo total vendido supera 5 unidades.
        <br />
        <code style={{ fontSize: '.78rem' }}>
          WHERE product_id IN (SELECT product_id FROM detalle_venta GROUP BY product_id HAVING SUM(quantity) &gt; 5)
        </code>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Total vendido</th>
                <th>¿Supera mínimo (5)?</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={4} className="empty">Sin registros</td></tr>
              ) : data.map((r: any, i: number) => (
                <tr key={i}>
                  <td style={{ color: 'var(--muted)', fontWeight: 600 }}>{i + 1}</td>
                  <td><strong>{r[0]}</strong></td>
                  <td><span className="badge badge-blue">{r[1]} uds.</span></td>
                  <td style={{ color: '#059669', fontWeight: 600 }}>Sí ({r[1]} &gt; 5)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
