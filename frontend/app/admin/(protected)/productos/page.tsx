export const dynamic = 'force-dynamic';

import ProductosTable from './ProductosTable';

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

type SP = { edit?: string; add?: string; success?: string; error?: string };

export default async function AdminProductosPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;

  const [categorias, proveedores] = await Promise.all([
    fetchJSON(`${process.env.API_URL}/categorias`),
    fetchJSON(`${process.env.API_URL}/proveedores-lista`),
  ]);

  const editId = sp.edit ? parseInt(sp.edit) : null;
  const showAdd = sp.add === '1';
  let editData: any = null;
  if (editId) editData = await fetchJSON(`${process.env.API_URL}/producto/${editId}`);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ margin: 0, color: '#1e1b4b' }}>Gestión de Productos</h1>
        {!showAdd && !editId && (
          <a
            href="/admin/productos?add=1"
            style={{ background: '#059669', color: '#fff', padding: '8px 18px', borderRadius: 7, fontSize: '.875rem', fontWeight: 600, textDecoration: 'none' }}
          >
            ＋ Agregar Producto
          </a>
        )}
      </div>

      {sp.success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{decodeURIComponent(sp.success)}</div>}
      {sp.error   && <div className="alert alert-error"   style={{ marginBottom: '1rem' }}>{decodeURIComponent(sp.error)}</div>}

      {/* ── FORM CREAR ── */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #059669' }}>
          <h2>Nuevo Producto</h2>
          <form action="/api/productos" method="post">
            <input type="hidden" name="_action" value="crear" />
            <input type="hidden" name="_redirect" value="/admin/productos" />
            <div className="form-grid">
              <div className="fg"><label>Nombre *</label><input name="name" required /></div>
              <div className="fg"><label>Precio (Q) *</label><input name="price" type="number" step="0.01" min="0" required /></div>
              <div className="fg"><label>Stock *</label><input name="stock" type="number" min="0" required /></div>
              <div className="fg">
                <label>Categoría *</label>
                <select name="category_id" required>
                  <option value="">Seleccionar…</option>
                  {categorias.map((c: any) => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>Proveedor *</label>
                <select name="supplier_id" required>
                  <option value="">Seleccionar…</option>
                  {proveedores.map((p: any) => <option key={p[0]} value={p[0]}>{p[1]}</option>)}
                </select>
              </div>
              <div className="fg" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <input name="description" defaultValue="" />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success btn-sm">Guardar</button>
              <a href="/admin/productos" className="btn btn-ghost btn-sm">Cancelar</a>
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
            <input type="hidden" name="_redirect" value="/admin/productos" />
            <div className="form-grid">
              <div className="fg"><label>Nombre *</label><input name="name" defaultValue={editData[1]} required /></div>
              <div className="fg"><label>Precio (Q) *</label><input name="price" type="number" step="0.01" min="0" defaultValue={editData[3]} required /></div>
              <div className="fg"><label>Stock *</label><input name="stock" type="number" min="0" defaultValue={editData[4]} required /></div>
              <div className="fg">
                <label>Categoría *</label>
                <select name="category_id" defaultValue={editData[5]} required>
                  {categorias.map((c: any) => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>Proveedor *</label>
                <select name="supplier_id" defaultValue={editData[6]} required>
                  {proveedores.map((p: any) => <option key={p[0]} value={p[0]}>{p[1]}</option>)}
                </select>
              </div>
              <div className="fg" style={{ gridColumn: '1 / -1' }}>
                <label>Descripción</label>
                <input name="description" defaultValue={editData[2]} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-sm">Actualizar</button>
              <a href="/admin/productos" className="btn btn-ghost btn-sm">Cancelar</a>
            </div>
          </form>
        </div>
      )}

      {/* ── TABLA CON STOCK EN VIVO ── */}
      <ProductosTable editId={editId} />
    </>
  );
}
