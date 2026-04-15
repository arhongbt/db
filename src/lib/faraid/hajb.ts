/**
 * Hajb (حجب) — Exclusion Rules
 * Saudi/Hanbali system (jumhur positions)
 *
 * Two types of hajb:
 * 1. Hajb hirman (حجب حرمان) — total exclusion from inheritance
 * 2. Hajb nuqsan (حجب نقصان) — partial reduction (handled in fard.ts)
 *
 * This module handles hajb hirman only.
 */

import type { HeirId, HeirInput } from './types';

interface ExclusionResult {
  excluded: boolean;
  excludedBy: HeirId | null;
}

/**
 * Determine which heirs are excluded (hajb hirman) given the full list of present heirs.
 * Returns a map of heirId → { excluded, excludedBy }
 *
 * Based on Saudi official system (Hanbali madhab, jumhur):
 * - Father present → grandfather excluded
 * - Father present → all siblings excluded (only father, NOT grandfather in jumhur)
 * - Mother present → all grandmothers excluded
 * - Son present → son's children excluded? NO — son's son inherits with son
 *   Actually: son does NOT exclude son's son. But son DOES exclude son's daughter
 *   from fard (she becomes asaba with son's son, or excluded if no son's son).
 *   This is handled in fard.ts — hajb only handles total exclusion.
 *
 * IMPORTANT: In the Saudi/Hanbali system, grandfather does NOT exclude siblings.
 * The grandfather shares with siblings via muqasama.
 */
export function calculateHajb(heirs: HeirInput[]): Map<HeirId, ExclusionResult> {
  const result = new Map<HeirId, ExclusionResult>();
  const present = new Set(heirs.filter(h => h.count > 0).map(h => h.id));

  // Initialize all as not excluded
  for (const h of heirs) {
    if (h.count > 0) {
      result.set(h.id, { excluded: false, excludedBy: null });
    }
  }

  // ─── Exclusion Rules (hajb hirman) ──────────────────────────

  // 1. GRANDFATHER (جد) excluded by FATHER (أب)
  if (present.has('grandfather') && present.has('father')) {
    result.set('grandfather', { excluded: true, excludedBy: 'father' });
  }

  // 2. GRANDMOTHERS excluded by MOTHER (أم)
  //    Both maternal and paternal grandmothers are excluded when mother is present
  if (present.has('mother')) {
    if (present.has('grandmotherMaternal')) {
      result.set('grandmotherMaternal', { excluded: true, excludedBy: 'mother' });
    }
    if (present.has('grandmotherPaternal')) {
      result.set('grandmotherPaternal', { excluded: true, excludedBy: 'mother' });
    }
  }

  // 3. PATERNAL GRANDMOTHER (أم الأب) excluded by FATHER (أب)
  //    Saudi/jumhur position: paternal grandmother is excluded by her son (the father)
  if (present.has('grandmotherPaternal') && present.has('father')) {
    result.set('grandmotherPaternal', { excluded: true, excludedBy: 'father' });
  }

  // 4. SON'S SON (ابن ابن) excluded by... NO ONE inherently
  //    Son does NOT exclude son's son — they both inherit as asaba
  //    Son's son is only excluded by father of son's son (i.e., the son himself)
  //    But in faraid, son's son takes from son's share, not excluded
  //    Actually: son's son IS excluded by the son in the sense that son takes all asaba first
  //    But this is handled in asaba.ts, not hajb

  // 5. SON'S DAUGHTER (بنت ابن) excluded by:
  //    - 2+ daughters (if no son's son to make her asaba)
  if (present.has('sonsDaughter')) {
    const daughters = heirs.find(h => h.id === 'daughter');
    const sonsSon = heirs.find(h => h.id === 'sonsSon');
    if (daughters && daughters.count >= 2 && (!sonsSon || sonsSon.count === 0)) {
      result.set('sonsDaughter', { excluded: true, excludedBy: 'daughter' });
    }
  }

  // 6. FULL SIBLINGS excluded by:
  //    - FATHER (أب) — father excludes ALL siblings
  //    - SON (ابن) or SON'S SON (ابن ابن) — male descendants exclude all siblings
  //    Note: GRANDFATHER does NOT exclude full siblings in Saudi/jumhur system
  if (present.has('father') || present.has('son') || present.has('sonsSon')) {
    const excludedBy: HeirId = present.has('father') ? 'father' : present.has('son') ? 'son' : 'sonsSon';
    if (present.has('fullBrother')) {
      result.set('fullBrother', { excluded: true, excludedBy });
    }
    if (present.has('fullSister')) {
      result.set('fullSister', { excluded: true, excludedBy });
    }
  }

  // 7. PATERNAL HALF-SIBLINGS excluded by:
  //    - FATHER, SON, SON'S SON (same as full siblings)
  //    - FULL BROTHER (أخ شقيق) — full brother excludes paternal half-siblings
  //    - 2 FULL SISTERS + no full brother (they take 2/3, nothing left for paternal sisters)
  if (present.has('father') || present.has('son') || present.has('sonsSon') || present.has('fullBrother')) {
    const excludedBy: HeirId = present.has('father') ? 'father' :
      present.has('son') ? 'son' :
      present.has('sonsSon') ? 'sonsSon' : 'fullBrother';
    if (present.has('paternalBrother')) {
      result.set('paternalBrother', { excluded: true, excludedBy });
    }
    if (present.has('paternalSister')) {
      result.set('paternalSister', { excluded: true, excludedBy });
    }
  }

  // Paternal sisters also excluded by 2+ full sisters (if no paternal brother to make asaba)
  if (present.has('paternalSister') && !result.get('paternalSister')?.excluded) {
    const fullSisters = heirs.find(h => h.id === 'fullSister');
    const paternalBrother = heirs.find(h => h.id === 'paternalBrother');
    if (fullSisters && fullSisters.count >= 2 && (!paternalBrother || paternalBrother.count === 0)) {
      result.set('paternalSister', { excluded: true, excludedBy: 'fullSister' });
    }
  }

  // 8. MATERNAL HALF-SIBLINGS (أخ/أخت لأم) excluded by:
  //    - FATHER, GRANDFATHER
  //    - SON, DAUGHTER, SON'S SON, SON'S DAUGHTER (any descendant)
  if (
    present.has('father') || present.has('grandfather') ||
    present.has('son') || present.has('daughter') ||
    present.has('sonsSon') || present.has('sonsDaughter')
  ) {
    const excludedBy: HeirId = present.has('father') ? 'father' :
      present.has('grandfather') ? 'grandfather' :
      present.has('son') ? 'son' :
      present.has('daughter') ? 'daughter' :
      present.has('sonsSon') ? 'sonsSon' : 'sonsDaughter';
    if (present.has('maternalBrother')) {
      result.set('maternalBrother', { excluded: true, excludedBy });
    }
    if (present.has('maternalSister')) {
      result.set('maternalSister', { excluded: true, excludedBy });
    }
  }

  return result;
}

/**
 * Filter heirs to only those who are NOT excluded.
 */
export function getActiveHeirs(heirs: HeirInput[], hajbMap: Map<HeirId, ExclusionResult>): HeirInput[] {
  return heirs.filter(h => {
    const status = hajbMap.get(h.id);
    return h.count > 0 && (!status || !status.excluded);
  });
}

/**
 * Check if any descendant (son, daughter, son's son, son's daughter) exists.
 * Used by fard.ts for determining shares.
 */
export function hasDescendant(heirs: HeirInput[]): boolean {
  return heirs.some(h =>
    h.count > 0 && ['son', 'daughter', 'sonsSon', 'sonsDaughter'].includes(h.id)
  );
}

/**
 * Check if any male descendant (son, son's son) exists.
 */
export function hasMaleDescendant(heirs: HeirInput[]): boolean {
  return heirs.some(h =>
    h.count > 0 && ['son', 'sonsSon'].includes(h.id)
  );
}

/**
 * Check if multiple siblings exist (used for mother's share reduction).
 * "Two or more siblings" — includes all types of siblings.
 */
export function hasMultipleSiblings(heirs: HeirInput[]): boolean {
  const siblingIds: HeirId[] = [
    'fullBrother', 'fullSister',
    'paternalBrother', 'paternalSister',
    'maternalBrother', 'maternalSister',
  ];
  const totalSiblings = heirs
    .filter(h => siblingIds.includes(h.id))
    .reduce((sum, h) => sum + h.count, 0);
  return totalSiblings >= 2;
}

/**
 * Get count of a specific heir.
 */
export function getCount(heirs: HeirInput[], id: HeirId): number {
  return heirs.find(h => h.id === id)?.count ?? 0;
}
