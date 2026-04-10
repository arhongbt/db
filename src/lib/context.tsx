'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import {
  Action,
  dodsboReducer,
  createInitialDodsbo,
  saveState,
  loadState,
} from './store';
import { useSupabaseSync } from '@/lib/supabase/use-supabase-sync';
import type { Dodsbo } from '@/types';

interface DodsboContextValue {
  state: Dodsbo;
  dispatch: Dispatch<Action>;
  /** True while loading from Supabase */
  loading: boolean;
  /** True if state is backed by Supabase */
  synced: boolean;
}

const DodsboContext = createContext<DodsboContextValue | null>(null);

export function DodsboProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(
    dodsboReducer,
    null,
    () => loadState() ?? createInitialDodsbo()
  );

  // Supabase sync — wraps dispatch to persist every action
  const { dispatch, loading, synced } = useSupabaseSync(state, rawDispatch);

  // Still persist to localStorage as fallback / offline cache
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <DodsboContext.Provider value={{ state, dispatch, loading, synced }}>
      {children}
    </DodsboContext.Provider>
  );
}

export function useDodsbo(): DodsboContextValue {
  const ctx = useContext(DodsboContext);
  if (!ctx) {
    throw new Error('useDodsbo must be used within a DodsboProvider');
  }
  return ctx;
}
