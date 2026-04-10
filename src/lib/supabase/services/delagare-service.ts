import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { Dodsbodelaware, Relation } from '@/types/dodsbo';

type DelagareRow = Database['public']['Tables']['delagare']['Row'];
type DelagareInsert = Database['public']['Tables']['delagare']['Insert'];

// ============================================================
// Mapping: App types ↔ Supabase rows
// ============================================================

function rowToDelagare(row: DelagareRow): Dodsbodelaware {
  return {
    id: row.id,
    name: row.name,
    personnummer: row.personnummer || undefined,
    relation: row.relation as Relation,
    email: row.email || undefined,
    phone: row.phone || undefined,
    share: row.share || undefined,
    isDelagare: row.is_delagare,
  };
}

// ============================================================
// Delagare CRUD
// ============================================================

/** Hämta alla delägare för ett dödsbo */
export async function getDelagare(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('delagare')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');

  return { data: data?.map(rowToDelagare) ?? null, error };
}

/** Lägg till en delägare */
export async function addDelagare(dodsboId: string, delagare: Omit<Dodsbodelaware, 'id'>) {
  const supabase = createClient();

  const insert: DelagareInsert = {
    dodsbo_id: dodsboId,
    name: delagare.name,
    personnummer: delagare.personnummer ?? '',
    relation: delagare.relation,
    email: delagare.email ?? null,
    phone: delagare.phone ?? null,
    share: delagare.share ?? null,
    is_delagare: delagare.isDelagare,
  };

  const { data, error } = await supabase
    .from('delagare')
    .insert(insert)
    .select()
    .single();

  return { data: data ? rowToDelagare(data) : null, error };
}

/** Uppdatera en delägare */
export async function updateDelagare(id: string, updates: Partial<Dodsbodelaware>) {
  const supabase = createClient();

  const dbUpdates: Database['public']['Tables']['delagare']['Update'] = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.personnummer !== undefined) dbUpdates.personnummer = updates.personnummer;
  if (updates.relation !== undefined) dbUpdates.relation = updates.relation;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.share !== undefined) dbUpdates.share = updates.share;
  if (updates.isDelagare !== undefined) dbUpdates.is_delagare = updates.isDelagare;

  const { data, error } = await supabase
    .from('delagare')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  return { data: data ? rowToDelagare(data) : null, error };
}

/** Ta bort en delägare */
export async function removeDelagare(id: string) {
  const supabase = createClient();
  return supabase
    .from('delagare')
    .delete()
    .eq('id', id);
}
