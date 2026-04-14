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
  TRIAL_DURATION_DAYS,
} from '@/types/dodsbo';

// ── Storage keys ──────────────────────────────────────────
const STORAGE_KEY = 'sr_subscription';

// ── Context type ──────────────────────────────────────────
interface SubscriptionContextType {
  tier: SubscriptionTier;
  trialDaysLeft: number;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  isPaid: boolean;
  canAccess: (feature: PremiumFeature) => boolean;
  upgradeTo: (tier: 'standard' | 'pro') => void;
  startTrial: () => void;
  state: SubscriptionState;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// ── Helpers ───────────────────────────────────────────────
function loadState(): SubscriptionState {
  if (typeof window === 'undefined') {
    return { tier: 'trial', trialStartedAt: null, trialExpiresAt: null, paidAt: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { tier: 'trial', trialStartedAt: null, trialExpiresAt: null, paidAt: null };
}

function saveState(state: SubscriptionState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateTier(state: SubscriptionState): SubscriptionTier {
  // If user has paid, return their paid tier
  if (state.paidAt && (state.tier === 'standard' || state.tier === 'pro')) {
    return state.tier;
  }
  // If trial hasn't started yet, return trial (will be started on first load)
  if (!state.trialStartedAt) return 'trial';

  // Check if trial is still active
  const expiresAt = state.trialExpiresAt
    ? new Date(state.trialExpiresAt)
    : new Date(new Date(state.trialStartedAt).getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);

  if (new Date() < expiresAt) return 'trial';
  return 'expired';
}

function getDaysLeft(state: SubscriptionState): number {
  if (!state.trialStartedAt) return TRIAL_DURATION_DAYS;
  const expiresAt = state.trialExpiresAt
    ? new Date(state.trialExpiresAt)
    : new Date(new Date(state.trialStartedAt).getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
  const msLeft = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}

// ── Provider ──────────────────────────────────────────────
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(loadState);

  // Auto-start trial on first load if not already started
  useEffect(() => {
    if (!state.trialStartedAt && !state.paidAt) {
      const now = new Date().toISOString();
      const expires = new Date(Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const newState: SubscriptionState = {
        tier: 'trial',
        trialStartedAt: now,
        trialExpiresAt: expires,
        paidAt: null,
      };
      setState(newState);
      saveState(newState);
    }
  }, [state.trialStartedAt, state.paidAt]);

  const tier = calculateTier(state);
  const trialDaysLeft = getDaysLeft(state);
  const isTrialActive = tier === 'trial';
  const isTrialExpired = tier === 'expired';
  const isPaid = tier === 'standard' || tier === 'pro';

  const canAccess = useCallback(
    (feature: PremiumFeature) => TIER_ACCESS[tier][feature],
    [tier]
  );

  const upgradeTo = useCallback((newTier: 'standard' | 'pro') => {
    const newState: SubscriptionState = {
      ...state,
      tier: newTier,
      paidAt: new Date().toISOString(),
    };
    setState(newState);
    saveState(newState);
  }, [state]);

  const startTrial = useCallback(() => {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const newState: SubscriptionState = {
      tier: 'trial',
      trialStartedAt: now,
      trialExpiresAt: expires,
      paidAt: null,
    };
    setState(newState);
    saveState(newState);
  }, []);

  const value = useMemo(() => ({
    tier,
    trialDaysLeft,
    isTrialActive,
    isTrialExpired,
    isPaid,
    canAccess,
    upgradeTo,
    startTrial,
    state,
  }), [tier, trialDaysLeft, isTrialActive, isTrialExpired, isPaid, canAccess, upgradeTo, startTrial, state]);

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
