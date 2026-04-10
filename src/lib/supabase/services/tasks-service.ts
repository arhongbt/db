import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { DodsboTask, ProcessStep, TaskCategory, TaskStatus, Priority } from '@/types/dodsbo';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];

// ============================================================
// Mapping
// ============================================================

function rowToTask(row: TaskRow): DodsboTask {
  return {
    id: row.id,
    step: row.step as ProcessStep,
    category: row.category as TaskCategory,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    priority: row.priority as Priority,
    deadlineDays: row.deadline_days ?? undefined,
    deadlineDate: row.deadline_date ?? undefined,
    helpText: row.help_text ?? undefined,
    externalUrl: row.external_url ?? undefined,
    completedAt: row.completed_at ?? undefined,
  };
}

// ============================================================
// Tasks CRUD
// ============================================================

export async function getTasks(dodsboId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at');

  return { data: data?.map(rowToTask) ?? null, error };
}

export async function addTask(dodsboId: string, task: Omit<DodsboTask, 'id'>) {
  const supabase = createClient();

  const insert: TaskInsert = {
    dodsbo_id: dodsboId,
    step: task.step,
    category: task.category,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    deadline_days: task.deadlineDays ?? null,
    deadline_date: task.deadlineDate ?? null,
    help_text: task.helpText ?? null,
    external_url: task.externalUrl ?? null,
    completed_at: task.completedAt ?? null,
    is_generated: true,
    is_custom: false,
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert(insert)
    .select()
    .single();

  return { data: data ? rowToTask(data) : null, error };
}

/** Bulk-insert tasks (used after onboarding generates ~14 tasks) */
export async function addTasksBulk(dodsboId: string, tasks: Omit<DodsboTask, 'id'>[]) {
  const supabase = createClient();

  const inserts: TaskInsert[] = tasks.map((task) => ({
    dodsbo_id: dodsboId,
    step: task.step,
    category: task.category,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    deadline_days: task.deadlineDays ?? null,
    deadline_date: task.deadlineDate ?? null,
    help_text: task.helpText ?? null,
    external_url: task.externalUrl ?? null,
    completed_at: task.completedAt ?? null,
    is_generated: true,
    is_custom: false,
  }));

  const { data, error } = await supabase
    .from('tasks')
    .insert(inserts)
    .select();

  return { data: data?.map(rowToTask) ?? null, error };
}

export async function updateTask(id: string, updates: Partial<DodsboTask>) {
  const supabase = createClient();

  const dbUpdates: Database['public']['Tables']['tasks']['Update'] = {};
  if (updates.step !== undefined) dbUpdates.step = updates.step;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.deadlineDays !== undefined) dbUpdates.deadline_days = updates.deadlineDays;
  if (updates.deadlineDate !== undefined) dbUpdates.deadline_date = updates.deadlineDate;
  if (updates.helpText !== undefined) dbUpdates.help_text = updates.helpText;
  if (updates.externalUrl !== undefined) dbUpdates.external_url = updates.externalUrl;
  if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;

  const { data, error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  return { data: data ? rowToTask(data) : null, error };
}

export async function removeTask(id: string) {
  const supabase = createClient();
  return supabase
    .from('tasks')
    .delete()
    .eq('id', id);
}
