import { describe, it, expect } from 'vitest';
import { formatPrice, getStockStatus, calcCartTotal } from './utils';

// ── formatPrice ────────────────────────────────────────────────────────────────
describe('formatPrice', () => {
  it('formatea un precio entero con dos decimales y prefijo Q', () => {
    expect(formatPrice(100)).toBe('Q100.00');
  });

  it('formatea un precio decimal correctamente', () => {
    expect(formatPrice(2850.5)).toBe('Q2850.50');
  });

  it('formatea precio cero', () => {
    expect(formatPrice(0)).toBe('Q0.00');
  });
});

// ── getStockStatus ─────────────────────────────────────────────────────────────
describe('getStockStatus', () => {
  it('retorna "Sin stock" cuando stock es 0', () => {
    expect(getStockStatus(0)).toBe('Sin stock');
  });

  it('retorna "Bajo" cuando stock es menor a 5', () => {
    expect(getStockStatus(1)).toBe('Bajo');
    expect(getStockStatus(4)).toBe('Bajo');
  });

  it('retorna "OK" cuando stock es 5 o más', () => {
    expect(getStockStatus(5)).toBe('OK');
    expect(getStockStatus(100)).toBe('OK');
  });
});

// ── calcCartTotal ──────────────────────────────────────────────────────────────
describe('calcCartTotal', () => {
  it('retorna 0 para un carrito vacío', () => {
    expect(calcCartTotal([])).toBe(0);
  });

  it('calcula correctamente el total de un solo ítem', () => {
    expect(calcCartTotal([{ price: 185, quantity: 2 }])).toBe(370);
  });

  it('suma correctamente múltiples ítems del carrito', () => {
    const items = [
      { price: 2850, quantity: 1 },
      { price: 42,   quantity: 3 },
      { price: 220,  quantity: 2 },
    ];
    expect(calcCartTotal(items)).toBe(2850 + 126 + 440);
  });
});
