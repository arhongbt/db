import { describe, it, expect } from 'vitest';
import { validatePersonnummer, formatPersonnummer } from '../personnummer';

describe('validatePersonnummer', () => {
  // Giltiga personnummer (verkliga testformat med korrekt Luhn)
  const VALID_CASES = [
    { input: '811228-9874', desc: 'ÅÅMMDD-XXXX format' },
    { input: '8112289874', desc: 'ÅÅMMDDXXXX utan bindestreck' },
    { input: '19811228-9874', desc: 'ÅÅÅÅMMDD-XXXX format' },
    { input: '198112289874', desc: 'ÅÅÅÅMMDDXXXX utan bindestreck' },
  ];

  it.each(VALID_CASES)('godkänner $desc ($input)', ({ input }) => {
    const result = validatePersonnummer(input);
    expect(result.valid).toBe(true);
    expect(result.formatted).toMatch(/^\d{6}-\d{4}$/);
    expect(result.error).toBeUndefined();
  });

  it('formaterar till ÅÅMMDD-XXXX', () => {
    const result = validatePersonnummer('198112289874');
    expect(result.formatted).toBe('811228-9874');
  });

  // Ogiltiga format
  it('avvisar tomt input', () => {
    const result = validatePersonnummer('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('avvisar för kort input', () => {
    const result = validatePersonnummer('123456');
    expect(result.valid).toBe(false);
  });

  it('avvisar bokstäver', () => {
    const result = validatePersonnummer('ABCDEF-GHIJ');
    expect(result.valid).toBe(false);
  });

  it('avvisar ogiltig månad', () => {
    const result = validatePersonnummer('901301-1234');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('datum');
  });

  it('avvisar ogiltig dag', () => {
    const result = validatePersonnummer('900132-1234');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('datum');
  });

  it('avvisar fel kontrollsiffra', () => {
    const result = validatePersonnummer('811228-9875');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Kontrollsiffra');
  });

  // Samordningsnummer (dag + 60)
  it('accepterar dag > 60 som samordningsnummer', () => {
    // Dag 61-91 är giltiga samordningsdagar (1-31 + 60)
    // Vi testar att datumet accepteras, Luhn kan misslyckas beroende på siffror
    const result = validatePersonnummer('811288-9874');
    // Om Luhn stämmer → valid, annars felet ska vara om kontrollsiffra, inte datum
    if (!result.valid) {
      expect(result.error).not.toContain('datum');
    }
  });

  // Edge cases
  it('hanterar null-liknande input', () => {
    const result = validatePersonnummer('   ');
    expect(result.valid).toBe(false);
  });
});

describe('formatPersonnummer', () => {
  it('formaterar giltigt nummer', () => {
    expect(formatPersonnummer('198112289874')).toBe('811228-9874');
  });

  it('returnerar input om ogiltigt', () => {
    expect(formatPersonnummer('hejhej')).toBe('hejhej');
  });
});
