/**
 * Tests for the Faraid engine — calculateFaraid()
 *
 * Covers:
 * 1. All test cases from test-cases.ts (run via forEach)
 * 2. Edge cases: empty heirs, zero estate, wasiyyah cap, totals, single heir
 */

import { describe, it, expect } from 'vitest';
import { calculateFaraid } from '../engine';
import type { FaraidInput } from '../types';

// ─── Inline test cases (mirrors test-cases.ts) ──────────────────────────────
// We replicate them here as typed objects so Vitest owns the lifecycle.

interface TestCase {
  name: string;
  input: FaraidInput;
  expected: {
    awl?: boolean;
    radd?: boolean;
    shares: Record<string, string>; // heirId → "n/d" fraction string
  };
}

const TEST_CASES: TestCase[] = [
  {
    name: 'Father only (pure asaba)',
    input: {
      heirs: [{ id: 'father', count: 1 }],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    },
    expected: { shares: { father: '1/1' } },
  },
  {
    name: '2 sons only',
    input: {
      heirs: [{ id: 'son', count: 2 }],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    },
    expected: { shares: { son: '1/1' } },
  },
  {
    name: 'Husband + 1 daughter',
    input: {
      heirs: [
        { id: 'husband', count: 1 },
        { id: 'daughter', count: 1 },
      ],
      estateValue: 400000,
      debts: 0,
      waspiqa: 0,
    },
    expected: {
      radd: true,
      shares: { husband: '1/4', daughter: '3/4' },
    },
  },
  {
    name: "'Awl case: Husband + 2 daughters + mother",
    input: {
      heirs: [
        { id: 'husband', count: 1 },
        { id: 'daughter', count: 2 },
        { id: 'mother', count: 1 },
      ],
      estateValue: 1300000,
      debts: 0,
      waspiqa: 0,
    },
    expected: {
      awl: true,
      shares: { husband: '3/13', daughter: '8/13', mother: '2/13' },
    },
  },
  {
    name: "'Awl case: Husband + mother + 2 full sisters",
    input: {
      heirs: [
        { id: 'husband', count: 1 },
        { id: 'mother', count: 1 },
        { id: 'fullSister', count: 2 },
      ],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    },
    expected: {
      awl: true,
      // engine simplifies 4/8 → 1/2
      shares: { husband: '3/8', mother: '1/8', fullSister: '1/2' },
    },
  },
  {
    name: 'Umariyyatan: Husband + father + mother',
    input: {
      heirs: [
        { id: 'husband', count: 1 },
        { id: 'father', count: 1 },
        { id: 'mother', count: 1 },
      ],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    },
    expected: {
      shares: { husband: '1/2', mother: '1/6', father: '1/3' },
    },
  },
  {
    name: 'Umariyyatan: Wife + father + mother',
    input: {
      heirs: [
        { id: 'wife', count: 1 },
        { id: 'father', count: 1 },
        { id: 'mother', count: 1 },
      ],
      estateValue: 400000,
      debts: 0,
      waspiqa: 0,
    },
    expected: {
      shares: { wife: '1/4', mother: '1/4', father: '1/2' },
    },
  },
  {
    name: 'Muqasama: Grandfather + 1 full brother',
    input: {
      heirs: [
        { id: 'grandfather', count: 1 },
        { id: 'fullBrother', count: 1 },
      ],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    },
    expected: {
      shares: { grandfather: '1/2', fullBrother: '1/2' },
    },
  },
  {
    name: 'Radd: Mother + 1 daughter only',
    input: {
      heirs: [
        { id: 'mother', count: 1 },
        { id: 'daughter', count: 1 },
      ],
      estateValue: 400000,
      debts: 0,
      waspiqa: 0,
    },
    expected: {
      radd: true,
      shares: { mother: '1/4', daughter: '3/4' },
    },
  },
  {
    name: 'With debts: 2 sons, 100k debts',
    input: {
      heirs: [{ id: 'son', count: 2 }],
      estateValue: 500000,
      debts: 100000,
      waspiqa: 0,
    },
    expected: {
      shares: { son: '1/1' },
    },
  },
];

// ─── Helper: format fraction as "n/d" string ─────────────────────────────────
function fractionStr([n, d]: [number, number]): string {
  return `${n}/${d}`;
}

// ─── 1. Run all test cases ────────────────────────────────────────────────────

describe('calculateFaraid — all test cases', () => {
  TEST_CASES.forEach((tc) => {
    describe(tc.name, () => {
      const result = calculateFaraid(tc.input);

      if (tc.expected.awl !== undefined) {
        it(`awlApplied = ${tc.expected.awl}`, () => {
          expect(result.awlApplied).toBe(tc.expected.awl);
        });
      }

      if (tc.expected.radd !== undefined) {
        it(`raddApplied = ${tc.expected.radd}`, () => {
          expect(result.raddApplied).toBe(tc.expected.radd);
        });
      }

      // Check each expected heir share
      Object.entries(tc.expected.shares).forEach(([heirId, expectedFraction]) => {
        it(`${heirId} share = ${expectedFraction}`, () => {
          const heir = result.heirs.find((h) => h.id === heirId);
          expect(heir, `heir "${heirId}" missing from result`).toBeDefined();
          if (!heir) return;
          const actual = fractionStr(heir.shareFraction);
          expect(actual).toBe(expectedFraction);
        });
      });

      it('share percentages sum to ~100%', () => {
        const activeHeirs = result.heirs.filter((h) => h.basis !== 'excluded');
        if (activeHeirs.length === 0) return;
        const total = activeHeirs.reduce((sum, h) => sum + h.sharePercentage, 0);
        expect(total).toBeGreaterThan(99.0);
        expect(total).toBeLessThan(101.0);
      });
    });
  });
});

// ─── 2. Edge cases ────────────────────────────────────────────────────────────

describe('calculateFaraid — edge cases', () => {
  it('empty heirs array → no_heirs warning, empty result', () => {
    const result = calculateFaraid({
      heirs: [],
      estateValue: 100000,
      debts: 0,
      waspiqa: 0,
    });
    expect(result.heirs).toHaveLength(0);
    expect(result.totalDistributed).toBe(0);
    expect(result.inheritableEstate).toBe(0);
    expect(result.warnings.some((w) => w.type === 'no_heirs')).toBe(true);
  });

  it('heirs with count=0 only → treated as empty', () => {
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 0 }],
      estateValue: 100000,
      debts: 0,
      waspiqa: 0,
    });
    expect(result.heirs).toHaveLength(0);
    expect(result.warnings.some((w) => w.type === 'no_heirs')).toBe(true);
  });

  it('estate fully consumed by debts → zero_estate warning', () => {
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue: 100000,
      debts: 100000,
      waspiqa: 0,
    });
    expect(result.inheritableEstate).toBe(0);
    expect(result.totalDistributed).toBe(0);
    expect(result.warnings.some((w) => w.type === 'zero_estate')).toBe(true);
  });

  it('estate fully consumed by debts + wasiyyah → zero_estate warning', () => {
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue: 90000,
      debts: 60000,
      waspiqa: 30000,
    });
    expect(result.inheritableEstate).toBe(0);
    expect(result.warnings.some((w) => w.type === 'zero_estate')).toBe(true);
  });

  it('wasiyyah capped at 1/3: overshooting wasiyyah triggers warning', () => {
    const estateValue = 300000;
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue,
      debts: 0,
      waspiqa: 200000, // 2/3 of estate — should be capped to 100k
    });
    expect(result.wasiyyahPaid).toBe(100000); // 1/3 of 300k
    expect(result.warnings.some((w) => w.type === 'wasiyyah_exceeded')).toBe(true);
  });

  it('wasiyyah exactly at 1/3 is not capped', () => {
    const estateValue = 300000;
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue,
      debts: 0,
      waspiqa: 100000, // exactly 1/3
    });
    expect(result.wasiyyahPaid).toBe(100000);
    expect(result.warnings.some((w) => w.type === 'wasiyyah_exceeded')).toBe(false);
  });

  it('single heir (son only) gets entire estate as asaba', () => {
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    });
    expect(result.heirs).toHaveLength(1);
    const son = result.heirs[0];
    expect(son.id).toBe('son');
    expect(fractionStr(son.shareFraction)).toBe('1/1');
    expect(son.sharePercentage).toBeCloseTo(100, 1);
    expect(son.totalAmount).toBe(600000);
    expect(son.basis).toBe('asaba');
  });

  it('totalDistributed equals inheritableEstate (no remainder lost)', () => {
    const result = calculateFaraid({
      heirs: [
        { id: 'husband', count: 1 },
        { id: 'daughter', count: 2 },
        { id: 'mother', count: 1 },
      ],
      estateValue: 1300000,
      debts: 0,
      waspiqa: 0,
    });
    expect(Math.abs(result.totalDistributed - result.inheritableEstate)).toBeLessThan(1);
  });

  it('debtsPaid is reported correctly', () => {
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue: 500000,
      debts: 100000,
      waspiqa: 0,
    });
    expect(result.debtsPaid).toBe(100000);
    expect(result.inheritableEstate).toBe(400000);
  });

  it('inheritableEstate = estateValue - debts - wasiyyah', () => {
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue: 600000,
      debts: 50000,
      waspiqa: 50000,
    });
    expect(result.inheritableEstate).toBe(500000);
  });

  it('result includes steps array (audit trail)', () => {
    const result = calculateFaraid({
      heirs: [{ id: 'son', count: 1 }],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    });
    expect(result.steps.length).toBeGreaterThan(0);
  });
});

// ─── 3. Hajb (exclusion) tests ────────────────────────────────────────────────

describe('calculateFaraid — hajb (heir exclusion)', () => {
  it('son excludes fullBrother (hajb hirman)', () => {
    const result = calculateFaraid({
      heirs: [
        { id: 'son', count: 1 },
        { id: 'fullBrother', count: 1 },
      ],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    });
    const brother = result.heirs.find((h) => h.id === 'fullBrother');
    expect(brother, 'fullBrother missing from result').toBeDefined();
    if (!brother) return;
    expect(brother.basis).toBe('excluded');
    expect(brother.excludedBy).toBe('son');
  });

  it('father excludes grandfather (hajb hirman)', () => {
    const result = calculateFaraid({
      heirs: [
        { id: 'father', count: 1 },
        { id: 'grandfather', count: 1 },
      ],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    });
    const grandfather = result.heirs.find((h) => h.id === 'grandfather');
    expect(grandfather, 'grandfather missing from result').toBeDefined();
    if (!grandfather) return;
    expect(grandfather.basis).toBe('excluded');
    expect(grandfather.excludedBy).toBe('father');
  });

  it('excluded heirs receive zero amount', () => {
    const result = calculateFaraid({
      heirs: [
        { id: 'son', count: 1 },
        { id: 'fullBrother', count: 1 },
      ],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    });
    const brother = result.heirs.find((h) => h.id === 'fullBrother');
    expect(brother?.totalAmount).toBe(0);
    expect(brother?.sharePercentage).toBe(0);
  });
});
