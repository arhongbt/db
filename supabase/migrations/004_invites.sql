-- ============================================================
-- Migration: Multi-user invites for dödsbo collaboration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Members table — tracks who has access to which dödsbo
CREATE TABLE IF NOT EXISTS dodsbo_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',  -- 'owner' | 'viewer'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dodsbo_id, user_id)
);

ALTER TABLE dodsbo_members ENABLE ROW LEVEL SECURITY;

-- Members can see their own memberships
CREATE POLICY "Users can view own memberships"
  ON dodsbo_members FOR SELECT
  USING (user_id = auth.uid());

-- Owners can see all members of their dödsbo
CREATE POLICY "Owners can view all members"
  ON dodsbo_members FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

-- Only the system (via invite acceptance) inserts members
CREATE POLICY "Users can insert own membership"
  ON dodsbo_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Owners can remove members
CREATE POLICY "Owners can remove members"
  ON dodsbo_members FOR DELETE
  USING (
    dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

-- 2. Invites table — pending invitations
CREATE TABLE IF NOT EXISTS invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invited_email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'accepted' | 'revoked'
  accepted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Owners can see invites for their dödsbo
CREATE POLICY "Owners can view invites"
  ON invites FOR SELECT
  USING (
    invited_by = auth.uid()
    OR dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

-- Owners can create invites
CREATE POLICY "Owners can create invites"
  ON invites FOR INSERT
  WITH CHECK (
    invited_by = auth.uid()
    AND dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

-- Anyone can read an invite by token (for accepting)
CREATE POLICY "Anyone can read invite by token"
  ON invites FOR SELECT
  USING (true);

-- Owners can update (revoke) invites
CREATE POLICY "Owners can update invites"
  ON invites FOR UPDATE
  USING (
    invited_by = auth.uid()
    OR dodsbo_id IN (
      SELECT id FROM dodsbon WHERE user_id = auth.uid()
    )
  );

-- Authenticated users can accept invites (update status)
CREATE POLICY "Users can accept invites"
  ON invites FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Update dodsbon RLS to allow members to read
CREATE POLICY "Members can view shared dodsbon"
  ON dodsbon FOR SELECT
  USING (
    id IN (
      SELECT dodsbo_id FROM dodsbo_members WHERE user_id = auth.uid()
    )
  );

-- 4. Allow members to read related tables
CREATE POLICY "Members can view shared delagare"
  ON delagare FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT dodsbo_id FROM dodsbo_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view shared tillgangar"
  ON tillgangar FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT dodsbo_id FROM dodsbo_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view shared skulder"
  ON skulder FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT dodsbo_id FROM dodsbo_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view shared forsakringar"
  ON forsakringar FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT dodsbo_id FROM dodsbo_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view shared tasks"
  ON tasks FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT dodsbo_id FROM dodsbo_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view shared dokument"
  ON dokument FOR SELECT
  USING (
    dodsbo_id IN (
      SELECT dodsbo_id FROM dodsbo_members WHERE user_id = auth.uid()
    )
  );
