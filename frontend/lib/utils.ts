export function formatPrice(price: number): string {
  return `Q${price.toFixed(2)}`;
}

export type StockStatus = 'Sin stock' | 'Bajo' | 'OK';

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'Sin stock';
  if (stock < 5) return 'Bajo';
  return 'OK';
}

export interface CartLine {
  price: number;
  quantity: number;
}

export function calcCartTotal(items: CartLine[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
