'use client';

import { useState } from 'react';
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

const BANK_GUIDES: BankGuide[] = [
  {
    id: 'swedbank',
    name: 'Swedbank',
    phone: '0771-22 11 22',
    web: 'swedbank.se/dodsbo',
    openHours: 'Mån-fre 08:00-18:00',
    steps: [
      'Ring kundtjänst eller besök kontor — meddela dödsfallet',
      'Konton spärras automatiskt, autogiro stoppas',
      'Begär saldobesked per dödsdagen',
      'Be om kontoutdrag 3 månader före och efter dödsdagen',
      'Fråga om befintliga lån, kreditkort och fonder',
      'Fråga om eventuella bankfack',
      'Ansök om dödsbokonto för löpande utgifter',
    ],
    documents: [
      'Dödsbevis (från vården eller Skatteverket)',
      'Legitimation (din egen)',
      'Fullmakt (om du inte är ensam dödsbodelägare)',
      'Registrerad bouppteckning (krävs för uttag)',
    ],
    tips: [
      'Swedbank kan öppna ett dödsbokonto för löpande betalningar (el, hyra) innan bouppteckning är klar.',
      'Internetbanken stängs av direkt — se till att notera alla automatiska betalningar först.',
      'Fonder och aktier fryses på dödsdagen — värdet bestäms av den dagens kurs.',
    ],
  },
  {
    id: 'handelsbanken',
    name: 'Handelsbanken',
    phone: '0771-77 88 99',
    web: 'handelsbanken.se/dodsbo',
    openHours: 'Mån-fre 08:00-18:00',
    steps: [
      'Kontakta lokalt kontor — Handelsbanken föredrar personligt besök',
      'Konton spärras, Swish och BankID avaktiveras',
      'Begär saldobesked per dödsdagen',
      'Be om att stoppa autogiro och stående överföringar',
      'Fråga om bankfack — kräver bouppteckningsförrättning för öppning',
      'Begär kontoutdrag och fondinformation',
    ],
    documents: [
      'Dödsbevis',
      'Legitimation',
      'Fullmakt från alla dödsbodelägare (vid uttag)',
      'Registrerad bouppteckning (för slutligt uttag)',
    ],
    tips: [
      'Handelsbanken är lokal — gå till samma kontor som den avlidne tillhörde.',
      'Be om en personlig bankman som kan följa ärendet hela vägen.',
      'Bankfack: Begär att det öppnas i samband med bouppteckningsförrättningen med förrättningsmannen närvarande.',
    ],
  },
  {
    id: 'seb',
    name: 'SEB',
    phone: '0771-365 365',
    web: 'seb.se/dodsbo',
    openHours: 'Mån-fre 08:00-18:00',
    steps: [
      'Ring kundtjänst eller besök kontor — anmäl dödsfallet',
      'Konton fryses, kortbetalningar stoppas',
      'Begär saldobesked per dödsdagen',
      'Fråga om sparande: fonder, ISK, KF, depåer',
      'Kontrollera om det finns företagskonton',
      'Fråga om tjänstepension via SEB Pension',
      'Begär kontoutdrag för relevanta perioder',
    ],
    documents: [
      'Dödsbevis',
      'Legitimation',
      'Fullmakt (mallar finns på SEB:s hemsida)',
      'Registrerad bouppteckning (för avslut)',
    ],
    tips: [
      'SEB har en särskild dödsboavdelning — be att bli kopplad dit.',
      'Om den avlidne hade ISK eller kapitalförsäkring, fråga om latent skatt som ska noteras i bouppteckningen.',
      'SEB:s mobilbank stängs av omedelbart, men du kan få tillgång till historik via kundtjänst.',
    ],
  },
  {
    id: 'nordea',
    name: 'Nordea',
    phone: '0771-22 44 88',
    web: 'nordea.se/dodsbo',
    openHours: 'Mån-fre 08:00-20:00',
    steps: [
      'Ring kundtjänst — dödsfall anmäls per telefon',
      'Nordea skickar informationspaket om dödsbo till dig',
      'Konton spärras, kort avaktiveras',
      'Begär saldobesked per dödsdagen',
      'Fråga om bolån — ränta fortsätter löpa',
      'Kontrollera Nordea Liv & Pension-försäkringar',
      'Fråga om värdepappersdepåer',
    ],
    documents: [
      'Dödsbevis',
      'Legitimation',
      'Fullmakt (Nordeas egen mall)',
      'Registrerad bouppteckning (för avslut av konton)',
    ],
    tips: [
      'Nordea har längre öppettider (till 20:00) — bra om du jobbar dagtid.',
      'Nordea Liv & Pension är ett separat bolag — ring dem separat på 0771-42 42 00.',
      'Om bolån finns: räntorna fortsätter löpa. Prata med banken om amorteringsfrihet under dödsboperioden.',
    ],
  },
  {
    id: 'lansforsakringar',
    name: 'Länsförsäkringar',
    phone: '08-588 400 00',
    web: 'lansforsakringar.se',
    openHours: 'Mån-fre 08:00-17:00',
    steps: [
      'Kontakta ditt lokala Länsförsäkringar-bolag',
      'Anmäl dödsfallet — gäller både bank och försäkring',
      'Begär saldobesked per dödsdagen',
      'Kontrollera hemförsäkring, livförsäkring och pension',
      'Fråga om grupplivförsäkring via arbetsgivare',
      'Begär information om alla produkter hos den avlidne',
    ],
    documents: [
      'Dödsbevis',
      'Legitimation',
      'Fullmakt',
      'Registrerad bouppteckning',
    ],
    tips: [
      'Länsförsäkringar är både bank OCH försäkringsbolag — ett samtal kan täcka båda delarna.',
      'Kontrollera om den avlidne hade grupplivförsäkring genom arbetsgivare — den administreras ofta av LF.',
      'Varje län har sitt eget bolag — kontakta rätt regionalt bolag.',
    ],
  },
];

export default function BankGuidePage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const toggleBank = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const copyPhone = (phone: string, bankId: string) => {
    navigator.clipboard.writeText(phone.replace(/[- ]/g, ''));
    setCopied(bankId);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-semibold text-primary">Bank-guide</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          Steg-för-steg instruktioner för varje storbank. Vad du ska säga, vilka dokument du behöver, och tips.
        </p>

        {/* Info box */}
        <div className="info-box mb-6">
          <p className="text-xs text-muted">
            Ring banken så snart som möjligt efter dödsfallet. Konton spärras för att skydda
            dödsboet, men löpande betalningar (el, hyra) kan lösas med ett dödsbokonto.
          </p>
        </div>

        {/* Bank cards */}
        <div className="space-y-3">
          {BANK_GUIDES.map(bank => (
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
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent text-white rounded-lg text-sm font-medium"
                    >
                      <Phone className="w-4 h-4" /> {bank.phone}
                    </a>
                    <button
                      onClick={() => copyPhone(bank.phone, bank.id)}
                      className="px-3 py-2.5 border border-border rounded-lg"
                    >
                      {copied === bank.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted" />}
                    </button>
                  </div>

                  {/* Steps */}
                  <div>
                    <p className="text-xs font-semibold text-primary mb-2">Steg att följa:</p>
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
                    <p className="text-xs font-semibold text-primary mb-2">Dokument du behöver:</p>
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
                    <p className="text-xs font-semibold text-primary mb-2">Tips:</p>
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
        <div className="card mt-6 border-l-4 border-accent">
          <p className="font-semibold text-primary text-sm mb-2">Generella tips</p>
          <div className="space-y-2 text-xs text-muted">
            <p>• Säg alltid: &ldquo;Jag ringer angående ett dödsfall&rdquo; — du kopplas direkt till rätt avdelning.</p>
            <p>• Ha dödsbevis och ditt eget leg redo vid varje samtal.</p>
            <p>• Be alltid om skriftlig bekräftelse via e-post.</p>
            <p>• Notera namn på handläggaren och ärendenummer.</p>
            <p>• Saldobesked per dödsdagen behövs till bouppteckningen — begär det direkt.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
