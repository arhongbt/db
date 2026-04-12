'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { DodsboProvider, useDodsbo } from '@/lib/context';
import { BottomNav } from '@/components/ui/BottomNav';
import Link from 'next/link';
import {
  ArrowLeft,
  XCircle,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Info,
  Building2,
  Smartphone,
  Car,
  Wifi,
  CreditCard,
  Heart,
} from 'lucide-react';

// ── Account categories and items ──

interface AccountItem {
  id: string;
  name: string;
  phone?: string;
  url?: string;
  info: string;
}

interface AccountCategory {
  id: string;
  title: string;
  icon: typeof Building2;
  items: AccountItem[];
}

const ACCOUNT_CATEGORIES: AccountCategory[] = [
  {
    id: 'banker',
    title: 'Banker',
    icon: Building2,
    items: [
      { id: 'swedbank', name: 'Swedbank', phone: '0771-22 11 22', url: 'https://www.swedbank.se', info: 'Ring kundtjänst med dödsfallsintyg. Begär saldobesked per dödsdagen. Alla delägare måste godkänna avslut.' },
      { id: 'handelsbanken', name: 'Handelsbanken', phone: '0771-77 88 99', url: 'https://www.handelsbanken.se', info: 'Kontakta närmaste kontor. Ta med dödsbevis och legitimation. Bankfack inventeras med två vittnen.' },
      { id: 'seb', name: 'SEB', phone: '0771-365 365', url: 'https://www.seb.se', info: 'Ring privatrådgivning. Begär saldobesked, stoppa autogiro. Fullmakt krävs om inte alla delägare medverkar.' },
      { id: 'nordea', name: 'Nordea', phone: '0771-22 44 88', url: 'https://www.nordea.se', info: 'Ring eller besök kontor. Meddela dödsfall, begär kontoutdrag per dödsdagen. Beställ saldobesked.' },
      { id: 'lansforsakringar', name: 'Länsförsäkringar', phone: '08-588 400 00', url: 'https://www.lansforsakringar.se', info: 'Kontakta ditt lokala LF-bolag. Hanterar både bank och försäkring. Begär samlat besked.' },
      { id: 'skandia', name: 'Skandia', phone: '0771-55 55 00', url: 'https://www.skandia.se', info: 'Ring kundtjänst. Kontrollera pensioner, fonder och försäkringar. Begär samlat besked.' },
      { id: 'ica_banken', name: 'ICA Banken', phone: '033-47 47 00', url: 'https://www.icabanken.se', info: 'Ring kundtjänst. Avsluta konton och kort. Kontrollera ICA-försäkringar.' },
      { id: 'avanza', name: 'Avanza', phone: '08-562 250 00', url: 'https://www.avanza.se', info: 'Ring eller mejla. Begär depåvärde per dödsdagen. Fullmakt krävs för att flytta värdepapper.' },
    ],
  },
  {
    id: 'forsakringar',
    title: 'Försäkringsbolag',
    icon: Heart,
    items: [
      { id: 'if', name: 'If Skadeförsäkring', phone: '0771-815 818', url: 'https://www.if.se', info: 'Anmäl dödsfallet. Kontrollera hem-, bil- och olycksfallsförsäkring. Fråga om grupplivförsäkring.' },
      { id: 'trygg_hansa', name: 'Trygg-Hansa', phone: '0771-11 11 00', url: 'https://www.trygghansa.se', info: 'Ring kundtjänst med personnummer. Kontrollera livförsäkring och efterlevandeskydd.' },
      { id: 'folksam', name: 'Folksam', phone: '0771-950 950', url: 'https://www.folksam.se', info: 'Kontrollera grupplivförsäkring via fack/förbund. Folksam hanterar många kollektivavtalsförsäkringar.' },
      { id: 'spf', name: 'SPP / Storebrand', phone: '020-51 52 53', url: 'https://www.spp.se', info: 'Kontrollera tjänstepension och efterlevandeskydd. Fråga om utbetalning till dödsboet.' },
      { id: 'alecta', name: 'Alecta', phone: '020-78 22 80', url: 'https://www.alecta.se', info: 'Tjänstepension för privatanställda tjänstemän. Kontrollera ITP och familjepension.' },
      { id: 'afa', name: 'AFA Försäkring', phone: '0771-88 00 99', url: 'https://www.afa.se', info: 'Kollektivavtalad försäkring. Kan ge dödsfallsersättning. Kontrollera TGL (tjänstegrupplivförsäkring).' },
    ],
  },
  {
    id: 'abonnemang',
    title: 'Telefon & bredband',
    icon: Smartphone,
    items: [
      { id: 'telia', name: 'Telia', phone: '020-20 20 20', url: 'https://www.telia.se', info: 'Ring med dödsfallsintyg. Säg upp mobil, bredband, TV. Bindningstid gäller inte vid dödsfall.' },
      { id: 'tele2', name: 'Tele2', phone: '0200-23 23 23', url: 'https://www.tele2.se', info: 'Ring kundtjänst. Dödsboet kan säga upp avtal utan bindningstid.' },
      { id: 'tre', name: 'Tre', phone: '0771-33 33 33', url: 'https://www.tre.se', info: 'Kontakta kundtjänst med personnummer och dödsbevis.' },
      { id: 'telenor', name: 'Telenor', phone: '020-22 22 22', url: 'https://www.telenor.se', info: 'Ring eller besök butik med dödsbevis. Avsluta mobil och bredband.' },
    ],
  },
  {
    id: 'fordon',
    title: 'Fordon & transport',
    icon: Car,
    items: [
      { id: 'transportstyrelsen', name: 'Transportstyrelsen', phone: '0771-503 503', url: 'https://www.transportstyrelsen.se', info: 'Avregistrera eller ägarbyt fordon. Betala fordonsskatt. Dödsboet står som ägare tills det säljs/överlåts.' },
      { id: 'bilforsakring', name: 'Bilförsäkring', info: 'Kontakta ditt försäkringsbolag. Bilförsäkringen gäller tills vidare men bör uppdateras.' },
    ],
  },
  {
    id: 'digitalt',
    title: 'Digitala tjänster',
    icon: Wifi,
    items: [
      { id: 'skatteverket_digital', name: 'Skatteverket — digital brevlåda', phone: '0771-567 567', url: 'https://www.skatteverket.se', info: 'Avregistrera från digital brevlåda. Posten börjar komma i fysisk form igen.' },
      { id: 'streaming', name: 'Streamingtjänster', info: 'Avsluta alla streamingtjänster: Spotify, Netflix, HBO Max, Disney+, Viaplay, YouTube Premium, Apple TV+ m.fl. Kontakta varje tjänsts support med dödsbevis, eller logga in och avsluta prenumerationen direkt.' },
      { id: 'apple', name: 'Apple ID', url: 'https://support.apple.com/deceased', info: 'Apple har en process för att hantera kontot för en avliden person. Kräver dödsbevis och ibland domstolsbeslut.' },
      { id: 'google', name: 'Google-konto', url: 'https://support.google.com/accounts/troubleshooter/6357590', info: 'Google Inactive Account Manager eller begäran om radering med dödsbevis.' },
      { id: 'facebook', name: 'Facebook / Meta', url: 'https://www.facebook.com/help/1506822589577997', info: 'Kontot kan omvandlas till minnesplats eller raderas. Kräver dödsbevis.' },
    ],
  },
  {
    id: 'ovriga',
    title: 'Övriga abonnemang',
    icon: CreditCard,
    items: [
      { id: 'el', name: 'Elbolag', info: 'Kontakta elleverantören och elnätsbolaget. Avsluta eller överlåt elavtalet. Mätarställning bör noteras.' },
      { id: 'hyresvard', name: 'Hyresvärd', info: 'Dödsboet har 1 månads uppsägningstid (ej 3). Meddela snarast. Se brevmall under Fullmakter.' },
      { id: 'tidningar', name: 'Tidningsprenumerationer', info: 'Kontakta varje tidning. De flesta accepterar dödsbevis som underlag för omedelbar uppsägning.' },
      { id: 'fackforbund', name: 'Fackförbund', info: 'Avsluta medlemskap. Kontrollera om det finns grupplivförsäkring (TGL) via facket — ofta 1-3 prisbasbelopp.' },
      { id: 'a_kassa', name: 'A-kassa', info: 'Avsluta medlemskap. Kontrollera eventuella utestående utbetalningar.' },
      { id: 'pensionsmyndigheten', name: 'Pensionsmyndigheten', phone: '0771-776 776', url: 'https://www.pensionsmyndigheten.se', info: 'Meddela dödsfall. Kontrollera allmän pension, efterlevandepension och premiepension.' },
    ],
  },
];

function AvslutaKontonSkeleton() {
  return (
    <div className="min-h-dvh bg-background p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-8" />
      <div className="space-y-4">
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );
}

function AvslutaKontonContent() {
  const { loading } = useDodsbo();
  const [mounted, setMounted] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>('banker');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);

  // Load/save checked items from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dodsbo_avsluta_konton');
      if (saved) setCheckedItems(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('dodsbo_avsluta_konton', JSON.stringify(Array.from(next)));
      } catch { /* ignore */ }
      return next;
    });
  };

  if (!mounted || loading) return <AvslutaKontonSkeleton />;

  const totalItems = ACCOUNT_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
  const doneCount = checkedItems.size;

  return (
    <div className="flex flex-col min-h-dvh px-5 py-6 pb-24">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <XCircle className="w-7 h-7 text-accent" />
        <h1 className="text-2xl font-semibold text-primary">Avsluta konton</h1>
      </div>
      <p className="text-muted mb-4">
        Checklista för att avsluta den avlidnes konton, abonnemang och tjänster.
      </p>

      {/* Progress */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">Framsteg</span>
          <span className="text-sm text-muted">{doneCount} / {totalItems}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-accent rounded-full h-3 transition-all duration-500"
            style={{ width: `${totalItems > 0 ? (doneCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="info-box mb-6">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary/80">
            Du behöver inte avsluta allt på en gång. Bocka av vartefter du gör framsteg.
            Ha dödsbevis och fullmakt till hands vid varje kontakt.
          </p>
        </div>
      </div>

      {/* Categories */}
      {ACCOUNT_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isExpanded = expandedCat === cat.id;
        const catDone = cat.items.filter((i) => checkedItems.has(i.id)).length;

        return (
          <div key={cat.id} className="mb-4">
            <button
              onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
              className="card w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <p className="font-medium text-primary">{cat.title}</p>
                  <p className="text-xs text-muted">{catDone} / {cat.items.length} klart</p>
                </div>
              </div>
              {isExpanded
                ? <ChevronUp className="w-5 h-5 text-muted" />
                : <ChevronDown className="w-5 h-5 text-muted" />}
            </button>

            {isExpanded && (
              <div className="mt-2 space-y-2">
                {cat.items.map((item) => {
                  const isDone = checkedItems.has(item.id);
                  return (
                    <div key={item.id} className={`card transition-all ${isDone ? 'opacity-60' : ''}`}>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {isDone
                            ? <CheckCircle2 className="w-5 h-5 text-success" />
                            : <Circle className="w-5 h-5 text-gray-300" />}
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium text-primary text-sm ${isDone ? 'line-through' : ''}`}>
                            {item.name}
                          </p>
                          <p className="text-xs text-muted mt-1">{item.info}</p>
                          <div className="flex gap-3 mt-2">
                            {item.phone && (
                              <a
                                href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                              >
                                <Phone className="w-3 h-3" /> {item.phone}
                              </a>
                            )}
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> Webbplats
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="bg-primary-lighter/30 rounded-card p-4">
        <p className="text-xs text-muted leading-relaxed">
          Listan täcker de vanligaste kontona och tjänsterna. Den avlidne kan ha haft
          ytterligare abonnemang — kontrollera kontoutdrag och post för att hitta dem.
          Dina framsteg sparas lokalt på den här enheten.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

export default function AvslutaKontonPage() {
  return (
    <DodsboProvider>
      <AvslutaKontonContent />
    </DodsboProvider>
  );
}
