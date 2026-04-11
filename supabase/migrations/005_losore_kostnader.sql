-- ============================================================
-- Migration: Lösöre & Kostnader tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Lösöre table — personal property items in the estate
CREATE TABLE IF NOT EXISTS losore (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'ovrigt'
    CHECK (category IN ('mobler', 'smycken', 'konst', 'elektronik', 'fordon', 'samlarobj', 'klader', 'ovrigt')),
  estimated_value NUMERIC DEFAULT 0,
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER losore_updated_at
BEFORE UPDATE ON losore
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE losore ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own losore"
  ON losore FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own losore"
  ON losore FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own losore"
  ON losore FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own losore"
  ON losore FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_losore_dodsbo_id ON losore(dodsbo_id);
CREATE INDEX idx_losore_user_id ON losore(user_id);

-- 2. Kostnader table — estate-related expenses
CREATE TABLE IF NOT EXISTS kostnader (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'ovrigt'
    CHECK (category IN ('begravning', 'juridik', 'vardering', 'stadning', 'transport', 'forvaring', 'fastighet', 'ovrigt')),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  date DATE,
  paid_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER kostnader_updated_at
BEFORE UPDATE ON kostnader
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE kostnader ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own kostnader"
  ON kostnader FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own kostnader"
  ON kostnader FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kostnader"
  ON kostnader FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kostnader"
  ON kostnader FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_kostnader_dodsbo_id ON kostnader(dodsbo_id);
CREATE INDEX idx_kostnader_user_id ON kostnader(user_id);
