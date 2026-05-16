export const dynamic = 'force-dynamic';

import DeleteClienteForm from './DeleteClienteForm';
import ClienteForm from './ClienteForm';

type SP = { edit?: string; add?: string; success?: string; error?: string };

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const clientes = await fetchJSON(`${process.env.API_URL}/cliente`);

  const editId = sp.edit ? parseInt(sp.edit) : null;
  const showAdd = sp.add === '1';

  let editData: any = null;
  if (editId) {
    editData = clientes.find((c: any) => c[0] === editId) ?? null;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ margin: 0 }}>Gestión de Clientes</h1>
        {!showAdd && !editId && (
          <a href="/admin/gestion-clientes?add=1" className="btn btn-success btn-sm">+ Agregar Cliente</a>
        )}
      </div>

      {sp.success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{decodeURIComponent(sp.success)}</div>}
      {sp.error   && <div className="alert alert-error"   style={{ marginBottom: '1rem' }}>{decodeURIComponent(sp.error)}</div>}

      {showAdd && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <h2>Nuevo Cliente</h2>
          <ClienteForm mode="crear" />
        </div>
      )}

      {editId && editData && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h2>Editar Cliente #{editId}</h2>
          <ClienteForm
            mode="editar"
            id={editId}
            initial={{
              name:  String(editData[1] ?? ''),
              email: String(editData[2] ?? ''),
              phone: String(editData[3] ?? ''),
            }}
          />
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan={5} className="empty">Sin clientes</td></tr>
              ) : clientes.map((r: any) => (
                <tr key={r[0]} className={editId === r[0] ? 'editing' : ''}>
                  <td><span className="badge badge-blue">{r[0]}</span></td>
                  <td><strong>{r[1]}</strong></td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <a href={`/admin/gestion-clientes?edit=${r[0]}`} className="btn btn-warning btn-sm">Editar</a>
                      <DeleteClienteForm id={r[0]} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
