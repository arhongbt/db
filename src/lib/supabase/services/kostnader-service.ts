import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { Kostnad, KostnadCategory } from '@/types/dodsbo';

type KostnadRow = Database['public']['Tables']['kostnader']['Row'];
type KostnadInsert = Database['public']['Tables']['kostnader']['Insert'];

function rowToKostnad(row: KostnadRow): Kostnad {
  return {
    id: row.id,
    category: row.category as KostnadCategory,
    description: row.description,
    amount: row.amount,
    date: row.date ?? '',
    paidBy: row.paid_by ?? undefined,
  };
}

export async function getKostnader(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('kostnader')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');

  return { data: data?.map(rowToKostnad) ?? null, error };
}

export async function addKostnad(dodsboId: string, item: Omit<Kostnad, 'id'>) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const insert: KostnadInsert = {
    dodsbo_id: dodsboId,
    user_id: user.id,
    category: item.category,
    description: item.description,
    amount: item.amount,
    date: item.date || null,
    paid_by: item.paidBy ?? null,
  };

  const { data, error } = await supabase
    .from('kostnader')
    .insert(insert)
    .select()
    .single();

  return { data: data ? rowToKostnad(data) : null, error };
}

export async function updateKostnad(id: string, updates: Partial<Kostnad>) {
  const supabase = createClient();

  const dbUpdates: Database['public']['Tables']['kostnader']['Update'] = {};
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
  if (updates.date !== undefined) dbUpdates.date = updates.date || null;
  if (updates.paidBy !== undefined) dbUpdates.paid_by = updates.paidBy;

  const { data, error } = await supabase
    .from('kostnader')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  return { data: data ? rowToKostnad(data) : null, error };
}

export async function removeKostnad(id: string) {
  const supabase = createClient();
  return supabase.from('kostnader').delete().eq('id', id);
}
