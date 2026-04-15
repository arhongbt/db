/**
 * Asaba (عصبة) — Residuary Heir Calculator
 * Saudi/Hanbali system (jumhur positions)
 *
 * Three types of asaba:
 * 1. Asaba bi-nafsih (عصبة بالنفس) — male residuary by himself
 * 2. Asaba bi-ghayrih (عصبة بالغير) — female becomes residuary through male
 * 3. Asaba ma'a al-ghayr (عصبة مع الغير) — sisters become residuary with daughters
 *
 * Hadith: "ألحقوا الفرائض بأهلها فما بقي فلأولى رجل ذكر"
 * "Give the prescribed shares to those entitled, and what remains goes to the nearest male."
 */

import type { HeirId, HeirInput } from './types';
import type { FardAssignment } from './fard';
import { type Fraction, ZERO, SIXTH, THIRD, add, subtract, ONE, toDecimal, isGreaterThan, multiply, sumAll, max, isZero } from './fraction';
import { getCount, hasDescendant, hasMaleDescendant } from './hajb';

export interface AsabaAssignment {
  id: HeirId;
  count: number;
  share: Fraction;        // Total share for this group
  perPerson: Fraction;
  type: 'bi-nafsih' | 'bi-ghayrih' | 'ma-al-ghayr' | 'muqasama';
  notes: { sv: string; en: string }[];
}

/**
 * Calculate asaba (residuary) shares.
 *
 * @param activeHeirs - Heirs after hajb
 * @param fardAssignments - Already calculated fard shares
 * @param allHeirs - All original heirs
 * @returns Asaba assignments + remaining fraction
 */
export function calculateAsaba(
  activeHeirs: HeirInput[],
  fardAssignments: FardAssignment[],
  allHeirs: HeirInput[]
): { assignments: AsabaAssignment[]; remainder: Fraction } {
  const assignments: AsabaAssignment[] = [];
  const active = new Set(activeHeirs.filter(h => h.count > 0).map(h => h.id));
  const isActive = (id: HeirId) => active.has(id);
  const count = (id: HeirId) => getCount(activeHeirs, id);

  // Calculate total fard shares
  const totalFard = sumAll(fardAssignments.map(a => a.share));
  let remainder = subtract(ONE, totalFard);

  // If remainder is zero or negative, no asaba distribution
  if (toDecimal(remainder) <= 0) {
    return { assignments, remainder: ZERO };
  }

  // ─── Priority order for asaba bi-nafsih ─────────────────
  // 1. Son (ابن)
  // 2. Son's son (ابن ابن)
  // 3. Father (أب) — if not already assigned fard
  // 4. Grandfather (جد) — with muqasama if siblings exist
  // 5. Full brother (أخ شقيق)
  // 6. Paternal half-brother (أخ لأب)
  // 7. Son of full brother (ابن أخ شقيق) — not in our heir list, skipped
  // 8. Full uncle (عم) — not in our heir list, skipped

  // ─── SONS + DAUGHTERS (asaba bi-ghayrih) ────────────────
  if (isActive('son')) {
    const sons = count('son');
    const daughters = isActive('daughter') ? count('daughter') : 0;

    if (daughters > 0) {
      // Sons + daughters: male gets 2x female share
      // Total "shares": sons*2 + daughters*1
      const totalParts = sons * 2 + daughters;
      const sonShare: Fraction = [sons * 2, totalParts];
      const daughterShare: Fraction = [daughters, totalParts];

      assignments.push({
        id: 'son',
        count: sons,
        share: multiply(remainder, sonShare),
        perPerson: multiply(remainder, [2, totalParts]),
        type: 'bi-nafsih',
        notes: [{ sv: `Rest — för pojken som för 2 flickor (النساء 4:11)`, en: `Remainder — male gets double the female share (An-Nisa 4:11)` }],
      });
      assignments.push({
        id: 'daughter',
        count: daughters,
        share: multiply(remainder, daughterShare),
        perPerson: multiply(remainder, [1, totalParts]),
        type: 'bi-ghayrih',
        notes: [{ sv: `Asaba med bror — 1 andel per dotter (النساء 4:11)`, en: `Asaba with brother — 1 share per daughter (An-Nisa 4:11)` }],
      });
    } else {
      // Sons only — split equally
      assignments.push({
        id: 'son',
        count: sons,
        share: remainder,
        perPerson: [remainder[0], remainder[1] * sons],
        type: 'bi-nafsih',
        notes: [{ sv: `Rest delat lika på ${sons} son(er)`, en: `Remainder shared equally among ${sons} son(s)` }],
      });
    }
    return { assignments, remainder: ZERO };
  }

  // ─── SON'S SONS + SON'S DAUGHTERS ──────────────────────
  if (isActive('sonsSon')) {
    const grandsons = count('sonsSon');
    const granddaughters = isActive('sonsDaughter') ? count('sonsDaughter') : 0;

    if (granddaughters > 0) {
      const totalParts = grandsons * 2 + granddaughters;
      assignments.push({
        id: 'sonsSon',
        count: grandsons,
        share: multiply(remainder, [grandsons * 2, totalParts]),
        perPerson: multiply(remainder, [2, totalParts]),
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest — sonsons som asaba', en: "Remainder — son's sons as asaba" }],
      });
      assignments.push({
        id: 'sonsDaughter',
        count: granddaughters,
        share: multiply(remainder, [granddaughters, totalParts]),
        perPerson: multiply(remainder, [1, totalParts]),
        type: 'bi-ghayrih',
        notes: [{ sv: 'Asaba med sonsons', en: "Asaba with son's sons" }],
      });
    } else {
      assignments.push({
        id: 'sonsSon',
        count: grandsons,
        share: remainder,
        perPerson: [remainder[0], remainder[1] * grandsons],
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest — sonsons', en: "Remainder — son's sons" }],
      });
    }
    return { assignments, remainder: ZERO };
  }

  // ─── FATHER as pure asaba ──────────────────────────────
  if (isActive('father')) {
    const fatherFard = fardAssignments.find(a => a.id === 'father');
    if (!fatherFard) {
      // Father gets all remainder (no children → pure asaba)
      assignments.push({
        id: 'father',
        count: 1,
        share: remainder,
        perPerson: remainder,
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest — far som asaba', en: 'Remainder — father as asaba' }],
      });
      return { assignments, remainder: ZERO };
    } else if (fatherFard.isAsaba) {
      // Father already has 1/6 fard, takes remainder too
      assignments.push({
        id: 'father',
        count: 1,
        share: remainder,
        perPerson: remainder,
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest utöver 1/6 — far som asaba', en: 'Remainder beyond 1/6 — father as asaba' }],
      });
      return { assignments, remainder: ZERO };
    }
  }

  // ─── GRANDFATHER (muqasama with siblings) ──────────────
  if (isActive('grandfather')) {
    const grandfatherFard = fardAssignments.find(a => a.id === 'grandfather');

    // Check if siblings exist for muqasama
    const fullBros = isActive('fullBrother') ? count('fullBrother') : 0;
    const fullSis = isActive('fullSister') ? count('fullSister') : 0;
    const patBros = isActive('paternalBrother') ? count('paternalBrother') : 0;
    const patSis = isActive('paternalSister') ? count('paternalSister') : 0;
    const totalSiblingParts = fullBros * 2 + fullSis + patBros * 2 + patSis;

    if (totalSiblingParts > 0 && !hasDescendant(allHeirs)) {
      // MUQASAMA — grandfather shares with siblings
      // Grandfather is treated as one full brother (2 parts)
      // Then pick the BEST of: muqasama, 1/3 of total, 1/6 of total
      const result = calculateMuqasama(
        remainder, totalSiblingParts,
        fullBros, fullSis, patBros, patSis,
      );
      assignments.push(...result.assignments);
      return { assignments, remainder: ZERO };
    } else if (!grandfatherFard) {
      // Pure asaba (no children, no siblings)
      assignments.push({
        id: 'grandfather',
        count: 1,
        share: remainder,
        perPerson: remainder,
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest — farfar som asaba', en: 'Remainder — grandfather as asaba' }],
      });
      return { assignments, remainder: ZERO };
    } else if (grandfatherFard.isAsaba) {
      assignments.push({
        id: 'grandfather',
        count: 1,
        share: remainder,
        perPerson: remainder,
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest utöver 1/6 — farfar som asaba', en: 'Remainder beyond 1/6 — grandfather as asaba' }],
      });
      return { assignments, remainder: ZERO };
    }
  }

  // ─── FULL BROTHERS + FULL SISTERS ──────────────────────
  if (isActive('fullBrother')) {
    const bros = count('fullBrother');
    const sis = isActive('fullSister') ? count('fullSister') : 0;
    const totalParts = bros * 2 + sis;

    if (sis > 0) {
      assignments.push({
        id: 'fullBrother',
        count: bros,
        share: multiply(remainder, [bros * 2, totalParts]),
        perPerson: multiply(remainder, [2, totalParts]),
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest — helbror som asaba', en: 'Remainder — full brother as asaba' }],
      });
      assignments.push({
        id: 'fullSister',
        count: sis,
        share: multiply(remainder, [sis, totalParts]),
        perPerson: multiply(remainder, [1, totalParts]),
        type: 'bi-ghayrih',
        notes: [{ sv: 'Asaba med helbror', en: 'Asaba with full brother' }],
      });
    } else {
      assignments.push({
        id: 'fullBrother',
        count: bros,
        share: remainder,
        perPerson: [remainder[0], remainder[1] * bros],
        type: 'bi-nafsih',
        notes: [{ sv: `Rest delat på ${bros} helbröder`, en: `Remainder shared among ${bros} full brother(s)` }],
      });
    }
    return { assignments, remainder: ZERO };
  }

  // ─── FULL SISTERS as asaba ma'a al-ghayr ──────────────
  // Sisters become asaba when daughters exist (no sons, no brothers)
  if (isActive('fullSister') && hasDescendant(allHeirs) && !hasMaleDescendant(allHeirs)) {
    const sis = count('fullSister');
    assignments.push({
      id: 'fullSister',
      count: sis,
      share: remainder,
      perPerson: [remainder[0], remainder[1] * sis],
      type: 'ma-al-ghayr',
      notes: [{ sv: 'Rest — helsyster som asaba med dotter', en: 'Remainder — full sister as asaba with daughter' }],
    });
    return { assignments, remainder: ZERO };
  }

  // ─── PATERNAL HALF-BROTHERS ────────────────────────────
  if (isActive('paternalBrother')) {
    const bros = count('paternalBrother');
    const sis = isActive('paternalSister') ? count('paternalSister') : 0;
    const totalParts = bros * 2 + sis;

    if (sis > 0) {
      assignments.push({
        id: 'paternalBrother',
        count: bros,
        share: multiply(remainder, [bros * 2, totalParts]),
        perPerson: multiply(remainder, [2, totalParts]),
        type: 'bi-nafsih',
        notes: [{ sv: 'Rest — halvbror (far) som asaba', en: 'Remainder — paternal half-brother as asaba' }],
      });
      assignments.push({
        id: 'paternalSister',
        count: sis,
        share: multiply(remainder, [sis, totalParts]),
        perPerson: multiply(remainder, [1, totalParts]),
        type: 'bi-ghayrih',
        notes: [{ sv: 'Asaba med halvbror (far)', en: 'Asaba with paternal half-brother' }],
      });
    } else {
      assignments.push({
        id: 'paternalBrother',
        count: bros,
        share: remainder,
        perPerson: [remainder[0], remainder[1] * bros],
        type: 'bi-nafsih',
        notes: [{ sv: `Rest delat på ${bros} halvbröder (far)`, en: `Remainder shared among ${bros} paternal half-brother(s)` }],
      });
    }
    return { assignments, remainder: ZERO };
  }

  // ─── PATERNAL HALF-SISTERS as asaba ma'a al-ghayr ─────
  if (isActive('paternalSister') && hasDescendant(allHeirs) && !hasMaleDescendant(allHeirs) && !isActive('fullSister') && !isActive('fullBrother')) {
    const sis = count('paternalSister');
    assignments.push({
      id: 'paternalSister',
      count: sis,
      share: remainder,
      perPerson: [remainder[0], remainder[1] * sis],
      type: 'ma-al-ghayr',
      notes: [{ sv: 'Rest — halvsyster (far) som asaba med dotter', en: 'Remainder — paternal half-sister as asaba with daughter' }],
    });
    return { assignments, remainder: ZERO };
  }

  // If we get here, remainder is unclaimed
  return { assignments, remainder };
}

/**
 * Calculate muqasama (المقاسمة) — grandfather sharing with siblings.
 * Saudi/Hanbali jumhur method.
 *
 * Grandfather gets the BEST of:
 * 1. Muqasama (equal sharing as if grandfather = one full brother)
 * 2. 1/3 of the remainder (after fard heirs)
 * 3. 1/6 of the total estate
 *
 * Note: 1/6 is already guaranteed as fard. This function handles the
 * remainder distribution including grandfather's additional share.
 */
function calculateMuqasama(
  remainder: Fraction,
  totalSiblingParts: number,
  fullBros: number,
  fullSis: number,
  patBros: number,
  patSis: number,
): { assignments: AsabaAssignment[] } {
  const assignments: AsabaAssignment[] = [];

  // Grandfather counts as 2 parts (like a brother)
  const grandfatherParts = 2;
  const totalPartsWithGrandfather = totalSiblingParts + grandfatherParts;

  // Option 1: Muqasama — grandfather gets 2/totalParts of remainder
  const muqasamaShare = multiply(remainder, [grandfatherParts, totalPartsWithGrandfather]);

  // Option 2: 1/3 of remainder
  const thirdOfRemainder = multiply(remainder, THIRD);

  // Option 3: 1/6 of total estate (minimum guarantee)
  const sixthOfTotal: Fraction = SIXTH;

  // Pick the BEST of all three options
  const bestOfFirst2 = isGreaterThan(muqasamaShare, thirdOfRemainder) ? muqasamaShare : thirdOfRemainder;
  const grandfatherShare = isGreaterThan(bestOfFirst2, sixthOfTotal) ? bestOfFirst2 : sixthOfTotal;
  const usedMuqasama = grandfatherShare === muqasamaShare;
  const usedThird = grandfatherShare === thirdOfRemainder;
  const usedSixth = grandfatherShare === sixthOfTotal;

  // Add grandfather
  const noteText = usedMuqasama
    ? { sv: 'Muqasama — farfar delar med syskon (bäst av muqasama/⅓/⅙)', en: 'Muqasama — grandfather shares with siblings (best of muqasama/⅓/⅙)' }
    : usedThird
    ? { sv: '1/3 av återstoden (bättre än muqasama och 1/6)', en: '1/3 of remainder (better than muqasama and 1/6)' }
    : { sv: '1/6 av hela kvarlåtenskapen (minimigaranti)', en: '1/6 of total estate (minimum guarantee)' };

  assignments.push({
    id: 'grandfather',
    count: 1,
    share: grandfatherShare,
    perPerson: grandfatherShare,
    type: 'muqasama',
    notes: [noteText],
  });

  // Distribute remaining to siblings
  const siblingRemainder = subtract(remainder, grandfatherShare);

  if (!isZero(siblingRemainder) && totalSiblingParts > 0) {
    if (fullBros > 0) {
      assignments.push({
        id: 'fullBrother',
        count: fullBros,
        share: multiply(siblingRemainder, [fullBros * 2, totalSiblingParts]),
        perPerson: multiply(siblingRemainder, [2, totalSiblingParts]),
        type: 'muqasama',
        notes: [{ sv: 'Muqasama med farfar', en: 'Muqasama with grandfather' }],
      });
    }
    if (fullSis > 0) {
      assignments.push({
        id: 'fullSister',
        count: fullSis,
        share: multiply(siblingRemainder, [fullSis, totalSiblingParts]),
        perPerson: multiply(siblingRemainder, [1, totalSiblingParts]),
        type: 'muqasama',
        notes: [{ sv: 'Muqasama med farfar', en: 'Muqasama with grandfather' }],
      });
    }
    if (patBros > 0) {
      assignments.push({
        id: 'paternalBrother',
        count: patBros,
        share: multiply(siblingRemainder, [patBros * 2, totalSiblingParts]),
        perPerson: multiply(siblingRemainder, [2, totalSiblingParts]),
        type: 'muqasama',
        notes: [{ sv: 'Muqasama med farfar', en: 'Muqasama with grandfather' }],
      });
    }
    if (patSis > 0) {
      assignments.push({
        id: 'paternalSister',
        count: patSis,
        share: multiply(siblingRemainder, [patSis, totalSiblingParts]),
        perPerson: multiply(siblingRemainder, [1, totalSiblingParts]),
        type: 'muqasama',
        notes: [{ sv: 'Muqasama med farfar', en: 'Muqasama with grandfather' }],
      });
    }
  }

  return { assignments };
}
