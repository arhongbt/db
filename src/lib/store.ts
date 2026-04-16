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
  LosoreItem,
  Kostnad,
} from '@/types';

// ============================================================
// Actions
// ============================================================

export type Action =
  | { type: 'SET_ONBOARDING'; payload: OnboardingData }
  | { type: 'SET_DECEASED_INFO'; payload: { name: string; deathDate: string } }
  | { type: 'SET_TASKS'; payload: DodsboTask[] }
  | { type: 'ADD_DELAGARE'; payload: Dodsbodelaware }
  | { type: 'REMOVE_DELAGARE'; payload: string }
  | { type: 'UPDATE_DELAGARE'; payload: Dodsbodelaware }
  | { type: 'ADD_TILLGANG'; payload: Tillgang }
  | { type: 'REMOVE_TILLGANG'; payload: string }
  | { type: 'ADD_SKULD'; payload: Skuld }
  | { type: 'REMOVE_SKULD'; payload: string }
  | { type: 'ADD_FORSAKRING'; payload: Forsakring }
  | { type: 'REMOVE_FORSAKRING'; payload: string }
  | { type: 'TOGGLE_FORSAKRING_CONTACTED'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; status?: DodsboTask['status']; assignedTo?: string } }
  | { type: 'SET_STEP'; payload: ProcessStep }
  | { type: 'SET_BOUPPTECKNING_INFO'; payload: Partial<Pick<Dodsbo,
      'deceasedPersonnummer' | 'deceasedAddress' | 'deceasedFolkbokforingsort' |
      'deceasedMedborgarskap' | 'deceasedCivilstand' | 'forrattningsdatum' |
      'forrattningsman' | 'bouppgivare'
    >> }
  | { type: 'SET_LOSORE'; payload: LosoreItem[] }
  | { type: 'ADD_LOSORE'; payload: LosoreItem }
  | { type: 'REMOVE_LOSORE'; payload: string }
  | { type: 'UPDATE_LOSORE'; payload: LosoreItem }
  | { type: 'SET_KOSTNADER'; payload: Kostnad[] }
  | { type: 'ADD_KOSTNAD'; payload: Kostnad }
  | { type: 'REMOVE_KOSTNAD'; payload: string }
  | { type: 'UPDATE_KOSTNAD'; payload: Kostnad }
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
    forrattningsman: [],
    onboarding: initialOnboarding,
    delagare: [],
    tillgangar: [],
    skulder: [],
    forsakringar: [],
    tasks: [],
    currentStep: 'akut',
    losore: [],
    kostnader: [],
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

    case 'SET_TASKS':
      return { ...state, tasks: action.payload, updatedAt: now };

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

    case 'UPDATE_DELAGARE':
      return {
        ...state,
        delagare: state.delagare.map((d) =>
          d.id === action.payload.id ? action.payload : d
        ),
        updatedAt: now,
      };

    case 'ADD_TILLGANG':
      return {
        ...state,
        tillgangar: [...state.tillgangar, action.payload],
        updatedAt: now,
      };

    case 'REMOVE_TILLGANG':
      return {
        ...state,
        tillgangar: state.tillgangar.filter((t) => t.id !== action.payload),
        updatedAt: now,
      };

    case 'ADD_SKULD':
      return {
        ...state,
        skulder: [...state.skulder, action.payload],
        updatedAt: now,
      };

    case 'REMOVE_SKULD':
      return {
        ...state,
        skulder: state.skulder.filter((s) => s.id !== action.payload),
        updatedAt: now,
      };

    case 'ADD_FORSAKRING':
      return {
        ...state,
        forsakringar: [...state.forsakringar, action.payload],
        updatedAt: now,
      };

    case 'REMOVE_FORSAKRING':
      return {
        ...state,
        forsakringar: state.forsakringar.filter((f) => f.id !== action.payload),
        updatedAt: now,
      };

    case 'TOGGLE_FORSAKRING_CONTACTED':
      return {
        ...state,
        forsakringar: state.forsakringar.map((f) =>
          f.id === action.payload ? { ...f, contacted: !f.contacted } : f
        ),
        updatedAt: now,
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                ...(action.payload.status !== undefined && {
                  status: action.payload.status,
                  completedAt:
                    action.payload.status === 'klar' ? now : t.completedAt,
                }),
                ...(action.payload.assignedTo !== undefined && {
                  assignedTo: action.payload.assignedTo || undefined,
                }),
              }
            : t
        ),
        updatedAt: now,
      };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload, updatedAt: now };

    case 'SET_BOUPPTECKNING_INFO':
      return { ...state, ...action.payload, updatedAt: now };

    case 'SET_LOSORE':
      return { ...state, losore: action.payload, updatedAt: now };

    case 'ADD_LOSORE':
      return { ...state, losore: [...state.losore, action.payload], updatedAt: now };

    case 'REMOVE_LOSORE':
      return { ...state, losore: state.losore.filter((l) => l.id !== action.payload), updatedAt: now };

    case 'UPDATE_LOSORE':
      return {
        ...state,
        losore: state.losore.map((l) => l.id === action.payload.id ? action.payload : l),
        updatedAt: now,
      };

    case 'SET_KOSTNADER':
      return { ...state, kostnader: action.payload, updatedAt: now };

    case 'ADD_KOSTNAD':
      return { ...state, kostnader: [...state.kostnader, action.payload], updatedAt: now };

    case 'REMOVE_KOSTNAD':
      return { ...state, kostnader: state.kostnader.filter((k) => k.id !== action.payload), updatedAt: now };

    case 'UPDATE_KOSTNAD':
      return { ...state, kostnader: state.kostnader.map((k) => k.id === action.payload.id ? action.payload : k), updatedAt: now };

    case 'LOAD_STATE':
      return {
        ...action.payload,
        losore: action.payload.losore || [],
        kostnader: action.payload.kostnader || [],
      };

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

// Fix stale external URLs from older versions
const URL_MIGRATIONS: Record<string, string> = {
  'https://www.skatteverket.se/privat/folkbokforing/dodsfall/bouppteckning': 'https://www.skatteverket.se/privat/folkbokforing/narenanhorigdor/bouppteckning',
  'https://www.skatteverket.se/privat/folkbokforing/dodsfall': 'https://www.skatteverket.se/privat/folkbokforing/narenanhorigdor',
  'https://support.apple.com/deceased': 'https://support.apple.com/en-us/HT208510',
  'https://facebook.com/help/contact/305593649477238': 'https://www.facebook.com/help/1506822589577997',
};

function migrateUrls(state: Dodsbo): Dodsbo {
  if (!state.tasks || state.tasks.length === 0) return state;
  let changed = false;
  const tasks = state.tasks.map((t) => {
    if (t.externalUrl && URL_MIGRATIONS[t.externalUrl]) {
      changed = true;
      return { ...t, externalUrl: URL_MIGRATIONS[t.externalUrl] };
    }
    return t;
  });
  return changed ? { ...state, tasks } : state;
}

export function loadState(): Dodsbo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Dodsbo;
      const state = { ...parsed, losore: parsed.losore || [], kostnader: parsed.kostnader || [] };
      const migrated = migrateUrls(state);
      // Persist migrated URLs back so they don't need fixing again
      if (migrated !== state) {
        saveState(migrated);
      }
      return migrated;
    }
  } catch {
    // Corrupted state — start fresh
  }
  return null;
}
