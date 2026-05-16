'use client';

import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface Props {
  productId: number;
  name: string;
  price: number;
  stock: number;
}

export default function AddToCartButton({ productId, name, price, stock }: Props) {
  const { add, items } = useCart();
  const { toast } = useToast();

  const inCart = items.find(i => i.product_id === productId);
  const atMax  = inCart ? inCart.quantity >= stock : false;
  const disabled = stock === 0 || atMax;

  const handleAdd = () => {
    add({ product_id: productId, name, price, stock });
    toast({
      type: 'success',
      title: 'Agregado al carrito',
      message: `${name} — Q${price.toFixed(2)}`,
      duration: 2500,
    });
  };

  if (stock === 0) {
    return (
      <span style={{
        display: 'inline-block', padding: '6px 12px', borderRadius: 6,
        fontSize: '.78rem', fontWeight: 600,
        background: '#f3f4f6', color: '#9ca3af', border: '1px solid #e5e7eb',
      }}>
        Sin stock
      </span>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      style={{
        padding: '6px 14px', borderRadius: 6, fontSize: '.8rem', fontWeight: 600,
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? '#e5e7eb' : '#4f46e5',
        color: disabled ? '#9ca3af' : '#fff',
        transition: 'background .15s, transform .1s',
      }}
      onMouseDown={e => { if (!disabled) (e.currentTarget.style.transform = 'scale(.95)'); }}
      onMouseUp={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
    >
      {atMax ? 'Máx. alcanzado' : '+ Carrito'}
    </button>
  );
}
