/**
 * Fraction arithmetic for precise Islamic inheritance calculations.
 * We avoid floating-point by keeping numerator/denominator as integers.
 */

export type Fraction = [number, number]; // [numerator, denominator]

export const ZERO: Fraction = [0, 1];
export const ONE: Fraction = [1, 1];

// Common fard fractions
export const HALF: Fraction = [1, 2];
export const QUARTER: Fraction = [1, 4];
export const EIGHTH: Fraction = [1, 8];
export const THIRD: Fraction = [1, 3];
export const TWO_THIRDS: Fraction = [2, 3];
export const SIXTH: Fraction = [1, 6];

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplify([n, d]: Fraction): Fraction {
  if (n === 0) return [0, 1];
  const g = gcd(Math.abs(n), Math.abs(d));
  const sign = d < 0 ? -1 : 1;
  return [(n / g) * sign, (d / g) * sign];
}

export function add(a: Fraction, b: Fraction): Fraction {
  const d = lcm(a[1], b[1]);
  const n = a[0] * (d / a[1]) + b[0] * (d / b[1]);
  return simplify([n, d]);
}

export function subtract(a: Fraction, b: Fraction): Fraction {
  const d = lcm(a[1], b[1]);
  const n = a[0] * (d / a[1]) - b[0] * (d / b[1]);
  return simplify([n, d]);
}

export function multiply(a: Fraction, b: Fraction): Fraction {
  return simplify([a[0] * b[0], a[1] * b[1]]);
}

export function divide(a: Fraction, b: Fraction): Fraction {
  if (b[0] === 0) throw new Error('Division by zero');
  return simplify([a[0] * b[1], a[1] * b[0]]);
}

export function toDecimal([n, d]: Fraction): number {
  return n / d;
}

export function fromNumber(n: number): Fraction {
  // Handle common fractions precisely
  const commonFractions: [number, Fraction][] = [
    [1/2, HALF], [1/3, THIRD], [2/3, TWO_THIRDS],
    [1/4, QUARTER], [1/6, SIXTH], [1/8, EIGHTH],
  ];
  for (const [val, frac] of commonFractions) {
    if (Math.abs(n - val) < 1e-10) return frac;
  }
  // Fallback: use large denominator
  const d = 10000;
  return simplify([Math.round(n * d), d]);
}

export function isZero([n]: Fraction): boolean {
  return n === 0;
}

export function isGreaterThan(a: Fraction, b: Fraction): boolean {
  return a[0] * b[1] > b[0] * a[1];
}

export function isEqual(a: Fraction, b: Fraction): boolean {
  const sa = simplify(a);
  const sb = simplify(b);
  return sa[0] === sb[0] && sa[1] === sb[1];
}

export function sumAll(fractions: Fraction[]): Fraction {
  return fractions.reduce((acc, f) => add(acc, f), ZERO);
}

export function max(a: Fraction, b: Fraction): Fraction {
  return isGreaterThan(a, b) ? a : b;
}

export function formatFraction([n, d]: Fraction): string {
  if (n === 0) return '0';
  if (d === 1) return `${n}`;
  return `${n}/${d}`;
}

export function formatPercentage(f: Fraction): string {
  return `${(toDecimal(f) * 100).toFixed(2)}%`;
}
