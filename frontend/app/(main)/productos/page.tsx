'use client';

import { useState, useEffect, useCallback } from 'react';
import AddToCartButton from '../../components/AddToCartButton';

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

function StockIndicator({ stock }: { stock: number }) {
  if (stock === 0) return null;

  const low  = stock <= 3;
  const mid  = stock <= 10;

  const color = low ? '#b45309' : mid ? '#0369a1' : '#047857';
  const bg    = low ? '#fef3c7' : mid ? '#e0f2fe' : '#d1fae5';
  const label = low ? `Últimas ${stock} unidades` : `${stock} en stock`;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '.35rem',
      background: bg,
      color,
      borderRadius: 6,
      padding: '3px 8px',
      fontSize: '.72rem',
      fontWeight: 700,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: color, flexShrink: 0,
        boxShadow: `0 0 0 2px ${bg}`,
      }} />
      {label}
    </div>
  );
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchProductos = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/productos-lista`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setProductos(data.map(mapRow));
      setLastUpdated(new Date());
    } catch {
      // red silenciosa — mantiene datos anteriores
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inicial
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Refresca al volver al tab (cubre el caso de "acabo de pagar")
  useEffect(() => {
    const onFocus = () => fetchProductos();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchProductos]);

  // Polling cada 30 s
  useEffect(() => {
    const id = setInterval(fetchProductos, 30_000);
    return () => clearInterval(id);
  }, [fetchProductos]);

  if (loading) {
    return (
      <>
        <div className="hero" style={{ marginBottom: '1.5rem' }}>
          <h1>Nuestros Productos</h1>
          <p>Cargando catálogo...</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card skeleton-card" style={{ height: 200 }} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hero" style={{ marginBottom: '1.5rem' }}>
        <h1>Nuestros Productos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ margin: 0 }}>{productos.length} productos disponibles</p>
          {lastUpdated && (
            <span style={{
              fontSize: '.72rem', opacity: .75,
              background: 'rgba(255,255,255,.15)',
              borderRadius: 20, padding: '2px 10px',
            }}>
              Stock actualizado {lastUpdated.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchProductos}
            style={{
              background: 'rgba(255,255,255,.15)',
              border: '1px solid rgba(255,255,255,.3)',
              color: '#fff',
              borderRadius: 20,
              padding: '3px 12px',
              fontSize: '.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.15)')}
          >
            Actualizar
          </button>
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="empty">No hay productos disponibles.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}>
          {productos.map(p => {
            const inStock = p.stock > 0;

            return (
              <div
                key={p.id}
                className={`card product-card${inStock ? '' : ' product-card--out'}`}
                style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', opacity: inStock ? 1 : .55, position: 'relative' }}
              >
                {/* Badges de categoría y estado */}
                <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="badge badge-blue" style={{ fontSize: '.7rem' }}>{p.category}</span>
                  {!inStock && (
                    <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 999, fontSize: '.7rem', fontWeight: 700 }}>
                      Agotado
                    </span>
                  )}
                </div>

                {/* Nombre */}
                <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, flex: 1 }}>{p.name}</div>

                {/* Proveedor */}
                <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Proveedor: {p.supplier}</div>

                {/* Stock indicator */}
                {inStock && <StockIndicator stock={p.stock} />}

                {/* Precio + botón */}
                <div style={{
                  marginTop: 'auto',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '.6rem', borderTop: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Q{p.price.toFixed(2)}
                  </span>
                  <AddToCartButton
                    productId={p.id}
                    name={p.name}
                    price={p.price}
                    stock={p.stock}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          from { background-position: -400px 0; }
          to   { background-position:  400px 0; }
        }
        .skeleton-card {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite linear;
          border: none !important;
        }
      `}</style>
    </>
  );
}
