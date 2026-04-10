import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { Forsakring, ForsakringType } from '@/types/dodsbo';

type ForsakringRow = Database['public']['Tables']['forsakringar']['Row'];
type ForsakringInsert = Database['public']['Tables']['forsakringar']['Insert'];

// ============================================================
// Mapping
// ============================================================

function rowToForsakring(row: ForsakringRow): Forsakring {
  return {
    id: row.id,
    type: row.type as ForsakringType,
    company: row.company,
    policyNumber: row.policy_number || undefined,
    beneficiary: row.beneficiary ?? undefined,
    estimatedValue: row.estimated_value ?? undefined,
    contacted: row.contacted,
    notes: row.notes ?? undefined,
  };
}

// ============================================================
// Försäkringar CRUD
// ============================================================

export async function getForsakringar(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('forsakringar')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');

  return { data: data?.map(rowToForsakring) ?? null, error };
}

export async function addForsakring(dodsboId: string, forsakring: Omit<Forsakring, 'id'>) {
  const supabase = createClient();

  const insert: ForsakringInsert = {
    dodsbo_id: dodsboId,
    type: forsakring.type,
    company: forsakring.company,
    policy_number: forsakring.policyNumber ?? '',
    beneficiary: forsakring.beneficiary ?? null,
    estimated_value: forsakring.estimatedValue ?? null,
    contacted: forsakring.contacted,
    notes: forsakring.notes ?? null,
  };

  const { data, error } = await supabase
    .from('forsakringar')
    .insert(insert)
    .select()
    .single();

  return { data: data ? rowToForsakring(data) : null, error };
}

export async function updateForsakring(id: string, updates: Partial<Forsakring>) {
  const supabase = createClient();

  const dbUpdates: Database['public']['Tables']['forsakringar']['Update'] = {};
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.company !== undefined) dbUpdates.company = updates.company;
  if (updates.policyNumber !== undefined) dbUpdates.policy_number = updates.policyNumber;
  if (updates.beneficiary !== undefined) dbUpdates.beneficiary = updates.beneficiary;
  if (updates.estimatedValue !== undefined) dbUpdates.estimated_value = updates.estimatedValue;
  if (updates.contacted !== undefined) dbUpdates.contacted = updates.contacted;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { data, error } = await supabase
    .from('forsakringar')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  return { data: data ? rowToForsakring(data) : null, error };
}

export async function removeForsakring(id: string) {
  const supabase = createClient();
  return supabase
    .from('forsakringar')
    .delete()
    .eq('id', id);
}
