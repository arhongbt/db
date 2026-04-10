// ============================================================
// Arvsordning — Decision tree based on Ärvdabalken (1958:637)
// Determines inheritance rights based on family situation
// ============================================================

import type { FamilySituation, Relation } from '@/types';

export interface ArvsInfo {
  /** Kort sammanfattning */
  summary: string;
  /** Detaljerad förklaring */
  details: string[];
  /** Viktiga varningar */
  warnings: string[];
  /** Vilka ärver? */
  heirs: { relation: string; share: string; note?: string }[];
  /** Relevanta lagrum */
  lawRefs: string[];
}

/**
 * Beräkna arvsordning baserat på familjesituation.
 * Förenklad modell — hänvisar till jurist vid komplexa fall.
 */
export function getArvsordning(
  situation: FamilySituation,
  hasTestamente: boolean | null
): ArvsInfo {
  const base = ARVS_REGLER[situation];

  if (hasTestamente === true) {
    return {
      ...base,
      warnings: [
        ...base.warnings,
        'Ett testamente finns som kan ändra fördelningen. Bröstarvingar (barn) har alltid rätt till sin laglott (halva arvslotten).',
        'Testamentet ska delges alla dödsbodelägare. De har 6 månader att klandra det.',
      ],
    };
  }

  return base;
}

const ARVS_REGLER: Record<FamilySituation, ArvsInfo> = {
  gift_med_gemensamma_barn: {
    summary: 'Efterlevande make/maka ärver med fri förfoganderätt. Barnen ärver vid makens/makans bortgång.',
    details: [
      'Efterlevande make/maka ärver allt med fri förfoganderätt (inte full äganderätt).',
      'Gemensamma barn har rätt till efterarv — de ärver sin del när den efterlevande maken/makan dör.',
      'Barnens arvslott "väntar" hos den efterlevande maken/makan.',
    ],
    warnings: [],
    heirs: [
      { relation: 'Make/maka', share: '100% (fri förfoganderätt)', note: 'Barnen ärver vid efterlevandes död' },
    ],
    lawRefs: ['ÄB 3 kap. 1§', 'ÄB 2 kap. 1§'],
  },

  gift_med_sarkullebarn: {
    summary: 'Särkullbarn har rätt att få ut sin arvslott direkt — de behöver inte vänta.',
    details: [
      'Särkullbarn (den avlidnes barn från tidigare förhållande) har rätt att få ut sin arvslott omedelbart.',
      'Efterlevande make/maka ärver resten med fri förfoganderätt.',
      'Särkullbarnet kan frivilligt avstå sin del till förmån för efterlevande (efterarvsrätt).',
      'Om bara särkullbarn finns och ingen gemensam barn, kan det påverka makens/makans rätt väsentligt.',
    ],
    warnings: [
      'OBS: Särkullbarn har starkare rättigheter än gemensamma barn. De kan kräva sin del direkt.',
      'Om den efterlevande inte kan betala ut särkullbarnets del kan bostaden behöva säljas.',
    ],
    heirs: [
      { relation: 'Särkullbarn', share: 'Lika delar av den avlidnes kvarlåtenskap', note: 'Rätt att få ut direkt' },
      { relation: 'Make/maka', share: 'Resten med fri förfoganderätt' },
    ],
    lawRefs: ['ÄB 3 kap. 1§', 'ÄB 3 kap. 9§'],
  },

  gift_utan_barn: {
    summary: 'Efterlevande make/maka ärver allt.',
    details: [
      'Utan barn ärver efterlevande make/maka hela kvarlåtenskapen.',
      'Den avlidnes föräldrar och syskon har efterarvsrätt — de ärver sin del när efterlevande make/maka dör.',
    ],
    warnings: [],
    heirs: [
      { relation: 'Make/maka', share: '100%', note: 'Med fri förfoganderätt' },
    ],
    lawRefs: ['ÄB 3 kap. 1-2§'],
  },

  ogift_med_barn: {
    summary: 'Barnen ärver allt, lika delar.',
    details: [
      'Alla barn (bröstarvingar) ärver lika stora delar.',
      'Om ett barn är avlidet ärver det barnets barn (barnbarn) genom istadarätt.',
      'Sambor ärver INTE varandra utan testamente.',
    ],
    warnings: [
      'Var den avlidne sambo? Sambon kan begära bodelning av samboegendom (gemensam bostad och bohag köpt för gemensamt bruk).',
    ],
    heirs: [
      { relation: 'Barn', share: 'Lika delar', note: 'Bröstarvingar i första arvsklassen' },
    ],
    lawRefs: ['ÄB 2 kap. 1§'],
  },

  sambo_med_barn: {
    summary: 'Barnen ärver allt. Sambon ärver inget utan testamente, men kan begära bodelning.',
    details: [
      'Sambor ärver INTE varandra enligt lag. Bara äkta makar har arvsrätt.',
      'Barnen ärver hela kvarlåtenskapen i lika delar.',
      'Sambon kan begära bodelning enligt sambolagen — gemensam bostad och bohag köpt för gemensamt bruk delas.',
      'Sambon har rätt att bo kvar i bostaden under en övergångsperiod (lilla basbeloppsregeln).',
    ],
    warnings: [
      'Utan testamente ärver sambon inget. Överväg att nämna detta om det finns en efterlevande sambo.',
      'Sambolagen gäller bara gemensam bostad och bohag anskaffat för gemensamt bruk.',
    ],
    heirs: [
      { relation: 'Barn', share: 'Allt (lika delar)' },
      { relation: 'Sambo', share: 'Inget arv', note: 'Kan begära bodelning av samboegendom' },
    ],
    lawRefs: ['ÄB 2 kap. 1§', 'Sambolagen 2003:376'],
  },

  sambo_utan_barn: {
    summary: 'Föräldrar eller syskon ärver. Sambon ärver inget utan testamente.',
    details: [
      'Sambor ärver INTE varandra. Arvet går till den avlidnes släktingar.',
      'Andra arvsklassen: Föräldrar ärver lika delar. Om en förälder är avliden ärver den avlidne förälderns barn (syskon).',
      'Sambon kan begära bodelning av samboegendom.',
    ],
    warnings: [
      'Om det inte finns föräldrar eller syskon går arvet till far-/morföräldrar (tredje arvsklassen).',
      'Finns inga arvingar alls ärver Allmänna arvsfonden.',
    ],
    heirs: [
      { relation: 'Föräldrar', share: 'Hälften var' },
      { relation: 'Syskon', share: 'Istadarätt om förälder avliden' },
      { relation: 'Sambo', share: 'Inget arv', note: 'Bodelning av samboegendom möjlig' },
    ],
    lawRefs: ['ÄB 2 kap. 2§', 'Sambolagen 2003:376'],
  },

  ensamstaende_utan_barn: {
    summary: 'Föräldrar, syskon eller mer avlägsna släktingar ärver.',
    details: [
      'Andra arvsklassen: Föräldrar ärver hälften var.',
      'Om en förälder är avliden ärver den sidan av syskon (istadarätt).',
      'Tredje arvsklassen: Far-/morföräldrar, sedan mostrar/fastrar.',
      'Kusiner ärver INTE — arvet går till Allmänna arvsfonden om inga närmare släktingar finns.',
    ],
    warnings: [
      'Kusiner har ingen arvsrätt i Sverige. Om det bara finns kusiner ärver Allmänna arvsfonden.',
    ],
    heirs: [
      { relation: 'Föräldrar', share: 'Hälften var' },
      { relation: 'Syskon', share: 'Om förälder avliden (istadarätt)' },
      { relation: 'Far-/morföräldrar', share: 'Tredje arvsklassen' },
    ],
    lawRefs: ['ÄB 2 kap. 2-3§'],
  },
};
