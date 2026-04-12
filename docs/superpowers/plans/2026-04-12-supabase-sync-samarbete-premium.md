# Supabase Sync, Samarbete & Premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three independent feature tracks: (A) sync lösöre + kostnader to Supabase, (B) move samarbete beslut/anteckningar from localStorage to Supabase, (C) wire Mike Ross premium gate + add MikeRossTip to 4 pages + add print button to uppgifter.

**Architecture:** Track A adds two service files following the existing tillgangar-service.ts pattern, then hooks into the already-wired syncDispatch. Track B adds a SQL migration + service file, then refactors the samarbete page to call Supabase with a localStorage fallback for unauthenticated users. Track C is UI-only: a PremiumModal component, four import additions, and a print stylesheet.

**Tech Stack:** Next.js 14 App Router, TypeScript, Supabase (already configured), Tailwind CSS, lucide-react.

**Run order:** Tracks A, B, C are fully independent — execute in any order or in parallel.

---

## ── TRACK A: Lösöre + Kostnader Supabase Sync ──

> Migration 005 already created the `losore` and `kostnader` tables in Supabase.
> What's missing: TypeScript types, service files, and sync wiring.

---

### Task A1: Add losore + kostnader to Supabase types

**Files:**
- Modify: `src/lib/supabase/types.ts` — append two new table definitions

- [ ] **Step 1: Open `src/lib/supabase/types.ts` and find the `Tables` object.** It currently has `profiles`, `dodsbon`, `delagare`, `tillgangar`, `skulder`, `forsakringar`, `tasks`, `dokument`, `invites`, `dodsbo_members`. Append the two new tables inside `Tables: {`:

```typescript
      losore: {
        Row: {
          id: string;
          dodsbo_id: string;
          user_id: string;
          name: string;
          category: string;
          estimated_value: number | null;
          assigned_to: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          user_id: string;
          name: string;
          category?: string;
          estimated_value?: number | null;
          assigned_to?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          estimated_value?: number | null;
          assigned_to?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      kostnader: {
        Row: {
          id: string;
          dodsbo_id: string;
          user_id: string;
          category: string;
          description: string;
          amount: number;
          date: string | null;
          paid_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          user_id: string;
          category?: string;
          description: string;
          amount?: number;
          date?: string | null;
          paid_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          user_id?: string;
          category?: string;
          description?: string;
          amount?: number;
          date?: string | null;
          paid_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
```

- [ ] **Step 2: Verify TypeScript compiles**
```bash
cd /Users/benzinho/Desktop/dodsbo && npx tsc --noEmit 2>&1 | head -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**
```bash
git add src/lib/supabase/types.ts
git commit -m "feat: add losore + kostnader to Supabase type definitions"
```

---

### Task A2: Create losore-service.ts

**Files:**
- Create: `src/lib/supabase/services/losore-service.ts`

- [ ] **Step 1: Create the file** with this exact content:

```typescript
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { LosoreItem, LosoreCategory } from '@/types';

type LosoreRow = Database['public']['Tables']['losore']['Row'];
type LosoreInsert = Database['public']['Tables']['losore']['Insert'];

// ── Mapping ──────────────────────────────────────────────────

function rowToLosore(row: LosoreRow): LosoreItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category as LosoreCategory,
    estimatedValue: row.estimated_value ?? 0,
    assignedTo: row.assigned_to ?? undefined,
    notes: row.notes ?? undefined,
  };
}

// ── CRUD ─────────────────────────────────────────────────────

export async function getLosore(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('losore')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');
  return { data: data?.map(rowToLosore) ?? null, error };
}

export async function addLosore(dodsboId: string, item: Omit<LosoreItem, 'id'>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const insert: LosoreInsert = {
    dodsbo_id: dodsboId,
    user_id: user.id,
    name: item.name,
    category: item.category,
    estimated_value: item.estimatedValue ?? null,
    assigned_to: item.assignedTo ?? null,
    notes: item.notes ?? null,
  };

  const { data, error } = await supabase
    .from('losore')
    .insert(insert)
    .select()
    .single();
  return { data: data ? rowToLosore(data) : null, error };
}

export async function updateLosore(id: string, updates: Partial<LosoreItem>) {
  const supabase = createClient();
  const dbUpdates: Database['public']['Tables']['losore']['Update'] = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.estimatedValue !== undefined) dbUpdates.estimated_value = updates.estimatedValue;
  if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { data, error } = await supabase
    .from('losore')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
  return { data: data ? rowToLosore(data) : null, error };
}

export async function removeLosore(id: string) {
  const supabase = createClient();
  return supabase.from('losore').delete().eq('id', id);
}
```

- [ ] **Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/lib/supabase/services/losore-service.ts
git commit -m "feat: add losore Supabase service (CRUD)"
```

---

### Task A3: Create kostnader-service.ts

**Files:**
- Create: `src/lib/supabase/services/kostnader-service.ts`

- [ ] **Step 1: Create the file:**

```typescript
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { Kostnad, KostnadCategory } from '@/types';

type KostnadRow = Database['public']['Tables']['kostnader']['Row'];
type KostnadInsert = Database['public']['Tables']['kostnader']['Insert'];

// ── Mapping ──────────────────────────────────────────────────

function rowToKostnad(row: KostnadRow): Kostnad {
  return {
    id: row.id,
    category: row.category as KostnadCategory,
    description: row.description,
    amount: row.amount,
    date: row.date ?? undefined,
    paidBy: row.paid_by ?? undefined,
  };
}

// ── CRUD ─────────────────────────────────────────────────────

export async function getKostnader(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('kostnader')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');
  return { data: data?.map(rowToKostnad) ?? null, error };
}

export async function addKostnad(dodsboId: string, kostnad: Omit<Kostnad, 'id'>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };

  const insert: KostnadInsert = {
    dodsbo_id: dodsboId,
    user_id: user.id,
    category: kostnad.category,
    description: kostnad.description,
    amount: kostnad.amount,
    date: kostnad.date ?? null,
    paid_by: kostnad.paidBy ?? null,
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
  if (updates.date !== undefined) dbUpdates.date = updates.date;
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
```

- [ ] **Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**
```bash
git add src/lib/supabase/services/kostnader-service.ts
git commit -m "feat: add kostnader Supabase service (CRUD)"
```

---

### Task A4: Wire sync into use-supabase-sync.ts

**Files:**
- Modify: `src/lib/supabase/use-supabase-sync.ts`

- [ ] **Step 1: Add imports** at the top of the file, after the existing service imports:

```typescript
import { getLosore, addLosore, updateLosore, removeLosore } from './services/losore-service';
import { getKostnader, addKostnad, removeKostnad } from './services/kostnader-service';
```

- [ ] **Step 2: In `loadFromSupabase()`, add losore + kostnader to the parallel `Promise.all` call.** Find:

```typescript
      const [
        { data: delagare },
        { data: tillgangar },
        { data: skulder },
        { data: forsakringar },
        { data: tasks },
      ] = await Promise.all([
        getDelagare(dodsboId),
        getTillgangar(dodsboId),
        getSkulder(dodsboId),
        getForsakringar(dodsboId),
        getTasks(dodsboId),
      ]);
```

Replace with:

```typescript
      const [
        { data: delagare },
        { data: tillgangar },
        { data: skulder },
        { data: forsakringar },
        { data: tasks },
        { data: losore },
        { data: kostnader },
      ] = await Promise.all([
        getDelagare(dodsboId),
        getTillgangar(dodsboId),
        getSkulder(dodsboId),
        getForsakringar(dodsboId),
        getTasks(dodsboId),
        getLosore(dodsboId),
        getKostnader(dodsboId),
      ]);
```

- [ ] **Step 3: Update `fullState` to use loaded data.** Find the two placeholder lines:

```typescript
        losore: [],
        kostnader: [],
```

Replace with:

```typescript
        losore: losore ?? [],
        kostnader: kostnader ?? [],
```

- [ ] **Step 4: Add losore + kostnader to `needsRow` array.** Find:

```typescript
          const needsRow = [
            'SET_ONBOARDING',
            'SET_DECEASED_INFO',
            'SET_TASKS',
            'SET_STEP',
            'SET_BOUPPTECKNING_INFO',
            'ADD_DELAGARE',
            'ADD_TILLGANG',
            'ADD_SKULD',
            'ADD_FORSAKRING',
          ];
```

Replace with:

```typescript
          const needsRow = [
            'SET_ONBOARDING',
            'SET_DECEASED_INFO',
            'SET_TASKS',
            'SET_STEP',
            'SET_BOUPPTECKNING_INFO',
            'ADD_DELAGARE',
            'ADD_TILLGANG',
            'ADD_SKULD',
            'ADD_FORSAKRING',
            'ADD_LOSORE',
            'ADD_KOSTNAD',
          ];
```

- [ ] **Step 5: Add sync cases** to the switch statement. After the `case 'TOGGLE_FORSAKRING_CONTACTED':` block and before `case 'UPDATE_TASK':`, add:

```typescript
            case 'ADD_LOSORE':
              if (dbId) await addLosore(dbId, action.payload);
              break;

            case 'REMOVE_LOSORE':
              await removeLosore(action.payload);
              break;

            case 'UPDATE_LOSORE':
              await updateLosore(action.payload.id, action.payload);
              break;

            case 'ADD_KOSTNAD':
              if (dbId) await addKostnad(dbId, action.payload);
              break;

            case 'REMOVE_KOSTNAD':
              await removeKostnad(action.payload);
              break;
```

- [ ] **Step 6: Verify TypeScript compiles**
```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

- [ ] **Step 7: Commit**
```bash
git add src/lib/supabase/use-supabase-sync.ts
git commit -m "feat: sync lösöre + kostnader actions to Supabase"
```

---

### Task A5: Update services/index.ts

**Files:**
- Modify: `src/lib/supabase/services/index.ts`

- [ ] **Step 1: Open `src/lib/supabase/services/index.ts` and append exports:**

```typescript
export * from './losore-service';
export * from './kostnader-service';
```

- [ ] **Step 2: Commit**
```bash
git add src/lib/supabase/services/index.ts
git commit -m "chore: export losore + kostnader services from index"
```

---

## ── TRACK B: Samarbete Molnsynk ──

> The samarbete page currently stores all data in localStorage.
> This track adds two Supabase tables and refactors the page to use them,
> with a localStorage fallback when the user is not authenticated.

---

### Task B1: SQL migration for samarbete tables

**Files:**
- Create: `supabase/migrations/006_samarbete.sql`

- [ ] **Step 1: Create the migration file:**

```sql
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
```

- [ ] **Step 2: Run migration in Supabase SQL Editor**  
  Go to Supabase → SQL Editor → paste the file contents → Run.  
  Expected: "Success. No rows returned."

- [ ] **Step 3: Commit**
```bash
git add supabase/migrations/006_samarbete.sql
git commit -m "feat: add migration 006 for samarbete beslut + anteckningar tables"
```

---

### Task B2: Add samarbete tables to types.ts

**Files:**
- Modify: `src/lib/supabase/types.ts`

- [ ] **Step 1: Append inside `Tables: {`** (after the kostnader block added in Task A1, or after existing last table):

```typescript
      samarbete_beslut: {
        Row: {
          id: string;
          dodsbo_id: string;
          title: string;
          status: string;
          approvals: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          title: string;
          status?: string;
          approvals?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          title?: string;
          status?: string;
          approvals?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      samarbete_anteckningar: {
        Row: {
          id: string;
          dodsbo_id: string;
          author: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          dodsbo_id: string;
          author: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          dodsbo_id?: string;
          author?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**
```bash
git add src/lib/supabase/types.ts
git commit -m "feat: add samarbete_beslut + samarbete_anteckningar to Supabase types"
```

---

### Task B3: Create samarbete-service.ts

**Files:**
- Create: `src/lib/supabase/services/samarbete-service.ts`

- [ ] **Step 1: Create the file:**

```typescript
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

// ── Local types (mirror samarbete/page.tsx interfaces) ───────

export type DecisionStatus = 'Väntar' | 'Pågår' | 'Alla godkänt';

export interface BeslutRow {
  id: string;
  title: string;
  status: DecisionStatus;
  approvals: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface AnteckningRow {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

// ── Mapping ──────────────────────────────────────────────────

function rowToBeslut(row: Database['public']['Tables']['samarbete_beslut']['Row']): BeslutRow {
  return {
    id: row.id,
    title: row.title,
    status: row.status as DecisionStatus,
    approvals: (row.approvals as Record<string, boolean>) ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToAnteckning(row: Database['public']['Tables']['samarbete_anteckningar']['Row']): AnteckningRow {
  return {
    id: row.id,
    author: row.author,
    content: row.content,
    createdAt: row.created_at,
  };
}

// ── Beslut CRUD ──────────────────────────────────────────────

export async function getBeslut(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_beslut')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');
  return { data: data?.map(rowToBeslut) ?? null, error };
}

export async function addBeslut(dodsboId: string, beslut: Omit<BeslutRow, 'id' | 'updatedAt'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_beslut')
    .insert({
      dodsbo_id: dodsboId,
      title: beslut.title,
      status: beslut.status,
      approvals: beslut.approvals,
      created_at: beslut.createdAt,
    })
    .select()
    .single();
  return { data: data ? rowToBeslut(data) : null, error };
}

export async function updateBeslut(id: string, updates: Pick<BeslutRow, 'status' | 'approvals'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_beslut')
    .update({ status: updates.status, approvals: updates.approvals })
    .eq('id', id)
    .select()
    .single();
  return { data: data ? rowToBeslut(data) : null, error };
}

export async function deleteBeslut(id: string) {
  const supabase = createClient();
  return supabase.from('samarbete_beslut').delete().eq('id', id);
}

// ── Anteckningar CRUD ────────────────────────────────────────

export async function getAnteckningar(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_anteckningar')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at', { ascending: false });
  return { data: data?.map(rowToAnteckning) ?? null, error };
}

export async function addAnteckning(dodsboId: string, anteckning: Omit<AnteckningRow, 'id'>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('samarbete_anteckningar')
    .insert({
      dodsbo_id: dodsboId,
      author: anteckning.author,
      content: anteckning.content,
      created_at: anteckning.createdAt,
    })
    .select()
    .single();
  return { data: data ? rowToAnteckning(data) : null, error };
}

export async function deleteAnteckning(id: string) {
  const supabase = createClient();
  return supabase.from('samarbete_anteckningar').delete().eq('id', id);
}
```

- [ ] **Step 2: Export from index**  
  Append to `src/lib/supabase/services/index.ts`:
  ```typescript
  export * from './samarbete-service';
  ```

- [ ] **Step 3: Verify**
```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**
```bash
git add src/lib/supabase/services/samarbete-service.ts src/lib/supabase/services/index.ts
git commit -m "feat: add samarbete service (beslut + anteckningar CRUD)"
```

---

### Task B4: Refactor samarbete page to use Supabase

**Files:**
- Modify: `src/app/samarbete/page.tsx`

> Strategy: Replace all `localStorage.getItem/setItem('samarbete-*')` calls with service calls.
> Keep a localStorage path as fallback when `dodsboId` is null (unauthenticated users).
> The `useDodsbo()` hook exposes `dodsboId` — use that to know if Supabase is available.

- [ ] **Step 1: Add imports** at the top of `src/app/samarbete/page.tsx`, after existing imports:

```typescript
import { useDodsbo } from '@/lib/context';
import {
  getBeslut, addBeslut, updateBeslut, deleteBeslut,
  getAnteckningar, addAnteckning, deleteAnteckning,
  type BeslutRow, type AnteckningRow, type DecisionStatus,
} from '@/lib/supabase/services/samarbete-service';
```

- [ ] **Step 2: Replace the local `Decision` and `Note` interface definitions** (currently defined in the file) with imports from the service. Delete the local `Decision`, `Note`, and `DecisionStatus` type declarations and use `BeslutRow` as `Decision` and `AnteckningRow` as `Note` instead. Rename usages:
  - `Decision` → `BeslutRow` (or add `type Decision = BeslutRow` alias after import)
  - `Note` → `AnteckningRow` (or add `type Note = AnteckningRow` alias)

  Add after the imports:
  ```typescript
  type Decision = BeslutRow;
  type Note = AnteckningRow;
  ```

- [ ] **Step 3: Refactor `TabBeslut`** — replace the `useEffect` that reads from localStorage and all `localStorage.setItem` calls:

  Replace the initial `useEffect`:
  ```typescript
  // OLD: reads from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('samarbete-beslut');
    ...
  }, [state.delagare]);
  ```

  With:
  ```typescript
  const { dodsboId } = useDodsbo();

  useEffect(() => {
    if (dodsboId) {
      // Load from Supabase
      getBeslut(dodsboId).then(({ data }) => {
        if (data && data.length > 0) {
          setDecisions(data);
        } else {
          // First time: seed with predefined decisions
          const initial: Decision[] = PREDEFINED_DECISIONS.map((title) => ({
            id: crypto.randomUUID(),
            title,
            status: 'Väntar' as DecisionStatus,
            approvals: state.delagare.reduce((acc, del) => {
              acc[del.name] = false; return acc;
            }, {} as Record<string, boolean>),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          // Persist seeds
          Promise.all(initial.map(d => addBeslut(dodsboId, d)));
          setDecisions(initial);
        }
      });
    } else {
      // localStorage fallback
      const stored = localStorage.getItem('samarbete-beslut');
      if (stored) {
        setDecisions(JSON.parse(stored));
      } else {
        const initial: Decision[] = PREDEFINED_DECISIONS.map((title) => ({
          id: crypto.randomUUID(),
          title,
          status: 'Väntar' as DecisionStatus,
          approvals: state.delagare.reduce((acc, del) => {
            acc[del.name] = false; return acc;
          }, {} as Record<string, boolean>),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setDecisions(initial);
        localStorage.setItem('samarbete-beslut', JSON.stringify(initial));
      }
    }
  }, [dodsboId, state.delagare]);
  ```

- [ ] **Step 4: Replace `updateDecision`** function in `TabBeslut`:

  ```typescript
  const updateDecision = (id: string, updatedDecision: Decision) => {
    const updated = decisions.map(d => d.id === id ? updatedDecision : d);
    setDecisions(updated);
    if (dodsboId) {
      updateBeslut(id, { status: updatedDecision.status, approvals: updatedDecision.approvals });
    } else {
      localStorage.setItem('samarbete-beslut', JSON.stringify(updated));
    }
  };
  ```

- [ ] **Step 5: Replace `addDecision`** in `TabBeslut`:

  ```typescript
  const addDecision = async () => {
    const title = selectedPredefined || newDecisionTitle;
    if (!title.trim()) return;
    const newDecision: Decision = {
      id: crypto.randomUUID(),
      title,
      status: 'Väntar',
      approvals: state.delagare.reduce((acc, del) => {
        acc[del.name] = false; return acc;
      }, {} as Record<string, boolean>),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (dodsboId) {
      const { data } = await addBeslut(dodsboId, newDecision);
      setDecisions(prev => [...prev, data ?? newDecision]);
    } else {
      const updated = [...decisions, newDecision];
      setDecisions(updated);
      localStorage.setItem('samarbete-beslut', JSON.stringify(updated));
    }
    setNewDecisionTitle('');
    setSelectedPredefined('');
    setShowAddForm(false);
  };
  ```

- [ ] **Step 6: Replace `deleteDecision`** in `TabBeslut`:

  ```typescript
  const deleteDecision = (id: string) => {
    const updated = decisions.filter(d => d.id !== id);
    setDecisions(updated);
    if (dodsboId) {
      deleteBeslut(id);
    } else {
      localStorage.setItem('samarbete-beslut', JSON.stringify(updated));
    }
  };
  ```

- [ ] **Step 7: Refactor `TabAnteckningar`** — same pattern. Add `const { dodsboId } = useDodsbo();`, replace the `useEffect` and `addNote`/`deleteNote` with Supabase calls:

  Replace `useEffect`:
  ```typescript
  const { dodsboId } = useDodsbo();

  useEffect(() => {
    if (dodsboId) {
      getAnteckningar(dodsboId).then(({ data }) => {
        if (data) setNotes(data);
      });
    } else {
      const stored = localStorage.getItem('samarbete-anteckningar');
      if (stored) setNotes(JSON.parse(stored));
    }
  }, [dodsboId]);
  ```

  Replace `addNote`:
  ```typescript
  const addNote = async () => {
    if (!author.trim() || !content.trim()) return;
    const newNote: Note = {
      id: crypto.randomUUID(),
      author,
      content,
      createdAt: new Date().toISOString(),
    };
    if (dodsboId) {
      const { data } = await addAnteckning(dodsboId, newNote);
      setNotes(prev => [data ?? newNote, ...prev]);
    } else {
      const updated = [newNote, ...notes];
      setNotes(updated);
      localStorage.setItem('samarbete-anteckningar', JSON.stringify(updated));
    }
    setAuthor('');
    setContent('');
  };
  ```

  Replace `deleteNote`:
  ```typescript
  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (dodsboId) {
      deleteAnteckning(id);
    } else {
      localStorage.setItem('samarbete-anteckningar', JSON.stringify(updated));
    }
  };
  ```

- [ ] **Step 8: Fix field name mismatch** — the service returns `createdAt` (camelCase), but the existing JSX uses `timestamp` and `lastUpdated`. Do a find+replace in the file:
  - `note.timestamp` → `note.createdAt`
  - `decision.lastUpdated` → `decision.updatedAt`
  - `d.createdAt` is already correct in `TabTidslinje`
  - `n.timestamp` in `TabTidslinje` → `n.createdAt`

- [ ] **Step 9: Verify TypeScript compiles**
```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 10: Commit**
```bash
git add src/app/samarbete/page.tsx
git commit -m "feat: sync samarbete beslut + anteckningar to Supabase with localStorage fallback"
```

---

## ── TRACK C: Premium Gate + MikeRossTip + Print ──

---

### Task C1: Create PremiumModal component

**Files:**
- Create: `src/components/ui/PremiumModal.tsx`

> The Mike Ross page already has the limit UI (shows a disabled button). This task
> replaces that button with one that opens a modal collecting interest/email.
> No payment backend — this is a waitlist/interest capture modal.

- [ ] **Step 1: Create the component:**

```typescript
'use client';

import { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Store locally — replace with API call when payment is ready
    const waitlist = JSON.parse(localStorage.getItem('premium_waitlist') || '[]');
    waitlist.push({ email, date: new Date().toISOString() });
    localStorage.setItem('premium_waitlist', JSON.stringify(waitlist));
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(42, 38, 34, 0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6B7F5E, #4F6145)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <button onClick={onClose} className="text-muted-light hover:text-primary transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-primary mb-1">Mike Ross Premium</h2>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Obegränsade juridiska frågor, prioriterat stöd och avancerade dokumentmallar.
          Premium lanseras snart.
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {[
            'Obegränsade frågor till Mike Ross',
            'Prioriterat e-poststöd',
            'Avancerade dokumentmallar',
            'Exportera all data som PDF',
          ].map((feat) => (
            <li key={feat} className="flex items-center gap-2 text-sm text-primary">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: '#EEF2EA' }}>
              <Check className="w-6 h-6 text-accent" />
            </div>
            <p className="font-semibold text-primary mb-1">Tack!</p>
            <p className="text-sm text-muted">Vi meddelar dig när Premium lanseras.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              required
              className="w-full px-4 py-3 border rounded-xl text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mb-3"
              style={{ borderColor: '#E8E4DE' }}
            />
            <button type="submit" className="btn-primary w-full !rounded-xl !py-3">
              Meddela mig när det lanseras
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/ui/PremiumModal.tsx
git commit -m "feat: add PremiumModal waitlist component"
```

---

### Task C2: Wire PremiumModal into Mike Ross page

**Files:**
- Modify: `src/app/juridisk-hjalp/page.tsx`

- [ ] **Step 1: Add import** at the top:
```typescript
import { PremiumModal } from '@/components/ui/PremiumModal';
```

- [ ] **Step 2: Add modal state** inside the `JuridiskHjalp` component function, alongside existing `useState` declarations:
```typescript
const [showPremiumModal, setShowPremiumModal] = useState(false);
```

- [ ] **Step 3: Find the existing upgrade button** (inside the `isLimitReached` block):
```typescript
            <button className="btn-primary !rounded-xl !py-2.5 !text-sm w-full">
              Uppgradera till Premium
            </button>
```
Replace with:
```typescript
            <button
              onClick={() => setShowPremiumModal(true)}
              className="btn-primary !rounded-xl !py-2.5 !text-sm w-full"
            >
              Uppgradera till Premium
            </button>
```

- [ ] **Step 4: Add modal to JSX** — before the closing `</div>` of the page root:
```typescript
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />
```

- [ ] **Step 5: Verify**
```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**
```bash
git add src/app/juridisk-hjalp/page.tsx
git commit -m "feat: wire PremiumModal to Mike Ross upgrade button"
```

---

### Task C3: Add MikeRossTip to tidslinje page

**Files:**
- Modify: `src/app/tidslinje/page.tsx`

- [ ] **Step 1: Add import** at the top of the file:
```typescript
import { MikeRossTip } from '@/components/ui/MikeRossTip';
```

- [ ] **Step 2: Find the main content area** (after the page header, before the timeline content) and insert:
```tsx
<MikeRossTip
  text="Tidslinjen visar viktiga händelser och tidsfrister i kronologisk ordning. I Sverige har du 90 dagar på dig att upprätta bouppteckning och 120 dagar att lämna in den till Skatteverket."
  className="mb-5"
/>
```

- [ ] **Step 3: Commit**
```bash
git add src/app/tidslinje/page.tsx
git commit -m "feat: add MikeRossTip to tidslinje page"
```

---

### Task C4: Add MikeRossTip to fullmakt page

**Files:**
- Modify: `src/app/fullmakt/page.tsx`

- [ ] **Step 1: Add import:**
```typescript
import { MikeRossTip } from '@/components/ui/MikeRossTip';
```

- [ ] **Step 2: Insert after page header, before form content:**
```tsx
<MikeRossTip
  text="En fullmakt ger en person rätt att agera å en annans vägnar. I dödsbon används fullmakt ofta för att låta en delägare hantera praktiska ärenden — som att avsluta abonnemang eller kommunicera med banker — utan att alla delägare behöver delta varje gång."
  className="mb-5"
/>
```

- [ ] **Step 3: Commit**
```bash
git add src/app/fullmakt/page.tsx
git commit -m "feat: add MikeRossTip to fullmakt page"
```

---

### Task C5: Add MikeRossTip to kallelse page

**Files:**
- Modify: `src/app/kallelse/page.tsx`

- [ ] **Step 1: Add import:**
```typescript
import { MikeRossTip } from '@/components/ui/MikeRossTip';
```

- [ ] **Step 2: Insert after page header:**
```tsx
<MikeRossTip
  text="Kallelse till bouppteckningsförrättning skickas till alla dödsbodelägare och dödsboets kända fordringsägare. Det finns inga formkrav i lag, men kallelsen bör skickas i god tid — minst en vecka i förväg — och bekräftas skriftligt."
  className="mb-5"
/>
```

- [ ] **Step 3: Commit**
```bash
git add src/app/kallelse/page.tsx
git commit -m "feat: add MikeRossTip to kallelse page"
```

---

### Task C6: Add MikeRossTip to ordlista page

**Files:**
- Modify: `src/app/ordlista/page.tsx`

- [ ] **Step 1: Add import:**
```typescript
import { MikeRossTip } from '@/components/ui/MikeRossTip';
```

- [ ] **Step 2: Insert at the top of the content area:**
```tsx
<MikeRossTip
  text="Juridiska termer kan kännas svåra, men de flesta har enkla förklaringar. Klicka på ett ord för att se vad det betyder i praktiken."
  className="mb-5"
/>
```

- [ ] **Step 3: Commit**
```bash
git add src/app/ordlista/page.tsx
git commit -m "feat: add MikeRossTip to ordlista page"
```

---

### Task C7: Print-friendly checklist on uppgifter page

**Files:**
- Modify: `src/app/uppgifter/page.tsx`
- Modify: `src/app/globals.css`

> Add a print button that triggers `window.print()` and CSS that hides nav/filters
> and renders a clean two-column task list suitable for A4 printing.

- [ ] **Step 1: Add print button** in `UppgifterContent`, inside the header area. Find the filter row and add a print button alongside it:

```tsx
import { Printer } from 'lucide-react'; // add to existing lucide import
```

Then in JSX, after the filter buttons row:
```tsx
<button
  onClick={() => window.print()}
  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted border rounded-xl hover:bg-gray-50 transition print:hidden"
  style={{ borderColor: '#E8E4DE' }}
  aria-label="Skriv ut checklista"
>
  <Printer className="w-4 h-4" />
  <span className="hidden sm:inline">Skriv ut</span>
</button>
```

- [ ] **Step 2: Add print CSS** to `src/app/globals.css`. Append at the end of the file:

```css
/* ── Print: Uppgifter checklist ─────────────────────────── */
@media print {
  /* Hide everything that isn't content */
  nav,
  header,
  .print\:hidden,
  [data-bottom-nav],
  [data-floating-chat] {
    display: none !important;
  }

  body {
    background: white !important;
    font-size: 12pt;
    color: #2A2622;
  }

  /* Page setup */
  @page {
    size: A4 portrait;
    margin: 20mm 15mm;
  }

  /* Task cards print cleanly */
  .rounded-2xl {
    border-radius: 4pt !important;
  }

  /* Avoid breaking a task card across pages */
  .print-task-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1pt solid #E8E4DE;
    padding: 8pt;
    margin-bottom: 6pt;
  }

  /* Two column layout for dense checklists */
  .print-task-grid {
    columns: 2;
    column-gap: 12mm;
  }
}
```

- [ ] **Step 3: Add `print-task-card` className** to the task card divs in `UppgifterContent`. Find each task item `<div>` that maps over `filtered` tasks and add `print-task-card` to its `className`.

- [ ] **Step 4: Verify visually** — run `npm run dev`, navigate to `/uppgifter`, hit `Cmd+P` or click the print button. Verify nav/filters disappear and tasks render in two columns.

- [ ] **Step 5: Commit**
```bash
git add src/app/uppgifter/page.tsx src/app/globals.css
git commit -m "feat: add print button + print CSS to uppgifter checklist"
```

---

## Final Push

- [ ] **Push all commits**
```bash
git push origin main
```

- [ ] **Verify Vercel deployment** at https://db-three-alpha.vercel.app

- [ ] **Manual test checklist**
  - [ ] Add a lösöre item → check Supabase `losore` table has new row
  - [ ] Add a kostnad → check Supabase `kostnader` table
  - [ ] Open samarbete page → add beslut → refresh → beslut is still there (Supabase, not localStorage)
  - [ ] Open samarbete page when logged out → localStorage fallback works
  - [ ] Mike Ross: reach message limit → click "Uppgradera" → modal opens → enter email → submitted state
  - [ ] Tidslinje, fullmakt, kallelse, ordlista pages all show MikeRossTip
  - [ ] Uppgifter print button triggers browser print dialog, nav hidden, two-column layout
