export const dynamic = 'force-dynamic';

import Link from 'next/link';
import ClienteForm from './ClienteForm';
import DeleteClienteBtn from './DeleteClienteBtn';

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

type SP = { add?: string; edit?: string; success?: string };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp      = await searchParams;
  const clientes = await fetchJSON(`${process.env.API_URL}/orm/clientes`);

  const editId   = sp.edit ? parseInt(sp.edit) : null;
  let   editData: any = null;
  if (editId) editData = await fetchJSON(`${process.env.API_URL}/orm/cliente/${editId}`);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Gestión de Clientes</h1>
          <p style={{ margin: '.25rem 0 0', color: 'var(--muted)', fontSize: '.875rem' }}>
            Crear via sp_create_customer · Editar via ORM · customer_service_role
          </p>
        </div>
        {!sp.add && !editId && (
          <Link href="/customers?add=1" className="btn btn-success btn-sm">+ Nuevo cliente</Link>
        )}
      </div>

      {sp.success && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          Operación realizada correctamente.
        </div>
      )}

      {sp.add === '1' && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <h2 style={{ marginTop: 0 }}>Nuevo cliente (sp_create_customer)</h2>
          <ClienteForm mode="crear" />
        </div>
      )}

      {editId && editData && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h2 style={{ marginTop: 0 }}>Editar cliente #{editId} (ORM)</h2>
          <ClienteForm
            mode="editar"
            id={editId}
            initial={{ name: editData.name, email: editData.email, phone: editData.phone }}
          />
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['ID', 'Nombre', 'Email', 'Teléfono', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                  color: 'var(--muted)', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((c: any) => (
              <tr key={c.customer_id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{c.customer_id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{c.email}</td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{c.phone}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '.4rem' }}>
                    <Link href={`/customers?edit=${c.customer_id}`} className="btn btn-ghost btn-sm"
                      style={{ fontSize: '.75rem', padding: '4px 10px' }}>
                      Editar
                    </Link>
                    <DeleteClienteBtn id={c.customer_id} />
                  </div>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                Sin clientes
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
