// ============================================================
// Bouppteckning Document Generator
// Follows the official Skatteverket SKV 4600 blankett structure
// ============================================================

import type { Dodsbo } from '@/types';

export interface BouppteckningSection {
  heading: string;
  /** Labeled field rows: [label, value] */
  fields?: [string, string][];
  /** Free text content */
  content?: string;
  /** Table rows: [description, value] */
  tableRows?: [string, string][];
  /** Summary total row */
  totalRow?: [string, string];
}

export interface BouppteckningDocument {
  title: string;
  sections: BouppteckningSection[];
  generatedAt: string;
  warnings: string[];
}

export function generateBouppteckningDocument(
  state: Dodsbo
): BouppteckningDocument {
  const warnings: string[] = [];
  const sections: BouppteckningSection[] = [];

  // ── Validate & collect warnings ──
  if (!state.deceasedPersonnummer) {
    warnings.push('Personnummer saknas — krävs av Skatteverket.');
  }
  if (!state.deceasedAddress) {
    warnings.push('Den avlidnes adress saknas.');
  }
  if (state.delagare.length === 0) {
    warnings.push('Inga dödsbodelägare registrerade.');
  }
  if (state.tillgangar.length === 0) {
    warnings.push('Inga tillgångar registrerade.');
  }
  if (!state.forrattningsman || state.forrattningsman.length < 2) {
    warnings.push('Två förrättningsmän krävs — ange under "Komplettera för Skatteverket".');
  }
  if (!state.bouppgivare?.name) {
    warnings.push('Bouppgivare saknas.');
  }

  const deathDate = state.deathDate
    ? new Date(state.deathDate).toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '–';

  const forrattningsDate = state.forrattningsdatum
    ? new Date(state.forrattningsdatum).toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '[Ej angivet]';

  const civilstandLabel: Record<string, string> = {
    gift: 'Gift',
    ogift: 'Ogift',
    anka_ankling: 'Änka/änkling',
    skild: 'Skild',
  };

  // ── Section 1: Den avlidne ──
  sections.push({
    heading: 'DEN AVLIDNE',
    fields: [
      ['Namn', state.deceasedName || '[Ej angivet]'],
      ['Personnummer', state.deceasedPersonnummer || '[Ej angivet]'],
      ['Adress', state.deceasedAddress || '[Ej angivet]'],
      ['Folkbokföringsort', state.deceasedFolkbokforingsort || '[Ej angivet]'],
      ['Civilstånd', state.deceasedCivilstand ? civilstandLabel[state.deceasedCivilstand] : '[Ej angivet]'],
      ['Medborgarskap', state.deceasedMedborgarskap || 'Svenskt'],
      ['Dödsdatum', deathDate],
    ],
  });

  // ── Section 2: Förrättning ──
  sections.push({
    heading: 'FÖRRÄTTNING',
    fields: [
      ['Förrättningsdatum', forrattningsDate],
      ['Bouppgivare', state.bouppgivare?.name || '[Ej angivet]'],
      ['Förrättningsman 1', state.forrattningsman?.[0]?.name || '[Ej angivet]'],
      ['Förrättningsman 2', state.forrattningsman?.[1]?.name || '[Ej angivet]'],
    ],
  });

  // ── Section 3: Dödsbodelägare ──
  const delagareContent =
    state.delagare.length > 0
      ? state.delagare
          .map(
            (d, i) =>
              `${i + 1}. ${d.name}${d.personnummer ? ` (${d.personnummer})` : ''}\n   Relation: ${formatRelation(d.relation)}${d.email ? `  |  ${d.email}` : ''}${d.phone ? `  |  ${d.phone}` : ''}`
          )
          .join('\n\n')
      : '[Inga dödsbodelägare registrerade]';

  sections.push({
    heading: 'DÖDSBODELÄGARE',
    content: delagareContent,
  });

  // ── Section 4: Testamente ──
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

  // ── Section 5: Tillgångar (broken into subcategories like SKV) ──
  const fastigheter = state.tillgangar.filter((t) =>
    ['villa', 'bostadsratt', 'fritidshus'].includes(t.type)
  );
  const bankmedel = state.tillgangar.filter((t) => t.type === 'bankkonto');
  const vardepapper = state.tillgangar.filter((t) => t.type === 'aktier_fonder');
  const losore = state.tillgangar.filter((t) =>
    ['losore', 'bil', 'forsakring', 'pension', 'ovrigt'].includes(t.type)
  );

  const totalTillgangar = state.tillgangar.reduce(
    (sum, t) => sum + (t.estimatedValue ?? 0),
    0
  );

  const tillgangarRows: [string, string][] = [];

  if (fastigheter.length > 0) {
    tillgangarRows.push(['── Fastigheter ──', '']);
    fastigheter.forEach((t) => {
      tillgangarRows.push([
        `${formatTillgangType(t.type)}: ${t.description}`,
        t.estimatedValue != null ? formatSEK(t.estimatedValue) : 'Ej värderat',
      ]);
    });
  }

  if (bankmedel.length > 0) {
    tillgangarRows.push(['── Bankmedel ──', '']);
    bankmedel.forEach((t) => {
      tillgangarRows.push([
        `${t.description}${t.bank ? ` (${t.bank})` : ''}`,
        t.estimatedValue != null ? formatSEK(t.estimatedValue) : 'Ej värderat',
      ]);
    });
  }

  if (vardepapper.length > 0) {
    tillgangarRows.push(['── Värdepapper ──', '']);
    vardepapper.forEach((t) => {
      tillgangarRows.push([
        t.description,
        t.estimatedValue != null ? formatSEK(t.estimatedValue) : 'Ej värderat',
      ]);
    });
  }

  if (losore.length > 0) {
    tillgangarRows.push(['── Lösöre och övrigt ──', '']);
    losore.forEach((t) => {
      tillgangarRows.push([
        `${formatTillgangType(t.type)}: ${t.description}`,
        t.estimatedValue != null ? formatSEK(t.estimatedValue) : 'Ej värderat',
      ]);
    });
  }

  if (state.tillgangar.length === 0) {
    tillgangarRows.push(['[Inga tillgångar registrerade]', '']);
  }

  sections.push({
    heading: 'TILLGÅNGAR',
    tableRows: tillgangarRows,
    totalRow: ['SUMMA TILLGÅNGAR', formatSEK(totalTillgangar)],
  });

  // ── Section 6: Skulder ──
  const totalSkulder = state.skulder.reduce(
    (sum, s) => sum + (s.amount ?? 0),
    0
  );

  const skulderRows: [string, string][] = state.skulder.map((s) => [
    `${formatSkuldType(s.type)}: ${s.creditor}`,
    s.amount != null ? formatSEK(s.amount) : 'Ej fastställt',
  ]);

  if (state.skulder.length === 0) {
    skulderRows.push(['Inga skulder har anmälts.', '']);
  }

  sections.push({
    heading: 'SKULDER',
    tableRows: skulderRows,
    totalRow: ['SUMMA SKULDER', formatSEK(totalSkulder)],
  });

  // ── Section 7: Behållning ──
  const netto = totalTillgangar - totalSkulder;
  sections.push({
    heading: 'BEHÅLLNING',
    fields: [
      ['Summa tillgångar', formatSEK(totalTillgangar)],
      ['Summa skulder', formatSEK(totalSkulder)],
    ],
    totalRow: ['BEHÅLLNING', formatSEK(netto)],
  });

  // ── Section 8: Försäkringar (för kännedom) ──
  if (state.forsakringar.length > 0) {
    const forsakringarRows: [string, string][] = state.forsakringar.map(
      (f) => [
        `${formatForsakringType(f.type)}: ${f.company}${f.beneficiary ? ` (förmånstagare: ${f.beneficiary})` : ''}`,
        f.estimatedValue != null ? formatSEK(f.estimatedValue) : '',
      ]
    );

    sections.push({
      heading: 'FÖRSÄKRINGAR (för kännedom)',
      tableRows: forsakringarRows,
      content:
        'OBS: Försäkringar med namngiven förmånstagare ingår inte i dödsboet.',
    });
  }

  // ── Section 9: Underskrifter ──
  sections.push({
    heading: 'UNDERSKRIFTER',
    content: [
      'Ovanstående uppgifter intygas härmed vara riktiga.',
      '',
      '',
      '________________________________',
      `Bouppgivare: ${state.bouppgivare?.name || '[Namn]'}`,
      '',
      '',
      'Vi intygar att vi som förrättningsmän har gått igenom',
      'dödsboets tillgångar och skulder:',
      '',
      '',
      '________________________________          ________________________________',
      `${state.forrattningsman?.[0]?.name || '[Förrättningsman 1]'}                    ${state.forrattningsman?.[1]?.name || '[Förrättningsman 2]'}`,
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
