export const dynamic = 'force-dynamic';

async function getData() {
  const res = await fetch(`${process.env.API_URL}/reporte`, { cache: 'no-store' });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return (
    <>
      <h1>Reporte de Ventas</h1>
      <p style={{ color: 'var(--muted)', fontSize: '.875rem', marginBottom: '1rem' }}>
        Vista consolidada desde la VIEW <code>reporte_ventas</code>.
      </p>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={4} className="empty">Sin registros</td></tr>
              ) : data.map((r: any, i: number) => (
                <tr key={i}>
                  <td><span className="badge badge-blue">{r[0]}</span></td>
                  <td>{r[1]}</td>
                  <td><strong>Q{Number(r[2]).toFixed(2)}</strong></td>
                  <td>{new Date(r[3]).toLocaleString('es-GT')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
