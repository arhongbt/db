'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {
  SubscriptionTier,
  SubscriptionState,
  PremiumFeature,
  TIER_ACCESS,
} from '@/types/dodsbo';

// ── Storage keys ──────────────────────────────────────────
const STORAGE_KEY = 'sr_subscription';

// ── Context type ──────────────────────────────────────────
interface SubscriptionContextType {
  tier: SubscriptionTier;
  isFree: boolean;
  isPremium: boolean;
  canAccess: (feature: PremiumFeature) => boolean;
  upgradeTo: (tier: 'premium') => void;
  state: SubscriptionState;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// ── Helpers ───────────────────────────────────────────────

/** Migrate old tier formats to freemium model */
function migrateState(raw: Record<string, unknown>): SubscriptionState {
  const oldTier = raw.tier as string;
  let tier: SubscriptionTier = 'free';
  let paidAt = (raw.paidAt as string) || null;

  if (oldTier === 'standard' || oldTier === 'pro' || oldTier === 'premium') {
    tier = 'premium';
    // Preserve existing paidAt or set one if missing for paid users
    if (!paidAt && (oldTier === 'standard' || oldTier === 'pro')) {
      paidAt = new Date().toISOString();
    }
  } else {
    // trial, expired, free, or anything else → free
    tier = 'free';
    paidAt = null;
  }

  return { tier, paidAt };
}

function loadState(): SubscriptionState {
  if (typeof window === 'undefined') {
    return { tier: 'free', paidAt: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate if old format detected
      if (parsed.tier && !['free', 'premium'].includes(parsed.tier)) {
        const migrated = migrateState(parsed);
        saveState(migrated);
        return migrated;
      }
      return { tier: parsed.tier || 'free', paidAt: parsed.paidAt || null };
    }
  } catch { /* ignore */ }
  return { tier: 'free', paidAt: null };
}

function saveState(state: SubscriptionState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Provider ──────────────────────────────────────────────
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(loadState);

  // Persist on state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const tier = state.tier;
  const isFree = tier === 'free';
  const isPremium = tier === 'premium';

  const canAccess = useCallback(
    (feature: PremiumFeature) => TIER_ACCESS[tier][feature],
    [tier]
  );

  const upgradeTo = useCallback((_tier: 'premium') => {
    const newState: SubscriptionState = {
      tier: 'premium',
      paidAt: new Date().toISOString(),
    };
    setState(newState);
    saveState(newState);
  }, []);

  const value = useMemo(() => ({
    tier,
    isFree,
    isPremium,
    canAccess,
    upgradeTo,
    state,
  }), [tier, isFree, isPremium, canAccess, upgradeTo, state]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
