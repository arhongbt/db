// ============================================================
// Dödsbo App — Core Data Model
// Based on Ärvdabalken (1958:637) and Swedish estate law
// ============================================================

// ── Subscription & Premium ────────────────────────────────
export type SubscriptionTier = 'trial' | 'standard' | 'pro' | 'expired';

export type PremiumFeature =
  | 'mikeRoss'
  | 'bodelning'
  | 'documentGeneration'
  | 'scanner'
  | 'bouppteckningPDF'
  | 'arvskifteshandling'
  | 'exportera'
  | 'advancedGuides';

export interface SubscriptionState {
  tier: SubscriptionTier;
  trialStartedAt: string | null;   // ISO date
  trialExpiresAt: string | null;   // ISO date
  paidAt: string | null;           // ISO date when payment was made
}

/** Feature access per tier */
export const TIER_ACCESS: Record<SubscriptionTier, Record<PremiumFeature, boolean>> = {
  trial: {
    mikeRoss: true,
    bodelning: true,
    documentGeneration: true,
    scanner: true,
    bouppteckningPDF: true,
    arvskifteshandling: true,
    exportera: true,
    advancedGuides: true,
  },
  standard: {
    mikeRoss: true,
    bodelning: false,
    documentGeneration: false,
    scanner: false,
    bouppteckningPDF: false,
    arvskifteshandling: false,
    exportera: false,
    advancedGuides: false,
  },
  pro: {
    mikeRoss: true,
    bodelning: true,
    documentGeneration: true,
    scanner: true,
    bouppteckningPDF: true,
    arvskifteshandling: true,
    exportera: true,
    advancedGuides: true,
  },
  expired: {
    mikeRoss: false,
    bodelning: false,
    documentGeneration: false,
    scanner: false,
    bouppteckningPDF: false,
    arvskifteshandling: false,
    exportera: false,
    advancedGuides: false,
  },
};

export const TRIAL_DURATION_DAYS = 7;

/** Relation till den avlidne */
export type Relation =
  | 'make_maka'        // Gift partner
  | 'sambo'            // Sambo
  | 'barn'             // Barn (bröstarvinge)
  | 'barnbarn'         // Barnbarn (istadarätt)
  | 'foralder'         // Förälder
  | 'syskon'           // Syskon
  | 'annan_slakting'   // Annan släkting
  | 'testamentstagare' // Testamentstagare utan släktskap
  | 'god_man'          // God man / förvaltare
  | 'ombud'            // Juridiskt ombud
  | 'vardnadshavare'   // Vårdnadshavare för minderårigt barn
  | 'foralder_avliden' // Förälder till den avlidne
  | 'van_annan';       // Vän eller annan

/** Boendetyp */
export type HousingType =
  | 'hyresratt'
  | 'bostadsratt'
  | 'villa'
  | 'fritidshus'
  | 'ingen_bostad';

/** Familjesituation — styr arvsordningen */
export type FamilySituation =
  | 'gift_med_gemensamma_barn'
  | 'gift_med_sarkullebarn'
  | 'gift_utan_barn'
  | 'ogift_med_barn'
  | 'sambo_med_barn'
  | 'sambo_utan_barn'
  | 'ensamstaende_utan_barn';

/** Steg i dödsboprocessen */
export type ProcessStep =
  | 'akut'               // Dag 1-7: Nödbroms
  | 'kartlaggning'       // Vecka 1-4: Inventera & förstå
  | 'bouppteckning'      // Månad 1-3: Formellt dokument
  | 'arvskifte'          // Månad 3-6: Fördela & avsluta
  | 'avslutat';

/** Status för en uppgift */
export type TaskStatus = 'ej_paborjad' | 'pagaende' | 'klar' | 'ej_aktuell';

/** Prioritet */
export type Priority = 'akut' | 'viktig' | 'normal' | 'kan_vanta';

// ============================================================
// Onboarding — samlas in vid registrering
// ============================================================

export interface OnboardingData {
  /** Vem är du i förhållande till den avlidne? */
  relation: Relation;

  /** Familjesituation (styr arvsordning) */
  familySituation: FamilySituation;

  /** Finns testamente? */
  hasTestamente: boolean | null; // null = vet ej

  /** Boendetyp */
  housingType: HousingType;

  /** Vilka banker hade den avlidne? */
  banks: string[];

  /** Ungefärlig ekonomisk situation */
  hasDebts: boolean | null;

  /** Vad har redan gjorts? */
  alreadyDone: AlreadyDoneStep[];
}

export type AlreadyDoneStep =
  | 'dodsbevis'
  | 'kontaktat_bank'
  | 'kontaktat_forsakring'
  | 'kontaktat_hyresvard'
  | 'begravning_bestald'
  | 'bouppteckning_paborjad';

// ============================================================
// Huvudentiteter
// ============================================================

export interface Dodsbo {
  id: string;
  createdAt: string;
  updatedAt: string;

  /** Den avlidnes namn */
  deceasedName: string;
  /** Dödsdatum — alla tidsfrister räknas härifrån */
  deathDate: string;
  /** Personnummer (krypterat) */
  deceasedPersonnummer?: string;
  /** Den avlidnes adress */
  deceasedAddress?: string;
  /** Folkbokföringsort */
  deceasedFolkbokforingsort?: string;
  /** Medborgarskap (svenskt om ej angivet) */
  deceasedMedborgarskap?: string;
  /** Civilstånd — gift, ogift, änka/änkling, skild */
  deceasedCivilstand?: 'gift' | 'ogift' | 'anka_ankling' | 'skild';

  /** Förrättningsdatum — när bouppteckningsförrättningen hålls */
  forrattningsdatum?: string;
  /** Förrättningsmän — två oberoende personer som intygar */
  forrattningsman: Forrattningsman[];
  /** Bouppgivare — den som lämnar uppgifterna */
  bouppgivare?: {
    name: string;
    personnummer?: string;
    relation?: string;
  };

  /** Onboarding-svar */
  onboarding: OnboardingData;

  /** Alla dödsbodelägare */
  delagare: Dodsbodelaware[];

  /** Tillgångar */
  tillgangar: Tillgang[];

  /** Skulder */
  skulder: Skuld[];

  /** Försäkringar */
  forsakringar: Forsakring[];

  /** Uppgifter/checklista */
  tasks: DodsboTask[];

  /** Aktuellt processteg */
  currentStep: ProcessStep;

  /** Lösöre — personliga tillhörigheter */
  losore: LosoreItem[];

  /** Dödsbokostnader */
  kostnader: Kostnad[];
}

// ============================================================
// Lösöre — personliga tillhörigheter
// ============================================================

export interface LosoreItem {
  id: string;
  name: string;
  category: LosoreCategory;
  estimatedValue: number;
  assignedTo?: string;
  notes?: string;
  imageUrl?: string;
  tilldeladTill?: string;
}

export type LosoreCategory =
  | 'mobler'
  | 'smycken'
  | 'konst'
  | 'elektronik'
  | 'fordon'
  | 'samlarobj'
  | 'klader'
  | 'ovrigt';

// ============================================================
// Dödsbokostnader
// ============================================================

export interface Kostnad {
  id: string;
  category: KostnadCategory;
  description: string;
  amount: number;
  date: string;
  paidBy?: string;
}

export type KostnadCategory =
  | 'begravning'
  | 'juridik'
  | 'vardering'
  | 'stadning'
  | 'transport'
  | 'forvaring'
  | 'fastighet'
  | 'ovrigt';

export interface Forrattningsman {
  name: string;
  personnummer?: string;
  address?: string;
}

export interface Dodsbodelaware {
  id: string;
  name: string;
  personnummer?: string;
  relation: Relation;
  email?: string;
  phone?: string;
  /** Andel i arvskiftet (0-100) */
  share?: number;
  /** Är dödsbodelägare (kan vara testamentstagare som inte är delägare) */
  isDelagare: boolean;
}

export interface Tillgang {
  id: string;
  type: TillgangType;
  description: string;
  /** Uppskattat värde i SEK */
  estimatedValue?: number;
  /** Bekräftat värde */
  confirmedValue?: number;
  /** Taxeringsvärde för fastighet (SEK) */
  taxeringsvarde?: number;
  bank?: string;
  notes?: string;
}

export type TillgangType =
  | 'bankkonto'
  | 'bostadsratt'
  | 'villa'
  | 'jordbruksfastighet'
  | 'fritidshus'
  | 'sommarstuga'
  | 'bil'
  | 'aktier_fonder'
  | 'kryptovalutor'
  | 'pension'
  | 'forsakring'
  | 'losore'
  | 'ovrigt';

export interface Skuld {
  id: string;
  type: SkuldType;
  creditor: string;
  amount?: number;
  notes?: string;
}

export type SkuldType =
  | 'bolan'
  | 'konsumentlan'
  | 'kreditkort'
  | 'skatteskuld'
  | 'begravningskostnad'
  | 'ovrigt';

export interface Forsakring {
  id: string;
  type: ForsakringType;
  company: string;
  policyNumber?: string;
  /** Förmånstagare — kan vara dödsboet eller namngiven person */
  beneficiary?: string;
  estimatedValue?: number;
  contacted: boolean;
  notes?: string;
}

export type ForsakringType =
  | 'livforsakring'
  | 'grupplivforsakring'
  | 'tjanstepension'
  | 'privat_pension'
  | 'hemforsakring'
  | 'bilforsakring'
  | 'olycksfallsforsakring'
  | 'sjukforsakring'
  | 'barnforsakring'
  | 'ovrigt';

// ============================================================
// Uppgifter / Checklista
// ============================================================

export interface DodsboTask {
  id: string;
  /** Processteg uppgiften tillhör */
  step: ProcessStep;
  /** Kategori */
  category: TaskCategory;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  /** Tidsfrist (dagar efter dödsfall) */
  deadlineDays?: number;
  /** Fast datum */
  deadlineDate?: string;
  /** Beror på andra uppgifter */
  dependsOn?: string[];
  /** Tips/hjälptext */
  helpText?: string;
  /** Extern länk (t.ex. till Skatteverket) */
  externalUrl?: string;
  completedAt?: string;
  /** Tilldelad till (namn på delägare) */
  assignedTo?: string;
}

export type TaskCategory =
  | 'akut_praktiskt'
  | 'bank_ekonomi'
  | 'forsakring'
  | 'bostad'
  | 'myndigheter'
  | 'begravning'
  | 'bouppteckning'
  | 'arvskifte'
  | 'digitalt'
  | 'post_abonnemang';

// ============================================================
// Tidsfrist — viktiga datum som räknas från dödsdatumet
// ============================================================

export interface Tidsfrist {
  id: string;
  title: string;
  description: string;
  /** Antal dagar/månader efter dödsfall */
  offsetDays: number;
  /** Är det en lagstadgad frist? */
  isLegal: boolean;
  /** Berörd myndighet/aktör */
  authority?: string;
  /** Konsekvens om man missar fristen */
  consequence?: string;
}

// ============================================================
// Swedish banks — used in onboarding
// ============================================================

export const SWEDISH_BANKS = [
  // Storbanker
  { id: 'swedbank', name: 'Swedbank', phone: '0771-22 11 22' },
  { id: 'handelsbanken', name: 'Handelsbanken', phone: '0771-77 88 99' },
  { id: 'seb', name: 'SEB', phone: '0771-365 365' },
  { id: 'nordea', name: 'Nordea', phone: '0771-22 44 88' },
  // Försäkringsbanker
  { id: 'lansforsakringar', name: 'Länsförsäkringar', phone: '08-588 400 00' },
  { id: 'skandia', name: 'Skandia', phone: '0771-55 55 00' },
  // Sparbanker
  { id: 'sparbanken', name: 'Sparbanken', phone: '' },
  { id: 'sparbanken_syd', name: 'Sparbanken Syd', phone: '0411-82 20 00' },
  { id: 'sparbanken_nord', name: 'Sparbanken Nord', phone: '0910-77 14 00' },
  // Nischbanker
  { id: 'ica_banken', name: 'ICA Banken', phone: '033-47 47 00' },
  { id: 'avanza', name: 'Avanza', phone: '08-562 250 00' },
  { id: 'nordnet', name: 'Nordnet', phone: '08-506 330 00' },
  { id: 'sbab', name: 'SBAB', phone: '0771-45 30 00' },
  { id: 'collector', name: 'Collector Bank', phone: '010-161 00 00' },
  { id: 'marginalen', name: 'Marginalen Bank', phone: '08-411 60 00' },
  { id: 'klarna', name: 'Klarna', phone: '08-120 120 00' },
  { id: 'resurs', name: 'Resurs Bank', phone: '042-382 000' },
  // Utländska med svensk verksamhet
  { id: 'danske_bank', name: 'Danske Bank', phone: '075-075 00 00' },
  { id: 'dnb', name: 'DNB', phone: '08-473 44 00' },
  { id: 'norwegian', name: 'Norwegian (Bank Norwegian)', phone: '0770-22 23 24' },
  { id: 'santander', name: 'Santander Consumer Bank', phone: '08-470 50 00' },
] as const;

// ============================================================
// Default tidsfrister — räknas från dödsdatum
// ============================================================

export const DEFAULT_TIDSFRISTER: Tidsfrist[] = [
  {
    id: 'dodsbevis',
    title: 'Dödsbevis utfärdas',
    description: 'Läkare utfärdar dödsbevis. Skatteverket underrättas automatiskt.',
    offsetDays: 1,
    isLegal: true,
    authority: 'Vården / Skatteverket',
  },
  {
    id: 'dodsanmalan_bank',
    title: 'Kontakta banken',
    description: 'Meddela banken om dödsfallet. Konton spärras tillfälligt.',
    offsetDays: 7,
    isLegal: false,
    authority: 'Banken',
    consequence: 'Autogiro-betalningar kan fortsätta dras.',
  },
  {
    id: 'forsakringar',
    title: 'Kontrollera försäkringar',
    description: 'Kontakta försäkringsbolag. Vissa har 6 månaders anmälningsfrist.',
    offsetDays: 14,
    isLegal: false,
    authority: 'Försäkringsbolag',
    consequence: 'Risk att missa utbetalningar.',
  },
  {
    id: 'bouppteckning_frist',
    title: 'Bouppteckning ska vara klar',
    description: 'Bouppteckningsförrättning ska hållas inom 3 månader. Kan ansöka om anstånd hos Skatteverket.',
    offsetDays: 90,
    isLegal: true,
    authority: 'Skatteverket',
    consequence: 'Skatteverket kan förelägga om att upprätta bouppteckning.',
  },
  {
    id: 'bouppteckning_inlaman',
    title: 'Bouppteckning inlämnad till Skatteverket',
    description: 'Ska lämnas in inom 1 månad efter förrättningen.',
    offsetDays: 120,
    isLegal: true,
    authority: 'Skatteverket',
    consequence: 'Vite kan utdömas.',
  },
  {
    id: 'hyresratt_uppsagning',
    title: 'Senaste uppsägning av hyresrätt',
    description: 'Dödsboet har rätt att säga upp hyresrätten med 1 månads uppsägningstid (istället för 3).',
    offsetDays: 180,
    isLegal: true,
    authority: 'Hyresvärd',
  },
];
