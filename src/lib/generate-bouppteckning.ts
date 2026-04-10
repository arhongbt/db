// ============================================================
// Bouppteckning Document Generator
// Generates a formatted bouppteckning text from collected data
// For MVP: generates structured text. Later: docx via API route.
// ============================================================

import type { Dodsbo } from '@/types';

export interface BouppteckningDocument {
  title: string;
  sections: { heading: string; content: string }[];
  generatedAt: string;
  warnings: string[];
}

export function generateBouppteckningDocument(
  state: Dodsbo
): BouppteckningDocument {
  const warnings: string[] = [];
  const sections: { heading: string; content: string }[] = [];

  const deathDate = state.deathDate
    ? new Date(state.deathDate).toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '–';

  const today = new Date().toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Validate data
  if (state.delagare.length === 0) {
    warnings.push('Inga dödsbodelägare registrerade.');
  }
  if (state.tillgangar.length === 0) {
    warnings.push('Inga tillgångar registrerade.');
  }

  // ── Section 1: Header ──
  sections.push({
    heading: 'BOUPPTECKNING',
    content: [
      `Bouppteckning efter ${state.deceasedName || '[Namn]'}`,
      `Dödsdatum: ${deathDate}`,
      `Bouppteckningsförrättning hållen: ${today}`,
      '',
      'Bouppgivare: [Namn på bouppgivare]',
      'Förrättningsmän: [Namn 1], [Namn 2]',
    ].join('\n'),
  });

  // ── Section 2: Dödsbodelägare ──
  const delagareText =
    state.delagare.length > 0
      ? state.delagare
          .map(
            (d, i) =>
              `${i + 1}. ${d.name}\n   Relation: ${formatRelation(d.relation)}${
                d.personnummer ? `\n   Personnummer: ${d.personnummer}` : ''
              }${d.email ? `\n   E-post: ${d.email}` : ''}${
                d.phone ? `\n   Telefon: ${d.phone}` : ''
              }`
          )
          .join('\n\n')
      : '[Inga dödsbodelägare registrerade]';

  sections.push({
    heading: 'DÖDSBODELÄGARE',
    content: delagareText,
  });

  // ── Section 3: Testamente ──
  const testamenteText =
    state.onboarding.hasTestamente === true
      ? 'Testamente finns. Testamentet ska bifogas bouppteckningen.'
      : state.onboarding.hasTestamente === false
      ? 'Inget testamente har påträffats.'
      : 'Uppgift saknas om huruvida testamente finns.';

  sections.push({
    heading: 'TESTAMENTE',
    content: testamenteText,
  });

  // ── Section 4: Tillgångar ──
  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0),
    0
  );

  const tillgangarText =
    state.tillgangar.length > 0
      ? [
          ...state.tillgangar.map(
            (t) =>
              `${formatTillgangType(t.type)}: ${t.description}${
                t.bank ? ` (${t.bank})` : ''
              }\n   Värde: ${
                t.estimatedValue != null
                  ? formatSEK(t.estimatedValue)
                  : 'Ej värderat'
              }`
          ),
          '',
          `SUMMA TILLGÅNGAR: ${formatSEK(totalTillgangar)}`,
        ].join('\n\n')
      : '[Inga tillgångar registrerade]';

  sections.push({
    heading: 'TILLGÅNGAR',
    content: tillgangarText,
  });

  // ── Section 5: Skulder ──
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0),
    0
  );

  const skulderText =
    state.skulder.length > 0
      ? [
          ...state.skulder.map(
            (s) =>
              `${formatSkuldType(s.type)}: ${s.creditor}\n   Belopp: ${
                s.amount != null ? formatSEK(s.amount) : 'Ej fastställt'
              }`
          ),
          '',
          `SUMMA SKULDER: ${formatSEK(totalSkulder)}`,
        ].join('\n\n')
      : 'Inga skulder har anmälts.';

  sections.push({
    heading: 'SKULDER',
    content: skulderText,
  });

  // ── Section 6: Behållning ──
  const netto = totalTillgangar - totalSkulder;
  sections.push({
    heading: 'BEHÅLLNING',
    content: `Summa tillgångar: ${formatSEK(totalTillgangar)}\nSumma skulder: ${formatSEK(totalSkulder)}\n\nBEHÅLLNING: ${formatSEK(netto)}`,
  });

  // ── Section 7: Försäkringar ──
  if (state.forsakringar.length > 0) {
    const forsakringarText = state.forsakringar
      .map(
        (f) =>
          `${formatForsakringType(f.type)}: ${f.company}${
            f.policyNumber ? ` (nr ${f.policyNumber})` : ''
          }${f.beneficiary ? `\n   Förmånstagare: ${f.beneficiary}` : ''}${
            f.estimatedValue != null
              ? `\n   Uppskattat värde: ${formatSEK(f.estimatedValue)}`
              : ''
          }`
      )
      .join('\n\n');

    sections.push({
      heading: 'FÖRSÄKRINGAR (för kännedom)',
      content: forsakringarText + '\n\nOBS: Försäkringar med namngiven förmånstagare ingår inte i dödsboet.',
    });
  }

  // ── Section 8: Underskrifter ──
  sections.push({
    heading: 'UNDERSKRIFTER',
    content: [
      'Ovanstående uppgifter intygas härmed:',
      '',
      '',
      '________________________________',
      'Bouppgivare',
      `${state.delagare[0]?.name || '[Namn]'}`,
      '',
      '',
      'Vi intygar att vi som förrättningsmän har gått igenom',
      'dödsboets tillgångar och skulder:',
      '',
      '',
      '________________________________     ________________________________',
      'Förrättningsman 1                    Förrättningsman 2',
      '[Namn]                               [Namn]',
    ].join('\n'),
  });

  return {
    title: `Bouppteckning efter ${state.deceasedName || '[Namn]'}`,
    sections,
    generatedAt: new Date().toISOString(),
    warnings,
  };
}

// ── Helpers ──

function formatSEK(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRelation(relation: string): string {
  const map: Record<string, string> = {
    make_maka: 'Make/maka',
    sambo: 'Sambo',
    barn: 'Barn',
    barnbarn: 'Barnbarn',
    foralder: 'Förälder',
    syskon: 'Syskon',
    annan_slakting: 'Annan släkting',
    testamentstagare: 'Testamentstagare',
    god_man: 'God man',
    ombud: 'Ombud',
  };
  return map[relation] || relation;
}

function formatTillgangType(type: string): string {
  const map: Record<string, string> = {
    bankkonto: 'Bankkonto',
    bostadsratt: 'Bostadsrätt',
    villa: 'Fastighet',
    fritidshus: 'Fritidshus',
    bil: 'Fordon',
    aktier_fonder: 'Aktier/fonder',
    pension: 'Pension',
    forsakring: 'Försäkring',
    losore: 'Lösöre',
    ovrigt: 'Övrigt',
  };
  return map[type] || type;
}

function formatSkuldType(type: string): string {
  const map: Record<string, string> = {
    bolan: 'Bolån',
    konsumentlan: 'Konsumentlån',
    kreditkort: 'Kreditkort',
    skatteskuld: 'Skatteskuld',
    begravningskostnad: 'Begravningskostnad',
    ovrigt: 'Övrigt',
  };
  return map[type] || type;
}

function formatForsakringType(type: string): string {
  const map: Record<string, string> = {
    livforsakring: 'Livförsäkring',
    grupplivforsakring: 'Grupplivförsäkring',
    tjanstepension: 'Tjänstepension',
    privat_pension: 'Privat pension',
    hemforsakring: 'Hemförsäkring',
    bilforsakring: 'Bilförsäkring',
    olycksfallsforsakring: 'Olycksfallsförsäkring',
    sjukforsakring: 'Sjukförsäkring',
    barnforsakring: 'Barnförsäkring',
    ovrigt: 'Övrigt',
  };
  return map[type] || type;
}
