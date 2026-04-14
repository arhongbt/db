// ============================================================
// Default tasks — generated based on onboarding answers
// Each task maps to a specific process step and category
// ============================================================

import type { DodsboTask, OnboardingData, AlreadyDoneStep } from '@/types';
import { SWEDISH_BANKS } from '@/types';

let taskIdCounter = 0;
function nextId(): string {
  return `task_${++taskIdCounter}`;
}

/**
 * Generate personalized task list based on onboarding answers.
 * Tasks are ordered by process step and priority.
 */
export function generateTasks(onboarding: OnboardingData): DodsboTask[] {
  taskIdCounter = 0;
  const tasks: DodsboTask[] = [];

  const done = new Set(onboarding.alreadyDone);
  const statusFor = (step: AlreadyDoneStep) =>
    done.has(step) ? 'klar' as const : 'ej_paborjad' as const;

  // ── AKUT (Dag 1-7) ──────────────────────────────────────
  tasks.push({
    id: nextId(),
    step: 'akut',
    category: 'akut_praktiskt',
    title: 'Skaffa dödsbevis',
    description: 'Begär dödsbevis från vårdgivaren eller Skatteverket.',
    status: statusFor('dodsbevis'),
    priority: 'akut',
    deadlineDays: 3,
    helpText: 'Dödsbeviset behövs för allt — bank, försäkring, begravning.',
    externalUrl: 'https://www.skatteverket.se/privat/folkbokforing/narenanhorigdor',
  });

  tasks.push({
    id: nextId(),
    step: 'akut',
    category: 'bank_ekonomi',
    title: 'Kontakta banken',
    description: `Meddela ${onboarding.banks.length > 0 ? onboarding.banks.map(id => SWEDISH_BANKS.find(b => b.id === id)?.name ?? id).join(', ') : 'banken'} om dödsfallet. Ta med dödsbevis.`,
    status: statusFor('kontaktat_bank'),
    priority: 'akut',
    deadlineDays: 7,
    helpText: 'Autogiro stoppas först när banken vet om dödsfallet. Ring eller besök kontoret.',
  });

  tasks.push({
    id: nextId(),
    step: 'akut',
    category: 'begravning',
    title: 'Ordna begravning',
    description: 'Kontakta begravningsbyrå. Alla i Sverige har rätt till begravning via Allmänna arvsfonden om medel saknas.',
    status: statusFor('begravning_bestald'),
    priority: 'akut',
    deadlineDays: 30,
    helpText: 'Begravningsavgiften ingår i skatten — du behöver inte betala kyrkoavgiften separat.',
  });

  tasks.push({
    id: nextId(),
    step: 'akut',
    category: 'forsakring',
    title: 'Kontrollera försäkringar',
    description: 'Ring försäkringsbolag och arbetsgivare. Fråga om livförsäkring, grupplivförsäkring, tjänstepension.',
    status: statusFor('kontaktat_forsakring'),
    priority: 'viktig',
    deadlineDays: 14,
    helpText: 'Glöm inte arbetsgivarens grupplivförsäkring — den är ofta värd 1-3 prisbasbelopp.',
  });

  // ── KARTLÄGGNING (Vecka 1-4) ────────────────────────────
  tasks.push({
    id: nextId(),
    step: 'kartlaggning',
    category: 'myndigheter',
    title: 'Eftersänd post',
    description: 'Anmäl eftersändning av den avlidnes post till din adress.',
    status: 'ej_paborjad',
    priority: 'viktig',
    deadlineDays: 14,
    externalUrl: 'https://www.postnord.se/ta-emot/eftersandning',
  });

  tasks.push({
    id: nextId(),
    step: 'kartlaggning',
    category: 'digitalt',
    title: 'Inventera digitala konton',
    description: 'Gå igenom e-post, mobiltelefon, sociala medier. Notera abonnemang.',
    status: 'ej_paborjad',
    priority: 'normal',
    deadlineDays: 30,
    helpText: 'Kolla betalhistorik i banken för att hitta prenumerationer (Spotify, Netflix, etc.).',
  });

  if (onboarding.housingType !== 'ingen_bostad') {
    tasks.push({
      id: nextId(),
      step: 'kartlaggning',
      category: 'bostad',
      title: onboarding.housingType === 'hyresratt'
        ? 'Kontakta hyresvärden'
        : 'Värdera bostaden',
      description: onboarding.housingType === 'hyresratt'
        ? 'Meddela hyresvärden om dödsfallet. Dödsboet har rätt till 1 månads uppsägningstid.'
        : 'Beställ värdering av bostaden inför bouppteckningen.',
      status: statusFor('kontaktat_hyresvard'),
      priority: 'viktig',
      deadlineDays: 14,
    });
  }

  tasks.push({
    id: nextId(),
    step: 'kartlaggning',
    category: 'post_abonnemang',
    title: 'Säg upp abonnemang',
    description: 'Telefon, bredband, tidningar, streamingtjänster, gym, etc.',
    status: 'ej_paborjad',
    priority: 'normal',
    deadlineDays: 30,
  });

  // ── BOUPPTECKNING (Månad 1-3) ───────────────────────────
  tasks.push({
    id: nextId(),
    step: 'bouppteckning',
    category: 'bouppteckning',
    title: 'Samla underlag för bouppteckning',
    description: 'Kontoutdrag per dödsdagen, fastighetsvärdering, skuldsaldo, fordon.',
    status: statusFor('bouppteckning_paborjad'),
    priority: 'viktig',
    deadlineDays: 60,
    helpText: 'Banken skickar ofta kontoutdrag automatiskt, men dubbelkolla.',
  });

  tasks.push({
    id: nextId(),
    step: 'bouppteckning',
    category: 'bouppteckning',
    title: 'Håll bouppteckningsförrättning',
    description: 'Alla dödsbodelägare ska kallas. Två utomstående förrättningsmän krävs.',
    status: 'ej_paborjad',
    priority: 'viktig',
    deadlineDays: 90,
    helpText: 'Förrättningen kan hållas digitalt (Zoom/Teams). Alla behöver inte närvara fysiskt.',
  });

  tasks.push({
    id: nextId(),
    step: 'bouppteckning',
    category: 'bouppteckning',
    title: 'Lämna in bouppteckning till Skatteverket',
    description: 'Ska lämnas in senast 1 månad efter förrättningen.',
    status: 'ej_paborjad',
    priority: 'viktig',
    deadlineDays: 120,
    externalUrl: 'https://www.skatteverket.se/privat/folkbokforing/dodsfall/bouppteckning',
  });

  // ── ARVSKIFTE (Månad 3-6) ───────────────────────────────
  tasks.push({
    id: nextId(),
    step: 'arvskifte',
    category: 'arvskifte',
    title: 'Upprätta arvskifteshandling',
    description: 'Alla dödsbodelägare ska skriva under. Dokumentet visar hur tillgångar fördelas.',
    status: 'ej_paborjad',
    priority: 'viktig',
    deadlineDays: 180,
    helpText: 'Arvskifte behövs inte om det bara finns en dödsbodelägare.',
  });

  tasks.push({
    id: nextId(),
    step: 'arvskifte',
    category: 'bank_ekonomi',
    title: 'Avsluta dödsboets bankkonton',
    description: 'Visa registrerad bouppteckning och arvskifteshandling för banken.',
    status: 'ej_paborjad',
    priority: 'normal',
    deadlineDays: 210,
  });

  tasks.push({
    id: nextId(),
    step: 'arvskifte',
    category: 'myndigheter',
    title: 'Avregistrera hos Skatteverket',
    description: 'Dödsboets slutliga deklaration ska lämnas in.',
    status: 'ej_paborjad',
    priority: 'normal',
    deadlineDays: 365,
    externalUrl: 'https://www.skatteverket.se/privat/folkbokforing/narenanhorigdor',
  });

  return tasks;
}
