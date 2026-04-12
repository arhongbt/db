import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

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

type BeslutDbRow = Database['public']['Tables']['samarbete_beslut']['Row'];
type AnteckningDbRow = Database['public']['Tables']['samarbete_anteckningar']['Row'];

function rowToBeslut(row: BeslutDbRow): BeslutRow {
  return {
    id: row.id,
    dodsbo_id: row.dodsbo_id,
    title: row.title,
    status: row.status as DecisionStatus,
    approvals: row.approvals as Record<string, boolean>,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToAnteckning(row: AnteckningDbRow): AnteckningRow {
  return {
    id: row.id,
    dodsbo_id: row.dodsbo_id,
    author: row.author,
    content: row.content,
    created_at: row.created_at,
  };
}

// ============================================================
// Beslut CRUD
// ============================================================

export async function getBeslut(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_beslut')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');
  return { data: data ? data.map(rowToBeslut) : null, error };
}

export async function addBeslut(
  dodsboId: string,
  title: string,
  approvals: Record<string, boolean>,
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_beslut')
    .insert({ dodsbo_id: dodsboId, title, status: 'Väntar', approvals })
    .select()
    .single();
  return { data: data ? rowToBeslut(data) : null, error };
}

export async function updateBeslut(
  id: string,
  updates: { status?: string; approvals?: Record<string, boolean> },
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_beslut')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data: data ? rowToBeslut(data) : null, error };
}

export async function deleteBeslut(id: string) {
  const supabase = createClient();
  return supabase.from('samarbete_beslut').delete().eq('id', id);
}

// ============================================================
// Anteckningar CRUD
// ============================================================

export async function getAnteckningar(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_anteckningar')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at', { ascending: false });
  return { data: data ? data.map(rowToAnteckning) : null, error };
}

export async function addAnteckning(dodsboId: string, author: string, content: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_anteckningar')
    .insert({ dodsbo_id: dodsboId, author, content })
    .select()
    .single();
  return { data: data ? rowToAnteckning(data) : null, error };
}

export async function deleteAnteckning(id: string) {
  const supabase = createClient();
  return supabase.from('samarbete_anteckningar').delete().eq('id', id);
}
