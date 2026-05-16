export const dynamic = 'force-dynamic';
import ErrorCard from '../../../components/ErrorCard';

async function getData(): Promise<any[] | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/ranking`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function Page() {
  const data = await getData();
  if (!data) return <ErrorCard />;
  return (
    <>
      <h1>Ranking de Productos</h1>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Producto</th><th>Unidades vendidas</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={3} className="empty">Sin registros</td></tr>
              ) : data.map((r: any, i: number) => (
                <tr key={i}>
                  <td>
                    <span style={{ background: 'rgba(124,111,250,.15)', color: '#a89dfc', padding: '2px 10px', borderRadius: 999, fontSize: '.75rem', fontWeight: 700 }}>
                      {i + 1}
                    </span>
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
