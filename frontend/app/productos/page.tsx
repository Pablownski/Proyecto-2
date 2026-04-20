export const dynamic = 'force-dynamic';

import DeleteProductForm from './DeleteProductForm';

async function fetchJSON(url: string) {
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}

type SP = { edit?: string; add?: string; success?: string; error?: string };

export default async function Page({ searchParams }: { searchParams: SP }) {
  const [productos, categorias, proveedores] = await Promise.all([
    fetchJSON(`${process.env.API_URL}/productos`),
    fetchJSON(`${process.env.API_URL}/categorias`),
    fetchJSON(`${process.env.API_URL}/proveedores-lista`),
  ]);

  const editId = searchParams.edit ? parseInt(searchParams.edit) : null;
  const showAdd = searchParams.add === '1';

  let editData: any = null;
  if (editId) {
    editData = await fetchJSON(`${process.env.API_URL}/producto/${editId}`);
  }

  const inputCls = 'fg';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ margin: 0 }}>📦 Productos</h1>
        {!showAdd && !editId && (
          <a href="/productos?add=1" className="btn btn-success btn-sm">＋ Agregar Producto</a>
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
          <h2>Nuevo Producto</h2>
          <form action="/api/productos" method="post">
            <input type="hidden" name="_action" value="crear" />
            <div className="form-grid">
              <div className={inputCls}><label>Nombre *</label><input name="name" required /></div>
              <div className={inputCls}><label>Precio (Q) *</label><input name="price" type="number" step="0.01" min="0" required /></div>
              <div className={inputCls}><label>Stock *</label><input name="stock" type="number" min="0" required /></div>
              <div className={inputCls}>
                <label>Categoría *</label>
                <select name="category_id" required>
                  <option value="">Seleccionar…</option>
                  {categorias.map((c: any) => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
                </select>
              </div>
              <div className={inputCls}>
                <label>Proveedor *</label>
                <select name="supplier_id" required>
                  <option value="">Seleccionar…</option>
                  {proveedores.map((p: any) => <option key={p[0]} value={p[0]}>{p[1]}</option>)}
                </select>
              </div>
              <div className={inputCls} style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <input name="description" defaultValue="" />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success btn-sm">Guardar</button>
              <a href="/productos" className="btn btn-ghost btn-sm">Cancelar</a>
            </div>
          </form>
        </div>
      )}

      {/* ── FORM EDITAR ── */}
      {editId && editData && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
          <h2>Editar Producto #{editId}</h2>
          <form action="/api/productos" method="post">
            <input type="hidden" name="_action" value="editar" />
            <input type="hidden" name="id" value={editId} />
            <div className="form-grid">
              <div className={inputCls}><label>Nombre *</label><input name="name" defaultValue={editData[1]} required /></div>
              <div className={inputCls}><label>Precio (Q) *</label><input name="price" type="number" step="0.01" min="0" defaultValue={editData[3]} required /></div>
              <div className={inputCls}><label>Stock *</label><input name="stock" type="number" min="0" defaultValue={editData[4]} required /></div>
              <div className={inputCls}>
                <label>Categoría *</label>
                <select name="category_id" defaultValue={editData[5]} required>
                  {categorias.map((c: any) => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
                </select>
              </div>
              <div className={inputCls}>
                <label>Proveedor *</label>
                <select name="supplier_id" defaultValue={editData[6]} required>
                  {proveedores.map((p: any) => <option key={p[0]} value={p[0]}>{p[1]}</option>)}
                </select>
              </div>
              <div className={inputCls} style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <input name="description" defaultValue={editData[2]} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-sm">Actualizar</button>
              <a href="/productos" className="btn btn-ghost btn-sm">Cancelar</a>
            </div>
          </form>
        </div>
      )}

      {/* ── TABLA ── */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Producto</th><th>Categoría</th><th>Proveedor</th>
                <th>Precio</th><th>Stock</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr><td colSpan={7} className="empty">Sin productos</td></tr>
              ) : productos.map((r: any) => (
                <tr key={r[0]} className={editId === r[0] ? 'editing' : ''}>
                  <td><span className="badge badge-blue">{r[0]}</span></td>
                  <td><strong>{r[1]}</strong></td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>Q{Number(r[4]).toFixed(2)}</td>
                  <td>{r[5]}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <a href={`/productos?edit=${r[0]}`} className="btn btn-warning btn-sm">✏️ Editar</a>
                      <DeleteProductForm id={r[0]} />
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
