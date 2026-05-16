export const dynamic = 'force-dynamic';

import ProductosTable from './ProductosTable';
import ProductoForm from './ProductoForm';

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

  const cats: [number, string][] = categorias.map((c: any) => [c[0], c[1]]);
  const provs: [number, string][] = proveedores.map((p: any) => [p[0], p[1]]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ margin: 0 }}>Gestión de Productos</h1>
        {!showAdd && !editId && (
          <a href="/admin/productos?add=1" className="btn btn-success btn-sm">
            + Agregar Producto
          </a>
        )}
      </div>

      {sp.success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{decodeURIComponent(sp.success)}</div>}
      {sp.error   && <div className="alert alert-error"   style={{ marginBottom: '1rem' }}>{decodeURIComponent(sp.error)}</div>}

      {showAdd && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <h2>Nuevo Producto</h2>
          <ProductoForm mode="crear" categorias={cats} proveedores={provs} />
        </div>
      )}

      {editId && editData && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h2>Editar Producto #{editId}</h2>
          <ProductoForm
            mode="editar"
            id={editId}
            categorias={cats}
            proveedores={provs}
            initial={{
              name:        String(editData[1] ?? ''),
              description: String(editData[2] ?? ''),
              price:       String(editData[3] ?? ''),
              stock:       String(editData[4] ?? ''),
              category_id: String(editData[5] ?? ''),
              supplier_id: String(editData[6] ?? ''),
            }}
          />
        </div>
      )}

      <ProductosTable editId={editId} />
    </>
  );
}
