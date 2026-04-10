import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { Skuld, SkuldType } from '@/types/dodsbo';

type SkuldRow = Database['public']['Tables']['skulder']['Row'];
type SkuldInsert = Database['public']['Tables']['skulder']['Insert'];

// ============================================================
// Mapping
// ============================================================

function rowToSkuld(row: SkuldRow): Skuld {
  return {
    id: row.id,
    type: row.type as SkuldType,
    creditor: row.creditor,
    amount: row.amount ?? undefined,
    notes: row.notes ?? undefined,
  };
}

// ============================================================
// Skulder CRUD
// ============================================================

export async function getSkulder(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('skulder')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');

  return { data: data?.map(rowToSkuld) ?? null, error };
}

export async function addSkuld(dodsboId: string, skuld: Omit<Skuld, 'id'>) {
  const supabase = createClient();

  const insert: SkuldInsert = {
    dodsbo_id: dodsboId,
    type: skuld.type,
    creditor: skuld.creditor,
    amount: skuld.amount ?? 0,
    notes: skuld.notes ?? null,
  };

  const { data, error } = await supabase
    .from('skulder')
    .insert(insert)
    .select()
    .single();

  return { data: data ? rowToSkuld(data) : null, error };
}

export async function updateSkuld(id: string, updates: Partial<Skuld>) {
  const supabase = createClient();

  const dbUpdates: Database['public']['Tables']['skulder']['Update'] = {};
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.creditor !== undefined) dbUpdates.creditor = updates.creditor;
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { data, error } = await supabase
    .from('skulder')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  return { data: data ? rowToSkuld(data) : null, error };
}

export async function removeSkuld(id: string) {
  const supabase = createClient();
  return supabase
    .from('skulder')
    .delete()
    .eq('id', id);
}
