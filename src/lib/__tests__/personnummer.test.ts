import { describe, it, expect } from 'vitest';
import { validatePersonnummer, formatPersonnummer } from '../personnummer';

// ---------------------------------------------------------------------------
// Luhn-verified test numbers
//
// 811228-9874 → digits 8112289874
//   Luhn: 7+1+2+2+4+8+9+8+5+4 = 50 ✓
//
// 900101-1239 → digits 9001011239
//   Luhn: 9+0+0+1+0+1+2+2+6+9 = 30 ✓  (born 1990-01-01)
//
// 900161-1236 → digits 9001611236  (samordningsnummer, day 01+60=61)
//   Luhn: 9+0+0+1+3+1+2+2+6+6 = 30 ✓
// ---------------------------------------------------------------------------

describe('validatePersonnummer', () => {
  // -------------------------------------------------------------------------
  // Valid inputs
  // -------------------------------------------------------------------------
  describe('valid personnummer', () => {
    it('accepts YYMMDD-XXXX (10-char dash format)', () => {
      const result = validatePersonnummer('811228-9874');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('811228-9874');
      expect(result.error).toBeUndefined();
    });

    it('accepts YYMMDDXXXX (10-char no dash format)', () => {
      const result = validatePersonnummer('8112289874');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('811228-9874');
    });

    it('accepts YYYYMMDD-XXXX (12-char long format with dash)', () => {
      const result = validatePersonnummer('19811228-9874');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('811228-9874');
    });

    it('accepts YYYYMMDDXXXX (12-char long format without dash)', () => {
      const result = validatePersonnummer('198112289874');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('811228-9874');
    });

    it('accepts another valid number (900101-1239)', () => {
      const result = validatePersonnummer('900101-1239');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('900101-1239');
    });

    it('accepts input with leading/trailing whitespace', () => {
      const result = validatePersonnummer('  811228-9874  ');
      expect(result.valid).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Samordningsnummer (day + 60)
  // -------------------------------------------------------------------------
  describe('samordningsnummer', () => {
    it('accepts samordningsnummer where day digit > 60 (900161-1236)', () => {
      const result = validatePersonnummer('900161-1236');
      expect(result.valid).toBe(true);
      expect(result.formatted).toBe('900161-1236');
    });

    it('accepts samordningsnummer without dash (9001611236)', () => {
      const result = validatePersonnummer('9001611236');
      expect(result.valid).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Invalid inputs
  // -------------------------------------------------------------------------
  describe('invalid inputs', () => {
    it('rejects empty string', () => {
      const result = validatePersonnummer('');
      expect(result.valid).toBe(false);
      expect(result.formatted).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('rejects whitespace-only string', () => {
      const result = validatePersonnummer('   ');
      expect(result.valid).toBe(false);
      expect(result.formatted).toBeNull();
    });

    it('rejects input that is too short (5 digits)', () => {
      const result = validatePersonnummer('12345');
      expect(result.valid).toBe(false);
      expect(result.formatted).toBeNull();
    });

    it('rejects input that is too long (15 digits)', () => {
      const result = validatePersonnummer('123456789012345');
      expect(result.valid).toBe(false);
    });

    it('rejects non-numeric input (letters only)', () => {
      const result = validatePersonnummer('abcdefghij');
      expect(result.valid).toBe(false);
    });

    it('rejects letters mixed with digits', () => {
      const result = validatePersonnummer('8112AB-9874');
      expect(result.valid).toBe(false);
    });

    it('rejects invalid Luhn checksum (811228-9875 — last digit off by one)', () => {
      const result = validatePersonnummer('811228-9875');
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/kontrollsiffra/i);
    });

    it('rejects invalid Luhn checksum (900101-1230)', () => {
      const result = validatePersonnummer('900101-1230');
      expect(result.valid).toBe(false);
    });

    it('rejects invalid month 13 (901301-0000)', () => {
      const result = validatePersonnummer('901301-0000');
      expect(result.valid).toBe(false);
    });

    it('rejects invalid day 32 (900132-0000)', () => {
      const result = validatePersonnummer('900132-0000');
      expect(result.valid).toBe(false);
    });

    it('rejects month 00 (900001-0000)', () => {
      const result = validatePersonnummer('900001-0000');
      expect(result.valid).toBe(false);
    });

    it('rejects day 00 (900100-0000)', () => {
      const result = validatePersonnummer('900100-0000');
      expect(result.valid).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Return shape
  // -------------------------------------------------------------------------
  describe('return shape', () => {
    it('returns { valid: true, formatted, no error } for valid input', () => {
      const result = validatePersonnummer('811228-9874');
      expect(result).toMatchObject({ valid: true, formatted: '811228-9874' });
      expect(result.error).toBeUndefined();
    });

    it('returns { valid: false, formatted: null, error: string } for invalid input', () => {
      const result = validatePersonnummer('811228-9875');
      expect(result.valid).toBe(false);
      expect(result.formatted).toBeNull();
      expect(typeof result.error).toBe('string');
    });
  });
});

// ---------------------------------------------------------------------------
// formatPersonnummer
// ---------------------------------------------------------------------------
describe('formatPersonnummer', () => {
  it('formats a valid 10-char no-dash input to YYMMDD-XXXX', () => {
    expect(formatPersonnummer('8112289874')).toBe('811228-9874');
  });

  it('formats a valid long format (19811228-9874) to YYMMDD-XXXX', () => {
    expect(formatPersonnummer('19811228-9874')).toBe('811228-9874');
  });

  it('returns input unchanged when format is invalid', () => {
    expect(formatPersonnummer('not-a-number')).toBe('not-a-number');
  });

  it('returns input unchanged when Luhn fails', () => {
    expect(formatPersonnummer('811228-9875')).toBe('811228-9875');
  });

  it('returns input unchanged for empty string', () => {
    expect(formatPersonnummer('')).toBe('');
  });

  it('returns already-formatted string unchanged when valid', () => {
    expect(formatPersonnummer('811228-9874')).toBe('811228-9874');
  });
});
