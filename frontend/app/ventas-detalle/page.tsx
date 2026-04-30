export const dynamic = 'force-dynamic';

import ErrorCard from '../components/ErrorCard';

async function getData(): Promise<any[] | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/ventas-bulto`, { cache: 'no-store' });
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
      <h1>Ventas con Artículos en Bulto</h1>
      <div className="alert alert-warn" style={{ marginBottom: '1rem' }}>
        <strong>Subquery con EXISTS:</strong> muestra ventas que tienen al menos una línea de detalle con <code>quantity &gt;= 2</code>.
        <br />
        <code style={{ fontSize: '.78rem' }}>
          WHERE EXISTS (SELECT 1 FROM detalle_venta d WHERE d.sale_id = v.sale_id AND d.quantity &gt;= 2)
        </code>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Venta ID</th><th>Cliente</th><th>Fecha</th><th>Total</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={4} className="empty">Sin resultados</td></tr>
              ) : data.map((r: any, i: number) => (
                <tr key={i}>
                  <td><span className="badge badge-blue">{r[0]}</span></td>
                  <td><strong>{r[1]}</strong></td>
                  <td>{new Date(r[2]).toLocaleString('es-GT')}</td>
                  <td>Q{Number(r[3]).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
