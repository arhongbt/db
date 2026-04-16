import { describe, it, expect } from 'vitest';
import { calculateInheritance, PRISBASBELOPP } from '../arvskalkylator';

// Simple translation stub: returns the Swedish string as-is
const t = (sv: string, _en?: string) => sv;

describe('PRISBASBELOPP', () => {
  it('ska vara 57300', () => {
    expect(PRISBASBELOPP).toBe(57300);
  });
});

describe('Edge cases', () => {
  it('noll tillgångar ger insolvent dödsbo', () => {
    const result = calculateInheritance(
      'ogift_med_barn',
      0, 0, 0,
      [{ name: 'Barn 1', relation: 'barn' }],
      null,
      undefined,
      t,
    );
    expect(result.nettoBehallning).toBe(0);
    expect(result.arvingar).toHaveLength(1);
    expect(result.arvingar[0].relation).toBe('insolvent');
    expect(result.arvingar[0].amount).toBe(0);
  });

  it('skulder överstiger tillgångar ger insolvent dödsbo', () => {
    const result = calculateInheritance(
      'ogift_med_barn',
      500_000, 600_000, 50_000,
      [{ name: 'Barn 1', relation: 'barn' }],
      null,
      undefined,
      t,
    );
    expect(result.nettoBehallning).toBe(-150_000);
    expect(result.arvingar[0].relation).toBe('insolvent');
  });

  it('ensam arvinge får hela nettobehållningen', () => {
    const result = calculateInheritance(
      'ogift_med_barn',
      1_000_000, 0, 0,
      [{ name: 'Anna', relation: 'barn' }],
      null,
      undefined,
      t,
    );
    const barn = result.arvingar.filter(a => a.relation === 'barn');
    expect(barn).toHaveLength(1);
    expect(barn[0].amount).toBe(1_000_000);
    expect(barn[0].share).toBe(100);
  });
});

describe('gift_med_gemensamma_barn', () => {
  it('make ärver dödsboets andel, barnen har efterarvsrätt', () => {
    const result = calculateInheritance(
      'gift_med_gemensamma_barn',
      2_000_000, 0, 0,
      [
        { name: 'Barn 1', relation: 'barn' },
        { name: 'Barn 2', relation: 'barn' },
      ],
      null,
      'Kerstin',
      t,
    );

    // Bodelning: 50/50
    expect(result.bodelning).toBeDefined();
    expect(result.bodelning!.makeAndel).toBe(1_000_000);
    expect(result.bodelning!.dodsboAndel).toBe(1_000_000);

    // Make ärver dödsboets andel med 100% och fri förfoganderätt
    const make = result.arvingar.find(a => a.relation === 'make_maka');
    expect(make).toBeDefined();
    expect(make!.name).toBe('Kerstin');
    expect(make!.share).toBe(100);
    expect(make!.amount).toBe(1_000_000);

    // Barnen har efterarvsrätt, share = 0 nu
    const barn = result.arvingar.filter(a => a.relation === 'barn');
    expect(barn).toHaveLength(2);
    barn.forEach(b => {
      expect(b.share).toBe(0);
      expect(b.amount).toBe(0);
    });
  });

  it('procentandelar summerar till 100% (make tar allt)', () => {
    const result = calculateInheritance(
      'gift_med_gemensamma_barn',
      3_000_000, 0, 0,
      [{ name: 'Barn 1', relation: 'barn' }],
      null,
      'Per',
      t,
    );
    const totalShare = result.arvingar
      .filter(a => a.share > 0)
      .reduce((sum, a) => sum + a.share, 0);
    expect(totalShare).toBe(100);
  });

  it('testamente lägger till laglott-varning', () => {
    const result = calculateInheritance(
      'gift_med_gemensamma_barn',
      1_000_000, 0, 0,
      [{ name: 'Barn 1', relation: 'barn' }],
      true,
      'Maria',
      t,
    );
    expect(result.laglottWarning).toBeDefined();
    expect(result.laglottWarning).toContain('Testamente');
  });
});

describe('gift_med_sarkullebarn', () => {
  it('särkullbarn får direkt arv av dödsboets andel', () => {
    const result = calculateInheritance(
      'gift_med_sarkullebarn',
      2_000_000, 0, 0,
      [
        { name: 'Särkullbarn 1', relation: 'barn' },
        { name: 'Särkullbarn 2', relation: 'barn' },
      ],
      null,
      'Erik',
      t,
    );

    // Bodelning: 50/50
    expect(result.bodelning!.dodsboAndel).toBe(1_000_000);

    // Varje särkullbarn får lika del av dödsboets andel
    const sarkullebarn = result.arvingar.filter(a => a.relation === 'barn');
    expect(sarkullebarn).toHaveLength(2);
    expect(sarkullebarn[0].amount).toBe(500_000);
    expect(sarkullebarn[1].amount).toBe(500_000);
    expect(sarkullebarn[0].share).toBe(50);
    expect(sarkullebarn[1].share).toBe(50);

    // Make behåller sin bodelningsandel men ärver inte dödsboets andel
    const make = result.arvingar.find(a => a.relation === 'make_maka');
    expect(make).toBeDefined();
    expect(make!.amount).toBe(1_000_000); // bodelningsandel
    expect(make!.share).toBe(0);
  });

  it('laglott-varning sätts för särkullbarn', () => {
    const result = calculateInheritance(
      'gift_med_sarkullebarn',
      1_000_000, 0, 0,
      [{ name: 'Barn', relation: 'barn' }],
      null,
      'Make',
      t,
    );
    expect(result.laglottWarning).toContain('Särkullbarn');
  });
});

describe('ogift_med_barn', () => {
  it('tre barn delar lika', () => {
    const result = calculateInheritance(
      'ogift_med_barn',
      900_000, 0, 0,
      [
        { name: 'Barn 1', relation: 'barn' },
        { name: 'Barn 2', relation: 'barn' },
        { name: 'Barn 3', relation: 'barn' },
      ],
      null,
      undefined,
      t,
    );

    const barn = result.arvingar.filter(a => a.relation === 'barn');
    expect(barn).toHaveLength(3);
    barn.forEach(b => {
      expect(b.amount).toBe(300_000);
      expect(b.share).toBe(33); // Math.round(100/3)
    });

    // Ingen bodelning för ogift
    expect(result.bodelning).toBeUndefined();
  });

  it('netto beräknas korrekt med skulder och kostnader', () => {
    const result = calculateInheritance(
      'ogift_med_barn',
      1_000_000, 200_000, 50_000,
      [{ name: 'Barn 1', relation: 'barn' }],
      null,
      undefined,
      t,
    );
    expect(result.nettoBehallning).toBe(750_000);
    const barn = result.arvingar.find(a => a.relation === 'barn');
    expect(barn!.amount).toBe(750_000);
  });
});

describe('ensamstaende_utan_barn', () => {
  it('föräldrar ärver om inga barn', () => {
    const result = calculateInheritance(
      'ensamstaende_utan_barn',
      600_000, 0, 0,
      [
        { name: 'Mamma', relation: 'foralder' },
        { name: 'Pappa', relation: 'foralder' },
      ],
      null,
      undefined,
      t,
    );
    const foraldar = result.arvingar.filter(a => a.relation === 'foralder');
    expect(foraldar).toHaveLength(2);
    foraldar.forEach(f => {
      expect(f.amount).toBe(300_000);
      expect(f.share).toBe(50);
    });
  });

  it('syskon ärver om inga föräldrar', () => {
    const result = calculateInheritance(
      'ensamstaende_utan_barn',
      400_000, 0, 0,
      [
        { name: 'Syskon 1', relation: 'syskon' },
        { name: 'Syskon 2', relation: 'syskon' },
      ],
      null,
      undefined,
      t,
    );
    const syskon = result.arvingar.filter(a => a.relation === 'syskon');
    expect(syskon).toHaveLength(2);
    syskon.forEach(s => {
      expect(s.amount).toBe(200_000);
    });
  });

  it('allmänna arvsfonden ärver om inga arvingar', () => {
    const result = calculateInheritance(
      'ensamstaende_utan_barn',
      500_000, 0, 0,
      [],
      null,
      undefined,
      t,
    );
    const fond = result.arvingar.find(a => a.relation === 'annan_slakting');
    expect(fond).toBeDefined();
    expect(fond!.amount).toBe(500_000);
    expect(fond!.share).toBe(100);
  });
});
