'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ArrowLeft, Printer, CheckSquare, Landmark, FileText, Heart, Scale, Shield, Phone } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';

interface ChecklistItem {
  text: string;
  done: boolean;
}

interface Checklist {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

const CHECKLISTS: Checklist[] = [
  {
    id: 'forsta-dagarna',
    title: 'Första dagarna',
    description: 'Det allra viktigaste att göra de första dagarna efter dödsfallet.',
    icon: <Phone className="w-5 h-5" />,
    items: [
      { text: 'Ring begravningsbyrå', done: false },
      { text: 'Kontakta närmaste anhöriga', done: false },
      { text: 'Beställ dödsbevis från Skatteverket', done: false },
      { text: 'Anmäl dödsfallet till banken', done: false },
      { text: 'Kontrollera om det finns testamente', done: false },
      { text: 'Kontrollera försäkringar (livförsäkring, hemförsäkring)', done: false },
      { text: 'Avsluta eventuella prenumerationer och autogiro', done: false },
      { text: 'Kontakta hyresvärd om det är hyresrätt', done: false },
      { text: 'Säkra bostaden (lås, nycklar)', done: false },
    ],
  },
  {
    id: 'bankbesok',
    title: 'Inför bankbesöket',
    description: 'Ta med allt du behöver till banken för att hantera den avlidnes konton.',
    icon: <Landmark className="w-5 h-5" />,
    items: [
      { text: 'Dödsbevis (original eller bestyrkt kopia)', done: false },
      { text: 'Giltig ID-handling för dig som dödsbodelägare', done: false },
      { text: 'Fullmakt om du representerar andra delägare', done: false },
      { text: 'Bouppteckning (om den är klar)', done: false },
      { text: 'Lista på alla konton som den avlidne hade', done: false },
      { text: 'Fråga om saldobesked per dödsdagen', done: false },
      { text: 'Avsluta/överför autogiro och stående överföringar', done: false },
      { text: 'Fråga om låneavtal och borgensåtaganden', done: false },
      { text: 'Fråga om bankfack', done: false },
    ],
  },
  {
    id: 'bouppteckning',
    title: 'Bouppteckning',
    description: 'Checklista för att sammanställa bouppteckningen inom 3 månader.',
    icon: <FileText className="w-5 h-5" />,
    items: [
      { text: 'Bestäm förrättningsman (jurist eller kunnig person)', done: false },
      { text: 'Boka datum för förrättningen', done: false },
      { text: 'Skicka kallelse till alla dödsbodelägare (minst 2 veckor före)', done: false },
      { text: 'Samla saldobesked från alla banker per dödsdagen', done: false },
      { text: 'Samla taxeringsvärden på fastigheter', done: false },
      { text: 'Samla försäkringsbrev och eventuella utbetalningar', done: false },
      { text: 'Inventera lösöre (möbler, smycken, fordon)', done: false },
      { text: 'Sammanställ skulder (lån, räkningar, skatt)', done: false },
      { text: 'Kontrollera om testamente finns registrerat', done: false },
      { text: 'Kontrollera äktenskapsförord', done: false },
      { text: 'Skicka bouppteckning till Skatteverket inom 1 månad efter förrättningen', done: false },
    ],
  },
  {
    id: 'begravning',
    title: 'Begravningsplanering',
    description: 'Praktiska steg inför begravningen.',
    icon: <Heart className="w-5 h-5" />,
    items: [
      { text: 'Välj begravningsbyrå', done: false },
      { text: 'Bestäm typ av begravning (jordbegravning/kremering)', done: false },
      { text: 'Välj ceremoni (religiös/borgerlig)', done: false },
      { text: 'Boka tid och plats för ceremonin', done: false },
      { text: 'Välj kista eller urna', done: false },
      { text: 'Bestäm om dödsannons ska publiceras', done: false },
      { text: 'Välj blommor och dekoration', done: false },
      { text: 'Välj musik till ceremonin', done: false },
      { text: 'Planera minnesstund (lokal, mat, gästlista)', done: false },
      { text: 'Välj kläder för den avlidne', done: false },
    ],
  },
  {
    id: 'arvskifte',
    title: 'Arvskifte',
    description: 'När bouppteckningen är klar och arvet ska fördelas.',
    icon: <Scale className="w-5 h-5" />,
    items: [
      { text: 'Invänta registrerad bouppteckning från Skatteverket', done: false },
      { text: 'Betala alla skulder i dödsboet', done: false },
      { text: 'Deklarera dödsboet (om nödvändigt)', done: false },
      { text: 'Upprätta arvskifteshandling', done: false },
      { text: 'Alla delägare signerar arvskifteshandlingen', done: false },
      { text: 'Fördela banktillgångar enligt arvskiftet', done: false },
      { text: 'Ansök om lagfart vid fastighetsarv', done: false },
      { text: 'Skriv om fordon hos Transportstyrelsen', done: false },
      { text: 'Avsluta dödsboets konton', done: false },
    ],
  },
  {
    id: 'forsakringar',
    title: 'Försäkringar att kontrollera',
    description: 'Gå igenom alla försäkringar — det kan finnas pengar att hämta.',
    icon: <Shield className="w-5 h-5" />,
    items: [
      { text: 'Livförsäkring (kontakta försäkringsbolaget)', done: false },
      { text: 'Grupplivförsäkring via arbetsgivare/fack', done: false },
      { text: 'Hemförsäkring (avsluta eller överföra)', done: false },
      { text: 'Bilförsäkring (om fordon finns)', done: false },
      { text: 'Sjuk- och olycksfallsförsäkring', done: false },
      { text: 'Tjänstepension (kontakta pensionsbolag)', done: false },
      { text: 'Privat pensionsförsäkring', done: false },
      { text: 'Efterlevandeskydd i pension', done: false },
    ],
  },
];

export default function ChecklistorPage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [checklists, setChecklists] = useState(CHECKLISTS);

  const toggleItem = (checklistId: string, itemIndex: number) => {
    setChecklists(prev =>
      prev.map(cl =>
        cl.id === checklistId
          ? { ...cl, items: cl.items.map((item, i) => i === itemIndex ? { ...item, done: !item.done } : item) }
          : cl
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedList = checklists.find(c => c.id === selected);

  return (
    <div className="min-h-dvh bg-background pb-24">
      <div className="px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {selected ? (
            <button
              onClick={() => setSelected(null)}
              className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-background transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-background transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-primary">
              {selected ? selectedList?.title : t('Checklistor', 'Checklists')}
            </h1>
            <p className="text-muted text-sm">
              {selected ? selectedList?.description : t('Utskriftsvänliga checklistor för varje steg', 'Printable checklists for each step')}
            </p>
          </div>
          {selected && (
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl hover:bg-white transition-colors print:hidden"
              style={{ border: '1px solid #E8E4DE' }}
              aria-label={t('Skriv ut', 'Print')}
            >
              <Printer className="w-5 h-5 text-accent" />
            </button>
          )}
        </div>

        {/* List of checklists */}
        {!selected && (
          <div className="space-y-3">
            {checklists.map(cl => {
              const done = cl.items.filter(i => i.done).length;
              const total = cl.items.length;
              const pct = Math.round((done / total) * 100);
              return (
                <button
                  key={cl.id}
                  onClick={() => setSelected(cl.id)}
                  className="w-full bg-white border rounded-2xl p-4 text-left hover:shadow-sm transition-all active:scale-[0.99]"
                  style={{ borderColor: '#E8E4DE' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}
                    >
                      {cl.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary text-sm">{cl.title}</p>
                      <p className="text-xs text-muted truncate">{cl.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-accent">{done}/{total}</p>
                      <div className="w-12 h-1.5 bg-background rounded-full mt-1">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${pct}%`, background: '#6B7F5E' }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected checklist detail */}
        {selected && selectedList && (
          <div className="print-checklist">
            {/* Print header (hidden on screen) */}
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold">{selectedList.title}</h1>
              <p className="text-gray-600">{selectedList.description}</p>
              <p className="text-sm text-gray-500 mt-1">{t('Sista Resan — utskrift', 'Sista Resan — print')} {new Date().toLocaleDateString('sv-SE')}</p>
              <hr className="mt-4" />
            </div>

            <div className="space-y-2">
              {selectedList.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleItem(selectedList.id, i)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    item.done
                      ? 'bg-accent/10 border-accent/30'
                      : 'bg-white border-[#E8E4DE] hover:border-accent/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                    item.done ? 'bg-accent border-accent' : 'border-[#E8E4DE]'
                  }`}>
                    {item.done && <CheckSquare className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm ${item.done ? 'line-through text-muted' : 'text-primary'}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Print-only: empty checkboxes */}
            <style jsx>{`
              @media print {
                .print-checklist button {
                  border: none !important;
                  padding: 6px 0 !important;
                  background: none !important;
                }
              }
            `}</style>

            {/* Progress summary */}
            <div className="mt-6 p-4 bg-white border rounded-2xl print:hidden" style={{ borderColor: '#E8E4DE' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-primary">{t('Framsteg', 'Progress')}</p>
                <p className="text-sm font-semibold text-accent">
                  {selectedList.items.filter(i => i.done).length} / {selectedList.items.length}
                </p>
              </div>
              <div className="w-full h-2 bg-background rounded-full">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((selectedList.items.filter(i => i.done).length / selectedList.items.length) * 100)}%`,
                    background: 'linear-gradient(135deg, #6B7F5E, #4F6145)',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
