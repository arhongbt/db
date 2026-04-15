/**
 * 'Awl (عول) and Radd (رد) — Special case handlers
 *
 * 'Awl: When total fard shares exceed 1 (the estate), all shares are
 *       proportionally reduced. The denominator increases.
 *       Example: shares sum to 7/6 → denominator goes from 6 to 7.
 *
 * Radd: When total fard shares are less than 1 and no asaba heir exists,
 *       the surplus is redistributed to fard heirs (EXCEPT spouse).
 *       Saudi/contemporary position: radd is applied (no functioning Bayt al-Mal).
 */

import type { Fraction } from './fraction';
import { sumAll, toDecimal, subtract, ONE, ZERO, multiply, add, isZero, simplify } from './fraction';
import type { HeirId } from './types';

interface ShareEntry {
  id: HeirId;
  count: number;
  share: Fraction;
}

// ─── 'AWL (عول) ────────────────────────────────────────────

export interface AwlResult {
  applied: boolean;
  originalDenominator: number;
  newDenominator: number;
  adjustedShares: ShareEntry[];
}

/**
 * Apply 'awl if total shares exceed 1.
 * All shares are proportionally reduced by the same factor.
 *
 * Method: Find common denominator, then increase it to match the sum of numerators.
 */
export function applyAwl(shares: ShareEntry[]): AwlResult {
  const total = sumAll(shares.map(s => s.share));

  if (toDecimal(total) <= 1.0001) {
    // No awl needed
    return {
      applied: false,
      originalDenominator: total[1],
      newDenominator: total[1],
      adjustedShares: shares,
    };
  }

  // Find LCM of all denominators to get common base
  let commonDenom = 1;
  for (const s of shares) {
    commonDenom = lcm(commonDenom, s.share[1]);
  }

  // Convert all to common denominator
  const numerators = shares.map(s => ({
    ...s,
    numerator: s.share[0] * (commonDenom / s.share[1]),
  }));

  const totalNumerator = numerators.reduce((sum, n) => sum + n.numerator, 0);

  // 'Awl: the new denominator becomes the total of numerators
  // Each share is now: numerator / totalNumerator
  const adjustedShares: ShareEntry[] = numerators.map(n => ({
    id: n.id,
    count: n.count,
    share: simplify([n.numerator, totalNumerator]),
  }));

  return {
    applied: true,
    originalDenominator: commonDenom,
    newDenominator: totalNumerator,
    adjustedShares,
  };
}

// ─── RADD (رد) ─────────────────────────────────────────────

export interface RaddResult {
  applied: boolean;
  adjustedShares: ShareEntry[];
  surplus: Fraction;
}

/**
 * Apply radd — redistribute surplus to fard heirs EXCEPT spouse.
 *
 * Saudi/contemporary ruling: radd is applied because there is no
 * functioning Bayt al-Mal. All four contemporary schools agree on this.
 *
 * Method:
 * 1. Calculate surplus (1 - total shares)
 * 2. Identify eligible heirs (all fard heirs EXCEPT husband/wife)
 * 3. Distribute surplus proportionally based on their original shares
 */
export function applyRadd(shares: ShareEntry[], remainder: Fraction): RaddResult {
  if (isZero(remainder) || toDecimal(remainder) <= 0.0001) {
    return { applied: false, adjustedShares: shares, surplus: ZERO };
  }

  // Spouse is excluded from radd
  const spouseIds: HeirId[] = ['husband', 'wife'];
  const eligibleForRadd = shares.filter(s => !spouseIds.includes(s.id));
  const spouseShares = shares.filter(s => spouseIds.includes(s.id));

  if (eligibleForRadd.length === 0) {
    // Only spouse — no radd possible (remainder goes nowhere in practice)
    return { applied: false, adjustedShares: shares, surplus: remainder };
  }

  // Sum of eligible shares
  const eligibleTotal = sumAll(eligibleForRadd.map(s => s.share));

  if (isZero(eligibleTotal)) {
    return { applied: false, adjustedShares: shares, surplus: remainder };
  }

  // Each eligible heir gets: original_share + (original_share / eligible_total) * remainder
  const adjustedEligible: ShareEntry[] = eligibleForRadd.map(s => {
    // proportion = s.share / eligibleTotal
    const proportion: Fraction = [s.share[0] * eligibleTotal[1], s.share[1] * eligibleTotal[0]];
    const raddBonus = multiply(remainder, simplify(proportion));
    return {
      id: s.id,
      count: s.count,
      share: add(s.share, raddBonus),
    };
  });

  return {
    applied: true,
    adjustedShares: [...spouseShares, ...adjustedEligible],
    surplus: ZERO,
  };
}

// ─── Helper ────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}
