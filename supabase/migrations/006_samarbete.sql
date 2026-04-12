-- ============================================================
-- Migration 006: Samarbete — beslut + anteckningar
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Beslut (decisions) table
CREATE TABLE IF NOT EXISTS samarbete_beslut (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  dodsbo_id   UUID        NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'Väntar'
    CHECK (status IN ('Väntar', 'Pågår', 'Alla godkänt')),
  approvals   JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER samarbete_beslut_updated_at
BEFORE UPDATE ON samarbete_beslut
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE samarbete_beslut ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view beslut"
  ON samarbete_beslut FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dodsbo_members
      WHERE dodsbo_members.dodsbo_id = samarbete_beslut.dodsbo_id
        AND dodsbo_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM dodsbon
      WHERE dodsbon.id = samarbete_beslut.dodsbo_id
        AND dodsbon.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert beslut"
  ON samarbete_beslut FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dodsbo_members
      WHERE dodsbo_members.dodsbo_id = samarbete_beslut.dodsbo_id
        AND dodsbo_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM dodsbon
      WHERE dodsbon.id = samarbete_beslut.dodsbo_id
        AND dodsbon.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update beslut"
  ON samarbete_beslut FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM dodsbo_members
      WHERE dodsbo_members.dodsbo_id = samarbete_beslut.dodsbo_id
        AND dodsbo_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM dodsbon
      WHERE dodsbon.id = samarbete_beslut.dodsbo_id
        AND dodsbon.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete beslut"
  ON samarbete_beslut FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dodsbo_members
      WHERE dodsbo_members.dodsbo_id = samarbete_beslut.dodsbo_id
        AND dodsbo_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM dodsbon
      WHERE dodsbon.id = samarbete_beslut.dodsbo_id
        AND dodsbon.user_id = auth.uid()
    )
  );

CREATE INDEX idx_samarbete_beslut_dodsbo ON samarbete_beslut(dodsbo_id);

-- 2. Anteckningar (notes) table
CREATE TABLE IF NOT EXISTS samarbete_anteckningar (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  dodsbo_id   UUID        NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  author      TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE samarbete_anteckningar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view anteckningar"
  ON samarbete_anteckningar FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dodsbo_members
      WHERE dodsbo_members.dodsbo_id = samarbete_anteckningar.dodsbo_id
        AND dodsbo_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM dodsbon
      WHERE dodsbon.id = samarbete_anteckningar.dodsbo_id
        AND dodsbon.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert anteckningar"
  ON samarbete_anteckningar FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dodsbo_members
      WHERE dodsbo_members.dodsbo_id = samarbete_anteckningar.dodsbo_id
        AND dodsbo_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM dodsbon
      WHERE dodsbon.id = samarbete_anteckningar.dodsbo_id
        AND dodsbon.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete anteckningar"
  ON samarbete_anteckningar FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dodsbo_members
      WHERE dodsbo_members.dodsbo_id = samarbete_anteckningar.dodsbo_id
        AND dodsbo_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM dodsbon
      WHERE dodsbon.id = samarbete_anteckningar.dodsbo_id
        AND dodsbon.user_id = auth.uid()
    )
  );

CREATE INDEX idx_samarbete_anteckningar_dodsbo ON samarbete_anteckningar(dodsbo_id);
