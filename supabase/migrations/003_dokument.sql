-- ============================================================
-- Migration: Document uploads for dödsbo
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create dokument table (metadata about uploaded files)
CREATE TABLE IF NOT EXISTS dokument (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'ovrigt',
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  storage_path TEXT NOT NULL,
  notes TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE dokument ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies — users can only access documents for their own dödsbon
CREATE POLICY "Users can view own dokument"
  ON dokument FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own dokument"
  ON dokument FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()
    AND dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own dokument"
  ON dokument FOR DELETE
  USING (
    uploaded_by = auth.uid()
    AND dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

-- 4. Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('dokument', 'dokument', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS policies
CREATE POLICY "Users can upload dokument"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'dokument'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own dokument files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'dokument'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own dokument files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'dokument'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
