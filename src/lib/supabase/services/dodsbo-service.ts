import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { OnboardingData, ProcessStep } from '@/types/dodsbo';

type DodsboRow = Database['public']['Tables']['dodsbon']['Row'];
type DodsboInsert = Database['public']['Tables']['dodsbon']['Insert'];
type DodsboUpdate = Database['public']['Tables']['dodsbon']['Update'];

// ============================================================
// Dodsbon CRUD
// ============================================================

/** Hämta alla dödsbon för inloggad användare */
export async function getDodsbon() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Ej inloggad') };

  return supabase
    .from('dodsbon')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
}

/** Hämta ett specifikt dödsbo med ID */
export async function getDodsboById(id: string) {
  const supabase = createClient();
  return supabase
    .from('dodsbon')
    .select('*')
    .eq('id', id)
    .single();
}

/** Skapa ett nytt dödsbo */
export async function createDodsbo(data: {
  deceasedName: string;
  deathDate: string;
  deceasedPersonnummer?: string;
  onboarding?: OnboardingData;
  currentStep?: ProcessStep;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Ej inloggad') };

  const insert: DodsboInsert = {
    user_id: user.id,
    deceased_name: data.deceasedName,
    death_date: data.deathDate,
    deceased_personnummer: data.deceasedPersonnummer ?? '',
    onboarding: data.onboarding ? (data.onboarding as unknown as Database['public']['Tables']['dodsbon']['Row']['onboarding']) : {},
    current_step: data.currentStep ?? 'akut',
  };

  return supabase
    .from('dodsbon')
    .insert(insert)
    .select()
    .single();
}

/** Uppdatera ett dödsbo */
export async function updateDodsbo(id: string, data: {
  deceasedName?: string;
  deathDate?: string;
  deceasedPersonnummer?: string;
  onboarding?: OnboardingData;
  currentStep?: ProcessStep;
}) {
  const supabase = createClient();

  const update: DodsboUpdate = {};
  if (data.deceasedName !== undefined) update.deceased_name = data.deceasedName;
  if (data.deathDate !== undefined) update.death_date = data.deathDate;
  if (data.deceasedPersonnummer !== undefined) update.deceased_personnummer = data.deceasedPersonnummer;
  if (data.onboarding !== undefined) update.onboarding = data.onboarding as unknown as DodsboRow['onboarding'];
  if (data.currentStep !== undefined) update.current_step = data.currentStep;

  return supabase
    .from('dodsbon')
    .update(update)
    .eq('id', id)
    .select()
    .single();
}

/** Radera ett dödsbo (cascaderar till alla barntabeller) */
export async function deleteDodsbo(id: string) {
  const supabase = createClient();
  return supabase
    .from('dodsbon')
    .delete()
    .eq('id', id);
}
