import { describe, it, expect } from 'vitest';
import { BASE_PROMPT, buildSystemPrompt } from '../system-prompt';

describe('buildSystemPrompt', () => {
  it('returns base prompt when no context provided', () => {
    const result = buildSystemPrompt();
    expect(result).toBe(BASE_PROMPT);
  });

  it('returns base prompt when called with undefined', () => {
    const result = buildSystemPrompt(undefined);
    expect(result).toBe(BASE_PROMPT);
  });

  it('includes deceased name when provided', () => {
    const result = buildSystemPrompt({ deceasedName: 'Anna Lindgren' });
    expect(result).toContain('Anna Lindgren');
    expect(result).toContain('ANVÄNDARENS DÖDSBO-KONTEXT');
  });

  it('includes family situation when provided', () => {
    const result = buildSystemPrompt({ familySituation: 'Gift med tre barn' });
    expect(result).toContain('Gift med tre barn');
    expect(result).toContain('ANVÄNDARENS DÖDSBO-KONTEXT');
  });

  it('includes both deceased name and family situation when both provided', () => {
    const result = buildSystemPrompt({
      deceasedName: 'Erik Johansson',
      familySituation: 'Sambo utan testamente',
    });
    expect(result).toContain('Erik Johansson');
    expect(result).toContain('Sambo utan testamente');
  });

  it('includes raw context string when provided', () => {
    const rawContext = 'Kund har ett komplicerat dödsbo med fastigheter i två länder.';
    const result = buildSystemPrompt({ raw: rawContext });
    expect(result).toContain(rawContext);
    expect(result).toContain('ANVÄNDARENS DÖDSBO-KONTEXT');
  });

  it('starts with the base prompt when context is provided', () => {
    const result = buildSystemPrompt({ deceasedName: 'Test Person' });
    expect(result.startsWith(BASE_PROMPT)).toBe(true);
  });

  it('includes instruction to refer to deceased by name', () => {
    const result = buildSystemPrompt({ deceasedName: 'Lars Svensson' });
    expect(result).toContain('Hänvisa till den avlidnes namn om det finns');
  });

  it('handles empty context object', () => {
    const result = buildSystemPrompt({});
    expect(result.startsWith(BASE_PROMPT)).toBe(true);
  });

  it('raw context overrides structured fields when both provided', () => {
    const result = buildSystemPrompt({
      raw: 'Custom context',
      deceasedName: 'Erik',
      familySituation: 'gift',
    });
    expect(result).toContain('Custom context');
    expect(result).not.toContain('Erik');
  });
});

describe('BASE_PROMPT', () => {
  it('contains Ärvdabalken reference', () => {
    expect(BASE_PROMPT).toContain('Ärvdabalken');
  });

  it('contains faraid section', () => {
    expect(BASE_PROMPT).toContain('faraid');
  });

  it('contains bouppteckning section', () => {
    expect(BASE_PROMPT).toContain('bouppteckning');
  });

  it('contains key legal sections', () => {
    expect(BASE_PROMPT).toContain('ÄRVDABALKEN');
    expect(BASE_PROMPT).toContain('ÄKTENSKAPSBALKEN');
    expect(BASE_PROMPT).toContain('SAMBOLAGEN');
    expect(BASE_PROMPT).toContain('ISLAMISK ARVSRÄTT');
  });

  it('contains time limits section', () => {
    expect(BASE_PROMPT).toContain('TIDSFRISTER');
  });

  it('is a non-empty string', () => {
    expect(typeof BASE_PROMPT).toBe('string');
    expect(BASE_PROMPT.length).toBeGreaterThan(1000);
  });
});
