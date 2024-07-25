import Decimal from 'decimal.js';

export function add(a: number, b: number): number {
  const dA = new Decimal(a);
  const dB = new Decimal(b);
  return parseFloat(dA.plus(dB).toFixed(2));
}

export function subtract(a: number, b: number): number {
  const dA = new Decimal(a);
  const dB = new Decimal(b);
  return parseFloat(dA.minus(dB).toFixed(2));
}
