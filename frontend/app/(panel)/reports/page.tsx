export const dynamic = 'force-dynamic';

import CancelarVentaBtn from './CancelarVentaBtn';

const Q = (n: number) => 'Q ' + Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2 });

async function fetchReport(start: string, end: string) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/sp/reporte-ventas?start=${start}&end=${end}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

type SP = { start?: string; end?: string };

export default async function ReportsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp      = await searchParams;
  const start   = sp.start ?? '2025-01-01';
  const end     = sp.end   ?? '2025-12-31';
  const rows    = await fetchReport(start, end);
  const total   = rows.reduce((s: number, r: any) => s + r.total, 0);

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Reporte de Ventas</h1>
        <p style={{ margin: '.25rem 0 0', color: 'var(--muted)', fontSize: '.875rem' }}>
          Generado via sp_generate_sales_report · reporting_role
        </p>
      </div>

      {/* Filtro de fechas */}
      <form method="get" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { name: 'start', label: 'Desde', value: start },
          { name: 'end',   label: 'Hasta', value: end   },
        ].map(({ name, label, value }) => (
          <div key={name}>
            <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>{label}</label>
            <input
              type="date" name={name} defaultValue={value}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--surface-2)', color: 'var(--text)', fontSize: '.875rem' }}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-ghost btn-sm" style={{ marginBottom: 1 }}>
          Generar
        </button>
      </form>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Ventas activas',    value: rows.length },
          { label: 'Ingresos totales',  value: Q(total)    },
          { label: 'Período',           value: `${start} → ${end}` },
        ].map(({ label, value }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '.8rem', marginBottom: '.5rem' }}>{label}</div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['#', 'Fecha', 'Cliente', 'Empleado', 'Ítems', 'Total', 'Cancelar'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                  color: 'var(--muted)', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.sale_id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{r.sale_id}</td>
                <td style={{ padding: '12px 16px' }}>{String(r.fecha).slice(0, 10)}</td>
                <td style={{ padding: '12px 16px' }}>{r.cliente}</td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{r.empleado}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{r.num_items}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>{Q(r.total)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <CancelarVentaBtn saleId={r.sale_id} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                Sin ventas en el período seleccionado
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
