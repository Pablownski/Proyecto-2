export const dynamic = 'force-dynamic';

async function getData() {
  const res = await fetch(`${process.env.API_URL}/ventas`, { cache: 'no-store' });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return (
    <>
      <h1>Ventas</h1>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Fecha</th><th>Cliente</th><th>Empleado</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5} className="empty">Sin registros</td></tr>
              ) : data.map((r: any, i: number) => (
                <tr key={i}>
                  <td><span className="badge badge-blue">{r[0]}</span></td>
                  <td>{new Date(r[1]).toLocaleString('es-GT')}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td><strong>Q{Number(r[4]).toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
