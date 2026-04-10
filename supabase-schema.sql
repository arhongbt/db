-- Dödsbo Database Schema
-- Production-ready SQL for Supabase

-- =====================================================================
-- Helper: Enable UUID generation
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- Trigger Function: Auto-update updated_at timestamp
-- =====================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- Table: profiles
-- =====================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================================
-- Trigger Function: Create profile on new user signup
-- =====================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- =====================================================================
-- Table: dodsbon
-- =====================================================================

CREATE TABLE IF NOT EXISTS dodsbon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deceased_name TEXT NOT NULL,
  death_date DATE,
  deceased_personnummer TEXT,
  onboarding JSONB DEFAULT '{}',
  current_step TEXT DEFAULT 'akut' CHECK (current_step IN ('akut', 'kartlaggning', 'bouppteckning', 'arvskifte', 'avslutat')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER dodsbon_updated_at
BEFORE UPDATE ON dodsbon
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_dodsbon_user_id ON dodsbon(user_id);
CREATE INDEX idx_dodsbon_created_at ON dodsbon(created_at);

-- Enable RLS
ALTER TABLE dodsbon ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dodsbon
CREATE POLICY "Users can view their own dodsbon" ON dodsbon
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create dodsbon" ON dodsbon
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dodsbon" ON dodsbon
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dodsbon" ON dodsbon
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================================
-- Table: delagare (Heirs/Shareholders)
-- =====================================================================

CREATE TABLE IF NOT EXISTS delagare (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  personnummer TEXT,
  relation TEXT CHECK (relation IN (
    'make_maka',
    'sambo',
    'barn',
    'barnbarn',
    'foralder',
    'syskon',
    'annan_slakting',
    'testamentstagare',
    'god_man',
    'ombud'
  )),
  email TEXT,
  phone TEXT,
  share NUMERIC(5, 2),
  is_delagare BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER delagare_updated_at
BEFORE UPDATE ON delagare
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_delagare_dodsbo_id ON delagare(dodsbo_id);

-- Enable RLS
ALTER TABLE delagare ENABLE ROW LEVEL SECURITY;

-- RLS Policies for delagare
CREATE POLICY "Users can view delagare for their dodsbon" ON delagare
  FOR SELECT USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create delagare for their dodsbon" ON delagare
  FOR INSERT WITH CHECK (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update delagare for their dodsbon" ON delagare
  FOR UPDATE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete delagare for their dodsbon" ON delagare
  FOR DELETE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

-- =====================================================================
-- Table: tillgangar (Assets)
-- =====================================================================

CREATE TABLE IF NOT EXISTS tillgangar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'bankkonto',
    'bostadsratt',
    'villa',
    'fritidshus',
    'bil',
    'aktier_fonder',
    'pension',
    'forsakring',
    'losore',
    'ovrigt'
  )),
  description TEXT,
  estimated_value INTEGER,
  confirmed_value INTEGER,
  bank TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER tillgangar_updated_at
BEFORE UPDATE ON tillgangar
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_tillgangar_dodsbo_id ON tillgangar(dodsbo_id);
CREATE INDEX idx_tillgangar_type ON tillgangar(type);

-- Enable RLS
ALTER TABLE tillgangar ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tillgangar
CREATE POLICY "Users can view tillgangar for their dodsbon" ON tillgangar
  FOR SELECT USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create tillgangar for their dodsbon" ON tillgangar
  FOR INSERT WITH CHECK (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update tillgangar for their dodsbon" ON tillgangar
  FOR UPDATE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete tillgangar for their dodsbon" ON tillgangar
  FOR DELETE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

-- =====================================================================
-- Table: skulder (Debts)
-- =====================================================================

CREATE TABLE IF NOT EXISTS skulder (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'bolan',
    'konsumentlan',
    'kreditkort',
    'skatteskuld',
    'begravningskostnad',
    'ovrigt'
  )),
  creditor TEXT,
  amount INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER skulder_updated_at
BEFORE UPDATE ON skulder
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_skulder_dodsbo_id ON skulder(dodsbo_id);
CREATE INDEX idx_skulder_type ON skulder(type);

-- Enable RLS
ALTER TABLE skulder ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skulder
CREATE POLICY "Users can view skulder for their dodsbon" ON skulder
  FOR SELECT USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create skulder for their dodsbon" ON skulder
  FOR INSERT WITH CHECK (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update skulder for their dodsbon" ON skulder
  FOR UPDATE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete skulder for their dodsbon" ON skulder
  FOR DELETE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

-- =====================================================================
-- Table: forsakringar (Insurance Policies)
-- =====================================================================

CREATE TABLE IF NOT EXISTS forsakringar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'livforsakring',
    'grupplivforsakring',
    'tjanstepension',
    'privat_pension',
    'hemforsakring',
    'bilforsakring',
    'olycksfallsforsakring',
    'sjukforsakring',
    'barnforsakring',
    'ovrigt'
  )),
  company TEXT,
  policy_number TEXT,
  beneficiary TEXT,
  estimated_value INTEGER,
  contacted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER forsakringar_updated_at
BEFORE UPDATE ON forsakringar
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_forsakringar_dodsbo_id ON forsakringar(dodsbo_id);
CREATE INDEX idx_forsakringar_type ON forsakringar(type);

-- Enable RLS
ALTER TABLE forsakringar ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forsakringar
CREATE POLICY "Users can view forsakringar for their dodsbon" ON forsakringar
  FOR SELECT USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create forsakringar for their dodsbon" ON forsakringar
  FOR INSERT WITH CHECK (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update forsakringar for their dodsbon" ON forsakringar
  FOR UPDATE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete forsakringar for their dodsbon" ON forsakringar
  FOR DELETE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

-- =====================================================================
-- Table: tasks
-- =====================================================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dodsbo_id UUID NOT NULL REFERENCES dodsbon(id) ON DELETE CASCADE,
  step TEXT NOT NULL CHECK (step IN ('akut', 'kartlaggning', 'bouppteckning', 'arvskifte', 'avslutat')),
  category TEXT NOT NULL CHECK (category IN (
    'akut_praktiskt',
    'bank_ekonomi',
    'forsakring',
    'bostad',
    'myndigheter',
    'begravning',
    'bouppteckning',
    'arvskifte',
    'digitalt',
    'post_abonnemang'
  )),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ej_paborjad' CHECK (status IN ('ej_paborjad', 'pagaende', 'klar', 'ej_aktuell')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('akut', 'viktig', 'normal', 'kan_vanta')),
  deadline_days INTEGER,
  deadline_date DATE,
  help_text TEXT,
  external_url TEXT,
  completed_at TIMESTAMPTZ,
  is_generated BOOLEAN DEFAULT TRUE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_tasks_dodsbo_id ON tasks(dodsbo_id);
CREATE INDEX idx_tasks_step ON tasks(step);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_deadline_date ON tasks(deadline_date);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks for their dodsbon" ON tasks
  FOR SELECT USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create tasks for their dodsbon" ON tasks
  FOR INSERT WITH CHECK (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update tasks for their dodsbon" ON tasks
  FOR UPDATE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete tasks for their dodsbon" ON tasks
  FOR DELETE USING (
    dodsbo_id IN (SELECT id FROM dodsbon WHERE user_id = auth.uid())
  );

-- =====================================================================
-- Indexes Summary
-- =====================================================================
-- Foreign key indexes (already created above):
-- idx_dodsbon_user_id
-- idx_delagare_dodsbo_id
-- idx_tillgangar_dodsbo_id
-- idx_skulder_dodsbo_id
-- idx_forsakringar_dodsbo_id
-- idx_tasks_dodsbo_id
--
-- Type/category indexes:
-- idx_tillgangar_type
-- idx_skulder_type
-- idx_forsakringar_type
-- idx_tasks_step
-- idx_tasks_category
-- idx_tasks_status
-- idx_tasks_priority
-- idx_tasks_deadline_date
--
-- Other useful indexes:
-- idx_profiles_email
-- idx_dodsbon_created_at
