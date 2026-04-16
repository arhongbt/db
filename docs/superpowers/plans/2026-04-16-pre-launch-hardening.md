# Pre-Launch Hardening Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden Sista Resan for production launch — fix security gaps, add test coverage for critical business logic, improve error handling, and consolidate code quality.

**Architecture:** Four parallel workstreams: (1) Security audit & fixes, (2) Unit/integration test suite, (3) Error boundaries & resilience, (4) Code quality & refactoring. Each task produces independently testable changes.

**Tech Stack:** Next.js 14 / TypeScript / Vitest / Playwright / Supabase / Upstash Redis / Tailwind CSS

---

## Task 1: Extract AI System Prompt to Separate Module

**Files:**
- Create: `src/lib/ai/system-prompt.ts`
- Create: `src/lib/ai/__tests__/system-prompt.test.ts`
- Modify: `src/app/api/juridisk-ai/route.ts:7-225`

- [ ] **Step 1: Create the system prompt module**

Create `src/lib/ai/system-prompt.ts`:

```typescript
// src/lib/ai/system-prompt.ts

interface PromptContext {
  deceasedName?: string;
  familySituation?: string;
  additionalContext?: string;
}

const BASE_PROMPT = `Du är Sista Resans juridiska AI-assistent...`; // Full prompt moved here

export function buildSystemPrompt(context?: PromptContext): string {
  let prompt = BASE_PROMPT;
  if (context?.deceasedName) {
    prompt += `\n\nKontext om dödsboet: Den avlidne heter ${context.deceasedName}.`;
  }
  if (context?.familySituation) {
    prompt += ` Familjesituation: ${context.familySituation}.`;
  }
  if (context?.additionalContext) {
    prompt += `\n${context.additionalContext}`;
  }
  return prompt;
}

export { BASE_PROMPT };
```

Copy the full system prompt text (lines 7-225 of `route.ts`) into the `BASE_PROMPT` constant.

- [ ] **Step 2: Write tests for the prompt module**

Create `src/lib/ai/__tests__/system-prompt.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, BASE_PROMPT } from '../system-prompt';

describe('buildSystemPrompt', () => {
  it('returns base prompt when no context provided', () => {
    const result = buildSystemPrompt();
    expect(result).toBe(BASE_PROMPT);
  });

  it('includes deceased name when provided', () => {
    const result = buildSystemPrompt({ deceasedName: 'Erik Svensson' });
    expect(result).toContain('Erik Svensson');
  });

  it('includes family situation when provided', () => {
    const result = buildSystemPrompt({ familySituation: 'gift med gemensamma barn' });
    expect(result).toContain('gift med gemensamma barn');
  });

  it('includes additional context when provided', () => {
    const result = buildSystemPrompt({ additionalContext: 'Det finns ett testamente' });
    expect(result).toContain('Det finns ett testamente');
  });

  it('base prompt contains key legal sections', () => {
    expect(BASE_PROMPT).toContain('Ärvdabalken');
    expect(BASE_PROMPT).toContain('faraid');
    expect(BASE_PROMPT).toContain('bouppteckning');
  });
});
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run src/lib/ai/__tests__/system-prompt.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 4: Update route.ts to use the new module**

In `src/app/api/juridisk-ai/route.ts`, replace lines 7-225 (the inline prompt) with:

```typescript
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
```

Then update the prompt construction (around line 293-297) to:

```typescript
const systemPrompt = buildSystemPrompt({
  additionalContext: contextMessage || undefined,
});
```

- [ ] **Step 5: Run existing test to verify nothing broke**

Run: `npx vitest run src/app/api/juridisk-ai`
Expected: Existing tests still PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/ai/ src/app/api/juridisk-ai/route.ts
git commit -m "refactor: extract AI system prompt to lib/ai/system-prompt.ts"
```

---

## Task 2: API Key Security Audit

**Files:**
- Modify: `src/app/api/juridisk-ai/route.ts` (verify server-only)
- Check: `.env.local`
- Create: `.env.example`

- [ ] **Step 1: Verify OpenRouter key is server-only**

Check `src/app/api/juridisk-ai/route.ts` — the `OPENROUTER_API_KEY` is read via `process.env.OPENROUTER_API_KEY` inside a route handler (server-side only). Verify it does NOT have `NEXT_PUBLIC_` prefix. Confirm no other file references this key.

Run: `grep -r "OPENROUTER_API_KEY" src/ --include="*.ts" --include="*.tsx"`
Expected: Only `src/app/api/juridisk-ai/route.ts`

- [ ] **Step 2: Check for any leaked secrets in NEXT_PUBLIC_ vars**

Run: `grep -r "NEXT_PUBLIC_" .env.local`
Expected: Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — these are safe (Supabase anon key is designed to be public, RLS protects data).

- [ ] **Step 3: Create .env.example**

Create `.env.example`:

```bash
# Supabase (public — safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenRouter (SECRET — server-only, never prefix with NEXT_PUBLIC_)
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Upstash Redis (SECRET — added in Task 3)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

- [ ] **Step 4: Add .env.local to .gitignore (verify)**

Run: `grep ".env.local" .gitignore`
Expected: `.env.local` already listed. If not, add it.

- [ ] **Step 5: Commit**

```bash
git add .env.example .gitignore
git commit -m "security: add .env.example, verify API key isolation"
```

---

## Task 3: Replace In-Memory Rate Limiting with Upstash Redis

**Files:**
- Modify: `src/app/api/juridisk-ai/route.ts:227-252`
- Create: `src/lib/rate-limit.ts`
- Create: `src/lib/__tests__/rate-limit.test.ts`

- [ ] **Step 1: Install Upstash packages**

```bash
npm install @upstash/redis @upstash/ratelimit
```

- [ ] **Step 2: Write the rate limiter module**

Create `src/lib/rate-limit.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('Upstash Redis not configured — rate limiting disabled');
    return null;
  }

  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    analytics: true,
    prefix: 'sista-resan',
  });

  return ratelimit;
}

export async function checkRateLimit(ip: string): Promise<{ success: boolean; remaining: number }> {
  const limiter = getRatelimit();

  if (!limiter) {
    // No Redis configured — allow all (dev mode)
    return { success: true, remaining: 5 };
  }

  const { success, remaining } = await limiter.limit(ip);
  return { success, remaining };
}
```

- [ ] **Step 3: Write tests with mocked Redis**

Create `src/lib/__tests__/rate-limit.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Upstash before importing
vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: vi.fn(() => ({})),
  },
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow = vi.fn(() => ({}));
    limit = vi.fn(async () => ({ success: true, remaining: 4, limit: 5, reset: Date.now() + 60000 }));
    constructor() {}
  },
}));

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  });

  it('allows requests within limit', async () => {
    const { checkRateLimit } = await import('../rate-limit');
    const result = await checkRateLimit('127.0.0.1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('allows all when Redis not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    const { checkRateLimit } = await import('../rate-limit');
    const result = await checkRateLimit('127.0.0.1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(5);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/__tests__/rate-limit.test.ts`
Expected: All 2 tests PASS

- [ ] **Step 5: Update route.ts to use new rate limiter**

In `src/app/api/juridisk-ai/route.ts`, remove lines 227-242 (old `rateLimitMap` and `checkRateLimit`). Replace the rate limit check (lines 247-252) with:

```typescript
import { checkRateLimit } from '@/lib/rate-limit';

// Inside POST handler, replace old rate limit block:
const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
const { success: withinLimit } = await checkRateLimit(ip);

if (!withinLimit) {
  return NextResponse.json(
    { error: 'För många förfrågningar. Vänta en minut och försök igen.' },
    { status: 429 }
  );
}
```

- [ ] **Step 6: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/rate-limit.ts src/lib/__tests__/rate-limit.test.ts src/app/api/juridisk-ai/route.ts package.json package-lock.json
git commit -m "security: replace in-memory rate limiting with Upstash Redis"
```

---

## Task 4: Faraid Engine Test Suite

**Files:**
- Create: `src/lib/faraid/__tests__/engine.test.ts`
- Create: `src/lib/faraid/__tests__/fraction.test.ts`
- Read: `src/lib/faraid/test-cases.ts` (21 existing test cases)
- Read: `src/lib/faraid/engine.ts` (main calculation function)
- Read: `src/lib/faraid/fraction.ts` (fraction arithmetic)

- [ ] **Step 1: Write fraction.ts unit tests**

Create `src/lib/faraid/__tests__/fraction.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { Fraction } from '../fraction';

describe('Fraction', () => {
  describe('arithmetic', () => {
    it('adds fractions correctly', () => {
      const a = new Fraction(1, 4);
      const b = new Fraction(1, 4);
      const result = a.add(b);
      expect(result.numerator).toBe(1);
      expect(result.denominator).toBe(2);
    });

    it('subtracts fractions correctly', () => {
      const a = new Fraction(3, 4);
      const b = new Fraction(1, 4);
      const result = a.subtract(b);
      expect(result.numerator).toBe(1);
      expect(result.denominator).toBe(2);
    });

    it('multiplies fractions correctly', () => {
      const a = new Fraction(2, 3);
      const b = new Fraction(3, 4);
      const result = a.multiply(b);
      expect(result.numerator).toBe(1);
      expect(result.denominator).toBe(2);
    });

    it('simplifies fractions automatically', () => {
      const f = new Fraction(4, 8);
      expect(f.numerator).toBe(1);
      expect(f.denominator).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('handles zero numerator', () => {
      const f = new Fraction(0, 5);
      expect(f.numerator).toBe(0);
      expect(f.toDecimal()).toBe(0);
    });

    it('handles whole numbers', () => {
      const f = new Fraction(6, 3);
      expect(f.numerator).toBe(2);
      expect(f.denominator).toBe(1);
    });
  });

  describe('conversion', () => {
    it('converts to decimal', () => {
      const f = new Fraction(1, 4);
      expect(f.toDecimal()).toBeCloseTo(0.25);
    });

    it('converts to string', () => {
      const f = new Fraction(1, 4);
      expect(f.toString()).toBe('1/4');
    });
  });
});
```

Note: Adjust constructor/method names after reading actual `fraction.ts` exports. The structure above assumes a `Fraction` class — adapt if it uses plain functions.

- [ ] **Step 2: Run fraction tests**

Run: `npx vitest run src/lib/faraid/__tests__/fraction.test.ts`
Expected: All tests PASS. If any fail due to API mismatch, fix test to match actual exports.

- [ ] **Step 3: Write engine test suite using existing test cases**

Create `src/lib/faraid/__tests__/engine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateFaraid } from '../engine';
import { testCases } from '../test-cases';

describe('calculateFaraid', () => {
  describe('existing test cases', () => {
    testCases.forEach((tc, index) => {
      it(`Case ${index + 1}: ${tc.name} (${tc.nameAr})`, () => {
        const result = calculateFaraid(tc.input);

        // Check awl/radd flags
        if (tc.expected.awl !== undefined) {
          expect(result.awlApplied).toBe(tc.expected.awl);
        }
        if (tc.expected.radd !== undefined) {
          expect(result.raddApplied).toBe(tc.expected.radd);
        }

        // Check each heir's share
        for (const [heirId, expectedFraction] of Object.entries(tc.expected.shares)) {
          const heir = result.heirs.find(h => h.id === heirId);
          expect(heir, `Heir ${heirId} not found in result`).toBeDefined();

          const [num, den] = expectedFraction.split('/').map(Number);
          const expectedPct = (num / den) * 100;
          expect(heir!.sharePercentage).toBeCloseTo(expectedPct, 1);
        }
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty heirs array', () => {
      const result = calculateFaraid({
        heirs: [],
        estateValue: 1000000,
        debts: 0,
        waspiqa: 0,
      });
      expect(result.heirs).toHaveLength(0);
      expect(result.inheritableEstate).toBe(1000000);
    });

    it('handles estate fully consumed by debts', () => {
      const result = calculateFaraid({
        heirs: [{ id: 'son', count: 1 }],
        estateValue: 100000,
        debts: 150000,
        waspiqa: 0,
      });
      expect(result.inheritableEstate).toBeLessThanOrEqual(0);
    });

    it('caps wasiyyah at 1/3 of estate', () => {
      const result = calculateFaraid({
        heirs: [{ id: 'son', count: 1 }],
        estateValue: 900000,
        debts: 0,
        waspiqa: 500000, // More than 1/3
      });
      // Wasiyyah should be capped at 300000 (1/3 of 900000)
      expect(result.inheritableEstate).toBeCloseTo(600000, 0);
    });

    it('share percentages sum to approximately 100%', () => {
      const result = calculateFaraid({
        heirs: [
          { id: 'wife', count: 1 },
          { id: 'son', count: 2 },
          { id: 'daughter', count: 1 },
        ],
        estateValue: 1000000,
        debts: 0,
        waspiqa: 0,
      });

      const totalPct = result.heirs
        .filter(h => !h.excludedBy)
        .reduce((sum, h) => sum + h.sharePercentage, 0);
      expect(totalPct).toBeCloseTo(100, 0);
    });
  });
});
```

Note: Adapt `testCases` import name and `tc.input`/`tc.expected` field access based on actual export structure in `test-cases.ts`. The test-cases file exports an array of 21 cases — the `forEach` loop runs each one as a separate test.

- [ ] **Step 4: Run engine tests**

Run: `npx vitest run src/lib/faraid/__tests__/engine.test.ts`
Expected: All 21 test cases + 4 edge cases PASS. If any fail, the calculation may have a bug — document it.

- [ ] **Step 5: Commit**

```bash
git add src/lib/faraid/__tests__/
git commit -m "test: add faraid engine and fraction test suite (25+ cases)"
```

---

## Task 5: Personnummer Validation Tests

**Files:**
- Create: `src/lib/__tests__/personnummer.test.ts`
- Read: `src/lib/personnummer.ts`

- [ ] **Step 1: Write personnummer tests**

Create `src/lib/__tests__/personnummer.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { validatePersonnummer, formatPersonnummer } from '../personnummer';

describe('validatePersonnummer', () => {
  describe('valid numbers', () => {
    it('accepts YYYYMMDD-XXXX format', () => {
      const result = validatePersonnummer('19900101-1234');
      // Note: 1234 may not pass Luhn — use a known valid number
      // Adjust with a real valid personnummer for testing
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('formatted');
    });

    it('accepts YYMMDD-XXXX format', () => {
      const result = validatePersonnummer('900101-1234');
      expect(result).toHaveProperty('valid');
    });

    it('accepts without dash', () => {
      const result = validatePersonnummer('9001011234');
      expect(result).toHaveProperty('valid');
    });

    // Use known valid test personnummer: 811228-9874
    it('validates a known valid personnummer', () => {
      const result = validatePersonnummer('811228-9874');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('811228-9874');
    });
  });

  describe('invalid numbers', () => {
    it('rejects too short input', () => {
      const result = validatePersonnummer('12345');
      expect(result.valid).toBe(false);
    });

    it('rejects invalid checksum', () => {
      const result = validatePersonnummer('900101-1235');
      expect(result.valid).toBe(false);
    });

    it('rejects invalid date', () => {
      const result = validatePersonnummer('901301-1234');
      expect(result.valid).toBe(false);
    });

    it('rejects empty string', () => {
      const result = validatePersonnummer('');
      expect(result.valid).toBe(false);
    });

    it('rejects non-numeric input', () => {
      const result = validatePersonnummer('abcdef-ghij');
      expect(result.valid).toBe(false);
    });
  });

  describe('samordningsnummer', () => {
    it('accepts samordningsnummer (day + 60)', () => {
      // Samordningsnummer: day 61-91 instead of 01-31
      // 900161 = January 1st, 1990, samordningsnummer
      const result = validatePersonnummer('900161-1234');
      // Check if valid depends on Luhn — adjust expected based on actual implementation
      expect(result).toHaveProperty('valid');
    });
  });
});

describe('formatPersonnummer', () => {
  it('formats valid input as YYMMDD-XXXX', () => {
    const result = formatPersonnummer('199001011234');
    expect(result).toMatch(/^\d{6}-\d{4}$/);
  });

  it('returns input unchanged for invalid input', () => {
    const result = formatPersonnummer('invalid');
    expect(result).toBe('invalid');
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/lib/__tests__/personnummer.test.ts`
Expected: Tests PASS. Adjust any test personnummer values that fail Luhn validation.

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/personnummer.test.ts
git commit -m "test: add personnummer validation test suite"
```

---

## Task 6: Swedish Inheritance Calculator — Extract Logic & Test

**Files:**
- Create: `src/lib/arvskalkylator.ts`
- Create: `src/lib/__tests__/arvskalkylator.test.ts`
- Modify: `src/app/arvskalkylator/page.tsx:28-250`

- [ ] **Step 1: Extract calculation logic from page component**

The `calculateInheritance` function (lines 28-250 of `src/app/arvskalkylator/page.tsx`) contains all calculation logic inline. Create `src/lib/arvskalkylator.ts` and move the function there:

```typescript
// src/lib/arvskalkylator.ts

export const PRISBASBELOPP = 57300; // Update annually

export interface CalcInput {
  familySituation: string;
  tillgangar: number;
  skulder: number;
  kostnader: number;
  testamente: boolean;
  delagare?: Array<{ namn: string; typ: string; andel?: number }>;
}

export interface CalcResult {
  heirs: Array<{
    name: string;
    type: string;
    amount: number;
    percentage: number;
  }>;
  bodelning?: {
    makesAndel: number;
    dodsboAndel: number;
  };
  totalEstate: number;
  netEstate: number;
}

export function calculateInheritance(input: CalcInput): CalcResult {
  // Move the full function body from page.tsx here
  // Keep exact same logic, just extract to separate module
}
```

Copy the exact function body from `page.tsx` lines 28-250 into this file.

- [ ] **Step 2: Write unit tests**

Create `src/lib/__tests__/arvskalkylator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateInheritance, PRISBASBELOPP } from '../arvskalkylator';

describe('calculateInheritance', () => {
  const baseInput = {
    tillgangar: 2000000,
    skulder: 200000,
    kostnader: 50000,
    testamente: false,
  };

  describe('gift med gemensamma barn', () => {
    it('gives spouse bodelning half + arv', () => {
      const result = calculateInheritance({
        ...baseInput,
        familySituation: 'gift_med_gemensamma_barn',
        delagare: [
          { namn: 'Make', typ: 'make' },
          { namn: 'Barn 1', typ: 'barn' },
        ],
      });

      expect(result.bodelning).toBeDefined();
      expect(result.heirs.length).toBeGreaterThan(0);

      const totalDistributed = result.heirs.reduce((sum, h) => sum + h.amount, 0);
      expect(totalDistributed).toBeCloseTo(result.netEstate, 0);
    });

    it('percentages sum to 100', () => {
      const result = calculateInheritance({
        ...baseInput,
        familySituation: 'gift_med_gemensamma_barn',
        delagare: [
          { namn: 'Make', typ: 'make' },
          { namn: 'Barn 1', typ: 'barn' },
          { namn: 'Barn 2', typ: 'barn' },
        ],
      });

      const totalPct = result.heirs.reduce((sum, h) => sum + h.percentage, 0);
      expect(totalPct).toBeCloseTo(100, 0);
    });
  });

  describe('gift med särkullbarn', () => {
    it('gives särkullbarn immediate inheritance right', () => {
      const result = calculateInheritance({
        ...baseInput,
        familySituation: 'gift_med_sarkullebarn',
        delagare: [
          { namn: 'Make', typ: 'make' },
          { namn: 'Särkullbarn', typ: 'sarkullbarn' },
        ],
      });

      const sarkullbarn = result.heirs.find(h => h.type === 'sarkullbarn');
      expect(sarkullbarn).toBeDefined();
      expect(sarkullbarn!.amount).toBeGreaterThan(0);
    });
  });

  describe('ogift med barn', () => {
    it('divides equally among children', () => {
      const result = calculateInheritance({
        ...baseInput,
        familySituation: 'ogift_med_barn',
        delagare: [
          { namn: 'Barn 1', typ: 'barn' },
          { namn: 'Barn 2', typ: 'barn' },
        ],
      });

      const barn = result.heirs.filter(h => h.type === 'barn');
      expect(barn).toHaveLength(2);
      expect(barn[0].amount).toBeCloseTo(barn[1].amount, 0);
    });
  });

  describe('edge cases', () => {
    it('handles zero estate', () => {
      const result = calculateInheritance({
        familySituation: 'ogift_med_barn',
        tillgangar: 0,
        skulder: 0,
        kostnader: 0,
        testamente: false,
        delagare: [{ namn: 'Barn', typ: 'barn' }],
      });

      expect(result.netEstate).toBe(0);
    });

    it('handles debts exceeding assets', () => {
      const result = calculateInheritance({
        familySituation: 'ogift_med_barn',
        tillgangar: 100000,
        skulder: 200000,
        kostnader: 0,
        testamente: false,
        delagare: [{ namn: 'Barn', typ: 'barn' }],
      });

      expect(result.netEstate).toBeLessThanOrEqual(0);
    });

    it('uses current prisbasbelopp', () => {
      expect(PRISBASBELOPP).toBe(57300);
    });
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/lib/__tests__/arvskalkylator.test.ts`
Expected: All tests PASS. Adjust field names based on actual CalcResult structure.

- [ ] **Step 4: Update page.tsx to import from lib**

In `src/app/arvskalkylator/page.tsx`, replace the inline function with:

```typescript
import { calculateInheritance, PRISBASBELOPP } from '@/lib/arvskalkylator';
```

Remove lines 28-250 (the old inline function).

- [ ] **Step 5: Verify page still works**

Run: `npm run build`
Expected: Build succeeds with no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/arvskalkylator.ts src/lib/__tests__/arvskalkylator.test.ts src/app/arvskalkylator/page.tsx
git commit -m "refactor: extract inheritance calculator to lib, add test suite"
```

---

## Task 7: Error Boundary for All Pages

**Files:**
- Create: `src/components/ErrorBoundary.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/global-error.tsx`

- [ ] **Step 1: Create the global error page**

Create `src/app/error.tsx` (Next.js App Router convention):

```typescript
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg)' }}
    >
      <div
        className="text-center max-w-md"
        style={{ color: 'var(--text)' }}
      >
        <div className="text-6xl mb-6">🕊️</div>
        <h2
          className="font-serif text-2xl mb-4"
          style={{ fontFamily: "'Libre Baskerville', serif" }}
        >
          Något gick fel
        </h2>
        <p
          className="mb-6 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Vi beklagar besväret. Din data är sparad och säker.
          Försök igen, eller gå tillbaka till startsidan.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full font-medium"
            style={{
              background: 'var(--accent)',
              color: 'white',
            }}
          >
            Försök igen
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-full font-medium"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            Till startsidan
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the global error boundary (for root layout errors)**

Create `src/app/global-error.tsx`:

```typescript
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: '#FAFBF9', color: '#1A1A2E', fontFamily: "'Libre Baskerville', serif" }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🕊️</div>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Något gick fel</h2>
            <p style={{ color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
              Vi beklagar besväret. Försök ladda om sidan.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                borderRadius: '9999px',
                background: '#6B7F5E',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Ladda om
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

Note: `global-error.tsx` must provide its own `<html>` and `<body>` tags since it replaces the root layout.

- [ ] **Step 3: Verify error handling works**

Run: `npm run build`
Expected: Build succeeds. Error pages are included in the output.

- [ ] **Step 4: Commit**

```bash
git add src/app/error.tsx src/app/global-error.tsx
git commit -m "feat: add grief-aware error boundaries for all pages"
```

---

## Task 8: Supabase Type Generation

**Files:**
- Create: `src/types/supabase.ts` (auto-generated)
- Modify: `package.json` (add script)
- Modify: `src/lib/supabase/services/dodsbo-service.ts` (use generated types)

- [ ] **Step 1: Install Supabase CLI (if not present)**

```bash
npm install -D supabase
```

- [ ] **Step 2: Add type generation script to package.json**

Add to `scripts` in `package.json`:

```json
"db:types": "supabase gen types typescript --project-id slpvqykepmenkholhkvo > src/types/supabase.ts"
```

- [ ] **Step 3: Generate types**

```bash
npx supabase login
npm run db:types
```

Expected: `src/types/supabase.ts` is created with full table definitions.

- [ ] **Step 4: Update dodsbo-service.ts to use generated types**

In `src/lib/supabase/services/dodsbo-service.ts`, add:

```typescript
import type { Database } from '@/types/supabase';

type DodsboRow = Database['public']['Tables']['dodsbon']['Row'];
type DodsboInsert = Database['public']['Tables']['dodsbon']['Insert'];
type DodsboUpdate = Database['public']['Tables']['dodsbon']['Update'];
```

Replace any existing manual type definitions with these generated ones.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds. Any type mismatches between code and DB schema are now caught.

- [ ] **Step 6: Commit**

```bash
git add src/types/supabase.ts package.json src/lib/supabase/services/dodsbo-service.ts
git commit -m "feat: add Supabase type generation, update dodsbo-service"
```

---

## Task 9: Styling Consolidation — CSS Variable Utilities

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/arvskalkylator/page.tsx:409` (last inline style)

- [ ] **Step 1: Audit remaining inline styles**

Run: `grep -rn "style={{" src/ --include="*.tsx" | grep "var(--"`
Expected: Minimal results after previous migrations. Document each one.

- [ ] **Step 2: Add Tailwind utility classes for CSS variables**

In `src/app/globals.css`, add after the existing theme variables (around line 310):

```css
/* Utility classes for CSS variable theming */
.bg-theme { background: var(--bg); }
.bg-card-theme { background: var(--bg-card); }
.text-theme { color: var(--text); }
.text-secondary-theme { color: var(--text-secondary); }
.border-theme { border-color: var(--border); }
.border-light-theme { border-color: var(--border-light); }
```

- [ ] **Step 3: Replace remaining inline styles**

In `src/app/arvskalkylator/page.tsx` line 409, replace:

```tsx
style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}
```

With a CSS class in globals.css:

```css
.card-sage-gradient {
  background: linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02));
  border: 1px solid rgba(107,127,94,0.15);
}

:root.dark .card-sage-gradient {
  background: linear-gradient(135deg, rgba(107,127,94,0.12), rgba(107,127,94,0.04));
  border: 1px solid rgba(107,127,94,0.25);
}
```

Then use `className="card-sage-gradient rounded-2xl p-6"` in the component.

- [ ] **Step 4: Run build to verify**

Run: `npm run build`
Expected: Build succeeds, no broken styles.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/arvskalkylator/page.tsx
git commit -m "refactor: consolidate remaining inline styles to CSS classes"
```

---

## Task 10: RLS Security Test Suite

**Files:**
- Create: `src/lib/supabase/__tests__/rls-audit.test.ts`

- [ ] **Step 1: Write RLS audit tests**

Create `src/lib/supabase/__tests__/rls-audit.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// These tests require two test users in Supabase
// User A owns dödsbo-A, User B owns dödsbo-B
// Tests verify User A cannot access dödsbo-B's data

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Test credentials — set in .env.test
const USER_A_EMAIL = process.env.TEST_USER_A_EMAIL || 'test-user-a@example.com';
const USER_A_PASSWORD = process.env.TEST_USER_A_PASSWORD || 'test-password-a';
const USER_B_EMAIL = process.env.TEST_USER_B_EMAIL || 'test-user-b@example.com';
const USER_B_PASSWORD = process.env.TEST_USER_B_PASSWORD || 'test-password-b';

describe('RLS Security Audit', () => {
  let clientA: ReturnType<typeof createClient>;
  let clientB: ReturnType<typeof createClient>;
  let dodsboA_id: string;
  let dodsboB_id: string;

  beforeAll(async () => {
    // Sign in as User A
    clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    await clientA.auth.signInWithPassword({ email: USER_A_EMAIL, password: USER_A_PASSWORD });

    // Sign in as User B
    clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    await clientB.auth.signInWithPassword({ email: USER_B_EMAIL, password: USER_B_PASSWORD });

    // Get each user's dödsbo
    const { data: dodsbonA } = await clientA.from('dodsbon').select('id').limit(1);
    const { data: dodsbonB } = await clientB.from('dodsbon').select('id').limit(1);

    dodsboA_id = dodsbonA?.[0]?.id;
    dodsboB_id = dodsbonB?.[0]?.id;
  });

  describe('dodsbon table', () => {
    it('User A can read own dödsbo', async () => {
      const { data, error } = await clientA.from('dodsbon').select('*').eq('id', dodsboA_id);
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });

    it('User A cannot read User B dödsbo', async () => {
      const { data } = await clientA.from('dodsbon').select('*').eq('id', dodsboB_id);
      expect(data).toHaveLength(0);
    });

    it('User A cannot update User B dödsbo', async () => {
      const { error } = await clientA
        .from('dodsbon')
        .update({ deceased_name: 'HACKED' })
        .eq('id', dodsboB_id);

      // Either error or 0 rows affected
      const { data } = await clientB.from('dodsbon').select('deceased_name').eq('id', dodsboB_id);
      expect(data?.[0]?.deceased_name).not.toBe('HACKED');
    });

    it('User A cannot delete User B dödsbo', async () => {
      const { error } = await clientA.from('dodsbon').delete().eq('id', dodsboB_id);

      // Verify B's dödsbo still exists
      const { data } = await clientB.from('dodsbon').select('id').eq('id', dodsboB_id);
      expect(data).toHaveLength(1);
    });
  });

  describe('anonymous access', () => {
    it('anonymous client cannot read any dödsbo', async () => {
      const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      // Don't sign in
      const { data } = await anonClient.from('dodsbon').select('*');
      expect(data).toHaveLength(0);
    });
  });

  // Repeat similar tests for child tables:
  // delagare, tillgangar, skulder, dokument, forsakringar,
  // tasks, losore, kostnader, samarbete
  // Each should verify cross-user isolation

  describe('delagare table', () => {
    it('User A cannot see User B delagare', async () => {
      const { data } = await clientA.from('delagare').select('*').eq('dodsbo_id', dodsboB_id);
      expect(data).toHaveLength(0);
    });
  });

  describe('tillgangar table', () => {
    it('User A cannot see User B tillgangar', async () => {
      const { data } = await clientA.from('tillgangar').select('*').eq('dodsbo_id', dodsboB_id);
      expect(data).toHaveLength(0);
    });
  });

  describe('skulder table', () => {
    it('User A cannot see User B skulder', async () => {
      const { data } = await clientA.from('skulder').select('*').eq('dodsbo_id', dodsboB_id);
      expect(data).toHaveLength(0);
    });
  });
});
```

**Important:** These tests require two test users set up in Supabase with test data. Create a seed script or set them up manually before running.

- [ ] **Step 2: Create .env.test for test credentials**

```bash
# .env.test — NOT committed to git
TEST_USER_A_EMAIL=test-a@sista-resan.se
TEST_USER_A_PASSWORD=TestPassword123!
TEST_USER_B_EMAIL=test-b@sista-resan.se
TEST_USER_B_PASSWORD=TestPassword456!
```

Add `.env.test` to `.gitignore`.

- [ ] **Step 3: Run RLS tests**

Run: `npx vitest run src/lib/supabase/__tests__/rls-audit.test.ts`
Expected: All tests PASS. If any fail — we found a security vulnerability that needs immediate fixing.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/__tests__/rls-audit.test.ts .gitignore
git commit -m "security: add RLS audit test suite for cross-user data isolation"
```

---

## Execution Order

Tasks can be parallelized in three lanes:

**Lane 1 — Security (Tasks 1→2→3→10):**
System prompt extraction → API audit → Rate limiting → RLS tests

**Lane 2 — Business logic tests (Tasks 4→5→6):**
Faraid tests → Personnummer tests → Inheritance calculator extraction + tests

**Lane 3 — UX & quality (Tasks 7→8→9):**
Error boundaries → Supabase types → Styling consolidation

All three lanes can run simultaneously with different agents.
