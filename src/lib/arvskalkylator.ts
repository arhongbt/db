import type { FamilySituation } from '@/types';

export interface Arvinge {
  name: string;
  relation: string;
  share: number; // procent
  amount: number;
  note?: string;
}

export interface CalcResult {
  arvingar: Arvinge[];
  bodelning?: { makeAndel: number; dodsboAndel: number };
  laglottWarning?: string;
  totalTillgangar: number;
  totalSkulder: number;
  totalKostnader: number;
  nettoBehallning: number;
}

// Prisbasbelopp uppdateras årligen av SCB — kontrollera på scb.se/prisbasbelopp
// 2025: 57 300 kr | 2026: uppdatera här när SCB publicerar nytt värde
export const PRISBASBELOPP = 57300;

function formatSEK(n: number): string {
  return n.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });
}

export function calculateInheritance(
  familySituation: FamilySituation,
  tillgangar: number,
  skulder: number,
  kostnader: number,
  delagareNames: { name: string; relation: string }[],
  hasTestamente: boolean | null,
  makeNamn: string | undefined,
  t: (sv: string, en?: string) => string,
): CalcResult {
  const netto = tillgangar - skulder - kostnader;
  const result: CalcResult = {
    arvingar: [],
    totalTillgangar: tillgangar,
    totalSkulder: skulder,
    totalKostnader: kostnader,
    nettoBehallning: netto,
  };

  if (netto <= 0) {
    result.arvingar = [{ name: t('Dödsboet', 'Estate'), relation: 'insolvent', share: 0, amount: 0, note: t('Dödsboet saknar tillgångar att fördela. Arvingar ärver aldrig skulder.', 'The estate has no assets to distribute. Heirs never inherit debts.') }];
    return result;
  }

  const barn = delagareNames.filter(d => d.relation === 'barn' || d.relation === 'barnbarn');

  switch (familySituation) {
    case 'gift_med_gemensamma_barn': {
      // Bodelning: 50/50 giftorättsgods
      const makeAndel = netto / 2;
      const dodsboAndel = netto / 2;
      result.bodelning = { makeAndel, dodsboAndel };

      // Make ärver med fri förfoganderätt, barnen har efterarvsrätt
      result.arvingar.push({
        name: makeNamn || t('Efterlevande make/maka', 'Surviving spouse'),
        relation: 'make_maka',
        share: 100,
        amount: dodsboAndel,
        note: t('Ärver med fri förfoganderätt (ÄB 3:1). Barnen har efterarvsrätt.', 'Inherits with unrestricted disposal right (ÄB 3:1). Children have succession rights.'),
      });
      barn.forEach(b => {
        result.arvingar.push({
          name: b.name || t('Barn', 'Child'),
          relation: 'barn',
          share: 0,
          amount: 0,
          note: t(`Efterarvsrätt: Får sin del (${barn.length > 0 ? Math.round(100 / barn.length) : 0}%) när efterlevande make avlider.`, `Succession rights: Receives their share (${barn.length > 0 ? Math.round(100 / barn.length) : 0}%) when the surviving spouse passes away.`),
        });
      });
      break;
    }

    case 'gift_med_sarkullebarn': {
      const makeAndel = netto / 2;
      const dodsboAndel = netto / 2;
      result.bodelning = { makeAndel, dodsboAndel };

      const sarkullebarn = barn.filter(b => b.relation === 'barn');
      if (sarkullebarn.length > 0) {
        const perBarn = dodsboAndel / sarkullebarn.length;
        sarkullebarn.forEach(b => {
          result.arvingar.push({
            name: b.name || t('Särkullbarn', 'Separate child'),
            relation: 'barn',
            share: Math.round((perBarn / dodsboAndel) * 100),
            amount: perBarn,
            note: t('Särkullbarn har rätt att få ut sin arvslott direkt (ÄB 3:1 2st). Kan frivilligt avstå.', 'Separate children have the right to receive their inheritance share immediately (ÄB 3:1 2st). Can voluntarily waive.'),
          });
        });
        result.arvingar.push({
          name: makeNamn || t('Efterlevande make/maka', 'Surviving spouse'),
          relation: 'make_maka',
          share: 0,
          amount: makeAndel,
          note: t(`Behåller sin bodelningsandel (${formatSEK(makeAndel)}). Ärver inte den avlidnes andel om särkullbarn kräver sin del.`, `Retains their division of property share (${formatSEK(makeAndel)}). Does not inherit the deceased's share if separate children claim their part.`),
        });
      }
      result.laglottWarning = t('Särkullbarn har alltid rätt till sin laglott (halva arvslotten). De kan inte göras arvlösa genom testamente.', 'Separate children always have the right to their compulsory share (half of inheritance). They cannot be disinherited by will.');
      break;
    }

    case 'gift_utan_barn': {
      const makeAndel = netto / 2;
      const dodsboAndel = netto / 2;
      result.bodelning = { makeAndel, dodsboAndel };

      result.arvingar.push({
        name: makeNamn || t('Efterlevande make/maka', 'Surviving spouse'),
        relation: 'make_maka',
        share: 100,
        amount: dodsboAndel,
        note: t('Ärver allt med fri förfoganderätt (ÄB 3:1). Föräldrar/syskon har efterarvsrätt.', 'Inherits everything with unrestricted disposal right (ÄB 3:1). Parents/siblings have succession rights.'),
      });
      break;
    }

    case 'ogift_med_barn':
    case 'sambo_med_barn': {
      const arvsmassan = netto;

      // Sambo kan begära bodelning av samboegendom
      if (familySituation === 'sambo_med_barn') {
        const samboNote = t('Efterlevande sambo kan begära bodelning av samboegendom (bostad + bohag köpt för gemensamt bruk). Lilla basbeloppsregeln: rätt till minst 2 prisbasbelopp.', 'Surviving partner can request division of shared cohabitation property (home + household items purchased for joint use). Small base amount rule: right to at least 2 base amounts.');
        result.arvingar.push({
          name: t('Efterlevande sambo', 'Surviving partner'),
          relation: 'sambo',
          share: 0,
          amount: 0,
          note: samboNote,
        });
      }

      if (barn.length > 0) {
        const perBarn = arvsmassan / barn.length;
        barn.forEach(b => {
          result.arvingar.push({
            name: b.name || t('Barn', 'Child'),
            relation: 'barn',
            share: Math.round(100 / barn.length),
            amount: perBarn,
            note: t('Ärver lika del enligt arvsordningen (ÄB 2:1).', 'Inherits equal share according to inheritance order (ÄB 2:1).'),
          });
        });
      }
      break;
    }

    case 'sambo_utan_barn': {
      // Sambor ärver inte varandra
      const parents = delagareNames.filter(d => d.relation === 'foralder');
      const syskon = delagareNames.filter(d => d.relation === 'syskon');

      result.arvingar.push({
        name: t('Efterlevande sambo', 'Surviving partner'),
        relation: 'sambo',
        share: 0,
        amount: 0,
        note: t('Sambor ärver INTE varandra utan testamente. Kan begära bodelning av samboegendom.', 'Partners do NOT inherit from each other without a will. Can request division of shared property.'),
      });

      if (parents.length > 0) {
        const perParent = netto / parents.length;
        parents.forEach(p => {
          result.arvingar.push({
            name: p.name || t('Förälder', 'Parent'),
            relation: 'foralder',
            share: Math.round(100 / parents.length),
            amount: perParent,
            note: t('2:a arvsklassen (ÄB 2:2).', '2nd class of heirs (ÄB 2:2).'),
          });
        });
      } else if (syskon.length > 0) {
        const perSyskon = netto / syskon.length;
        syskon.forEach(s => {
          result.arvingar.push({
            name: s.name || t('Syskon', 'Sibling'),
            relation: 'syskon',
            share: Math.round(100 / syskon.length),
            amount: perSyskon,
            note: t('Ärver i föräldrarnas ställe (ÄB 2:2 2st).', 'Inherits in parents\' place (ÄB 2:2 2st).'),
          });
        });
      } else {
        result.arvingar.push({
          name: t('Allmänna arvsfonden', 'Swedish Inheritance Fund'),
          relation: 'annan_slakting',
          share: 100,
          amount: netto,
          note: t('Utan arvingar tillfaller arvet Allmänna arvsfonden.', 'Without heirs, the estate goes to the Swedish Inheritance Fund.'),
        });
      }
      break;
    }

    case 'ensamstaende_utan_barn': {
      const parents = delagareNames.filter(d => d.relation === 'foralder');
      const syskon = delagareNames.filter(d => d.relation === 'syskon');

      if (parents.length > 0) {
        const perParent = netto / parents.length;
        parents.forEach(p => {
          result.arvingar.push({
            name: p.name || t('Förälder', 'Parent'),
            relation: 'foralder',
            share: Math.round(100 / parents.length),
            amount: perParent,
          });
        });
      } else if (syskon.length > 0) {
        const perSyskon = netto / syskon.length;
        syskon.forEach(s => {
          result.arvingar.push({
            name: s.name || t('Syskon', 'Sibling'),
            relation: 'syskon',
            share: Math.round(100 / syskon.length),
            amount: perSyskon,
          });
        });
      } else {
        result.arvingar.push({
          name: t('Allmänna arvsfonden', 'Swedish Inheritance Fund'),
          relation: 'annan_slakting',
          share: 100,
          amount: netto,
          note: t('Utan arvingar tillfaller arvet Allmänna arvsfonden.', 'Without heirs, the estate goes to the Swedish Inheritance Fund.'),
        });
      }
      break;
    }
  }

  if (hasTestamente) {
    result.laglottWarning = (result.laglottWarning || '') +
      ' ' + t('OBS: Testamente kan påverka fördelningen. Bröstarvingar har alltid rätt till laglott (halva arvslotten, ÄB 7:1). Testamentet måste klandras inom 6 månader.', 'NOTE: Wills can affect distribution. Compulsory heirs always have the right to their compulsory share (half of inheritance, ÄB 7:1). The will must be challenged within 6 months.');
  }

  return result;
}
