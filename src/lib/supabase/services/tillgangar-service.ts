import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { Tillgang, TillgangType } from '@/types/dodsbo';

type TillgangRow = Database['public']['Tables']['tillgangar']['Row'];
type TillgangInsert = Database['public']['Tables']['tillgangar']['Insert'];

// ============================================================
// Mapping
// ============================================================

function rowToTillgang(row: TillgangRow): Tillgang {
  return {
    id: row.id,
    type: row.type as TillgangType,
    description: row.description,
    estimatedValue: row.estimated_value ?? undefined,
    confirmedValue: row.confirmed_value ?? undefined,
    bank: row.bank ?? undefined,
    notes: row.notes ?? undefined,
  };
}

// ============================================================
// Tillgångar CRUD
// ============================================================

export async function getTillgangar(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tillgangar')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');

  return { data: data?.map(rowToTillgang) ?? null, error };
}

export async function addTillgang(dodsboId: string, tillgang: Omit<Tillgang, 'id'>) {
  const supabase = createClient();

  const insert: TillgangInsert = {
    dodsbo_id: dodsboId,
    type: tillgang.type,
    description: tillgang.description,
    estimated_value: tillgang.estimatedValue ?? null,
    confirmed_value: tillgang.confirmedValue ?? null,
    bank: tillgang.bank ?? null,
    notes: tillgang.notes ?? null,
  };

  const { data, error } = await supabase
    .from('tillgangar')
    .insert(insert)
    .select()
    .single();

  return { data: data ? rowToTillgang(data) : null, error };
}

export async function updateTillgang(id: string, updates: Partial<Tillgang>) {
  const supabase = createClient();

  const dbUpdates: Database['public']['Tables']['tillgangar']['Update'] = {};
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.estimatedValue !== undefined) dbUpdates.estimated_value = updates.estimatedValue;
  if (updates.confirmedValue !== undefined) dbUpdates.confirmed_value = updates.confirmedValue;
  if (updates.bank !== undefined) dbUpdates.bank = updates.bank;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { data, error } = await supabase
    .from('tillgangar')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  return { data: data ? rowToTillgang(data) : null, error };
}

export async function removeTillgang(id: string) {
  const supabase = createClient();
  return supabase
    .from('tillgangar')
    .delete()
    .eq('id', id);
}
