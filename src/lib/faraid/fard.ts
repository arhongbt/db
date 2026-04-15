/**
 * Fard (فرض) — Fixed Share Calculator
 * Saudi/Hanbali system (jumhur positions)
 *
 * The six Quranic fractions: 1/2, 1/4, 1/8, 1/3, 2/3, 1/6
 *
 * References:
 * - Quran An-Nisa 4:11, 4:12, 4:176
 * - Hadith: "ألحقوا الفرائض بأهلها فما بقي فلأولى رجل ذكر"
 */

import type { HeirId, HeirInput } from './types';
import {
  type Fraction,
  ZERO, HALF, QUARTER, EIGHTH, THIRD, TWO_THIRDS, SIXTH,
} from './fraction';
import { hasDescendant, hasMaleDescendant, hasMultipleSiblings, getCount } from './hajb';

export interface FardAssignment {
  id: HeirId;
  count: number;
  share: Fraction;        // Total share for this group
  perPerson: Fraction;    // Share per individual
  isAsaba: boolean;       // Also takes as asaba (e.g., father with daughters)
  notes: { sv: string; en: string }[];
}

/**
 * Calculate fard (fixed shares) for all active (non-excluded) heirs.
 * This does NOT handle asaba — that's in asaba.ts.
 *
 * @param activeHeirs - Heirs after hajb exclusion
 * @param allHeirs - All original heirs (for checking presence conditions)
 */
export function calculateFard(
  activeHeirs: HeirInput[],
  allHeirs: HeirInput[]
): FardAssignment[] {
  const assignments: FardAssignment[] = [];
  const active = new Set(activeHeirs.filter(h => h.count > 0).map(h => h.id));

  const hasChild = hasDescendant(allHeirs);
  const hasMaleChild = hasMaleDescendant(allHeirs);
  const hasSiblings = hasMultipleSiblings(allHeirs);

  // Helper to check if heir is active
  const isActive = (id: HeirId) => active.has(id);
  const count = (id: HeirId) => getCount(activeHeirs, id);

  // ─── HUSBAND (زوج) ─────────────────────────────────────
  if (isActive('husband')) {
    const share: Fraction = hasChild ? QUARTER : HALF;
    assignments.push({
      id: 'husband',
      count: 1,
      share,
      perPerson: share,
      isAsaba: false,
      notes: hasChild
        ? [{ sv: '1/4 — det finns barn (النساء 4:12)', en: '1/4 — descendants exist (An-Nisa 4:12)' }]
        : [{ sv: '1/2 — inga barn (النساء 4:12)', en: '1/2 — no descendants (An-Nisa 4:12)' }],
    });
  }

  // ─── WIFE (زوجة) — up to 4, share divided equally ──────
  if (isActive('wife')) {
    const n = count('wife');
    const share: Fraction = hasChild ? EIGHTH : QUARTER;
    const perPerson: Fraction = [share[0], share[1] * n];
    assignments.push({
      id: 'wife',
      count: n,
      share,
      perPerson,
      isAsaba: false,
      notes: hasChild
        ? [{ sv: `1/8 delat på ${n} fru(ar) (النساء 4:12)`, en: `1/8 shared among ${n} wife/wives (An-Nisa 4:12)` }]
        : [{ sv: `1/4 delat på ${n} fru(ar) (النساء 4:12)`, en: `1/4 shared among ${n} wife/wives (An-Nisa 4:12)` }],
    });
  }

  // ─── FATHER (أب) ────────────────────────────────────────
  if (isActive('father')) {
    if (hasMaleChild) {
      // Father gets 1/6 only (son takes residue)
      assignments.push({
        id: 'father',
        count: 1,
        share: SIXTH,
        perPerson: SIXTH,
        isAsaba: false,
        notes: [{ sv: '1/6 — det finns son/sonsons (النساء 4:11)', en: '1/6 — male descendant exists (An-Nisa 4:11)' }],
      });
    } else if (hasChild) {
      // Father gets 1/6 fard + remainder as asaba
      assignments.push({
        id: 'father',
        count: 1,
        share: SIXTH,
        perPerson: SIXTH,
        isAsaba: true, // Will also get remainder
        notes: [{ sv: '1/6 + rest som asaba — det finns dotter men ingen son (النساء 4:11)', en: '1/6 + remainder as asaba — daughter exists but no son (An-Nisa 4:11)' }],
      });
    } else {
      // Father is pure asaba (takes all remainder) — no fard
      // Don't assign fard here — asaba.ts handles it
    }
  }

  // ─── MOTHER (أم) ────────────────────────────────────────
  if (isActive('mother')) {
    if (hasChild || hasSiblings) {
      // Mother gets 1/6
      assignments.push({
        id: 'mother',
        count: 1,
        share: SIXTH,
        perPerson: SIXTH,
        isAsaba: false,
        notes: hasChild
          ? [{ sv: '1/6 — det finns barn (النساء 4:11)', en: '1/6 — descendants exist (An-Nisa 4:11)' }]
          : [{ sv: '1/6 — det finns 2+ syskon (النساء 4:11)', en: '1/6 — 2+ siblings exist (An-Nisa 4:11)' }],
      });
    } else {
      // Mother gets 1/3
      // SPECIAL CASE: Umariyyatan — if only spouse + mother + father,
      // mother gets 1/3 of REMAINDER (not 1/3 of total)
      const onlySpouseAndParents =
        activeHeirs.every(h =>
          ['husband', 'wife', 'father', 'mother'].includes(h.id) || h.count === 0
        ) && (isActive('husband') || isActive('wife')) && isActive('father');

      if (onlySpouseAndParents) {
        // Umariyyatan: mother gets 1/3 of remainder after spouse
        // We handle this specially — assign 1/3 but flag it
        assignments.push({
          id: 'mother',
          count: 1,
          share: THIRD, // This will be adjusted in engine.ts for Umariyyatan
          perPerson: THIRD,
          isAsaba: false,
          notes: [{ sv: '1/3 av återstoden (العمريتان) — make/fru + föräldrar', en: '1/3 of remainder (Umariyyatan) — spouse + parents only' }],
        });
      } else {
        assignments.push({
          id: 'mother',
          count: 1,
          share: THIRD,
          perPerson: THIRD,
          isAsaba: false,
          notes: [{ sv: '1/3 — inga barn, <2 syskon (النساء 4:11)', en: '1/3 — no descendants, <2 siblings (An-Nisa 4:11)' }],
        });
      }
    }
  }

  // ─── GRANDFATHER (جد) ───────────────────────────────────
  // Only if father is NOT present (hajb should have excluded him)
  if (isActive('grandfather')) {
    const hasActiveSiblings = ['fullBrother', 'fullSister', 'paternalBrother', 'paternalSister']
      .some(id => isActive(id as HeirId));

    if (hasMaleChild) {
      // Grandfather gets 1/6 (like father with male child)
      assignments.push({
        id: 'grandfather',
        count: 1,
        share: SIXTH,
        perPerson: SIXTH,
        isAsaba: false,
        notes: [{ sv: '1/6 — det finns son/sonsons', en: '1/6 — male descendant exists' }],
      });
    } else if (hasChild && !hasActiveSiblings) {
      // Grandfather gets 1/6 + remainder as asaba
      assignments.push({
        id: 'grandfather',
        count: 1,
        share: SIXTH,
        perPerson: SIXTH,
        isAsaba: true,
        notes: [{ sv: '1/6 + rest som asaba — dotter finns men inga syskon', en: '1/6 + remainder as asaba — daughter exists, no siblings' }],
      });
    } else if (hasActiveSiblings) {
      // MUQASAMA — grandfather shares with siblings
      // This is complex and handled in asaba.ts
      // Grandfather gets minimum 1/6 guaranteed
      assignments.push({
        id: 'grandfather',
        count: 1,
        share: SIXTH, // Minimum guarantee, may get more via muqasama
        perPerson: SIXTH,
        isAsaba: true, // Participates in muqasama
        notes: [{ sv: '1/6 (minimum) + muqasama med syskon', en: '1/6 (minimum) + muqasama with siblings' }],
      });
    }
    // If no children and no siblings → pure asaba (handled in asaba.ts)
  }

  // ─── GRANDMOTHERS (جدة) ─────────────────────────────────
  {
    const maternalGM = isActive('grandmotherMaternal');
    const paternalGM = isActive('grandmotherPaternal');
    const gmCount = (maternalGM ? 1 : 0) + (paternalGM ? 1 : 0);

    if (gmCount > 0) {
      // Grandmothers share 1/6 equally
      if (maternalGM) {
        assignments.push({
          id: 'grandmotherMaternal',
          count: 1,
          share: gmCount === 2 ? [1, 12] as Fraction : SIXTH,
          perPerson: gmCount === 2 ? [1, 12] as Fraction : SIXTH,
          isAsaba: false,
          notes: gmCount === 2
            ? [{ sv: '1/6 delat med farmor = 1/12', en: '1/6 shared with paternal grandmother = 1/12' }]
            : [{ sv: '1/6 (السدس)', en: '1/6 (one-sixth)' }],
        });
      }
      if (paternalGM) {
        assignments.push({
          id: 'grandmotherPaternal',
          count: 1,
          share: gmCount === 2 ? [1, 12] as Fraction : SIXTH,
          perPerson: gmCount === 2 ? [1, 12] as Fraction : SIXTH,
          isAsaba: false,
          notes: gmCount === 2
            ? [{ sv: '1/6 delat med mormor = 1/12', en: '1/6 shared with maternal grandmother = 1/12' }]
            : [{ sv: '1/6 (السدس)', en: '1/6 (one-sixth)' }],
        });
      }
    }
  }

  // ─── DAUGHTERS (بنت) ────────────────────────────────────
  if (isActive('daughter') && !isActive('son')) {
    // Daughters only get fard if there's NO son (son makes them asaba)
    const n = count('daughter');
    if (n === 1) {
      assignments.push({
        id: 'daughter',
        count: 1,
        share: HALF,
        perPerson: HALF,
        isAsaba: false,
        notes: [{ sv: '1/2 — en dotter utan bror (النساء 4:11)', en: '1/2 — one daughter with no brother (An-Nisa 4:11)' }],
      });
    } else {
      assignments.push({
        id: 'daughter',
        count: n,
        share: TWO_THIRDS,
        perPerson: [2, 3 * n] as Fraction,
        isAsaba: false,
        notes: [{ sv: `2/3 delat på ${n} döttrar (النساء 4:11)`, en: `2/3 shared among ${n} daughters (An-Nisa 4:11)` }],
      });
    }
  }
  // If son exists → daughters become asaba with son (handled in asaba.ts)

  // ─── SON'S DAUGHTERS (بنت ابن) ──────────────────────────
  if (isActive('sonsDaughter') && !isActive('son') && !isActive('sonsSon')) {
    const n = count('sonsDaughter');
    const daughterCount = count('daughter');

    if (daughterCount === 0) {
      // Same as daughters: 1/2 for one, 2/3 for multiple
      if (n === 1) {
        assignments.push({
          id: 'sonsDaughter',
          count: 1,
          share: HALF,
          perPerson: HALF,
          isAsaba: false,
          notes: [{ sv: '1/2 — en sonsdotter utan broder', en: '1/2 — one son\'s daughter with no brother' }],
        });
      } else {
        assignments.push({
          id: 'sonsDaughter',
          count: n,
          share: TWO_THIRDS,
          perPerson: [2, 3 * n] as Fraction,
          isAsaba: false,
          notes: [{ sv: `2/3 delat på ${n} sonsdöttrar`, en: `2/3 shared among ${n} son's daughters` }],
        });
      }
    } else if (daughterCount === 1) {
      // 1 daughter already took 1/2, son's daughters get 1/6 (complement to 2/3)
      assignments.push({
        id: 'sonsDaughter',
        count: n,
        share: SIXTH,
        perPerson: [1, 6 * n] as Fraction,
        isAsaba: false,
        notes: [{ sv: '1/6 — komplement till 2/3 (dotter tog 1/2)', en: '1/6 — complement to 2/3 (daughter took 1/2)' }],
      });
    }
    // If 2+ daughters → son's daughters are excluded (handled in hajb.ts)
  }
  // If son's son exists → son's daughters become asaba (handled in asaba.ts)

  // ─── FULL SISTERS (أخت شقيقة) ───────────────────────────
  if (isActive('fullSister') && !isActive('fullBrother')) {
    const n = count('fullSister');
    // Full sisters only get fard if no full brother (who makes them asaba)
    // AND no descendants (who exclude them)

    // Check if sisters become asaba ma'a al-ghayr (with daughters)
    const hasOnlyDaughters = hasChild && !hasMaleChild;
    if (hasOnlyDaughters) {
      // Sisters become asaba ma'a al-ghayr — handled in asaba.ts
    } else if (!hasChild) {
      if (n === 1) {
        assignments.push({
          id: 'fullSister',
          count: 1,
          share: HALF,
          perPerson: HALF,
          isAsaba: false,
          notes: [{ sv: '1/2 — en helsyster utan bror (النساء 4:176)', en: '1/2 — one full sister with no brother (An-Nisa 4:176)' }],
        });
      } else {
        assignments.push({
          id: 'fullSister',
          count: n,
          share: TWO_THIRDS,
          perPerson: [2, 3 * n] as Fraction,
          isAsaba: false,
          notes: [{ sv: `2/3 delat på ${n} helsystrar (النساء 4:176)`, en: `2/3 shared among ${n} full sisters (An-Nisa 4:176)` }],
        });
      }
    }
  }

  // ─── PATERNAL HALF-SISTERS (أخت لأب) ────────────────────
  if (isActive('paternalSister') && !isActive('paternalBrother') && !isActive('fullBrother')) {
    const n = count('paternalSister');
    const fullSisterCount = count('fullSister');

    if (!hasChild && fullSisterCount === 0) {
      if (n === 1) {
        assignments.push({
          id: 'paternalSister',
          count: 1,
          share: HALF,
          perPerson: HALF,
          isAsaba: false,
          notes: [{ sv: '1/2 — en halvsyster (far) utan bror', en: '1/2 — one paternal half-sister with no brother' }],
        });
      } else {
        assignments.push({
          id: 'paternalSister',
          count: n,
          share: TWO_THIRDS,
          perPerson: [2, 3 * n] as Fraction,
          isAsaba: false,
          notes: [{ sv: `2/3 delat på ${n} halvsystrar`, en: `2/3 shared among ${n} paternal half-sisters` }],
        });
      }
    } else if (!hasChild && fullSisterCount === 1) {
      // 1/6 complement (like son's daughter with 1 daughter)
      assignments.push({
        id: 'paternalSister',
        count: n,
        share: SIXTH,
        perPerson: [1, 6 * n] as Fraction,
        isAsaba: false,
        notes: [{ sv: '1/6 — komplement till 2/3 (helsyster tog 1/2)', en: '1/6 — complement to 2/3 (full sister took 1/2)' }],
      });
    }
  }

  // ─── MATERNAL HALF-SIBLINGS (أخ/أخت لأم) ────────────────
  // They share equally regardless of gender
  {
    const maternalBros = isActive('maternalBrother') ? count('maternalBrother') : 0;
    const maternalSis = isActive('maternalSister') ? count('maternalSister') : 0;
    const totalMaternal = maternalBros + maternalSis;

    if (totalMaternal > 0) {
      if (totalMaternal === 1) {
        const id: HeirId = maternalBros > 0 ? 'maternalBrother' : 'maternalSister';
        assignments.push({
          id,
          count: 1,
          share: SIXTH,
          perPerson: SIXTH,
          isAsaba: false,
          notes: [{ sv: '1/6 — en halvsyskon (mor) (النساء 4:12)', en: '1/6 — one maternal half-sibling (An-Nisa 4:12)' }],
        });
      } else {
        // 2+: they share 1/3 equally
        if (maternalBros > 0) {
          assignments.push({
            id: 'maternalBrother',
            count: maternalBros,
            share: [maternalBros, 3 * totalMaternal] as Fraction,
            perPerson: [1, 3 * totalMaternal] as Fraction,
            isAsaba: false,
            notes: [{ sv: `1/3 delat lika — ${totalMaternal} halvsyskon (mor) (النساء 4:12)`, en: `1/3 shared equally — ${totalMaternal} maternal half-siblings (An-Nisa 4:12)` }],
          });
        }
        if (maternalSis > 0) {
          assignments.push({
            id: 'maternalSister',
            count: maternalSis,
            share: [maternalSis, 3 * totalMaternal] as Fraction,
            perPerson: [1, 3 * totalMaternal] as Fraction,
            isAsaba: false,
            notes: [{ sv: `1/3 delat lika — ${totalMaternal} halvsyskon (mor) (النساء 4:12)`, en: `1/3 shared equally — ${totalMaternal} maternal half-siblings (An-Nisa 4:12)` }],
          });
        }
      }
    }
  }

  return assignments;
}

/**
 * Check if this is an Umariyyatan case (العمريتان).
 * Spouse + mother + father only, no descendants/siblings.
 * In this case, mother gets 1/3 of REMAINDER (not 1/3 of total).
 */
export function isUmariyyatan(activeHeirs: HeirInput[]): boolean {
  const active = activeHeirs.filter(h => h.count > 0);
  const ids = new Set(active.map(h => h.id));
  const hasSpouse = ids.has('husband') || ids.has('wife');
  return hasSpouse && ids.has('father') && ids.has('mother') && active.length === 3;
}
