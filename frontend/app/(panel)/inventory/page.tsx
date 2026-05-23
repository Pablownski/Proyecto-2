export const dynamic = 'force-dynamic';

import Link from 'next/link';
import ProductoForm from './ProductoForm';
import StockAjuste from './StockAjuste';
import DeleteProductoBtn from './DeleteProductoBtn';

const Q = (n: number) => 'Q ' + n.toLocaleString('es-GT', { minimumFractionDigits: 2 });

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

type SP = { add?: string; edit?: string; stock?: string; success?: string };

export default async function InventoryPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;

  const [productos, categorias, proveedores] = await Promise.all([
    fetchJSON(`${process.env.API_URL}/orm/productos`),
    fetchJSON(`${process.env.API_URL}/orm/categorias`),
    fetchJSON(`${process.env.API_URL}/orm/proveedores`),
  ]);

  const editId  = sp.edit  ? parseInt(sp.edit)  : null;
  const stockId = sp.stock ? parseInt(sp.stock) : null;

  let editData: any = null;
  if (editId) editData = await fetchJSON(`${process.env.API_URL}/orm/producto/${editId}`);

  const editProduct = editId && editData
    ? productos.find((p: any) => p.product_id === editId)
    : null;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Gestión de Inventario</h1>
          <p style={{ margin: '.25rem 0 0', color: 'var(--muted)', fontSize: '.875rem' }}>
            CRUD via ORM (SQLAlchemy) · inventory_role
          </p>
        </div>
        {!sp.add && !editId && (
          <Link href="/inventory?add=1" className="btn btn-success btn-sm">+ Nuevo producto</Link>
        )}
      </div>

      {sp.success && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          Operación realizada correctamente.
        </div>
      )}

      {sp.add === '1' && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <h2 style={{ marginTop: 0 }}>Nuevo producto</h2>
          <ProductoForm mode="crear" categorias={categorias} proveedores={proveedores} />
        </div>
      )}

      {editId && editData && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h2 style={{ marginTop: 0 }}>Editar producto #{editId}</h2>
          <ProductoForm
            mode="editar"
            id={editId}
            categorias={categorias}
            proveedores={proveedores}
            initial={{
              name:        String(editData.name ?? ''),
              description: String(editData.description ?? ''),
              price:       String(editData.price ?? ''),
              stock:       String(editData.stock ?? ''),
              category_id: String(editData.category_id ?? ''),
              supplier_id: String(editData.supplier_id ?? ''),
            }}
          />
        </div>
      )}

      {stockId && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <h2 style={{ marginTop: 0 }}>Ajuste de stock (sp_update_stock)</h2>
          {(() => {
            const p = productos.find((x: any) => x.product_id === stockId);
            return p
              ? <StockAjuste productId={p.product_id} nombre={p.name} stockActual={p.stock} />
              : <p>Producto no encontrado.</p>;
          })()}
          <Link href="/inventory" style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.75rem', display: 'inline-block' }}>
            ← Volver
          </Link>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['ID', 'Nombre', 'Categoría', 'Proveedor', 'Precio', 'Stock', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                  color: 'var(--muted)', borderBottom: '2px solid var(--border)', fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((p: any) => (
              <tr key={p.product_id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.product_id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.category_name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.supplier_name}</td>
                <td style={{ padding: '12px 16px' }}>{Q(p.price)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontWeight: 700,
                    color: p.stock < 10 ? '#f87171' : p.stock < 30 ? '#fbbf24' : '#4ade80',
                  }}>
                    {p.stock}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                    <Link href={`/inventory?edit=${p.product_id}`} className="btn btn-ghost btn-sm"
                      style={{ fontSize: '.75rem', padding: '4px 10px' }}>
                      Editar
                    </Link>
                    <Link href={`/inventory?stock=${p.product_id}`} className="btn btn-ghost btn-sm"
                      style={{ fontSize: '.75rem', padding: '4px 10px', borderColor: '#f59e0b', color: '#f59e0b' }}>
                      Stock
                    </Link>
                    <DeleteProductoBtn id={p.product_id} />
                  </div>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                Sin productos
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

