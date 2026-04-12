import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { LosoreItem, LosoreCategory } from '@/types/dodsbo';

type LosoreRow = Database['public']['Tables']['losore']['Row'];
type LosoreInsert = Database['public']['Tables']['losore']['Insert'];

// ============================================================
// Mapping
// ============================================================

function rowToLosore(row: LosoreRow): LosoreItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category as LosoreCategory,
    estimatedValue: row.estimated_value ?? 0,
    assignedTo: row.assigned_to ?? undefined,
    notes: row.notes ?? undefined,
  };
}

// ============================================================
// Lösöre CRUD
// ============================================================

export async function getLosore(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('losore')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');

  return { data: data?.map(rowToLosore) ?? null, error };
}

export async function addLosore(dodsboId: string, item: Omit<LosoreItem, 'id'>) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const insert: LosoreInsert = {
    dodsbo_id: dodsboId,
    user_id: user.id,
    name: item.name,
    category: item.category,
    estimated_value: item.estimatedValue ?? 0,
    assigned_to: item.assignedTo ?? null,
    notes: item.notes ?? null,
  };

  const { data, error } = await supabase
    .from('losore')
    .insert(insert)
    .select()
    .single();

  return { data: data ? rowToLosore(data) : null, error };
}

export async function updateLosore(id: string, updates: Partial<LosoreItem>) {
  const supabase = createClient();

  const dbUpdates: Database['public']['Tables']['losore']['Update'] = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.estimatedValue !== undefined) dbUpdates.estimated_value = updates.estimatedValue;
  if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { data, error } = await supabase
    .from('losore')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  return { data: data ? rowToLosore(data) : null, error };
}

export async function removeLosore(id: string) {
  const supabase = createClient();
  return supabase.from('losore').delete().eq('id', id);
}
