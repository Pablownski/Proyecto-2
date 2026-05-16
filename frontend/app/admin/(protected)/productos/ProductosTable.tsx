'use client';

import { useState, useEffect, useCallback } from 'react';
import DeleteProductForm from './DeleteProductForm';

interface Producto {
  id: number;
  name: string;
  category: string;
  supplier: string;
  price: number;
  stock: number;
}

function mapRow(r: any[]): Producto {
  return { id: r[0], name: r[1], category: r[2], supplier: r[3], price: Number(r[4]), stock: r[5] };
}

function StockCell({ stock }: { stock: number }) {
  const color = stock === 0 ? '#f87171' : stock < 5 ? '#fbbf24' : '#34d399';
  const bg    = stock === 0 ? 'rgba(248,113,113,.15)' : stock < 5 ? 'rgba(251,191,36,.15)' : 'rgba(52,211,153,.15)';
  const label = stock === 0 ? 'Sin stock' : stock < 5 ? 'Bajo' : 'OK';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
      <span style={{ fontWeight: 700, color, fontSize: '1rem' }}>{stock}</span>
      <span style={{
        background: bg, color,
        borderRadius: 999, padding: '1px 8px',
        fontSize: '.7rem', fontWeight: 700,
      }}>
        {label}
      </span>
    </div>
  );
}

interface Props {
  editId: number | null;
}

export default function ProductosTable({ editId }: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProductos = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/productos-lista', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setProductos(data.map(mapRow));
      setLastUpdated(new Date());
    } catch {
      // mantiene datos anteriores silenciosamente
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  useEffect(() => {
    const onFocus = () => fetchProductos();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchProductos]);

  useEffect(() => {
    const id = setInterval(() => fetchProductos(), 30_000);
    return () => clearInterval(id);
  }, [fetchProductos]);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header de la tabla con timestamp */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface-2)',
      }}>
        <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontWeight: 500 }}>
          {lastUpdated
            ? `Stock actualizado: ${lastUpdated.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
            : 'Cargando...'}
        </span>
        <button
          onClick={() => fetchProductos(true)}
          disabled={refreshing}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: '.78rem',
            fontWeight: 600,
            cursor: refreshing ? 'default' : 'pointer',
            color: refreshing ? 'var(--muted)' : 'var(--primary)',
            transition: 'all .15s',
          }}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar stock'}
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j}>
                      <div style={{
                        height: 16, borderRadius: 4,
                        background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%)',
                        backgroundSize: '400px 100%',
                        animation: 'shimmer 1.4s infinite linear',
                        width: j === 1 ? '80%' : '60%',
                      }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : productos.length === 0 ? (
              <tr><td colSpan={7} className="empty">Sin productos</td></tr>
            ) : (
              productos.map(r => (
                <tr key={r.id} className={editId === r.id ? 'editing' : ''}>
                  <td><span className="badge badge-blue">{r.id}</span></td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.category}</td>
                  <td>{r.supplier}</td>
                  <td>Q{r.price.toFixed(2)}</td>
                  <td><StockCell stock={r.stock} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <a href={`/admin/productos?edit=${r.id}`} className="btn btn-warning btn-sm">Editar</a>
                      <DeleteProductForm id={r.id} redirectTo="/admin/productos" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes shimmer {
          from { background-position: -400px 0; }
          to   { background-position:  400px 0; }
        }
      `}</style>
    </div>
  );
}
