export const dynamic = 'force-dynamic';

import SalesForm from './SalesForm';

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function SalesPage() {
  const [productos, clientes, ventas] = await Promise.all([
    fetchJSON(`${process.env.API_URL}/orm/productos`),
    fetchJSON(`${process.env.API_URL}/orm/clientes`),
    fetchJSON(`${process.env.API_URL}/ventas`),
  ]);

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Registro de Ventas</h1>
        <p style={{ margin: '.25rem 0 0', color: 'var(--muted)', fontSize: '.875rem' }}>
          Venta creada via sp_create_sale · sales_role
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <SalesForm productos={productos} clientes={clientes} />

        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>Ventas recientes</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  {['#', 'Fecha', 'Cliente', 'Empleado', 'Total'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left',
                      color: 'var(--muted)', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ventas.slice(0, 15).map((v: any[]) => (
                  <tr key={v[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{v[0]}</td>
                    <td style={{ padding: '10px 12px' }}>{String(v[1]).slice(0, 10)}</td>
                    <td style={{ padding: '10px 12px' }}>{v[2]}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>{v[3]}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--primary)' }}>
                      Q {parseFloat(v[4]).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {ventas.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)' }}>
                    Sin ventas
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
