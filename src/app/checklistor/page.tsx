'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ArrowLeft, Printer, CheckSquare, Landmark, FileText, Heart, Scale, Shield, Phone } from 'lucide-react';

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

const createChecklists = (t: (sv: string, en: string) => string): Checklist[] => [
  {
    id: 'forsta-dagarna',
    title: t('Första dagarna', 'First days'),
    description: t('Det allra viktigaste att göra de första dagarna efter dödsfallet.', 'The most important things to do in the first days after death.'),
    icon: <Phone className="w-5 h-5" />,
    items: [
      { text: t('Ring begravningsbyrå', 'Call funeral home'), done: false },
      { text: t('Kontakta närmaste anhöriga', 'Contact closest relatives'), done: false },
      { text: t('Beställ dödsbevis från Skatteverket', 'Order death certificate from Tax Agency'), done: false },
      { text: t('Anmäl dödsfallet till banken', 'Report death to bank'), done: false },
      { text: t('Kontrollera om det finns testamente', 'Check if there is a will'), done: false },
      { text: t('Kontrollera försäkringar (livförsäkring, hemförsäkring)', 'Check insurance policies (life insurance, home insurance)'), done: false },
      { text: t('Avsluta eventuella prenumerationer och autogiro', 'Cancel any subscriptions and standing orders'), done: false },
      { text: t('Kontakta hyresvärd om det är hyresrätt', 'Contact landlord if rented'), done: false },
      { text: t('Säkra bostaden (lås, nycklar)', 'Secure the residence (locks, keys)'), done: false },
    ],
  },
  {
    id: 'bankbesok',
    title: t('Inför bankbesöket', 'Before visiting the bank'),
    description: t('Ta med allt du behöver till banken för att hantera den avlidnes konton.', 'Bring everything you need to the bank to manage the deceased\'s accounts.'),
    icon: <Landmark className="w-5 h-5" />,
    items: [
      { text: t('Dödsbevis (original eller bestyrkt kopia)', 'Death certificate (original or certified copy)'), done: false },
      { text: t('Giltig ID-handling för dig som dödsbodelägare', 'Valid ID for you as estate beneficiary'), done: false },
      { text: t('Fullmakt om du representerar andra delägare', 'Power of attorney if you represent other co-owners'), done: false },
      { text: t('Bouppteckning (om den är klar)', 'Estate inventory (if ready)'), done: false },
      { text: t('Lista på alla konton som den avlidne hade', 'List of all accounts the deceased had'), done: false },
      { text: t('Fråga om saldobesked per dödsdagen', 'Ask for balance statement as of death date'), done: false },
      { text: t('Avsluta/överför autogiro och stående överföringar', 'Cancel/transfer standing orders and automatic transfers'), done: false },
      { text: t('Fråga om låneavtal och borgensåtaganden', 'Ask about loan agreements and guarantees'), done: false },
      { text: t('Fråga om bankfack', 'Ask about safe deposit box'), done: false },
    ],
  },
  {
    id: 'bouppteckning',
    title: t('Bouppteckning', 'Estate inventory'),
    description: t('Checklista för att sammanställa bouppteckningen inom 3 månader.', 'Checklist for preparing the estate inventory within 3 months.'),
    icon: <FileText className="w-5 h-5" />,
    items: [
      { text: t('Bestäm förrättningsman (jurist eller kunnig person)', 'Appoint estate administrator (lawyer or knowledgeable person)'), done: false },
      { text: t('Boka datum för förrättningen', 'Book date for the proceedings'), done: false },
      { text: t('Skicka kallelse till alla dödsbodelägare (minst 2 veckor före)', 'Send notice to all co-heirs (at least 2 weeks before)'), done: false },
      { text: t('Samla saldobesked från alla banker per dödsdagen', 'Collect balance statements from all banks as of death date'), done: false },
      { text: t('Samla taxeringsvärden på fastigheter', 'Gather tax assessment values for properties'), done: false },
      { text: t('Samla försäkringsbrev och eventuella utbetalningar', 'Gather insurance documents and any payouts'), done: false },
      { text: t('Inventera lösöre (möbler, smycken, fordon)', 'Inventory personal property (furniture, jewelry, vehicles)'), done: false },
      { text: t('Sammanställ skulder (lån, räkningar, skatt)', 'Compile debts (loans, bills, taxes)'), done: false },
      { text: t('Kontrollera om testamente finns registrerat', 'Check if will is registered'), done: false },
      { text: t('Kontrollera äktenskapsförord', 'Check marital property agreement'), done: false },
      { text: t('Skicka bouppteckning till Skatteverket inom 1 månad efter förrättningen', 'Send estate inventory to Tax Agency within 1 month after proceedings'), done: false },
    ],
  },
  {
    id: 'begravning',
    title: t('Begravningsplanering', 'Funeral planning'),
    description: t('Praktiska steg inför begravningen.', 'Practical steps before the funeral.'),
    icon: <Heart className="w-5 h-5" />,
    items: [
      { text: t('Välj begravningsbyrå', 'Choose funeral home'), done: false },
      { text: t('Bestäm typ av begravning (jordbegravning/kremering)', 'Decide type of funeral (burial/cremation)'), done: false },
      { text: t('Välj ceremoni (religiös/borgerlig)', 'Choose ceremony (religious/secular)'), done: false },
      { text: t('Boka tid och plats för ceremonin', 'Book time and venue for ceremony'), done: false },
      { text: t('Välj kista eller urna', 'Choose coffin or urn'), done: false },
      { text: t('Bestäm om dödsannons ska publiceras', 'Decide if obituary should be published'), done: false },
      { text: t('Välj blommor och dekoration', 'Choose flowers and decorations'), done: false },
      { text: t('Välj musik till ceremonin', 'Choose music for ceremony'), done: false },
      { text: t('Planera minnesstund (lokal, mat, gästlista)', 'Plan memorial gathering (venue, food, guest list)'), done: false },
      { text: t('Välj kläder för den avlidne', 'Choose clothes for the deceased'), done: false },
    ],
  },
  {
    id: 'arvskifte',
    title: t('Arvskifte', 'Inheritance settlement'),
    description: t('När bouppteckningen är klar och arvet ska fördelas.', 'When the estate inventory is complete and inheritance is to be distributed.'),
    icon: <Scale className="w-5 h-5" />,
    items: [
      { text: t('Invänta registrerad bouppteckning från Skatteverket', 'Await registered estate inventory from Tax Agency'), done: false },
      { text: t('Betala alla skulder i dödsboet', 'Pay all debts of the estate'), done: false },
      { text: t('Deklarera dödsboet (om nödvändigt)', 'File tax return for estate (if necessary)'), done: false },
      { text: t('Upprätta arvskifteshandling', 'Prepare inheritance settlement document'), done: false },
      { text: t('Alla delägare signerar arvskifteshandlingen', 'All co-heirs sign inheritance settlement'), done: false },
      { text: t('Fördela banktillgångar enligt arvskiftet', 'Distribute bank funds according to settlement'), done: false },
      { text: t('Ansök om lagfart vid fastighetsarv', 'Apply for ownership registration for real estate'), done: false },
      { text: t('Skriv om fordon hos Transportstyrelsen', 'Re-register vehicles with Transport Agency'), done: false },
      { text: t('Avsluta dödsboets konton', 'Close estate accounts'), done: false },
    ],
  },
  {
    id: 'forsakringar',
    title: t('Försäkringar att kontrollera', 'Insurance policies to check'),
    description: t('Gå igenom alla försäkringar — det kan finnas pengar att hämta.', 'Review all insurance policies — there may be money to collect.'),
    icon: <Shield className="w-5 h-5" />,
    items: [
      { text: t('Livförsäkring (kontakta försäkringsbolaget)', 'Life insurance (contact insurance company)'), done: false },
      { text: t('Grupplivförsäkring via arbetsgivare/fack', 'Group life insurance via employer/union'), done: false },
      { text: t('Hemförsäkring (avsluta eller överföra)', 'Home insurance (cancel or transfer)'), done: false },
      { text: t('Bilförsäkring (om fordon finns)', 'Car insurance (if vehicle exists)'), done: false },
      { text: t('Sjuk- och olycksfallsförsäkring', 'Accident and health insurance'), done: false },
      { text: t('Tjänstepension (kontakta pensionsbolag)', 'Occupational pension (contact pension company)'), done: false },
      { text: t('Privat pensionsförsäkring', 'Private pension insurance'), done: false },
      { text: t('Efterlevandeskydd i pension', 'Survivor benefits in pension'), done: false },
    ],
  },
];

export default function ChecklistorPage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [checklists, setChecklists] = useState(createChecklists(t));

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
    <div className="min-h-dvh bg-background pb-28">
      <div className="flex flex-col min-h-[calc(100dvh-5rem)] px-6 py-8">
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
            <h1 className="text-2xl font-display text-primary">
              {selected ? selectedList?.title : t('Checklistor', 'Checklists')}
            </h1>
          </div>
          {selected && (
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-full hover:bg-white transition-colors print:hidden"
              style={{ border: '1px solid #E8E4DE' }}
              aria-label={t('Skriv ut', 'Print')}
            >
              <Printer className="w-5 h-5 text-accent" />
            </button>
          )}
        </div>
        <p className="text-muted text-sm">
              {selected ? selectedList?.description : t('Utskriftsvänliga checklistor för varje steg', 'Printable checklists for each step')}
            </p>

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
                      style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
                    >
                      {cl.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-primary text-sm">{cl.title}</p>
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
                  className={`w-full flex items-center gap-3 p-3 rounded-[20px] border transition-all text-left ${
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
                    background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
