'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const Q = (n: number) => 'Q ' + n.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CarritoPage() {
  const router = useRouter();
  const { items, total, itemCount, remove, updateQty, clear, hydrated } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleRemove = (productId: number, name: string) => {
    remove(productId);
    toast({ type: 'warning', title: 'Producto eliminado', message: name, duration: 2000 });
  };

  const handleCheckout = useCallback(async () => {
    if (items.length === 0 || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/compra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          type: 'error',
          title: 'Error en la compra',
          message: data.detail ?? 'No se pudo procesar la transacción.',
          duration: 6000,
        });
        return;
      }

      clear();
      toast({
        type: 'success',
        title: `¡Compra exitosa! Venta #${data.sale_id}`,
        message: `Total pagado: ${Q(data.total)}. El stock fue actualizado.`,
        duration: 5000,
      });
      setTimeout(() => router.push('/productos'), 1200);
    } catch {
      toast({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo contactar el servidor. Intenta de nuevo.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [items, loading, clear, toast, router]);

  if (!hydrated) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
        Cargando carrito...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Carrito</h1>
        {itemCount > 0 && (
          <span className="badge badge-blue">
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            Tu carrito está vacío.
          </p>
          <a href="/productos" className="btn btn-success">Ver productos</a>
        </div>
      ) : (
        <div className="carrito-grid">

          {/* ── Items ── */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  {['Producto', 'Cantidad', 'Precio unit.', 'Subtotal', ''].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: h === 'Cantidad' ? 'center' : h === '' ? 'center' : 'left',
                      color: 'var(--muted)', borderBottom: '2px solid var(--border)', fontWeight: 600,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.product_id} style={{ borderBottom: '1px solid var(--border)', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,111,250,.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                      {item.quantity >= item.stock && (
                        <div style={{ fontSize: '.72rem', color: '#d97706', marginTop: '.15rem', fontWeight: 600 }}>
                          Cantidad máxima disponible
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'var(--surface-2)', borderRadius: 8, padding: '4px 6px', border: '1px solid var(--border)' }}>
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity - 1)}
                          style={{ width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 6, background: '#1c1f3a', cursor: 'pointer', fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}
                        >−</button>
                        <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, color: 'var(--text)' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          style={{ width: 28, height: 28, border: '1px solid var(--border)', borderRadius: 6, background: item.quantity >= item.stock ? '#12142a' : '#1c1f3a', cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer', fontWeight: 700, color: item.quantity >= item.stock ? 'var(--muted)' : 'var(--text)', fontSize: '1rem' }}
                        >+</button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'left' }}>{Q(item.price)}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--primary)' }}>
                      {Q(item.price * item.quantity)}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemove(item.product_id, item.name)}
                        title="Eliminar"
                        style={{ background: 'none', border: '1px solid rgba(248,113,113,.25)', borderRadius: 6, cursor: 'pointer', color: '#f87171', fontSize: '.8rem', padding: '5px 9px', transition: 'background .15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Summary ── */}
          <div className="card carrito-summary">
            <h2 style={{ marginBottom: '1.25rem' }}>Resumen del pedido</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1rem' }}>
              {items.map(item => (
                <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.83rem', color: 'var(--muted)' }}>
                  <span>{item.name} <strong style={{ color: 'var(--text)' }}>×{item.quantity}</strong></span>
                  <span>{Q(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: 'var(--border)', margin: '.75rem 0 1rem' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', marginBottom: '1.5rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>{Q(total)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-success"
              style={{ width: '100%', justifyContent: 'center', gap: '.5rem', opacity: loading ? .8 : 1, transition: 'opacity .2s' }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                  Procesando...
                </>
              ) : 'Confirmar compra'}
            </button>

            <button
              onClick={() => {
                clear();
                toast({ type: 'info', title: 'Carrito vaciado', duration: 2000 });
              }}
              disabled={loading}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', justifyContent: 'center', marginTop: '.6rem' }}
            >
              Vaciar carrito
            </button>

            <p style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: '1rem', textAlign: 'center', lineHeight: 1.5 }}>
              Compra procesada con transacción SQL.<br />
              Si el stock no alcanza, la operación se revierte automáticamente.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
