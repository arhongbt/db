import { createClient } from '@/lib/supabase/client';

export type DecisionStatus = 'Väntar' | 'Pågår' | 'Alla godkänt';

export interface BeslutRow {
  id: string;
  dodsbo_id: string;
  title: string;
  status: DecisionStatus;
  approvals: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface AnteckningRow {
  id: string;
  dodsbo_id: string;
  author: string;
  content: string;
  created_at: string;
}

// ============================================================
// Beslut CRUD
// ============================================================

export async function getBeslut(dodsboId: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('samarbete_beslut')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');
  return { data: data as BeslutRow[] | null, error };
}

export async function addBeslut(
  dodsboId: string,
  title: string,
  approvals: Record<string, boolean>,
) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('samarbete_beslut')
    .insert({ dodsbo_id: dodsboId, title, status: 'Väntar', approvals })
    .select()
    .single();
  return { data: data as BeslutRow | null, error };
}

export async function updateBeslut(
  id: string,
  updates: { status?: DecisionStatus; approvals?: Record<string, boolean> },
) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('samarbete_beslut')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data: data as BeslutRow | null, error };
}

export async function deleteBeslut(id: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('samarbete_beslut').delete().eq('id', id);
}

// ============================================================
// Anteckningar CRUD
// ============================================================

export async function getAnteckningar(dodsboId: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('samarbete_anteckningar')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at', { ascending: false });
  return { data: data as AnteckningRow[] | null, error };
}

export async function addAnteckning(dodsboId: string, author: string, content: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('samarbete_anteckningar')
    .insert({ dodsbo_id: dodsboId, author, content })
    .select()
    .single();
  return { data: data as AnteckningRow | null, error };
}

export async function deleteAnteckning(id: string) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('samarbete_anteckningar').delete().eq('id', id);
}
