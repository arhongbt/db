'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SeniorModeContextType {
  seniorMode: boolean;
  setSeniorMode: (v: boolean) => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({
  seniorMode: false,
  setSeniorMode: () => {},
});

const STORAGE_KEY = 'sr_senior_mode';

export function SeniorModeProvider({ children }: { children: ReactNode }) {
  const [seniorMode, setSeniorModeState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setSeniorModeState(true);
        document.documentElement.setAttribute('data-senior', 'true');
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setSeniorMode = (v: boolean) => {
    setSeniorModeState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? 'true' : 'false');
      if (v) {
        document.documentElement.setAttribute('data-senior', 'true');
      } else {
        document.documentElement.removeAttribute('data-senior');
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <SeniorModeContext.Provider value={{ seniorMode: mounted ? seniorMode : false, setSeniorMode }}>
      {children}
    </SeniorModeContext.Provider>
  );
}

export function useSeniorMode() {
  return useContext(SeniorModeContext);
}
