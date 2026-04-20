export const dynamic = 'force-dynamic';

type SP = { edit?: string; add?: string; success?: string; error?: string };

async function fetchJSON(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}

export default async function Page({ searchParams }: { searchParams: SP }) {
  const clientes = await fetchJSON(`${process.env.API_URL}/cliente`);

  const editId = searchParams.edit ? parseInt(searchParams.edit) : null;
  const showAdd = searchParams.add === '1';

  let editData: any = null;
  if (editId) {
    editData = clientes.find((c: any) => c[0] === editId) ?? null;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ margin: 0 }}>👥 Gestión de Clientes</h1>
        {!showAdd && !editId && (
          <a href="/gestion-clientes?add=1" className="btn btn-success btn-sm">＋ Agregar Cliente</a>
        )}
      </div>

      {searchParams.success && (
        <div className="alert alert-success">✅ {decodeURIComponent(searchParams.success)}</div>
      )}
      {searchParams.error && (
        <div className="alert alert-error">❌ {decodeURIComponent(searchParams.error)}</div>
      )}

      {/* ── FORM CREAR ── */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #059669' }}>
          <h2>Nuevo Cliente</h2>
          <form action="/api/clientes" method="post">
            <input type="hidden" name="_action" value="crear" />
            <div className="form-grid">
              <div className="fg"><label>Nombre completo *</label><input name="name" required /></div>
              <div className="fg"><label>Email *</label><input name="email" type="email" required /></div>
              <div className="fg"><label>Teléfono *</label><input name="phone" required /></div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success btn-sm">Guardar</button>
              <a href="/gestion-clientes" className="btn btn-ghost btn-sm">Cancelar</a>
            </div>
          </form>
        </div>
      )}

      {/* ── FORM EDITAR ── */}
      {editId && editData && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
          <h2>Editar Cliente #{editId}</h2>
          <form action="/api/clientes" method="post">
            <input type="hidden" name="_action" value="editar" />
            <input type="hidden" name="id" value={editId} />
            <div className="form-grid">
              <div className="fg"><label>Nombre completo *</label><input name="name" defaultValue={editData[1]} required /></div>
              <div className="fg"><label>Email *</label><input name="email" type="email" defaultValue={editData[2]} required /></div>
              <div className="fg"><label>Teléfono *</label><input name="phone" defaultValue={editData[3]} required /></div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-sm">Actualizar</button>
              <a href="/gestion-clientes" className="btn btn-ghost btn-sm">Cancelar</a>
            </div>
          </form>
        </div>
      )}

      {/* ── TABLA ── */}
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
                      <a href={`/gestion-clientes?edit=${r[0]}`} className="btn btn-warning btn-sm">✏️ Editar</a>
                      <form action="/api/clientes" method="post" style={{ display: 'inline' }}>
                        <input type="hidden" name="_action" value="eliminar" />
                        <input type="hidden" name="id" value={r[0]} />
                        <button type="submit" className="btn btn-danger btn-sm">🗑 Eliminar</button>
                      </form>
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
