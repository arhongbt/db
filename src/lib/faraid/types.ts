/**
 * Islamic Inheritance (Faraid) Calculator — Type Definitions
 * Based on Saudi Arabian official system (Hanbali madhab, jumhur positions)
 *
 * Key terminology:
 * - Fard (فرض): Fixed share prescribed by Quran/Sunnah
 * - 'Asaba (عصبة): Residuary heir who takes remainder
 * - Hajb (حجب): Exclusion of an heir by another
 * - 'Awl (عول): Proportional reduction when shares exceed total
 * - Radd (رد): Redistribution of surplus to eligible heirs
 * - Muqasama (مقاسمة): Sharing method for grandfather with siblings
 */

// ─── Heir Types ───────────────────────────────────────────────

export type HeirId =
  | 'husband'       // زوج
  | 'wife'          // زوجة
  | 'son'           // ابن
  | 'daughter'      // بنت
  | 'sonsSon'       // ابن ابن
  | 'sonsDaughter'  // بنت ابن
  | 'father'        // أب
  | 'mother'        // أم
  | 'grandfather'   // جد (أب الأب)
  | 'grandmotherMaternal'  // جدة (أم الأم)
  | 'grandmotherPaternal'  // جدة (أم الأب)
  | 'fullBrother'          // أخ شقيق
  | 'fullSister'           // أخت شقيقة
  | 'paternalBrother'      // أخ لأب
  | 'paternalSister'       // أخت لأب
  | 'maternalBrother'      // أخ لأم
  | 'maternalSister';      // أخت لأم

export type Gender = 'male' | 'female';

export type HeirCategory =
  | 'spouse'
  | 'children'
  | 'grandchildren'
  | 'parents'
  | 'grandparents'
  | 'fullSiblings'
  | 'paternalHalfSiblings'
  | 'maternalHalfSiblings';

// ─── Heir Metadata ────────────────────────────────────────────

export interface HeirDefinition {
  id: HeirId;
  gender: Gender;
  category: HeirCategory;
  arabic: string;
  swedish: string;
  english: string;
  maxCount: number; // e.g., husband=1, wife=4, sons=unlimited
}

export const HEIR_DEFINITIONS: Record<HeirId, HeirDefinition> = {
  husband:              { id: 'husband',              gender: 'male',   category: 'spouse',                arabic: 'زوج',        swedish: 'Make',              english: 'Husband',                 maxCount: 1  },
  wife:                 { id: 'wife',                 gender: 'female', category: 'spouse',                arabic: 'زوجة',       swedish: 'Fru',               english: 'Wife',                    maxCount: 4  },
  son:                  { id: 'son',                  gender: 'male',   category: 'children',              arabic: 'ابن',        swedish: 'Son',               english: 'Son',                     maxCount: 99 },
  daughter:             { id: 'daughter',             gender: 'female', category: 'children',              arabic: 'بنت',        swedish: 'Dotter',            english: 'Daughter',                maxCount: 99 },
  sonsSon:              { id: 'sonsSon',              gender: 'male',   category: 'grandchildren',         arabic: 'ابن ابن',    swedish: 'Sonsons',           english: "Son's son",               maxCount: 99 },
  sonsDaughter:         { id: 'sonsDaughter',         gender: 'female', category: 'grandchildren',         arabic: 'بنت ابن',    swedish: 'Sonsdotter',        english: "Son's daughter",          maxCount: 99 },
  father:               { id: 'father',               gender: 'male',   category: 'parents',               arabic: 'أب',         swedish: 'Far',               english: 'Father',                  maxCount: 1  },
  mother:               { id: 'mother',               gender: 'female', category: 'parents',               arabic: 'أم',         swedish: 'Mor',               english: 'Mother',                  maxCount: 1  },
  grandfather:          { id: 'grandfather',          gender: 'male',   category: 'grandparents',          arabic: 'جد',         swedish: 'Farfar',            english: 'Grandfather',             maxCount: 1  },
  grandmotherMaternal:  { id: 'grandmotherMaternal',  gender: 'female', category: 'grandparents',          arabic: 'جدة لأم',    swedish: 'Mormor',            english: 'Maternal grandmother',    maxCount: 1  },
  grandmotherPaternal:  { id: 'grandmotherPaternal',  gender: 'female', category: 'grandparents',          arabic: 'جدة لأب',    swedish: 'Farmor',            english: 'Paternal grandmother',    maxCount: 1  },
  fullBrother:          { id: 'fullBrother',          gender: 'male',   category: 'fullSiblings',          arabic: 'أخ شقيق',    swedish: 'Helbror',           english: 'Full brother',            maxCount: 99 },
  fullSister:           { id: 'fullSister',           gender: 'female', category: 'fullSiblings',          arabic: 'أخت شقيقة',  swedish: 'Helsyster',         english: 'Full sister',             maxCount: 99 },
  paternalBrother:      { id: 'paternalBrother',      gender: 'male',   category: 'paternalHalfSiblings',  arabic: 'أخ لأب',     swedish: 'Halvbror (far)',     english: 'Paternal half-brother',   maxCount: 99 },
  paternalSister:       { id: 'paternalSister',       gender: 'female', category: 'paternalHalfSiblings',  arabic: 'أخت لأب',    swedish: 'Halvsyster (far)',   english: 'Paternal half-sister',    maxCount: 99 },
  maternalBrother:      { id: 'maternalBrother',      gender: 'male',   category: 'maternalHalfSiblings',  arabic: 'أخ لأم',     swedish: 'Halvbror (mor)',     english: 'Maternal half-brother',   maxCount: 99 },
  maternalSister:       { id: 'maternalSister',       gender: 'female', category: 'maternalHalfSiblings',  arabic: 'أخت لأم',    swedish: 'Halvsyster (mor)',   english: 'Maternal half-sister',    maxCount: 99 },
};

// ─── Calculation Input/Output ─────────────────────────────────

export interface HeirInput {
  id: HeirId;
  count: number;
}

export interface FaraidInput {
  heirs: HeirInput[];
  estateValue: number;  // Total estate in SEK
  debts: number;        // Outstanding debts
  waspiqa: number;      // Wasiyyah (bequest) — max 1/3
}

export type ShareBasis = 'fard' | 'asaba' | 'fard+asaba' | 'radd' | 'excluded';

export interface HeirResult {
  id: HeirId;
  count: number;
  shareFraction: [number, number]; // [numerator, denominator]
  sharePercentage: number;
  totalAmount: number;
  perPersonAmount: number;
  basis: ShareBasis;
  excludedBy?: HeirId;
  notes: string[]; // Calculation notes / dalil references
}

export interface FaraidResult {
  heirs: HeirResult[];
  inheritableEstate: number;   // After debts + wasiyyah
  debtsPaid: number;
  wasiyyahPaid: number;
  totalDistributed: number;
  remainder: number;           // Should be 0 ideally
  awlApplied: boolean;
  awlFactor?: [number, number]; // Original denominator → new denominator
  raddApplied: boolean;
  warnings: FaraidWarning[];
  steps: CalculationStep[];    // Audit trail
}

export interface FaraidWarning {
  type: 'awl' | 'radd' | 'zero_estate' | 'wasiyyah_exceeded' | 'no_heirs' | 'info';
  messageSv: string;
  messageEn: string;
}

export interface CalculationStep {
  phase: 'deductions' | 'hajb' | 'fard' | 'asaba' | 'awl' | 'radd';
  descriptionSv: string;
  descriptionEn: string;
}

// ─── Fraction helpers ─────────────────────────────────────────

export type Fraction = [number, number]; // [numerator, denominator]
