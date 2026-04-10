'use client';

import { useContext, createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';

// Re-export a safe version of useAuth that returns null user
// when called outside AuthProvider (e.g., during SSR or on pages
// that don't have auth yet).

// Import the actual context module to access its internals
// We can't import the context object directly, so we use a try/catch approach.

import { useAuth as useAuthOriginal } from './context';

/**
 * Safe wrapper around useAuth — returns { user: null } instead of
 * throwing when called outside AuthProvider.
 */
export function useAuth() {
  try {
    return useAuthOriginal();
  } catch {
    return {
      user: null as User | null,
      session: null as Session | null,
      loading: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
      resetPassword: async () => {},
    };
  }
}
