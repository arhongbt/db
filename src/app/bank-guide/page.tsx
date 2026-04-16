'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowLeft, Building2, Phone, Globe, ChevronDown, ChevronUp, CheckCircle2, Copy, Check } from 'lucide-react';

interface BankGuide {
  id: string;
  name: string;
  phone: string;
  web: string;
  openHours: string;
  steps: string[];
  documents: string[];
  tips: string[];
  specialInfo?: string;
}

const getBankGuides = (t: (sv: string, en: string) => string): BankGuide[] => [
  {
    id: 'swedbank',
    name: 'Swedbank',
    phone: '0771-22 11 22',
    web: 'swedbank.se/dodsbo',
    openHours: t('Mån-fre 08:00-18:00', 'Mon-Fri 08:00-18:00'),
    steps: [
      t('Ring kundtjänst eller besök kontor — meddela dödsfallet', 'Call customer service or visit an office — notify of the death'),
      t('Konton spärras automatiskt, autogiro stoppas', 'Accounts are frozen automatically, standing orders are stopped'),
      t('Begär saldobesked per dödsdagen', 'Request balance statement for the date of death'),
      t('Be om kontoutdrag 3 månader före och efter dödsdagen', 'Ask for account statements 3 months before and after the date of death'),
      t('Fråga om befintliga lån, kreditkort och fonder', 'Ask about existing loans, credit cards, and funds'),
      t('Fråga om eventuella bankfack', 'Ask about any safe deposit boxes'),
      t('Ansök om dödsbokonto för löpande utgifter', 'Apply for an estate account for ongoing expenses'),
    ],
    documents: [
      t('Dödsbevis (från vården eller Skatteverket)', 'Death certificate (from healthcare or Tax Agency)'),
      t('Legitimation (din egen)', 'ID card (your own)'),
      t('Fullmakt (om du inte är ensam dödsbodelägare)', 'Power of attorney (if you are not the sole estate heir)'),
      t('Registrerad bouppteckning (krävs för uttag)', 'Registered inventory of estate (required for withdrawal)'),
    ],
    tips: [
      t('Swedbank kan öppna ett dödsbokonto för löpande betalningar (el, hyra) innan bouppteckning är klar.', 'Swedbank can open an estate account for ongoing payments (electricity, rent) before the inventory is complete.'),
      t('Internetbanken stängs av direkt — se till att notera alla automatiska betalningar först.', 'Online banking is closed immediately — make sure to note all automatic payments first.'),
      t('Fonder och aktier fryses på dödsdagen — värdet bestäms av den dagens kurs.', 'Funds and shares are frozen on the date of death — the value is determined by that day\'s rate.'),
    ],
  },
  {
    id: 'handelsbanken',
    name: 'Handelsbanken',
    phone: '0771-77 88 99',
    web: 'handelsbanken.se/dodsbo',
    openHours: t('Mån-fre 08:00-18:00', 'Mon-Fri 08:00-18:00'),
    steps: [
      t('Kontakta lokalt kontor — Handelsbanken föredrar personligt besök', 'Contact local office — Handelsbanken prefers in-person visits'),
      t('Konton spärras, Swish och BankID avaktiveras', 'Accounts are frozen, Swish and BankID are deactivated'),
      t('Begär saldobesked per dödsdagen', 'Request balance statement for the date of death'),
      t('Be om att stoppa autogiro och stående överföringar', 'Ask to stop standing orders and transfers'),
      t('Fråga om bankfack — kräver bouppteckningsförrättning för öppning', 'Ask about safe deposit boxes — requires estate inventory procedure to open'),
      t('Begär kontoutdrag och fondinformation', 'Request account statements and fund information'),
    ],
    documents: [
      t('Dödsbevis', 'Death certificate'),
      t('Legitimation', 'ID card'),
      t('Fullmakt från alla dödsbodelägare (vid uttag)', 'Power of attorney from all estate heirs (for withdrawal)'),
      t('Registrerad bouppteckning (för slutligt uttag)', 'Registered inventory of estate (for final withdrawal)'),
    ],
    tips: [
      t('Handelsbanken är lokal — gå till samma kontor som den avlidne tillhörde.', 'Handelsbanken is local — go to the same office as the deceased belonged to.'),
      t('Be om en personlig bankman som kan följa ärendet hela vägen.', 'Ask for a personal banker who can follow your case all the way.'),
      t('Bankfack: Begär att det öppnas i samband med bouppteckningsförrättningen med förrättningsmannen närvarande.', 'Safe deposit box: Request that it be opened during the estate inventory procedure with the official present.'),
    ],
  },
  {
    id: 'seb',
    name: 'SEB',
    phone: '0771-365 365',
    web: 'seb.se/dodsbo',
    openHours: t('Mån-fre 08:00-18:00', 'Mon-Fri 08:00-18:00'),
    steps: [
      t('Ring kundtjänst eller besök kontor — anmäl dödsfallet', 'Call customer service or visit an office — report the death'),
      t('Konton fryses, kortbetalningar stoppas', 'Accounts are frozen, card payments are stopped'),
      t('Begär saldobesked per dödsdagen', 'Request balance statement for the date of death'),
      t('Fråga om sparande: fonder, ISK, KF, depåer', 'Ask about savings: funds, ISK, building societies, deposits'),
      t('Kontrollera om det finns företagskonton', 'Check if there are business accounts'),
      t('Fråga om tjänstepension via SEB Pension', 'Ask about occupational pension through SEB Pension'),
      t('Begär kontoutdrag för relevanta perioder', 'Request account statements for relevant periods'),
    ],
    documents: [
      t('Dödsbevis', 'Death certificate'),
      t('Legitimation', 'ID card'),
      t('Fullmakt (mallar finns på SEB:s hemsida)', 'Power of attorney (templates available on SEB\'s website)'),
      t('Registrerad bouppteckning (för avslut)', 'Registered inventory of estate (for closure)'),
    ],
    tips: [
      t('SEB har en särskild dödsboavdelning — be att bli kopplad dit.', 'SEB has a special estate department — ask to be transferred there.'),
      t('Om den avlidne hade ISK eller kapitalförsäkring, fråga om latent skatt som ska noteras i bouppteckningen.', 'If the deceased had an ISK or capital insurance, ask about latent tax that should be noted in the inventory.'),
      t('SEB:s mobilbank stängs av omedelbart, men du kan få tillgång till historik via kundtjänst.', 'SEB\'s mobile bank is closed immediately, but you can get access to history through customer service.'),
    ],
  },
  {
    id: 'nordea',
    name: 'Nordea',
    phone: '0771-22 44 88',
    web: 'nordea.se/dodsbo',
    openHours: t('Mån-fre 08:00-20:00', 'Mon-Fri 08:00-20:00'),
    steps: [
      t('Ring kundtjänst — dödsfall anmäls per telefon', 'Call customer service — death is reported by phone'),
      t('Nordea skickar informationspaket om dödsbo till dig', 'Nordea sends an information package about the estate to you'),
      t('Konton spärras, kort avaktiveras', 'Accounts are frozen, cards are deactivated'),
      t('Begär saldobesked per dödsdagen', 'Request balance statement for the date of death'),
      t('Fråga om bolån — ränta fortsätter löpa', 'Ask about mortgage — interest continues to accrue'),
      t('Kontrollera Nordea Liv & Pension-försäkringar', 'Check Nordea Life & Pension insurance'),
      t('Fråga om värdepappersdepåer', 'Ask about securities deposits'),
    ],
    documents: [
      t('Dödsbevis', 'Death certificate'),
      t('Legitimation', 'ID card'),
      t('Fullmakt (Nordeas egen mall)', 'Power of attorney (Nordea\'s own template)'),
      t('Registrerad bouppteckning (för avslut av konton)', 'Registered inventory of estate (for closing accounts)'),
    ],
    tips: [
      t('Nordea har längre öppettider (till 20:00) — bra om du jobbar dagtid.', 'Nordea has longer opening hours (until 20:00) — good if you work during the day.'),
      t('Nordea Liv & Pension är ett separat bolag — ring dem separat på 0771-42 42 00.', 'Nordea Life & Pension is a separate company — call them separately at 0771-42 42 00.'),
      t('Om bolån finns: räntorna fortsätter löpa. Prata med banken om amorteringsfrihet under dödsboperioden.', 'If there is a mortgage: interest continues to accrue. Talk to the bank about payment holidays during the estate period.'),
    ],
  },
  {
    id: 'lansforsakringar',
    name: 'Länsförsäkringar',
    phone: '08-588 400 00',
    web: 'lansforsakringar.se',
    openHours: t('Mån-fre 08:00-17:00', 'Mon-Fri 08:00-17:00'),
    steps: [
      t('Kontakta ditt lokala Länsförsäkringar-bolag', 'Contact your local Länsförsäkringar office'),
      t('Anmäl dödsfallet — gäller både bank och försäkring', 'Report the death — applies to both bank and insurance'),
      t('Begär saldobesked per dödsdagen', 'Request balance statement for the date of death'),
      t('Kontrollera hemförsäkring, livförsäkring och pension', 'Check home insurance, life insurance, and pension'),
      t('Fråga om grupplivförsäkring via arbetsgivare', 'Ask about group life insurance through employer'),
      t('Begär information om alla produkter hos den avlidne', 'Request information about all products of the deceased'),
    ],
    documents: [
      t('Dödsbevis', 'Death certificate'),
      t('Legitimation', 'ID card'),
      t('Fullmakt', 'Power of attorney'),
      t('Registrerad bouppteckning', 'Registered inventory of estate'),
    ],
    tips: [
      t('Länsförsäkringar är både bank OCH försäkringsbolag — ett samtal kan täcka båda delarna.', 'Länsförsäkringar is both a bank AND an insurance company — one call can cover both.'),
      t('Kontrollera om den avlidne hade grupplivförsäkring genom arbetsgivare — den administreras ofta av LF.', 'Check if the deceased had group life insurance through their employer — it is often administered by LF.'),
      t('Varje län har sitt eget bolag — kontakta rätt regionalt bolag.', 'Each region has its own company — contact the right regional office.'),
    ],
  },
];

export default function BankGuidePage() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const bankGuides = getBankGuides(t);

  const toggleBank = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const copyPhone = (phone: string, bankId: string) => {
    navigator.clipboard.writeText(phone.replace(/[- ]/g, ''));
    setCopied(bankId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-background">
      <div className="px-4 py-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 rounded-full p-2 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-display text-primary">{t('Bank-guide', 'Bank Guide')}</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          {t('Steg-för-steg instruktioner för varje storbank. Vad du ska säga, vilka dokument du behöver, och tips.', 'Step-by-step instructions for each major bank. What to say, what documents you need, and tips.')}
        </p>

        {/* Info box */}
        <div className="info-box mb-6">
          <p className="text-xs text-muted">
            {t('Ring banken så snart som möjligt efter dödsfallet. Konton spärras för att skydda dödsboet, men löpande betalningar (el, hyra) kan lösas med ett dödsbokonto.', 'Call the bank as soon as possible after the death. Accounts are frozen to protect the estate, but ongoing payments (electricity, rent) can be handled with an estate account.')}
          </p>
        </div>

        {/* Bank cards */}
        <div className="space-y-3">
          {bankGuides.map(bank => (
            <div key={bank.id} className="card">
              <button
                onClick={() => toggleBank(bank.id)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-lighter rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-primary text-sm">{bank.name}</p>
                    <p className="text-xs text-muted">{bank.openHours}</p>
                  </div>
                </div>
                {expanded === bank.id ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>

              {expanded === bank.id && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  {/* Contact */}
                  <div className="flex gap-2">
                    <a
                      href={`tel:${bank.phone.replace(/[- ]/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent text-white rounded-full text-sm font-medium"
                      style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
                    >
                      <Phone className="w-4 h-4" /> {bank.phone}
                    </a>
                    <button
                      onClick={() => copyPhone(bank.phone, bank.id)}
                      className="px-3 py-2.5 border border-border rounded-full"
                    >
                      {copied === bank.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted" />}
                    </button>
                  </div>

                  {/* Steps */}
                  <div>
                    <p className="text-xs font-semibold text-primary mb-2">{t('Steg att följa:', 'Steps to follow:')}</p>
                    <div className="space-y-2">
                      {bank.steps.map((step, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-xs font-bold text-accent w-5 shrink-0">{i + 1}.</span>
                          <span className="text-xs text-primary/80">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <p className="text-xs font-semibold text-primary mb-2">{t('Dokument du behöver:', 'Documents you need:')}</p>
                    <div className="space-y-1">
                      {bank.documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="text-xs text-primary/80">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs font-semibold text-primary mb-2">{t('Tips:', 'Tips:')}</p>
                    <div className="space-y-2">
                      {bank.tips.map((tip, i) => (
                        <p key={i} className="text-xs text-muted leading-relaxed">• {tip}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* General tips */}
        <div className="card mt-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
          <p className="font-display text-primary text-sm mb-2">{t('Generella tips', 'General tips')}</p>
          <div className="space-y-2 text-xs text-muted">
            <p>• {t('Säg alltid: &ldquo;Jag ringer angående ett dödsfall&rdquo; — du kopplas direkt till rätt avdelning.', 'Always say: "I\'m calling about a death" — you\'ll be transferred directly to the right department.')}</p>
            <p>• {t('Ha dödsbevis och ditt eget leg redo vid varje samtal.', 'Have the death certificate and your own ID ready for every call.')}</p>
            <p>• {t('Be alltid om skriftlig bekräftelse via e-post.', 'Always ask for written confirmation via email.')}</p>
            <p>• {t('Notera namn på handläggaren och ärendenummer.', 'Note the case officer\'s name and case number.')}</p>
            <p>• {t('Saldobesked per dödsdagen behövs till bouppteckningen — begär det direkt.', 'Balance statement for the date of death is needed for the inventory — ask for it immediately.')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
