'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flag,
  Plus,
  Trash2,
  HelpCircle,
} from 'lucide-react';

interface CountryInfo {
  name: string;
  flag: string;
  law: string;
  agreements: string[];
  challenges: string[];
  notes: string;
}

interface ForeignAsset {
  id: string;
  country: string;
  assetType: string;
  estimatedValue: string;
  currency: string;
}

const CURRENCY_RATES: { [key: string]: number } = {
  SEK: 1,
  NOK: 0.89,
  DKK: 0.75,
  EUR: 11.5,
  GBP: 13.2,
  USD: 10.8,
  PLN: 2.8,
  TRY: 0.33,
  CNY: 1.5,
  THB: 0.32,
};

const COUNTRY_INFO: { [key: string]: CountryInfo } = {
  Finland: {
    name: 'Finland',
    flag: '🇫🇮',
    law: 'Finsk arvslag gäller om hemvist i Finland',
    agreements: [
      'Nordisk konvention (1934)',
      'EU-arvsförordningen (650/2012)',
    ],
    challenges: [
      'Finsk bolagsskatt kan påverka värdepapper',
      'Fastigheter kräver lokal registrering',
    ],
    notes: 'Som nordiskt land ofta förutsägbar process',
  },
  Norge: {
    name: 'Norge',
    flag: '🇳🇴',
    law: 'Norsk arvslag gäller om hemvist i Norge',
    agreements: [
      'Nordisk konvention (1934)',
      'EØS-avtalet (EU-liknande regler)',
    ],
    challenges: [
      'Norge inte EU-medlem, men närmare samarbete',
      'Fastigheter: Konsultationskrav för utlänningar',
    ],
    notes: 'Nordisk konvention gör processen relativt enkel',
  },
  Danmark: {
    name: 'Danmark',
    flag: '🇩🇰',
    law: 'Dansk arvslag gäller om hemvist i Danmark',
    agreements: [
      'Nordisk konvention (1934)',
      'EU-arvsförordningen (650/2012)',
    ],
    challenges: [
      'Fastigheter måste registreras på lokal domstol',
      'Arvsskatt på vissa tillgångar',
    ],
    notes: 'EU-medlem, nordisk konvention ger flexibilitet',
  },
  Tyskland: {
    name: 'Tyskland',
    flag: '🇩🇪',
    law: 'Tysk arvslag (BGB) gäller om hemvist i Tyskland',
    agreements: ['EU-arvsförordningen (650/2012)'],
    challenges: [
      'Arvsskatt 7-30% beroende på släktskap',
      'Fastigheter kräver tysk notarie (Notar)',
      'Komplicerad skattereglering',
    ],
    notes: 'Många svenskar med tyska fastigheter — ofta behövs tysk advokat',
  },
  Polen: {
    name: 'Polen',
    flag: '🇵🇱',
    law: 'Polsk arvslag gäller om hemvist i Polen',
    agreements: ['EU-arvsförordningen (650/2012)'],
    challenges: [
      'Arvsskatt upp till 20%',
      'Fastigheter: långsam lokal process',
      'Valutavexling kan bli dyr',
    ],
    notes: 'Många svenska arv från östeuropeiska ursprung',
  },
  Turkiet: {
    name: 'Turkiet',
    flag: '🇹🇷',
    law: 'Turkisk arvslag (Türk Medeni Kanunu)',
    agreements: [
      'Begränsade avtal med Sverige',
      'Kan kräva turkisk domstolsbeslut',
    ],
    challenges: [
      'Ingen EU-förordning — komplicerat',
      'Lokalt dödsbevis och arvintyg krävs',
      'Fastigheter ofta problematiska',
      'Valutakontroll kan påverka överföringar',
    ],
    notes: 'Mycket komplicerat — starkt rekommenderat att anställa turkisk advokat',
  },
  Irak: {
    name: 'Irak',
    flag: '🇮🇶',
    law: 'Islamisk familjerätt och irakisk lag',
    agreements: [
      'Mycket begränsade avtal med Sverige',
      'Irakiska domstolar och notarier krävs',
    ],
    challenges: [
      'Religiös arvsrätt (sharia) kan tillämpas',
      'Mycket osäker juridisk situation',
      'Politisk instabilitet',
      'Valutakontroll på överföringar',
    ],
    notes: 'Stark rekommendation: anställ både irakisk advokat och svensk jurist',
  },
  Bosnien: {
    name: 'Bosnien och Hercegovina',
    flag: '🇧🇦',
    law: 'Bosnisk arvslag (med regionala variationer)',
    agreements: [
      'EU-liknande regler men inte medlem',
      'Begränsade avtal med Sverige',
    ],
    challenges: [
      'Tres olika system (bosnjacker, serber, kroater)',
      'Post-krigskomplikationer med egendom',
      'Långsam domstolsprocess',
    ],
    notes: 'Rekommenderas starkt att anställa lokal bosnisk advokat',
  },
  Kina: {
    name: 'Kina',
    flag: '🇨🇳',
    law: 'Kinesisk arvslag (PRC Succession Law)',
    agreements: ['Mycket begränsade avtal'],
    challenges: [
      'Kinesiska tillgångar ofta till statsägda företag',
      'Valutakontroller strikt — svårt att överföra pengar',
      'Fastigheter: utlänningar kan inte normalt ärva',
      'Mycket byråkratisk process',
    ],
    notes: 'Nästan omöjligt att realisera arv i Kina — konsultera jurist omedelbar',
  },
  USA: {
    name: 'USA',
    flag: '🇺🇸',
    law: 'Amerikańsk arvsskatt (Estate Tax) upp till 40%',
    agreements: [
      'Begränsade dubbelbeskattningsavtal',
      'Varje stat har egen lag',
    ],
    challenges: [
      'Förbunden arvsskatt på stora dödsbon',
      'Statlig arvsskatt kan tillkomma (9-16%)',
      'Måste ansöka till IRS',
      'Långsam process',
    ],
    notes: 'Mycket viktigt att anställa amerikansk advokat för större dödsbon',
  },
  'Förenade Kungariket': {
    name: 'Förenade Kungariket',
    flag: '🇬🇧',
    law: 'Engelsk lag för England, skotsk för Skottland',
    agreements: [
      'Post-Brexit: ej EU-medlem',
      'Bilaterala avtal regleras separat',
    ],
    challenges: [
      'Arvsskatt (Inheritance Tax) upp till 40%',
      'Probate-processen kan vara lång',
      'Fastigheter: skotsk vs engelsk rättsordning',
    ],
    notes: 'Relativt välreglerat men process kan vara långsamt',
  },
  Thailand: {
    name: 'Thailand',
    flag: '🇹🇭',
    law: 'Thailändsk arvslag (Thai Succession Law)',
    agreements: [
      'Mycket begränsade avtal',
      'Svenska ämbetsmän behövs för bevisning',
    ],
    challenges: [
      'Religiös arvsrätt (buddhism)',
      'Utlänningar kan inte ärva fastigheter',
      'Valutakontroller på överföringar',
      'Långsam lokal byråkrati',
    ],
    notes: 'Många pensionärer i Thailand — rekommenderas anställa lokal advokat',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Ska utländska tillgångar med i svensk bouppteckning?',
    answer: 'Ja, absolut. Alla tillgångar världen över måste registreras i bouppteckningen, även om de är i utlandet. Det spelar ingen roll var tillgångarna ligger — de är en del av dödsboet och måste värderas och dokumenteras.',
  },
  {
    question: 'Vilket lands lag gäller för arvet?',
    answer: 'Som huvudregel gäller lagen i det land där den avlidne hade sin hemvist (hemlighetvistkonceptet). Det är vanligtvis det land där personen faktiskt bodde längre period, inte medborgarskap. EU-arvsförordningen och Nordiska konventionen kan ge undantag.',
  },
  {
    question: 'Behöver jag anställa en advokat?',
    answer: 'Rekommenderas starkt för nästan alla internationella dödsbon. Redan vid ett litet utlandstal eller när flera länder är inblandade kan juridisk rådgivning spara både tid och pengar. För stora dödsbon eller komplicerade länder är det nästan obligatoriskt.',
  },
  {
    question: 'Hur lång tid tar ett internationalt arvskifte?',
    answer: 'Det beror helt på länder inblandade. Nordiska dödsbon kan ta 3-6 månader. EU-dödsbon 6-12 månader. Länder utanför EU kan ta 1-3 år eller ännu längre, speciellt USA, Kina eller Mellanöstern.',
  },
  {
    question: 'Vad kostar en internationell advokat?',
    answer: 'Priset varierar enormt beroende på land och komplexitet. En dansk eller norsk advokat kan kosta 100-300 SEK per timme. En amerikansk advokat kan kosta 500+ SEK per timme. Planera för extra kostnader.',
  },
];

function StepGuide() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: 'Var bodde den avlidne?',
      description: 'Hemvisten är det viktigaste konceptet',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-primary/80">
            <strong>Hemvist</strong> är ofta avgörande för vilken arvslag som tillämpas. Det är inte samma som medborgarskap eller var personen var född.
          </p>
          <div className="rounded-lg p-3 border" style={{ background: 'var(--accent-soft)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium text-primary mb-2">Hemvist betyder:</p>
            <ul className="text-xs text-primary space-y-1">
              <li>• Där personen faktiskt bodde längst tid (vanligtvis 183+ dagar/år)</li>
              <li>• Där personen hade sitt huvudsakliga hemål</li>
              <li>• Där de flesta av personens tillgångar var</li>
            </ul>
          </div>
          <p className="text-sm text-primary/70">
            Enligt EU-arvsförordningen och Nordiska konventionen är hemvistlandet ofta helt avgörande.
          </p>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Medborgarskap & internationell rätt',
      description: 'EU-förordning, Nordiska konventionen och lokala lagar',
      content: (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="pl-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(139,164,184,0.06), rgba(139,164,184,0.02))', border: '1px solid rgba(139,164,184,0.15)' }}>
              <p className="font-medium text-primary text-sm">EU-arvsförordningen (650/2012)</p>
              <p className="text-xs text-primary/70 mt-1">
                Tillämpas mellan EU-medlemsstater. Enkelt: hemvistlandet lag gäller normalt.
              </p>
            </div>
            <div className="pl-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(139,164,184,0.06), rgba(139,164,184,0.02))', border: '1px solid rgba(139,164,184,0.15)' }}>
              <p className="font-medium text-primary text-sm">Nordiska konventionen</p>
              <p className="text-xs text-primary/70 mt-1">
                Mellan Sverige, Norge, Danmark, Finland och Island. Ofta mer flexibel än EU-regler.
              </p>
            </div>
            <div className="pl-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(139,164,184,0.06), rgba(139,164,184,0.02))', border: '1px solid rgba(139,164,184,0.15)' }}>
              <p className="font-medium text-primary text-sm">Länder utan överenskommelse</p>
              <p className="text-xs text-primary/70 mt-1">
                USA, Kina, Turkiet, Irak etc. Kräver ofta lokal advokat och lokal domstol.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Tillgångar utomlands',
      description: 'Lägg till och håll koll på utländska tillgångar',
      content: <ForeignAssetsInput />,
    },
    {
      number: 4,
      title: 'Vilka myndigheter?',
      description: 'Dynamisk info baserad på länder',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-primary/80 mb-4">
            Beroende på vilka länder som är inblandade behövs kontakt med olika myndigheter:
          </p>
          <div className="space-y-2">
            <div className="bg-background p-3 rounded-lg border"
              style={{ borderColor: 'var(--border)' }}>
              <p className="font-medium text-sm text-primary">Sverige</p>
              <p className="text-xs text-primary/70 mt-1">Skatteverket, Domstolsverket, lokala tingsrätt</p>
            </div>
            <div className="bg-background p-3 rounded-lg border"
              style={{ borderColor: 'var(--border)' }}>
              <p className="font-medium text-sm text-primary">Nordiska länder (Norge, Danmark, Finland)</p>
              <p className="text-xs text-primary/70 mt-1">Motsvarande myndigheter i respektive land, ofta med bilaterala avtal</p>
            </div>
            <div className="bg-background p-3 rounded-lg border"
              style={{ borderColor: 'var(--border)' }}>
              <p className="font-medium text-sm text-primary">EU-länder (Tyskland, Polen etc.)</p>
              <p className="text-xs text-primary/70 mt-1">Lokala domstolar, notarier, skattemyndigheter</p>
            </div>
            <div className="bg-background p-3 rounded-lg border"
              style={{ borderColor: 'var(--border)' }}>
              <p className="font-medium text-sm text-primary">USA</p>
              <p className="text-xs text-primary/70 mt-1">IRS (Internal Revenue Service), statlig domstol (Probate Court), lokala skattemyndigheter</p>
            </div>
            <div className="bg-background p-3 rounded-lg border"
              style={{ borderColor: 'var(--border)' }}>
              <p className="font-medium text-sm text-primary">Övriga länder</p>
              <p className="text-xs text-primary/70 mt-1">Lokala domstolar, notarier, konsulat och svenska ambassader</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 5,
      title: 'Sammanfattning & nästa steg',
      description: 'Rekommendationer och juridisk hjälp',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg p-3 border" style={{ background: 'var(--accent-soft)', borderColor: 'var(--border)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Rekommenderad handlingsplan:</p>
            <ol className="text-xs space-y-1.5" style={{ color: 'var(--text)' }}>
              <li>1. Samla in och inventera alla utländska tillgångar</li>
              <li>2. Identifiera vilka länder som är inblandade</li>
              <li>3. Kontakta svenska länsrätt för arkskifte</li>
              <li>4. Konsultera internationell advokat snarast</li>
              <li>5. Skaffa internationella arvsintyg/dödsbevis</li>
              <li>6. Öppna kontakt med lokala myndigheter</li>
            </ol>
          </div>
          <Link
            href="/juridisk-hjalp"
            className="block w-full text-center bg-accent text-white py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Kontakta jurist med internationell erfarenhet
          </Link>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-display text-primary mb-4">Steg-för-steg guide</h2>

      {/* Step indicator */}
      <div className="flex gap-2 mb-4">
        {steps.map((step) => (
          <button
            key={step.number}
            onClick={() => setCurrentStep(step.number)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors border ${
              currentStep === step.number
                ? 'bg-accent text-white'
                : 'text-primary/70'
            }`}
            style={currentStep === step.number
              ? { borderColor: 'var(--accent)' }
              : { background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            Steg {step.number}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-display text-primary mb-1">{currentStepData.title}</h3>
        <p className="text-xs text-primary/70 mb-3">{currentStepData.description}</p>
        {currentStepData.content}
      </div>

      {/* Navigation */}
      <div className="flex gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex-1 py-2 px-3 rounded-lg text-sm font-medium border text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
        >
          Föregående
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
          disabled={currentStep === 5}
          className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Nästa
        </button>
      </div>
    </div>
  );
}

function ForeignAssetsInput() {
  const [assets, setAssets] = useState<ForeignAsset[]>([]);
  const [newAsset, setNewAsset] = useState({
    country: '',
    assetType: '',
    estimatedValue: '',
    currency: 'EUR',
  });

  const addAsset = () => {
    if (newAsset.country && newAsset.assetType && newAsset.estimatedValue) {
      setAssets([
        ...assets,
        {
          id: Date.now().toString(),
          ...newAsset,
        },
      ]);
      setNewAsset({
        country: '',
        assetType: '',
        estimatedValue: '',
        currency: 'EUR',
      });
    }
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const getTotalSEK = () => {
    return assets.reduce((sum, asset) => {
      const value = parseFloat(asset.estimatedValue) || 0;
      const rate = CURRENCY_RATES[asset.currency] || 1;
      return sum + value * rate;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        <input
          type="text"
          placeholder="Land (t.ex. Tyskland)"
          value={newAsset.country}
          onChange={(e) => setNewAsset({ ...newAsset, country: e.target.value })}
          className="w-full px-3 py-2 border text-sm rounded-2xl"
          style={{ borderColor: 'var(--border)' }}
        />
        <input
          type="text"
          placeholder="Tillgångstyp (t.ex. Fastighet, Bankkonto)"
          value={newAsset.assetType}
          onChange={(e) => setNewAsset({ ...newAsset, assetType: e.target.value })}
          className="w-full px-3 py-2 border text-sm rounded-2xl"
          style={{ borderColor: 'var(--border)' }}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Värde"
            value={newAsset.estimatedValue}
            onChange={(e) => setNewAsset({ ...newAsset, estimatedValue: e.target.value })}
            className="w-full px-3 py-2 border text-sm rounded-2xl"
            style={{ borderColor: 'var(--border)' }}
          />
          <select
            value={newAsset.currency}
            onChange={(e) => setNewAsset({ ...newAsset, currency: e.target.value })}
            className="w-full px-3 py-2 border text-sm rounded-2xl"
            style={{ borderColor: 'var(--border)' }}
          >
            {Object.keys(CURRENCY_RATES).map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={addAsset}
          className="w-full flex items-center justify-center gap-2 text-white py-2 text-sm font-medium hover:opacity-90 transition-opacity rounded-full"
          style={{ background: 'linear-gradient(135deg, #6B7F5E, #5A6E4E)' }}
        >
          <Plus className="w-4 h-4" />
          Lägg till tillgång
        </button>
      </div>

      {assets.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[color:var(--border)]">
          {assets.map((asset) => {
            const sek = (parseFloat(asset.estimatedValue) || 0) * (CURRENCY_RATES[asset.currency] || 1);
            return (
              <div
                key={asset.id}
                className="flex items-center justify-between bg-background p-2 rounded-lg text-sm"
              >
                <div className="flex-1">
                  <p className="font-medium text-primary">{asset.country} — {asset.assetType}</p>
                  <p className="text-xs text-primary/70">
                    {asset.estimatedValue} {asset.currency} (≈ {sek.toLocaleString('sv-SE', {
                      maximumFractionDigits: 0,
                    })} SEK)
                  </p>
                </div>
                <button
                  onClick={() => deleteAsset(asset.id)}
                  className="p-1.5 text-warn hover:bg-white rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mt-3">
            <p className="text-sm font-medium text-primary">Totalt i SEK:</p>
            <p className="text-lg font-semibold text-accent">
              {getTotalSEK().toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CountryCards() {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
        <Flag className="w-5 h-5" />
        Länderinfo för vanliga destinationer
      </h2>
      <div className="space-y-2">
        {Object.entries(COUNTRY_INFO).map(([key, country]) => {
          const isExpanded = expandedCountry === key;
          return (
            <button
              key={key}
              onClick={() => setExpandedCountry(isExpanded ? null : key)}
              className="w-full text-left border rounded-lg p-3 hover:border-accent transition-colors"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-primary">
                    {country.flag} {country.name}
                  </p>
                  {!isExpanded && <p className="text-xs text-primary/70 mt-1">{country.law}</p>}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[color:var(--border)] space-y-2">
                  <div>
                    <p className="font-medium text-sm text-primary">{country.law}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary/70 mb-1">Överenskommelser:</p>
                    <ul className="text-xs text-primary/70 space-y-0.5">
                      {country.agreements.map((agreement, i) => (
                        <li key={i}>• {agreement}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary/70 mb-1">Särskilda utmaningar:</p>
                    <ul className="text-xs text-primary/70 space-y-0.5">
                      {country.challenges.map((challenge, i) => (
                        <li key={i}>• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded p-2 mt-2 border" style={{ background: 'var(--accent-soft)', borderColor: 'var(--border)' }}>
                    <p className="text-xs text-primary">{country.notes}</p>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('EUR');

  const toSEK = (parseFloat(amount) || 0) * (CURRENCY_RATES[fromCurrency] || 1);

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-display text-primary mb-4">Valutakonverterare till SEK</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-xs font-medium text-primary/70 block mb-1">Belopp</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border text-sm rounded-2xl"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-primary/70 block mb-1">Valuta</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-3 py-2 border text-sm rounded-2xl"
            style={{ borderColor: 'var(--border)' }}
          >
            {Object.keys(CURRENCY_RATES).filter((c) => c !== 'SEK').map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
        <div className="p-3 mt-2 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(107,127,94,0.06), rgba(107,127,94,0.02))', border: '1px solid rgba(107,127,94,0.15)' }}>
          <p className="text-xs font-medium text-primary/70 mb-1">Ungefärligt värde i SEK:</p>
          <p className="text-2xl font-semibold text-accent">
            {toSEK.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
          </p>
          <p className="text-xs text-primary/70 mt-1">
            (Ungefärliga kurser — verifiera alltid aktuell valutakurs före överföring)
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
        <HelpCircle className="w-5 h-5" />
        Vanliga frågor
      </h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <button
              key={index}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="w-full text-left border rounded-lg p-3 hover:border-accent transition-colors"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-primary text-sm">{item.question}</p>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                )}
              </div>
              {isExpanded && (
                <p className="text-sm text-primary/80 mt-3 pt-3 border-t border-[color:var(--border)] leading-relaxed">
                  {item.answer}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InternationelltContent() {
  const { t } = useLanguage();
  const { state } = useDodsbo();

  const hasInternationalAssets =
    state.deceasedMedborgarskap &&
    state.deceasedMedborgarskap !== 'Svenska' &&
    state.deceasedMedborgarskap !== 'Sverige';

  return (
    <div className="flex flex-col px-4 py-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-xl font-display text-primary">Internationella arv</h1>
          <p className="text-muted text-sm">Utländsk hemvist, tillgångar &amp; medborgarskap</p>
        </div>
      </div>

      {/* Warning banner */}
      <div
        className="card border-2 border-warn bg-warn/5 mb-6"
        style={{
          borderColor: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.05)',
        }}
      >
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warn flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warn mb-2">
              Internationella dödsbon är komplexa.
            </p>
            <p className="text-sm text-primary/80 mb-3">
              Vi rekommenderar alltid juridisk rådgivning när utländska tillgångar eller hemvist är inblandade. Denna guide ger endast översiktlig information.
            </p>
            <Link
              href="/juridisk-hjalp"
              className="inline-flex items-center gap-2 text-warn font-medium text-sm hover:underline"
            >
              Kontakta advokat med internationell erfarenhet
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Auto-detect banner */}
      {hasInternationalAssets && (
        <div className="card border mb-6" style={{ background: 'var(--accent-soft)', borderColor: 'var(--border)' }}>
          <div className="flex gap-2">
            <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                Utländskt medborgarskap upptäckt
              </p>
              <p className="text-xs text-primary/70">
                Den avlidne hade medborgarskap i {state.deceasedMedborgarskap}. Denna guide är särskilt relevant för er situation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="card border border-blue-200 bg-blue-50 mb-6">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/80">
            <strong>Hemvist</strong> är oftast avgörande för vilken arvslag som gäller — inte medborgarskap eller var personen var född.
          </p>
        </div>
      </div>

      {/* Step guide */}
      <StepGuide />

      {/* Country cards */}
      <CountryCards />

      {/* Currency converter */}
      <CurrencyConverter />

      {/* FAQ */}
      <FAQSection />

      {/* Useful links */}
      <div className="card mb-6">
        <h2 className="text-lg font-display text-primary mb-4">Användbara resurser</h2>
        <div className="space-y-2">
          <a
            href="https://ec.europa.eu/info/law/better-regulation/have-your-say/initiatives/12627-European-Succession-Certificate-ESC_en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Europeiskt arvsintyg
          </a>
          <a
            href="https://www.skatteverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Skatteverkets webbplats
          </a>
          <a
            href="https://www.domstolverket.se"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-accent text-sm font-medium hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Domstolsverket — information om arvskifte
          </a>
        </div>
      </div>

    </div>
  );
}

export default function InternationelltPage() {
  return (
    <DodsboProvider>
      <InternationelltContent />
    </DodsboProvider>
  );
}
