/**
 * Faraid Engine — Main orchestrator
 * Coordinates: deductions → hajb → fard → asaba → awl/radd
 *
 * This is the single entry point for Islamic inheritance calculations.
 * Pure TypeScript — no React, no side effects.
 */

import type {
  HeirInput, FaraidInput, FaraidResult, HeirResult,
  ShareBasis, FaraidWarning, CalculationStep, HeirId,
} from './types';
import { HEIR_DEFINITIONS } from './types';
import { type Fraction, ZERO, ONE, toDecimal, sumAll, add, subtract, simplify, formatFraction, isZero } from './fraction';
import { calculateHajb, getActiveHeirs } from './hajb';
import { calculateFard, isUmariyyatan, type FardAssignment } from './fard';
import { calculateAsaba } from './asaba';
import { applyAwl, applyRadd } from './awl-radd';

/**
 * Calculate Islamic inheritance distribution.
 *
 * @param input - Estate value, debts, wasiyyah, and list of heirs
 * @returns Complete distribution with amounts, notes, and audit trail
 */
export function calculateFaraid(input: FaraidInput): FaraidResult {
  const warnings: FaraidWarning[] = [];
  const steps: CalculationStep[] = [];

  // ─── Step 0: Validate input ────────────────────────────
  const validHeirs = input.heirs.filter(h => h.count > 0);
  if (validHeirs.length === 0) {
    return emptyResult(input, [{
      type: 'no_heirs',
      messageSv: 'Inga arvingar har angetts.',
      messageEn: 'No heirs have been specified.',
    }]);
  }

  // ─── Step 1: Deductions ────────────────────────────────
  let wasiyyah = input.waspiqa;
  const maxWasiyyah = input.estateValue * (1 / 3);
  if (wasiyyah > maxWasiyyah) {
    wasiyyah = maxWasiyyah;
    warnings.push({
      type: 'wasiyyah_exceeded',
      messageSv: `Testamente begränsat till 1/3 av kvarlåtenskapen (${Math.round(maxWasiyyah)} kr).`,
      messageEn: `Bequest limited to 1/3 of estate (${Math.round(maxWasiyyah)} SEK).`,
    });
  }

  const inheritableEstate = Math.max(0, input.estateValue - input.debts - wasiyyah);
  steps.push({
    phase: 'deductions',
    descriptionSv: `Kvarlåtenskap: ${input.estateValue} kr − ${input.debts} kr (skulder) − ${Math.round(wasiyyah)} kr (testamente) = ${Math.round(inheritableEstate)} kr`,
    descriptionEn: `Estate: ${input.estateValue} SEK − ${input.debts} SEK (debts) − ${Math.round(wasiyyah)} SEK (bequest) = ${Math.round(inheritableEstate)} SEK`,
  });

  if (inheritableEstate === 0) {
    return emptyResult(input, [{
      type: 'zero_estate',
      messageSv: 'Kvarlåtenskapen är noll efter avdrag för skulder och testamente.',
      messageEn: 'Estate is zero after deducting debts and bequest.',
    }]);
  }

  // ─── Step 2: Hajb (exclusion) ──────────────────────────
  const hajbMap = calculateHajb(validHeirs);
  const activeHeirs = getActiveHeirs(validHeirs, hajbMap);

  const excludedHeirs = validHeirs.filter(h => {
    const status = hajbMap.get(h.id);
    return status?.excluded;
  });

  for (const h of excludedHeirs) {
    const status = hajbMap.get(h.id)!;
    const def = HEIR_DEFINITIONS[h.id];
    const excluderDef = status.excludedBy ? HEIR_DEFINITIONS[status.excludedBy] : null;
    steps.push({
      phase: 'hajb',
      descriptionSv: `${def.swedish} utesluten av ${excluderDef?.swedish ?? 'okänd'}`,
      descriptionEn: `${def.english} excluded by ${excluderDef?.english ?? 'unknown'}`,
    });
  }

  // ─── Step 3: Fard (fixed shares) ───────────────────────
  const fardAssignments = calculateFard(activeHeirs, validHeirs);

  for (const f of fardAssignments) {
    const def = HEIR_DEFINITIONS[f.id];
    steps.push({
      phase: 'fard',
      descriptionSv: `${def.swedish}: ${formatFraction(f.share)} (fard)${f.isAsaba ? ' + asaba' : ''}`,
      descriptionEn: `${def.english}: ${formatFraction(f.share)} (fard)${f.isAsaba ? ' + asaba' : ''}`,
    });
  }

  // ─── Step 4: Umariyyatan check ─────────────────────────
  // Special case: husband/wife + father + mother only
  // Mother gets 1/3 of REMAINDER, not 1/3 of total
  let adjustedFard = fardAssignments;
  if (isUmariyyatan(activeHeirs)) {
    adjustedFard = handleUmariyyatan(fardAssignments, activeHeirs);
    steps.push({
      phase: 'fard',
      descriptionSv: 'العمريتان — mors andel justerad till 1/3 av återstoden (efter make/maka)',
      descriptionEn: 'Umariyyatan — mother\'s share adjusted to 1/3 of remainder (after spouse)',
    });
  }

  // ─── Step 5: Asaba (residuary) ─────────────────────────
  const totalFard = sumAll(adjustedFard.map(a => a.share));
  const { assignments: asabaAssignments, remainder: asabaRemainder } = calculateAsaba(activeHeirs, adjustedFard, validHeirs);

  for (const a of asabaAssignments) {
    const def = HEIR_DEFINITIONS[a.id];
    steps.push({
      phase: 'asaba',
      descriptionSv: `${def.swedish}: ${formatFraction(a.share)} (${a.type})`,
      descriptionEn: `${def.english}: ${formatFraction(a.share)} (${a.type})`,
    });
  }

  // ─── Step 6: Merge fard + asaba ────────────────────────
  const mergedMap = new Map<HeirId, { share: Fraction; count: number; basis: ShareBasis; notes: { sv: string; en: string }[] }>();

  for (const f of adjustedFard) {
    const existing = mergedMap.get(f.id);
    if (existing) {
      existing.share = add(existing.share, f.share);
      existing.notes.push(...f.notes);
    } else {
      mergedMap.set(f.id, {
        share: f.share,
        count: f.count,
        basis: f.isAsaba ? 'fard+asaba' : 'fard',
        notes: [...f.notes],
      });
    }
  }

  for (const a of asabaAssignments) {
    const existing = mergedMap.get(a.id);
    if (existing) {
      existing.share = add(existing.share, a.share);
      existing.basis = 'fard+asaba';
      existing.notes.push(...a.notes);
    } else {
      mergedMap.set(a.id, {
        share: a.share,
        count: a.count,
        basis: 'asaba',
        notes: [...a.notes],
      });
    }
  }

  // Convert to array for awl/radd processing
  let shareEntries = Array.from(mergedMap.entries()).map(([id, data]) => ({
    id,
    count: data.count,
    share: data.share,
    basis: data.basis,
    notes: data.notes,
  }));

  // ─── Step 7: 'Awl or Radd ─────────────────────────────
  const totalShares = sumAll(shareEntries.map(s => s.share));
  let awlApplied = false;
  let raddApplied = false;
  let awlFactor: [number, number] | undefined;

  if (toDecimal(totalShares) > 1.0001) {
    // 'Awl needed
    const awlResult = applyAwl(shareEntries.map(s => ({ id: s.id, count: s.count, share: s.share })));
    if (awlResult.applied) {
      awlApplied = true;
      awlFactor = [awlResult.originalDenominator, awlResult.newDenominator];
      // Update shares
      for (const adj of awlResult.adjustedShares) {
        const entry = shareEntries.find(s => s.id === adj.id);
        if (entry) entry.share = adj.share;
      }
      steps.push({
        phase: 'awl',
        descriptionSv: `عول tillämpat — nämnaren ökad från ${awlResult.originalDenominator} till ${awlResult.newDenominator}`,
        descriptionEn: `'Awl applied — denominator increased from ${awlResult.originalDenominator} to ${awlResult.newDenominator}`,
      });
      warnings.push({
        type: 'awl',
        messageSv: 'De fasta andelarna överstiger kvarlåtenskapen. Alla andelar har minskats proportionellt (عول).',
        messageEn: 'Fixed shares exceed the estate. All shares have been proportionally reduced (\'awl).',
      });
    }
  } else if (toDecimal(totalShares) < 0.9999 && asabaAssignments.length === 0) {
    // Radd needed (surplus with no asaba heir)
    const surplus = subtract(ONE, totalShares);
    const raddResult = applyRadd(
      shareEntries.map(s => ({ id: s.id, count: s.count, share: s.share })),
      surplus,
    );
    if (raddResult.applied) {
      raddApplied = true;
      for (const adj of raddResult.adjustedShares) {
        const entry = shareEntries.find(s => s.id === adj.id);
        if (entry) {
          entry.share = adj.share;
          entry.basis = 'radd';
        }
      }
      steps.push({
        phase: 'radd',
        descriptionSv: `رد tillämpat — överskott omfördelat till fard-arvingar (ej make/maka)`,
        descriptionEn: `Radd applied — surplus redistributed to fard heirs (except spouse)`,
      });
      warnings.push({
        type: 'radd',
        messageSv: 'Det fanns överskott efter fasta andelar. Överskottet har omfördelats (رد).',
        messageEn: 'There was surplus after fixed shares. The surplus has been redistributed (radd).',
      });
    }
  }

  // ─── Step 8: Build final results ───────────────────────
  const heirResults: HeirResult[] = [];

  // Add active heirs with shares
  for (const entry of shareEntries) {
    const percentage = toDecimal(entry.share) * 100;
    const totalAmount = toDecimal(entry.share) * inheritableEstate;
    heirResults.push({
      id: entry.id,
      count: entry.count,
      shareFraction: simplify(entry.share),
      sharePercentage: Math.round(percentage * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      perPersonAmount: Math.round((totalAmount / entry.count) * 100) / 100,
      basis: entry.basis,
      notes: entry.notes.map(n => n.sv), // Will be resolved by UI based on language
    });
  }

  // Add excluded heirs
  for (const h of excludedHeirs) {
    const status = hajbMap.get(h.id)!;
    heirResults.push({
      id: h.id,
      count: h.count,
      shareFraction: [0, 1],
      sharePercentage: 0,
      totalAmount: 0,
      perPersonAmount: 0,
      basis: 'excluded',
      excludedBy: status.excludedBy ?? undefined,
      notes: [],
    });
  }

  const totalDistributed = heirResults
    .filter(h => h.basis !== 'excluded')
    .reduce((sum, h) => sum + h.totalAmount, 0);

  return {
    heirs: heirResults,
    inheritableEstate: Math.round(inheritableEstate * 100) / 100,
    debtsPaid: input.debts,
    wasiyyahPaid: Math.round(wasiyyah * 100) / 100,
    totalDistributed: Math.round(totalDistributed * 100) / 100,
    remainder: Math.round((inheritableEstate - totalDistributed) * 100) / 100,
    awlApplied,
    awlFactor,
    raddApplied,
    warnings,
    steps,
  };
}

// ─── Helpers ────────────────────────────────────────────────

function emptyResult(input: FaraidInput, warnings: FaraidWarning[]): FaraidResult {
  return {
    heirs: [],
    inheritableEstate: 0,
    debtsPaid: input.debts,
    wasiyyahPaid: input.waspiqa,
    totalDistributed: 0,
    remainder: 0,
    awlApplied: false,
    raddApplied: false,
    warnings,
    steps: [],
  };
}

/**
 * Handle Umariyyatan (العمريتان) special case.
 * When only spouse + father + mother exist, mother gets 1/3 of REMAINDER
 * (after spouse's share), not 1/3 of total estate.
 *
 * This prevents mother from getting more than father when combined with spouse.
 */
function handleUmariyyatan(fardAssignments: FardAssignment[], activeHeirs: HeirInput[]): FardAssignment[] {
  const spouseAssignment = fardAssignments.find(a => a.id === 'husband' || a.id === 'wife');
  const motherAssignment = fardAssignments.find(a => a.id === 'mother');

  if (!spouseAssignment || !motherAssignment) return fardAssignments;

  // Mother gets 1/3 of remainder after spouse
  const remainderAfterSpouse = subtract(ONE, spouseAssignment.share);
  const motherShare: Fraction = [remainderAfterSpouse[0], remainderAfterSpouse[1] * 3];
  const simplifiedMother = simplify(motherShare);

  return fardAssignments.map(a => {
    if (a.id === 'mother') {
      return {
        ...a,
        share: simplifiedMother,
        perPerson: simplifiedMother,
        notes: [{
          sv: `1/3 av återstoden efter ${spouseAssignment.id === 'husband' ? 'make' : 'fru'} (العمريتان)`,
          en: `1/3 of remainder after ${spouseAssignment.id === 'husband' ? 'husband' : 'wife'} (Umariyyatan)`,
        }],
      };
    }
    return a;
  });
}

// Re-export for convenience
export { HEIR_DEFINITIONS } from './types';
export type { FaraidInput, FaraidResult, HeirResult, HeirInput, HeirId } from './types';
