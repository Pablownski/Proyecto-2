export const dynamic = 'force-dynamic';

async function getData() {
  const res = await fetch(`${process.env.API_URL}/ranking`, { cache: 'no-store' });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return (
    <>
      <h1>Ranking de Productos</h1>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Producto</th><th>Total Vendido</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={3} className="empty">Sin registros</td></tr>
              ) : data.map((r: any, i: number) => (
                <tr key={i}>
                  <td style={{ color: 'var(--muted)', fontWeight: 600 }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td><strong>{r[0]}</strong></td>
                  <td>{r[1]} unidades</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
