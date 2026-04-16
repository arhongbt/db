/**
 * Tests for fraction.ts — pure fraction arithmetic
 */

import { describe, it, expect } from 'vitest';
import {
  type Fraction,
  ZERO, ONE, HALF, QUARTER, EIGHTH, THIRD, TWO_THIRDS, SIXTH,
  simplify,
  add,
  subtract,
  multiply,
  divide,
  toDecimal,
  fromNumber,
  isZero,
  isGreaterThan,
  isEqual,
  sumAll,
  max,
  formatFraction,
  formatPercentage,
} from '../fraction';

describe('fraction constants', () => {
  it('ZERO is [0, 1]', () => expect(ZERO).toEqual([0, 1]));
  it('ONE is [1, 1]', () => expect(ONE).toEqual([1, 1]));
  it('HALF is [1, 2]', () => expect(HALF).toEqual([1, 2]));
  it('QUARTER is [1, 4]', () => expect(QUARTER).toEqual([1, 4]));
  it('EIGHTH is [1, 8]', () => expect(EIGHTH).toEqual([1, 8]));
  it('THIRD is [1, 3]', () => expect(THIRD).toEqual([1, 3]));
  it('TWO_THIRDS is [2, 3]', () => expect(TWO_THIRDS).toEqual([2, 3]));
  it('SIXTH is [1, 6]', () => expect(SIXTH).toEqual([1, 6]));
});

describe('simplify', () => {
  it('simplifies 2/4 to 1/2', () => expect(simplify([2, 4])).toEqual([1, 2]));
  it('simplifies 6/9 to 2/3', () => expect(simplify([6, 9])).toEqual([2, 3]));
  it('simplifies 0/5 to 0/1', () => expect(simplify([0, 5])).toEqual([0, 1]));
  it('simplifies 4/4 to 1/1', () => expect(simplify([4, 4])).toEqual([1, 1]));
  it('simplifies 3/1 to 3/1', () => expect(simplify([3, 1])).toEqual([3, 1]));
  it('simplifies 12/8 to 3/2', () => expect(simplify([12, 8])).toEqual([3, 2]));
  it('handles already-simplified 1/3', () => expect(simplify([1, 3])).toEqual([1, 3]));
  it('handles negative numerator: -2/4 → -1/2', () => expect(simplify([-2, 4])).toEqual([-1, 2]));
});

describe('add', () => {
  it('1/2 + 1/2 = 1/1', () => expect(add(HALF, HALF)).toEqual([1, 1]));
  it('1/4 + 1/4 = 1/2', () => expect(add(QUARTER, QUARTER)).toEqual([1, 2]));
  it('1/3 + 1/6 = 1/2', () => expect(add(THIRD, SIXTH)).toEqual([1, 2]));
  it('1/6 + 1/6 = 1/3', () => expect(add(SIXTH, SIXTH)).toEqual([1, 3]));
  it('0 + 1/2 = 1/2', () => expect(add(ZERO, HALF)).toEqual([1, 2]));
  it('1/2 + 0 = 1/2', () => expect(add(HALF, ZERO)).toEqual([1, 2]));
  it('2/3 + 1/3 = 1/1', () => expect(add(TWO_THIRDS, THIRD)).toEqual([1, 1]));
  it('1/4 + 1/2 = 3/4', () => expect(add(QUARTER, HALF)).toEqual([3, 4]));
  // Faraid-relevant: 1/4 + 1/2 + 1/6 = 11/12
  it('1/4 + 1/2 + 1/6 sums correctly', () => {
    const result = add(add(QUARTER, HALF), SIXTH);
    expect(toDecimal(result)).toBeCloseTo(11 / 12, 10);
  });
});

describe('subtract', () => {
  it('1/1 - 1/2 = 1/2', () => expect(subtract(ONE, HALF)).toEqual([1, 2]));
  it('1/2 - 1/4 = 1/4', () => expect(subtract(HALF, QUARTER)).toEqual([1, 4]));
  it('1/1 - 1/4 = 3/4', () => expect(subtract(ONE, QUARTER)).toEqual([3, 4]));
  it('2/3 - 1/3 = 1/3', () => expect(subtract(TWO_THIRDS, THIRD)).toEqual([1, 3]));
  it('1/2 - 1/2 = 0', () => expect(subtract(HALF, HALF)).toEqual([0, 1]));
  it('1/6 - 1/6 = 0', () => expect(subtract(SIXTH, SIXTH)).toEqual([0, 1]));
  // Umariyyatan: 1 - 1/2 = 1/2 (remainder after husband)
  it('1 - 1/2 = 1/2 (umariyyatan remainder)', () => expect(subtract(ONE, HALF)).toEqual([1, 2]));
  // Umariyyatan: 1 - 1/4 = 3/4 (remainder after wife)
  it('1 - 1/4 = 3/4 (umariyyatan remainder)', () => expect(subtract(ONE, QUARTER)).toEqual([3, 4]));
});

describe('multiply', () => {
  it('1/2 * 1/2 = 1/4', () => expect(multiply(HALF, HALF)).toEqual([1, 4]));
  it('2/3 * 3/4 = 1/2', () => expect(multiply(TWO_THIRDS, [3, 4])).toEqual([1, 2]));
  it('0 * 1/2 = 0', () => expect(multiply(ZERO, HALF)).toEqual([0, 1]));
  it('1 * 1/3 = 1/3', () => expect(multiply(ONE, THIRD)).toEqual([1, 3]));
  it('1/3 * 3/1 = 1/1', () => expect(multiply(THIRD, [3, 1])).toEqual([1, 1]));
  it('1/6 * 2/1 = 1/3', () => expect(multiply(SIXTH, [2, 1])).toEqual([1, 3]));
});

describe('divide', () => {
  it('1/2 ÷ 1/2 = 1', () => expect(divide(HALF, HALF)).toEqual([1, 1]));
  it('1/4 ÷ 1/2 = 1/2', () => expect(divide(QUARTER, HALF)).toEqual([1, 2]));
  it('2/3 ÷ 1/3 = 2', () => expect(divide(TWO_THIRDS, THIRD)).toEqual([2, 1]));
  it('1/1 ÷ 3/1 = 1/3', () => expect(divide(ONE, [3, 1])).toEqual([1, 3]));
  it('throws on division by zero', () => {
    expect(() => divide(HALF, ZERO)).toThrow('Division by zero');
  });
});

describe('toDecimal', () => {
  it('1/2 = 0.5', () => expect(toDecimal(HALF)).toBe(0.5));
  it('1/4 = 0.25', () => expect(toDecimal(QUARTER)).toBe(0.25));
  it('1/3 ≈ 0.333...', () => expect(toDecimal(THIRD)).toBeCloseTo(1 / 3, 10));
  it('2/3 ≈ 0.666...', () => expect(toDecimal(TWO_THIRDS)).toBeCloseTo(2 / 3, 10));
  it('0/1 = 0', () => expect(toDecimal(ZERO)).toBe(0));
  it('1/1 = 1', () => expect(toDecimal(ONE)).toBe(1));
  it('1/8 = 0.125', () => expect(toDecimal(EIGHTH)).toBe(0.125));
  it('1/6 ≈ 0.1666...', () => expect(toDecimal(SIXTH)).toBeCloseTo(1 / 6, 10));
});

describe('fromNumber', () => {
  it('0.5 → [1, 2]', () => expect(fromNumber(0.5)).toEqual([1, 2]));
  it('1/3 → [1, 3]', () => expect(fromNumber(1 / 3)).toEqual([1, 3]));
  it('2/3 → [2, 3]', () => expect(fromNumber(2 / 3)).toEqual([2, 3]));
  it('0.25 → [1, 4]', () => expect(fromNumber(0.25)).toEqual([1, 4]));
  it('1/6 → [1, 6]', () => expect(fromNumber(1 / 6)).toEqual([1, 6]));
  it('1/8 → [1, 8]', () => expect(fromNumber(0.125)).toEqual([1, 8]));
  it('0 → [0, 1]', () => expect(fromNumber(0)).toEqual([0, 1]));
});

describe('isZero', () => {
  it('ZERO is zero', () => expect(isZero(ZERO)).toBe(true));
  it('[0, 5] is zero', () => expect(isZero([0, 5])).toBe(true));
  it('HALF is not zero', () => expect(isZero(HALF)).toBe(false));
  it('ONE is not zero', () => expect(isZero(ONE)).toBe(false));
});

describe('isGreaterThan', () => {
  it('1/2 > 1/3', () => expect(isGreaterThan(HALF, THIRD)).toBe(true));
  it('1/3 is NOT > 1/2', () => expect(isGreaterThan(THIRD, HALF)).toBe(false));
  it('2/3 > 1/2', () => expect(isGreaterThan(TWO_THIRDS, HALF)).toBe(true));
  it('1/4 is NOT > 1/4', () => expect(isGreaterThan(QUARTER, QUARTER)).toBe(false));
  it('1/1 > 1/2', () => expect(isGreaterThan(ONE, HALF)).toBe(true));
});

describe('isEqual', () => {
  it('1/2 equals 2/4', () => expect(isEqual(HALF, [2, 4])).toBe(true));
  it('1/3 equals 2/6', () => expect(isEqual(THIRD, [2, 6])).toBe(true));
  it('1/2 does not equal 1/3', () => expect(isEqual(HALF, THIRD)).toBe(false));
  it('0/1 equals 0/5', () => expect(isEqual(ZERO, [0, 5])).toBe(true));
});

describe('sumAll', () => {
  it('empty array = 0', () => expect(sumAll([])).toEqual([0, 1]));
  it('[1/4, 1/4, 1/2] = 1', () => expect(sumAll([QUARTER, QUARTER, HALF])).toEqual([1, 1]));
  it('[1/6, 1/6, 2/3] = 1', () => expect(sumAll([SIXTH, SIXTH, TWO_THIRDS])).toEqual([1, 1]));
  it('[1/4, 1/2] = 3/4', () => {
    const result = sumAll([QUARTER, HALF]);
    expect(toDecimal(result)).toBeCloseTo(0.75, 10);
  });
  // Awl scenario: 1/2 + 1/6 + 2/3 = 4/3 > 1
  it('awl scenario: 1/2 + 1/6 + 2/3 = 4/3', () => {
    const result = sumAll([HALF, SIXTH, TWO_THIRDS]);
    expect(toDecimal(result)).toBeCloseTo(4 / 3, 10);
  });
});

describe('max', () => {
  it('max(1/2, 1/3) = 1/2', () => expect(max(HALF, THIRD)).toEqual(HALF));
  it('max(1/3, 1/2) = 1/2', () => expect(max(THIRD, HALF)).toEqual(HALF));
  it('max(1/4, 1/4) = 1/4', () => expect(max(QUARTER, QUARTER)).toEqual(QUARTER));
  it('max(0, 1/6) = 1/6', () => expect(max(ZERO, SIXTH)).toEqual(SIXTH));
});

describe('formatFraction', () => {
  it('formats 1/2 as "1/2"', () => expect(formatFraction([1, 2])).toBe('1/2'));
  it('formats 0/1 as "0"', () => expect(formatFraction([0, 1])).toBe('0'));
  it('formats 1/1 as "1"', () => expect(formatFraction([1, 1])).toBe('1'));
  it('formats 2/3 as "2/3"', () => expect(formatFraction([2, 3])).toBe('2/3'));
  it('formats 3/13 as "3/13"', () => expect(formatFraction([3, 13])).toBe('3/13'));
});

describe('formatPercentage', () => {
  it('formats 1/2 as "50.00%"', () => expect(formatPercentage(HALF)).toBe('50.00%'));
  it('formats 1/4 as "25.00%"', () => expect(formatPercentage(QUARTER)).toBe('25.00%'));
  it('formats 1/3 as "33.33%"', () => expect(formatPercentage(THIRD)).toBe('33.33%'));
  it('formats 0 as "0.00%"', () => expect(formatPercentage(ZERO)).toBe('0.00%'));
});
