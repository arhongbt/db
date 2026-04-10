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
import type { Dodsbo } from '@/types';

interface DodsboContextValue {
  state: Dodsbo;
  dispatch: Dispatch<Action>;
}

const DodsboContext = createContext<DodsboContextValue | null>(null);

export function DodsboProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    dodsboReducer,
    null,
    () => loadState() ?? createInitialDodsbo()
  );

  // Persist to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <DodsboContext.Provider value={{ state, dispatch }}>
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
