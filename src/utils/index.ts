import Decimal from 'decimal.js';

export function parseNumber(number: Decimal): number {
  return parseFloat(number.toFixed(2));
}
