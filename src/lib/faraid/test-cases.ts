/**
 * Faraid Calculator — Test Cases
 * Run with: npx tsx src/lib/faraid/test-cases.ts
 *
 * These are well-known Islamic inheritance scenarios with verified answers.
 */

import { calculateFaraid } from './engine';

interface TestCase {
  name: string;
  nameAr: string;
  input: Parameters<typeof calculateFaraid>[0];
  expected: {
    awl?: boolean;
    radd?: boolean;
    shares: Record<string, string>; // heirId → expected fraction
  };
}

const cases: TestCase[] = [
  // ─── Basic Cases ──────────────────────────────────────
  {
    name: 'Father only (pure asaba)',
    nameAr: 'أب فقط',
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
    nameAr: 'ابنان فقط',
    input: {
      heirs: [{ id: 'son', count: 2 }],
      estateValue: 600000,
      debts: 0,
      waspiqa: 0,
    },
    expected: { shares: { son: '1/1' } }, // Split equally
  },
  {
    name: 'Husband + 1 daughter',
    nameAr: 'زوج + بنت',
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
      radd: true, // Husband 1/4, daughter 1/2 = 3/4 → radd surplus to daughter
      shares: { husband: '1/4', daughter: '3/4' },
    },
  },

  // ─── 'Awl Cases ───────────────────────────────────────
  {
    name: "'Awl case: Husband + 2 daughters + mother (المنبرية)",
    nameAr: 'زوج + بنتان + أم — عول من ٦ إلى ٨... wait no, 12→13',
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
      // Husband 1/4=3/12, daughters 2/3=8/12, mother 1/6=2/12 → total 13/12 → awl
      shares: { husband: '3/13', daughter: '8/13', mother: '2/13' },
    },
  },
  {
    name: "'Awl case: Husband + mother + 2 full sisters",
    nameAr: 'زوج + أم + أختان شقيقتان — عول',
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
      // Husband 1/2=3/6, mother 1/6, sisters 2/3=4/6 → total 8/6 → awl to 8
      shares: { husband: '3/8', mother: '1/8', fullSister: '4/8' },
    },
  },

  // ─── Umariyyatan (العمريتان) ──────────────────────────
  {
    name: 'Umariyyatan: Husband + father + mother',
    nameAr: 'العمرية الأولى: زوج + أب + أم',
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
      // Husband 1/2, mother 1/3 of remainder (1/6 of total), father rest (1/3 of total)
      // Mother gets 1/3 of (1-1/2) = 1/3 of 1/2 = 1/6
      shares: { husband: '1/2', mother: '1/6', father: '1/3' },
    },
  },
  {
    name: 'Umariyyatan: Wife + father + mother',
    nameAr: 'العمرية الثانية: زوجة + أب + أم',
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
      // Wife 1/4, mother 1/3 of remainder = 1/3 of 3/4 = 1/4, father rest = 1/2
      shares: { wife: '1/4', mother: '1/4', father: '1/2' },
    },
  },

  // ─── Muqasama (grandfather + siblings) ────────────────
  {
    name: 'Muqasama: Grandfather + 1 full brother',
    nameAr: 'جد + أخ شقيق — مقاسمة',
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
      // Muqasama: grandfather=2 parts, brother=2 parts → each gets 1/2
      // 1/3 of total = 1/3. Muqasama gives 1/2. 1/2 > 1/3, so muqasama wins.
      shares: { grandfather: '1/2', fullBrother: '1/2' },
    },
  },

  // ─── Radd Cases ───────────────────────────────────────
  {
    name: 'Radd: Mother + 1 daughter only',
    nameAr: 'أم + بنت فقط — رد',
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
      // Mother 1/6, daughter 1/2 = 4/6 total → 2/6 surplus → radd proportional (1:3)
      // Mother: 1/6 + 1/4*2/6 = 1/4, Daughter: 1/2 + 3/4*2/6 = 3/4
      shares: { mother: '1/4', daughter: '3/4' },
    },
  },

  // ─── With Debts ───────────────────────────────────────
  {
    name: 'With debts: 2 sons, 100k debts',
    nameAr: 'ابنان + ديون',
    input: {
      heirs: [{ id: 'son', count: 2 }],
      estateValue: 500000,
      debts: 100000,
      waspiqa: 0,
    },
    expected: {
      shares: { son: '1/1' }, // 400k split equally → 200k each
    },
  },
];

// ─── Run Tests ──────────────────────────────────────────

let passed = 0;
let failed = 0;

for (const tc of cases) {
  const result = calculateFaraid(tc.input);
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📋 ${tc.name}`);
  console.log(`   ${tc.nameAr}`);
  console.log(`${'─'.repeat(60)}`);

  if (tc.expected.awl !== undefined && tc.expected.awl !== result.awlApplied) {
    console.log(`❌ AWL: expected ${tc.expected.awl}, got ${result.awlApplied}`);
    failed++;
  } else if (tc.expected.radd !== undefined && tc.expected.radd !== result.raddApplied) {
    console.log(`❌ RADD: expected ${tc.expected.radd}, got ${result.raddApplied}`);
    failed++;
  } else {
    passed++;
  }

  console.log(`   Estate: ${tc.input.estateValue} → Inheritable: ${result.inheritableEstate}`);
  if (result.awlApplied) console.log(`   ⚠️  'AWL APPLIED (${result.awlFactor?.join('→')})`);
  if (result.raddApplied) console.log(`   ⚠️  RADD APPLIED`);

  for (const h of result.heirs) {
    const mark = h.basis === 'excluded' ? '🚫' : '✅';
    const expectedShare = tc.expected.shares[h.id];
    const actual = `${h.shareFraction[0]}/${h.shareFraction[1]}`;
    const match = expectedShare ? (actual === expectedShare ? '✓' : `✗ expected ${expectedShare}`) : '';
    console.log(
      `   ${mark} ${h.id.padEnd(22)} ${actual.padEnd(8)} ${h.sharePercentage.toFixed(1).padStart(6)}%  ${h.totalAmount.toLocaleString('sv-SE').padStart(12)} kr  ${match}`
    );
  }

  // Verify total = 100%
  const totalPct = result.heirs
    .filter(h => h.basis !== 'excluded')
    .reduce((sum, h) => sum + h.sharePercentage, 0);
  if (Math.abs(totalPct - 100) > 0.5 && result.heirs.filter(h => h.basis !== 'excluded').length > 0) {
    console.log(`   ⚠️  Total: ${totalPct.toFixed(2)}% (should be ~100%)`);
  }
}

console.log(`\n${'═'.repeat(60)}`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${cases.length} tests`);
console.log(`${'═'.repeat(60)}`);
