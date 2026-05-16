'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'tienda_cart';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; product_id: number }
  | { type: 'UPDATE_QTY'; product_id: number; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'RESTORE'; items: CartItem[] };

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  hydrated: boolean;
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (product_id: number) => void;
  updateQty: (product_id: number, quantity: number) => void;
  clear: () => void;
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'RESTORE':
      return { items: action.items };
    case 'ADD': {
      const existing = state.items.find(i => i.product_id === action.item.product_id);
      if (existing) {
        const newQty = existing.quantity + 1;
        if (newQty > existing.stock) return state;
        return {
          items: state.items.map(i =>
            i.product_id === action.item.product_id ? { ...i, quantity: newQty } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.product_id !== action.product_id) };
    case 'UPDATE_QTY': {
      if (action.quantity < 1)
        return { items: state.items.filter(i => i.product_id !== action.product_id) };
      return {
        items: state.items.map(i =>
          i.product_id === action.product_id
            ? { ...i, quantity: Math.min(action.quantity, i.stock) }
            : i
        ),
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType>({
  items: [], total: 0, itemCount: 0, hydrated: false,
  add: () => {}, remove: () => {}, updateQty: () => {}, clear: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [hydrated, setHydrated] = useState(false);

  // Cargar desde localStorage una sola vez al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartState = JSON.parse(raw);
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          dispatch({ type: 'RESTORE', items: parsed.items });
        }
      }
    } catch { /* localStorage no disponible o JSON inválido */ }
    setHydrated(true);
  }, []);

  // Persistir en localStorage en cada cambio (solo después de hidratar)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* storage lleno o modo privado */ }
  }, [state, hydrated]);

  const add = useCallback((item: Omit<CartItem, 'quantity'>) => dispatch({ type: 'ADD', item }), []);
  const remove = useCallback((product_id: number) => dispatch({ type: 'REMOVE', product_id }), []);
  const updateQty = useCallback((product_id: number, quantity: number) => dispatch({ type: 'UPDATE_QTY', product_id, quantity }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, total, itemCount, hydrated, add, remove, updateQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
