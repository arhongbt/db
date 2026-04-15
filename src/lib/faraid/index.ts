/**
 * Faraid Calculator — Public API
 *
 * Usage:
 * ```ts
 * import { calculateFaraid } from '@/lib/faraid';
 *
 * const result = calculateFaraid({
 *   heirs: [
 *     { id: 'husband', count: 1 },
 *     { id: 'daughter', count: 2 },
 *     { id: 'mother', count: 1 },
 *   ],
 *   estateValue: 1000000,
 *   debts: 50000,
 *   waspiqa: 0,
 * });
 * ```
 */

export { calculateFaraid } from './engine';
export { HEIR_DEFINITIONS } from './types';
export type {
  HeirId,
  HeirInput,
  HeirDefinition,
  HeirCategory,
  FaraidInput,
  FaraidResult,
  HeirResult,
  ShareBasis,
  FaraidWarning,
  CalculationStep,
  Fraction,
} from './types';
export { formatFraction, formatPercentage, toDecimal } from './fraction';
