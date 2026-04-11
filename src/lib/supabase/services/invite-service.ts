import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type InviteRow = Database['public']['Tables']['invites']['Row'];

function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ============================================================
// Create invite
// ============================================================

export async function createInvite(
  dodsboId: string,
  email: string
): Promise<{ data: InviteRow | null; error: Error | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Ej inloggad') };

  const token = generateToken();

  const { data, error } = await supabase
    .from('invites')
    .insert({
      dodsbo_id: dodsboId,
      invited_by: user.id,
      invited_email: email.toLowerCase().trim(),
      token,
      role: 'viewer',
      status: 'pending',
    })
    .select()
    .single();

  if (error) return { data: null, error: new Error(error.message) };
  return { data, error: null };
}

// ============================================================
// List invites for a dödsbo
// ============================================================

export async function getInvites(dodsboId: string) {
  const supabase = createClient();
  return supabase
    .from('invites')
    .select('*')
    .eq('dodsbo_id', dodsboId)
    .order('created_at', { ascending: false });
}

// ============================================================
// Get invite by token (for accept page)
// ============================================================

export async function getInviteByToken(token: string) {
  const supabase = createClient();
  return supabase
    .from('invites')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single();
}

// ============================================================
// Accept invite
// ============================================================

export async function acceptInvite(
  token: string
): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: new Error('Du måste vara inloggad för att acceptera inbjudan') };

  // 1. Find the invite
  const { data: invite, error: findError } = await supabase
    .from('invites')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single();

  if (findError || !invite) {
    return { success: false, error: new Error('Inbjudan hittades inte eller har redan använts') };
  }

  // 2. Add user as member
  const { error: memberError } = await supabase
    .from('dodsbo_members')
    .insert({
      dodsbo_id: invite.dodsbo_id,
      user_id: user.id,
      role: invite.role || 'viewer',
    });

  if (memberError) {
    // Might already be a member
    if (memberError.code === '23505') {
      // Unique violation — already a member, still mark invite as accepted
    } else {
      return { success: false, error: new Error(memberError.message) };
    }
  }

  // 3. Mark invite as accepted
  await supabase
    .from('invites')
    .update({
      status: 'accepted',
      accepted_by: user.id,
      accepted_at: new Date().toISOString(),
    })
    .eq('id', invite.id);

  return { success: true, error: null };
}

// ============================================================
// Revoke invite
// ============================================================

export async function revokeInvite(inviteId: string) {
  const supabase = createClient();
  return supabase
    .from('invites')
    .update({ status: 'revoked' })
    .eq('id', inviteId);
}

// ============================================================
// Remove member
// ============================================================

export async function removeMember(memberId: string) {
  const supabase = createClient();
  return supabase
    .from('dodsbo_members')
    .delete()
    .eq('id', memberId);
}

// ============================================================
// List members
// ============================================================

export async function getMembers(dodsboId: string) {
  const supabase = createClient();
  return supabase
    .from('dodsbo_members')
    .select('*')
    .eq('dodsbo_id', dodsboId);
}

// ============================================================
// Build invite link
// ============================================================

export function getInviteLink(token: string): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : '';
  return `${baseUrl}/invite/${token}`;
}
