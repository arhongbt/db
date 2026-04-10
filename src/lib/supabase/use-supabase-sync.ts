'use client';

// ============================================================
// useSupabaseSync — bridges DodsboProvider ↔ Supabase
//
// Strategy:
//   1. On mount (if authenticated): load dödsbo + children from DB
//   2. Wrap dispatch so every action also syncs to Supabase
//   3. Falls back to localStorage when logged out
// ============================================================

import { useCallback, useEffect, useRef, useState, type Dispatch } from 'react';
import { useAuth } from '@/lib/auth/safe-use-auth';
import { type Action } from '@/lib/store';
import type { Dodsbo } from '@/types';

import {
  getDodsbon,
  getDodsboById,
  createDodsbo,
  updateDodsbo,
} from './services/dodsbo-service';
import { getDelagare, addDelagare, removeDelagare, updateDelagare } from './services/delagare-service';
import { getTillgangar, addTillgang, removeTillgang } from './services/tillgangar-service';
import { getSkulder, addSkuld, removeSkuld } from './services/skulder-service';
import { getForsakringar, addForsakring, removeForsakring, updateForsakring } from './services/forsakringar-service';
import { getTasks, addTasksBulk, updateTask } from './services/tasks-service';

interface SyncState {
  /** Supabase row ID for the current dödsbo */
  dodsboId: string | null;
  /** True while initial load is in progress */
  loading: boolean;
  /** True if user is authenticated and data came from Supabase */
  synced: boolean;
}

/**
 * Hook that syncs local DodsboProvider state with Supabase.
 *
 * Returns a wrapped dispatch that persists every action to Supabase,
 * and loads initial state from DB when authenticated.
 */
export function useSupabaseSync(
  localState: Dodsbo,
  rawDispatch: Dispatch<Action>,
) {
  const { user } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>({
    dodsboId: null,
    loading: true,
    synced: false,
  });

  // Track dodsboId in a ref so the wrapped dispatch always has latest
  const dodsboIdRef = useRef<string | null>(null);
  dodsboIdRef.current = syncState.dodsboId;

  // ── Initial load from Supabase ───────────────────────────
  useEffect(() => {
    if (!user) {
      setSyncState({ dodsboId: null, loading: false, synced: false });
      return;
    }

    let cancelled = false;

    async function loadFromSupabase() {
      // 1. Get user's dödsbon
      const { data: dodsbon } = await getDodsbon();
      if (cancelled) return;

      if (!dodsbon || dodsbon.length === 0) {
        // No dödsbo in DB yet — keep localStorage state, will push on first meaningful action
        setSyncState({ dodsboId: null, loading: false, synced: false });
        return;
      }

      // Use the first (most recent) dödsbo (raw DB row — snake_case)
      const row = dodsbon[0];
      const dodsboId = row.id;

      // 2. Load all children in parallel
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

      if (cancelled) return;

      // 3. Assemble full Dodsbo (map snake_case row → camelCase)
      const fullState: Dodsbo = {
        id: dodsboId,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        deceasedName: row.deceased_name,
        deathDate: row.death_date,
        deceasedPersonnummer: row.deceased_personnummer,
        onboarding: (row.onboarding ?? {}) as unknown as Dodsbo['onboarding'],
        currentStep: row.current_step as Dodsbo['currentStep'],
        delagare: delagare ?? [],
        tillgangar: tillgangar ?? [],
        skulder: skulder ?? [],
        forsakringar: forsakringar ?? [],
        tasks: tasks ?? [],
      };

      rawDispatch({ type: 'LOAD_STATE', payload: fullState });
      setSyncState({ dodsboId, loading: false, synced: true });
    }

    loadFromSupabase();
    return () => { cancelled = true; };
  }, [user, rawDispatch]);

  // ── Ensure dödsbo row exists in Supabase ─────────────────
  const ensureDodsboRow = useCallback(async (state: Dodsbo): Promise<string | null> => {
    if (dodsboIdRef.current) return dodsboIdRef.current;
    if (!user) return null;

    // Create the dödsbo row
    const { data } = await createDodsbo({
      deceasedName: state.deceasedName,
      deathDate: state.deathDate,
      deceasedPersonnummer: state.deceasedPersonnummer,
      onboarding: state.onboarding,
      currentStep: state.currentStep,
    });

    if (data) {
      const newId = data.id;
      dodsboIdRef.current = newId;
      setSyncState(prev => ({ ...prev, dodsboId: newId, synced: true }));
      return newId;
    }
    return null;
  }, [user]);

  // ── Wrapped dispatch that syncs to Supabase ──────────────
  const syncDispatch = useCallback(
    (action: Action) => {
      // Always update local state first
      rawDispatch(action);

      // If not authenticated, skip Supabase sync
      if (!user) return;

      // Fire-and-forget sync to Supabase
      (async () => {
        try {
          // For actions that create/modify the dödsbo itself, ensure row exists
          const needsRow = [
            'SET_ONBOARDING',
            'SET_DECEASED_INFO',
            'SET_TASKS',
            'SET_STEP',
            'ADD_DELAGARE',
            'ADD_TILLGANG',
            'ADD_SKULD',
            'ADD_FORSAKRING',
          ];

          let dbId = dodsboIdRef.current;
          if (needsRow.includes(action.type) && !dbId) {
            dbId = await ensureDodsboRow(localState);
            if (!dbId) return; // Can't sync without a row
          }

          switch (action.type) {
            case 'SET_ONBOARDING':
              if (dbId) await updateDodsbo(dbId, { onboarding: action.payload });
              break;

            case 'SET_DECEASED_INFO':
              if (dbId) await updateDodsbo(dbId, {
                deceasedName: action.payload.name,
                deathDate: action.payload.deathDate,
              });
              break;

            case 'SET_STEP':
              if (dbId) await updateDodsbo(dbId, { currentStep: action.payload });
              break;

            case 'SET_TASKS':
              // Bulk insert all tasks (typically from onboarding)
              if (dbId) await addTasksBulk(dbId, action.payload);
              break;

            case 'ADD_DELAGARE':
              if (dbId) await addDelagare(dbId, action.payload);
              break;

            case 'REMOVE_DELAGARE':
              await removeDelagare(action.payload);
              break;

            case 'UPDATE_DELAGARE':
              await updateDelagare(action.payload.id, action.payload);
              break;

            case 'ADD_TILLGANG':
              if (dbId) await addTillgang(dbId, action.payload);
              break;

            case 'REMOVE_TILLGANG':
              await removeTillgang(action.payload);
              break;

            case 'ADD_SKULD':
              if (dbId) await addSkuld(dbId, action.payload);
              break;

            case 'REMOVE_SKULD':
              await removeSkuld(action.payload);
              break;

            case 'ADD_FORSAKRING':
              if (dbId) await addForsakring(dbId, action.payload);
              break;

            case 'REMOVE_FORSAKRING':
              await removeForsakring(action.payload);
              break;

            case 'TOGGLE_FORSAKRING_CONTACTED': {
              // We need the current state of the forsakring to toggle
              // The local reducer already toggled it, so read from the updated state
              // We pass the id and the service will handle it
              const f = localState.forsakringar.find(f => f.id === action.payload);
              if (f) await updateForsakring(action.payload, { contacted: !f.contacted });
              break;
            }

            case 'UPDATE_TASK':
              await updateTask(action.payload.id, {
                status: action.payload.status,
                completedAt: action.payload.status === 'klar' ? new Date().toISOString() : undefined,
              });
              break;

            case 'RESET':
              // On reset, we don't delete from Supabase — just clear local
              setSyncState({ dodsboId: null, loading: false, synced: false });
              break;
          }
        } catch (err) {
          console.error('[Supabase sync] Error syncing action:', action.type, err);
          // Local state is fine — Supabase will catch up next load
        }
      })();
    },
    [user, rawDispatch, localState, ensureDodsboRow],
  );

  return {
    dispatch: syncDispatch,
    loading: syncState.loading,
    synced: syncState.synced,
    dodsboId: syncState.dodsboId,
  };
}
