import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type DokumentRow = Database['public']['Tables']['dokument']['Row'];
type DokumentInsert = Database['public']['Tables']['dokument']['Insert'];

const BUCKET = 'dokument';

/** Document categories matching Swedish estate administration */
export const DOKUMENT_CATEGORIES = [
  { value: 'dodsbevis', label: 'Dödsbevis' },
  { value: 'testamente', label: 'Testamente' },
  { value: 'saldobesked', label: 'Saldobesked' },
  { value: 'vardeintyg', label: 'Värdeintyg' },
  { value: 'taxeringsvarde', label: 'Taxeringsvärde' },
  { value: 'forsakringsbrev', label: 'Försäkringsbrev' },
  { value: 'aktenskapsforord', label: 'Äktenskapsförord' },
  { value: 'fullmakt', label: 'Fullmakt' },
  { value: 'kvitto', label: 'Kvitto / faktura' },
  { value: 'ovrigt', label: 'Övrigt' },
] as const;

export type DokumentCategory = typeof DOKUMENT_CATEGORIES[number]['value'];

// ============================================================
// Upload
// ============================================================

export async function uploadDokument(
  dodsboId: string,
  file: File,
  category: DokumentCategory,
  notes?: string
): Promise<{ data: DokumentRow | null; error: Error | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Ej inloggad') };

  // Storage path: {userId}/{dodsboId}/{timestamp}_{filename}
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${user.id}/${dodsboId}/${timestamp}_${safeName}`;

  // 1. Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    return { data: null, error: new Error(`Uppladdning misslyckades: ${uploadError.message}`) };
  }

  // 2. Insert metadata row
  const insert: DokumentInsert = {
    dodsbo_id: dodsboId,
    category,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type || 'application/octet-stream',
    storage_path: storagePath,
    notes: notes || null,
    uploaded_by: user.id,
  };

  const { data, error } = await supabase
    .from('dokument')
    .insert(insert)
    .select()
    .single();

  if (error) {
    // Clean up orphaned file
    await supabase.storage.from(BUCKET).remove([storagePath]);
    return { data: null, error: new Error(`Metadata sparades inte: ${error.message}`) };
  }

  return { data, error: null };
}

// ============================================================
// List
// ============================================================

export async function getDokument(dodsboId: string) {
  const supabase = createClient();
  return supabase
    .from('dokument')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at', { ascending: false });
}

// ============================================================
// Download (signed URL)
// ============================================================

export async function getDokumentUrl(storagePath: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60); // 1 hour

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

// ============================================================
// Delete
// ============================================================

export async function deleteDokument(id: string, storagePath: string) {
  const supabase = createClient();

  // Delete metadata row
  const { error: dbError } = await supabase
    .from('dokument')
    .delete()
    .eq('id', id);

  if (dbError) return { error: dbError };

  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  return { error: storageError };
}

// ============================================================
// Helpers
// ============================================================

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getCategoryLabel(category: string): string {
  return DOKUMENT_CATEGORIES.find((c) => c.value === category)?.label || category;
}
