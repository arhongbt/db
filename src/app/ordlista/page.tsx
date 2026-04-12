'use client';

import { useState, useMemo } from 'react';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { MikeRossTip } from '@/components/ui/MikeRossTip';

interface GlossaryTerm {
  term: string;
  explanation: string;
  legalRef?: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Arvlåtare',
    explanation:
      'Den person som har avlidit och vars egendom nu ska delas mellan arvingarna. Även kallad den avlidne eller dekujus.',
    legalRef: 'Ärvdabalken',
  },
  {
    term: 'Arvlott',
    explanation:
      'Andelen av arvet som en arving har rätt till enligt arvordningen. En arvlott är normalt en viss del (1/4, 1/3 osv) av nettodödsboet.',
    legalRef: 'Ärvdabalken',
  },
  {
    term: 'Arvskifte',
    explanation:
      'Fördelningen av dödsboets tillgångar mellan arvingarna. Vid ett arvskifte görs en överenskommelse om hur egendom och pengar ska delas.',
  },
  {
    term: 'Arvsklass 1:a',
    explanation:
      'Första arvklassen består av barn (och deras ättlingar). De har högsta prioritet och ärver före senare klasser.',
    legalRef: 'Ärvdabalken 3 kap.',
  },
  {
    term: 'Arvsklass 2:a',
    explanation:
      'Andra arvklassen består av föräldrar och deras barn (syskon till den avlidne). De ärver endast om ingen från första klassen finns.',
    legalRef: 'Ärvdabalken 3 kap.',
  },
  {
    term: 'Arvsklass 3:e',
    explanation:
      'Tredje arvklassen består av morföräldrar, farföräldrar och deras ättlingar. De ärver endast om två första klasserna inte finns.',
    legalRef: 'Ärvdabalken 3 kap.',
  },
  {
    term: 'Bodelning',
    explanation:
      'Uppdelningen av gemensam egendom mellan två personer, t.ex. mellan makar vid separation, eller mellan dödsbo och efterlevande maka/make.',
    legalRef: 'Äktenskapsbalken, Ärvdabalken',
  },
  {
    term: 'Bouppteckning',
    explanation:
      'En fullständig förteckning över dödsboets alla tillgångar, skulder och kostnader. Är juridisk handling som måste in till Skatteverket. Måste göras normalt inom 4 månader.',
    legalRef: 'Ärvdabalken 16 kap.',
  },
  {
    term: 'Bouppgivare',
    explanation:
      'En vuxen arving som är bosatt i Sverige och tar ansvar för att bouppteckningen görs och skickas till Skatteverket. Kan också kallas förrättningsman.',
  },
  {
    term: 'Boutredningsman',
    explanation:
      'En neutral person som utses av tingsrätten för att administrera dödsboet när arvingarna inte kan komma överens. Tar över administrationen och försöker lösa konflikter.',
    legalRef: 'Ärvdabalken 19 kap.',
  },
  {
    term: 'Dödsbo',
    explanation:
      'Den egendom och de rättigheter som den avlidne lämnade efter sig. Dödsboet ägs av arvingarna tillsammans fram till arvskiftet är gjort.',
  },
  {
    term: 'Dödsbodelägare',
    explanation:
      'En person som är arving och därför äger en andel av dödsboet. Alla arvingar är dödsbodelägare tillsammans.',
  },
  {
    term: 'Dödsboanmälan',
    explanation:
      'En förenklad process som kan göras istället för fullständig bouppteckning om dödsboets tillgångar är mycket små och inte räcker till begravningskostnaden. Görs via kommunens socialtjänst.',
    legalRef: 'Ärvdabalken 16 kap.',
  },
  {
    term: 'Enskild egendom',
    explanation:
      'Egendom som ägs av en person själv och inte är gemensam. Vid giftermål kan egendom som ägs före giftermålet klassificeras som enskild egendom.',
    legalRef: 'Äktenskapsbalken',
  },
  {
    term: 'Efterarv',
    explanation:
      'Rätten för särkullbarn (och ibland andra arvingar) att få sin arvandel när den förste arvtagaren dör. Ofta är det barn från tidigara relationer som har rätt till efterarv.',
    legalRef: 'Ärvdabalken 10 kap.',
  },
  {
    term: 'Fri förfoganderätt',
    explanation:
      'En rättighet som den efterlevande maken/makan kan få enligt testamente. Det betyder att den efterlevande får använda och förbruka egendomen men inte kan testamentera bort den.',
    legalRef: 'Ärvdabalken 10 kap.',
  },
  {
    term: 'Full äganderätt',
    explanation:
      'Rätten att äga, använda, förbruka och testamentera bort en egendom helt. Vid dödsfall kan en person få full äganderätt om den avlidne så bestämt i testamente.',
  },
  {
    term: 'Förrättning',
    explanation:
      'En juridisk handling som görs officiellt, ofta med protokoll. Bouppteckningsförrättningen är när en förrättningsman inventerar dödsboets egendom.',
  },
  {
    term: 'Förrättningsman',
    explanation:
      'En person som övervakar och genomför en förrättning, t.ex. bouppteckningsförrättningen. Kan också kallas bouppgivare. Behöver inte vara jurist.',
    legalRef: 'Ärvdabalken',
  },
  {
    term: 'Giftorättsgods',
    explanation:
      'Egendom som ägs gemensamt mellan makar. I många fall är det som två gifta personer köper eller förvärvar under äktenskapet giftorättsgods (om inte något annat överenskommits).',
    legalRef: 'Äktenskapsbalken',
  },
  {
    term: 'Istadarätt',
    explanation:
      'Rätten för en arvinges ättlingar att ärva på arvningens plats om arvningen är död. T.ex. om en son är död kan hans barn ärva "i stället för" sin far.',
    legalRef: 'Ärvdabalken 2 kap.',
  },
  {
    term: 'Kallelse',
    explanation:
      'En skriftlig uppmaning till alla dödsbodelägare (arvingar) att närvara vid bouppteckning eller arvskifte. Måste skickas minst en vecka innan förrättningen.',
    legalRef: 'Ärvdabalken 16 kap.',
  },
  {
    term: 'Klander',
    explanation:
      'Att ifrågasätta eller angripa ett testamente för att det är gjort under ogiltiga förhållanden, t.ex. påtryckningar eller bedrägeri. Måste göras inom 6 månader.',
    legalRef: 'Ärvdabalken 13 kap.',
  },
  {
    term: 'Kronofogden',
    explanation:
      'Myndigheten som hanterar indrivning av skulder och tvångsauktioner. Kan sälja dödsboets egendom om det finns otillräckliga medel för att betala skulder.',
    legalRef: 'Kronofogdemyndigheten',
  },
  {
    term: 'Laglott',
    explanation:
      'Hälften av vad en arving skulle ha fått enligt arvordningen. Bröstarvingar (barn) har alltid rätt till laglott oavsett vad testamente säger. Kan inte fråntas.',
    legalRef: 'Ärvdabalken 7 kap.',
  },
  {
    term: 'Lösöre',
    explanation:
      'Rörlig egendom som inte är fastighet. T.ex. möbler, smycken, bilar, konst, och hushållsartiklar. Motsatsen till fastighet.',
  },
  {
    term: 'Legat',
    explanation:
      'En gåva från dödsboet enligt testamente. T.ex. "Jag lämnar 10 000 kr till min favoritvälfärdsorganisation".',
    legalRef: 'Ärvdabalken 13 kap.',
  },
  {
    term: 'Legatarie',
    explanation:
      'En person eller organisation som får ett legat (gåva) enligt testamente. Legataren är inte en arving utan får bara en specifik gåva.',
    legalRef: 'Ärvdabalken 13 kap.',
  },
  {
    term: 'Prisbasbelopp',
    explanation:
      'Ett belopp som räknas upp årligen och används vid många juridiska beräkningar. Används t.ex. för att bestämma beloppsgränser i ärvdabalken. År 2024 är prisbasbeloppet omkring 57 100 kr.',
    legalRef: 'Regeringskansliet',
  },
  {
    term: 'Skiftesman',
    explanation:
      'En person som utses av tingsrätten för att genomdriva tvångsskifte när frivilligt arvskifte är omöjligt. Kan tvinga fram försäljning av gemensam egendom och genomför fördelningen.',
    legalRef: 'Ärvdabalken 23 kap.',
  },
  {
    term: 'Särkullbarn',
    explanation:
      'Ett barn som den avlidne har med en annan partner än den nuvarande maken/makan. Särkullbarn kan kräva sin arvslott direkt och behöver inte vänta på den efterlevande makens/makans död.',
    legalRef: 'Ärvdabalken 4 kap.',
  },
  {
    term: 'Testamente',
    explanation:
      'Ett juridiskt dokument där en person bestämmer hur hennes eller hans egendom ska fördelas efter döden. Ett testamente kan ändras när som helst innan döden.',
    legalRef: 'Ärvdabalken 13 kap.',
  },
  {
    term: 'Testamentstagare',
    explanation:
      'En person eller organisation som förmånstages i ett testamente och får egendom eller pengar enligt testamentet. Kan vara arvingar eller helt utomstående.',
    legalRef: 'Ärvdabalken 13 kap.',
  },
  {
    term: 'Tvångsskifte',
    explanation:
      'En tvungen fördelning av dödsboet genom domstol när arvingarna inte kan komma överens om frivilligt arvskifte. Mycket dyrt och tidskrävande.',
    legalRef: 'Ärvdabalken 23 kap. 5 §',
  },
  {
    term: 'Ärvdabalken',
    explanation:
      'Den svenska lag som reglerar arvets fördelning, testamenten och allt om dödsbo. Ärvdabalken är källa för nästan all lagstiftning om arv och dödsbo.',
    legalRef: 'Lag (1958:637)',
  },
  {
    term: 'Äktenskapsförord',
    explanation:
      'Ett avtal mellan två personer som ska gifta sig (eller är redan gifta) som reglerar hur egendom och skulder ska behandlas vid separation eller dödsfall. Kan ändra arvrätten och fördelningen av giftorättsgods.',
    legalRef: 'Äktenskapsbalken 6 kap.',
  },
];

function OrdlistaContent() {
  const { state } = useDodsbo();
  const [searchTerm, setSearchTerm] = useState('');

  const sortedTerms = useMemo(() => {
    return [...GLOSSARY_TERMS].sort((a, b) =>
      a.term.localeCompare(b.term, 'sv')
    );
  }, []);

  const filteredTerms = useMemo(() => {
    if (!searchTerm.trim()) return sortedTerms;

    const query = searchTerm.toLowerCase();
    return sortedTerms.filter(
      (t) =>
        t.term.toLowerCase().includes(query) ||
        t.explanation.toLowerCase().includes(query)
    );
  }, [searchTerm, sortedTerms]);

  // Group by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};

    filteredTerms.forEach((term) => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });

    return groups;
  }, [filteredTerms]);

  const sortedLetters = useMemo(() => {
    return Object.keys(groupedTerms).sort();
  }, [groupedTerms]);

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-background transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Juridisk ordlista
          </h1>
          <p className="text-muted text-sm">
            {GLOSSARY_TERMS.length} termer förklarade
          </p>
        </div>
      </div>

      <MikeRossTip text="Juridisk terminologi kan vara förvirrande — men du behöver inte kunna allt. De viktigaste begreppen att förstå är: laglott (barnens skyddade del), bouppgivare (den som ansvarar för bouppteckningen) och arvskifte (det formella dokumentet som fördelar arvet)." />

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Sök i ordlistan..."
          className="w-full min-h-touch pl-10 pr-4 py-3 text-base border-2 border-[#E8E4DE] rounded-card focus:border-accent focus:outline-none bg-white"
        />
      </div>

      {/* Results info */}
      {searchTerm && (
        <p className="text-sm text-muted mb-4">
          {filteredTerms.length} term{filteredTerms.length !== 1 ? 'er' : ''}{' '}
          matchade
        </p>
      )}

      {/* Terms grouped by letter */}
      {sortedLetters.length > 0 ? (
        <div className="flex flex-col gap-6">
          {sortedLetters.map((letter) => (
            <div key={letter}>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 sticky top-0 bg-background py-2">
                {letter}
              </h2>
              <div className="flex flex-col gap-2">
                {groupedTerms[letter].map((term, i) => (
                  <div key={i} className="card">
                    <p className="font-semibold text-primary">{term.term}</p>
                    <p className="text-sm text-primary/70 mt-2 leading-relaxed">
                      {term.explanation}
                    </p>
                    {term.legalRef && (
                      <p className="text-xs text-muted mt-2">
                        <strong>Lagstöd:</strong> {term.legalRef}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <p className="text-muted mb-2">Inga termer matchade sökningen.</p>
          <p className="text-xs text-muted/70">
            Försök ett annat ord eller bläddra bland alla termer.
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function OrdlistaPage() {
  return (
    <DodsboProvider>
      <OrdlistaContent />
    </DodsboProvider>
  );
}
