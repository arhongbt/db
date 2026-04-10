// ============================================================
// Dödsbo App — Client-side state management
// Simple React context + useReducer (no external deps)
// Data persists in localStorage until we add Supabase
// ============================================================

import {
  Dodsbo,
  OnboardingData,
  ProcessStep,
  DodsboTask,
  Dodsbodelaware,
  Tillgang,
  Skuld,
  Forsakring,
} from '@/types';

// ============================================================
// Actions
// ============================================================

export type Action =
  | { type: 'SET_ONBOARDING'; payload: OnboardingData }
  | { type: 'SET_DECEASED_INFO'; payload: { name: string; deathDate: string } }
  | { type: 'ADD_DELAGARE'; payload: Dodsbodelaware }
  | { type: 'REMOVE_DELAGARE'; payload: string }
  | { type: 'ADD_TILLGANG'; payload: Tillgang }
  | { type: 'ADD_SKULD'; payload: Skuld }
  | { type: 'ADD_FORSAKRING'; payload: Forsakring }
  | { type: 'UPDATE_TASK'; payload: { id: string; status: DodsboTask['status'] } }
  | { type: 'SET_STEP'; payload: ProcessStep }
  | { type: 'LOAD_STATE'; payload: Dodsbo }
  | { type: 'RESET' };

// ============================================================
// Initial state
// ============================================================

export const initialOnboarding: OnboardingData = {
  relation: 'barn',
  familySituation: 'ogift_med_barn',
  hasTestamente: null,
  housingType: 'hyresratt',
  banks: [],
  hasDebts: null,
  alreadyDone: [],
};

export function createInitialDodsbo(): Dodsbo {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    deceasedName: '',
    deathDate: '',
    onboarding: initialOnboarding,
    delagare: [],
    tillgangar: [],
    skulder: [],
    forsakringar: [],
    tasks: [],
    currentStep: 'akut',
  };
}

// ============================================================
// Reducer
// ============================================================

export function dodsboReducer(state: Dodsbo, action: Action): Dodsbo {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'SET_ONBOARDING':
      return { ...state, onboarding: action.payload, updatedAt: now };

    case 'SET_DECEASED_INFO':
      return {
        ...state,
        deceasedName: action.payload.name,
        deathDate: action.payload.deathDate,
        updatedAt: now,
      };

    case 'ADD_DELAGARE':
      return {
        ...state,
        delagare: [...state.delagare, action.payload],
        updatedAt: now,
      };

    case 'REMOVE_DELAGARE':
      return {
        ...state,
        delagare: state.delagare.filter((d) => d.id !== action.payload),
        updatedAt: now,
      };

    case 'ADD_TILLGANG':
      return {
        ...state,
        tillgangar: [...state.tillgangar, action.payload],
        updatedAt: now,
      };

    case 'ADD_SKULD':
      return {
        ...state,
        skulder: [...state.skulder, action.payload],
        updatedAt: now,
      };

    case 'ADD_FORSAKRING':
      return {
        ...state,
        forsakringar: [...state.forsakringar, action.payload],
        updatedAt: now,
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                status: action.payload.status,
                completedAt:
                  action.payload.status === 'klar' ? now : t.completedAt,
              }
            : t
        ),
        updatedAt: now,
      };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload, updatedAt: now };

    case 'LOAD_STATE':
      return action.payload;

    case 'RESET':
      return createInitialDodsbo();

    default:
      return state;
  }
}

// ============================================================
// LocalStorage helpers (until Supabase)
// ============================================================

const STORAGE_KEY = 'dodsbo_state';

export function saveState(state: Dodsbo): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail — user might have storage disabled
  }
}

export function loadState(): Dodsbo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Dodsbo;
  } catch {
    // Corrupted state — start fresh
  }
  return null;
}
