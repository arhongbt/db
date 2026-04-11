'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

/** Juridisk ordlista — korta förklaringar av vanliga termer */
const JURIDISKA_TERMER: Record<string, string> = {
  laglott: 'Den del av arvet som barn alltid har rätt till — hälften av arvslotten. Kan inte testamenteras bort.',
  arvslott: 'Den andel av arvet som en arvinge har rätt till enligt lag, innan eventuellt testamente.',
  bouppteckning: 'En förteckning över den avlidnes alla tillgångar och skulder. Ska göras inom 3 månader.',
  arvskifte: 'Avtalet där alla dödsbodelägare bestämmer hur arvet ska fördelas. Ska vara skriftligt.',
  dödsbodelägare: 'Person som har rätt till arv — t.ex. make/maka, barn, eller testamentstagare.',
  särkullbarn: 'Barn som inte är gemensamt med den efterlevande maken/makan. Har rätt att få ut sitt arv direkt.',
  bodelning: 'Uppdelning av gemensam egendom mellan makar. Måste göras innan arvskifte om den avlidne var gift.',
  giftorättsgods: 'Egendom som delas lika mellan makar vid bodelning — allt som inte är enskild egendom.',
  'enskild egendom': 'Egendom som inte delas vid bodelning, t.ex. genom äktenskapsförord eller gåvobrev.',
  'fri förfoganderätt': 'Maken får använda egendomen fritt men kan inte testamentera bort den. Barnen har efterarvsrätt.',
  efterarvsrätt: 'Rätten att ärva senare, t.ex. när den efterlevande maken/makan går bort.',
  testamente: 'Skriftligt dokument som bestämmer hur arvet ska fördelas. Kräver två vittnen.',
  förrättningsman: 'Oberoende person som leder bouppteckningen. Minst två krävs, får inte vara dödsbodelägare.',
  boutredningsman: 'Person utsedd av tingsrätten för att utreda ett dödsbo, t.ex. vid konflikter.',
  skiftesman: 'Person utsedd av tingsrätten för att fördela arvet om delägarna inte kan enas.',
  dödsboanmälan: 'Förenklad form av bouppteckning för enkla dödsbon där tillgångarna understiger prisbasbeloppet.',
  prisbasbelopp: 'Ett belopp som fastställs årligen av regeringen. 2025/2026: 57 300 kr. Används som referensvärde.',
  samboegendom: 'Bostad och bohag som köpts för gemensamt bruk under samboförhållandet.',
};

interface JuridiskTooltipProps {
  term: string;
  children?: React.ReactNode;
}

/**
 * Visar en juridisk term med en liten ?-ikon.
 * Vid klick visas en popup med förklaring.
 */
export function JuridiskTooltip({ term, children }: JuridiskTooltipProps) {
  const [open, setOpen] = useState(false);
  const key = term.toLowerCase();
  const explanation = JURIDISKA_TERMER[key];

  if (!explanation) {
    return <>{children || term}</>;
  }

  return (
    <span className="relative inline-flex items-center gap-0.5">
      <span className="border-b border-dotted border-accent/50">{children || term}</span>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="inline-flex items-center justify-center w-4 h-4 text-accent/60 hover:text-accent transition-colors"
        aria-label={`Förklaring av ${term}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 z-50 w-64 p-3 bg-white border border-gray-200 rounded-xl shadow-lg text-sm text-primary">
            <p className="font-medium text-accent mb-1 capitalize">{term}</p>
            <p className="text-muted leading-relaxed">{explanation}</p>
          </div>
        </>
      )}
    </span>
  );
}

export { JURIDISKA_TERMER };
