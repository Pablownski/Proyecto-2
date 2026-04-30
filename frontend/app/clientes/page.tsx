export const dynamic = 'force-dynamic';

import ErrorCard from '../components/ErrorCard';

async function getData(): Promise<any[] | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/clientes-top`, { cache: 'no-store' });
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
      <h1>Clientes Top</h1>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Cliente</th><th>Total Gastado</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={2} className="empty">Sin registros</td></tr>
              ) : data.map((r: any, i: number) => (
                <tr key={i}>
                  <td><strong>{r[0]}</strong></td>
                  <td>Q{Number(r[1]).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
