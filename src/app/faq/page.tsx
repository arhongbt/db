'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, Search, BookOpen } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  // Vanliga frågor
  {
    category: 'Vanliga frågor',
    question: 'Ärver man skulder i Sverige?',
    answer: 'Nej, man ärver aldrig skulder i Sverige. Om den avlidnes skulder överstiger tillgångarna blir dödsboet insolvent, men arvingarna blir aldrig personligt ansvariga. Skulderna betalas av dödsboets tillgångar i den mån de räcker. Om tillgångarna inte räcker kan man istället göra en dödsboanmälan (förenklad bouppteckning) via kommunens socialtjänst.',
  },
  {
    category: 'Vanliga frågor',
    question: 'Vad är skillnaden mellan bouppteckning och dödsboanmälan?',
    answer: 'En bouppteckning är en fullständig förteckning av den avlidnes alla tillgångar och skulder. Den krävs i de flesta fall. En dödsboanmälan är en förenklad process som kan göras istället om dödsboets tillgångar inte räcker till begravningskostnaden. Dödsboanmälan görs av kommunens socialtjänst och ska lämnas till Skatteverket inom 2 månader.',
  },
  {
    category: 'Vanliga frågor',
    question: 'Måste alla dödsbodelägare vara överens?',
    answer: 'Ja, alla dödsbodelägare måste vara överens vid ett arvskifte. Om ni inte kan komma överens kan tingsrätten utse en skiftesman som medlar. I sista hand kan skiftesmannen genomföra ett tvångsskifte, men det bör undvikas då det medför kostnader.',
  },
  {
    category: 'Vanliga frågor',
    question: 'Hur lång tid har man på sig att göra bouppteckning?',
    answer: 'Bouppteckningsförrättningen ska hållas inom 3 månader från dödsfallet, och handlingen ska lämnas in till Skatteverket inom 1 månad efter förrättningen. Alltså totalt 4 månader. Man kan ansöka om anstånd hos Skatteverket om det behövs mer tid.',
  },
  // Arv & fördelning
  {
    category: 'Arv & fördelning',
    question: 'Vad är laglott?',
    answer: 'Laglotten är hälften av arvslotten och är den del av arvet som bröstarvingar (barn) alltid har rätt till, oavsett vad som står i ett testamente. Om ett testamente inskränker på laglotten måste bröstarvingen aktivt begära jämkning inom 6 månader från det att testamentet delgavs.',
  },
  {
    category: 'Arv & fördelning',
    question: 'Vad betyder fri förfoganderätt?',
    answer: 'Fri förfoganderätt innebär att den efterlevande maken/makan får använda och förbruka egendomen, men inte testamentera bort den. När den efterlevande avlider har den först avlidnes arvingar (oftast barn) rätt till efterarv — sin andel av den totala behållningen.',
  },
  {
    category: 'Arv & fördelning',
    question: 'Vad händer om sambon inte ärver?',
    answer: 'Sambor ärver inte varandra utan testamente. Sambon kan dock begära bodelning enligt sambolagen — detta gäller gemensam bostad och bohag som köpts för gemensamt bruk. Sambon har också rätt att bo kvar under en övergångsperiod (lilla basbeloppsregeln). Utan testamente kan sambon stå utan hem och tillgångar.',
  },
  {
    category: 'Arv & fördelning',
    question: 'Vad är särkullbarn?',
    answer: 'Särkullbarn är barn som den avlidne har med en annan partner än den nuvarande maken/makan. Särkullbarn har rätt att få ut sin arvslott direkt vid arvskiftet — de behöver inte vänta tills den efterlevande maken/makan dör. Särkullbarn kan dock frivilligt avstå sin del till förmån för den efterlevande.',
  },
  // Praktiskt
  {
    category: 'Praktiskt',
    question: 'Får man använda den avlidnes bankkort?',
    answer: 'Nej, man får inte använda den avlidnes bankkort efter dödsfallet. Det kan ses som bedrägeri. Dödsboet tar över kontona, och det krävs fullmakt eller gemensamt beslut av alla dödsbodelägare för att använda dödsboets medel. Nödvändiga löpande utgifter som hyra och el kan dock ofta betalas.',
  },
  {
    category: 'Praktiskt',
    question: 'Vad gör man med den avlidnes mobiltelefon?',
    answer: 'Spara telefonen — den kan innehålla viktig information om abonnemang, digitala konton, och kontakter. Kontrollera att du kan låsa upp den (fråga närstående om PIN-kod). Säg upp abonnemang först när du har inventerat allt som behövs. Bankappen kan visa automatiska dragningar som avslöjar okända abonnemang.',
  },
  {
    category: 'Praktiskt',
    question: 'Vem betalar begravningen?',
    answer: 'Begravningskostnaden är en skuld i dödsboet och betalas av dödsboets medel. Begravningsavgiften (som finansierar begravningsplats) ingår redan i skatten. Om dödsboet saknar tillgångar kan man ansöka om ekonomiskt bistånd via kommunens socialtjänst. Alla i Sverige har rätt till en värdig begravning.',
  },
  {
    category: 'Praktiskt',
    question: 'Måste man tömma bostaden direkt?',
    answer: 'Nej, det finns ingen brådska att tömma bostaden. Vid hyresrätt har dödsboet rätt till 1 månads uppsägningstid (istället för normalt 3). Vid bostadsrätt eller villa finns ingen tidsgräns förrän dödsboet beslutar. Hyran måste dock fortsätta betalas.',
  },
  // Ekonomi
  {
    category: 'Ekonomi',
    question: 'Finns det arvsskatt i Sverige?',
    answer: 'Nej, arvsskatten avskaffades i Sverige 2005. Det finns ingen skatt på arv. Däremot kan det uppstå kapitalvinstskatt om dödsboet säljer tillgångar (t.ex. bostad eller aktier) och vinsten överstiger inköpspriset.',
  },
  {
    category: 'Ekonomi',
    question: 'Vad kostar en bouppteckning?',
    answer: 'Om du gör bouppteckningen själv (med hjälp av denna app) kostar det i princip ingenting utom tid. Anlitar du en jurist kostar det vanligen 5 000 – 25 000 kr beroende på dödsboets komplexitet. Förrättningsmännen behöver inte vara jurister — det kan vara vänner eller bekanta som inte är dödsbodelägare.',
  },
  {
    category: 'Ekonomi',
    question: 'Vad händer med autogiro efter dödsfall?',
    answer: 'Autogiro fortsätter att dras tills banken meddelas om dödsfallet. Kontakta banken snarast för att stoppa onödiga dragningar (gym, streaming, tidningar). Behåll dragningar för nödvändiga utgifter som hyra, el, och försäkring tills de sägs upp ordentligt.',
  },
];

export default function FaqPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Alla');

  const categories = ['Alla', ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))];

  const filtered = FAQ_ITEMS.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'Alla' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col px-5 py-6 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-primary">Vanliga frågor</h1>
          <p className="text-muted text-sm">{FAQ_ITEMS.length} frågor & svar</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Sök frågor..."
          className="w-full min-h-touch pl-10 pr-4 py-3 text-base border-2 border-gray-200 rounded-card focus:border-accent focus:outline-none"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ list */}
      <div className="flex flex-col gap-2">
        {filtered.map((faq, i) => {
          const globalIndex = FAQ_ITEMS.indexOf(faq);
          const isExpanded = expandedIndex === globalIndex;
          return (
            <button
              key={globalIndex}
              onClick={() => setExpandedIndex(isExpanded ? null : globalIndex)}
              className="card w-full text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-primary">{faq.question}</p>
                  {!isExpanded && (
                    <p className="text-xs text-accent mt-1">{faq.category}</p>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </div>
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-primary/80 leading-relaxed">{faq.answer}</p>
                  <p className="text-xs text-accent mt-2">{faq.category}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-muted">Inga frågor matchade sökningen.</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
