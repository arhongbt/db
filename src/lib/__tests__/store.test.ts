import { describe, it, expect } from 'vitest';
import { dodsboReducer, createInitialDodsbo } from '../store';
import type { Dodsbo } from '@/types';

function makeState(overrides?: Partial<Dodsbo>): Dodsbo {
  return { ...createInitialDodsbo(), ...overrides };
}

describe('dodsboReducer', () => {
  describe('SET_DECEASED_INFO', () => {
    it('sätter namn och dödsdatum', () => {
      const state = makeState();
      const next = dodsboReducer(state, {
        type: 'SET_DECEASED_INFO',
        payload: { name: 'Anna Svensson', deathDate: '2025-01-15' },
      });
      expect(next.deceasedName).toBe('Anna Svensson');
      expect(next.deathDate).toBe('2025-01-15');
      expect(next.updatedAt).not.toBe(state.updatedAt);
    });
  });

  describe('ADD_DELAGARE', () => {
    it('lägger till en delägare', () => {
      const state = makeState();
      const delagare = {
        id: '1',
        name: 'Erik Svensson',
        relation: 'barn' as const,
        email: 'erik@test.se',
        phone: '070-1234567',
        isDelagare: true,
      };
      const next = dodsboReducer(state, { type: 'ADD_DELAGARE', payload: delagare });
      expect(next.delagare).toHaveLength(1);
      expect(next.delagare[0].name).toBe('Erik Svensson');
    });
  });

  describe('REMOVE_DELAGARE', () => {
    it('tar bort rätt delägare', () => {
      const state = makeState({
        delagare: [
          { id: '1', name: 'A', relation: 'barn', email: '', phone: '', isDelagare: true },
          { id: '2', name: 'B', relation: 'barn', email: '', phone: '', isDelagare: true },
        ],
      });
      const next = dodsboReducer(state, { type: 'REMOVE_DELAGARE', payload: '1' });
      expect(next.delagare).toHaveLength(1);
      expect(next.delagare[0].id).toBe('2');
    });
  });

  describe('ADD_TILLGANG', () => {
    it('lägger till tillgång', () => {
      const state = makeState();
      const next = dodsboReducer(state, {
        type: 'ADD_TILLGANG',
        payload: { id: 't1', type: 'bankkonto', description: 'Sparkonto SEB', estimatedValue: 150000 },
      });
      expect(next.tillgangar).toHaveLength(1);
      expect(next.tillgangar[0].estimatedValue).toBe(150000);
    });
  });

  describe('ADD_SKULD', () => {
    it('lägger till skuld', () => {
      const state = makeState();
      const next = dodsboReducer(state, {
        type: 'ADD_SKULD',
        payload: { id: 's1', type: 'bolan', creditor: 'Nordea', amount: 2000000 },
      });
      expect(next.skulder).toHaveLength(1);
      expect(next.skulder[0].amount).toBe(2000000);
    });
  });

  describe('UPDATE_TASK', () => {
    it('uppdaterar status och sätter completedAt', () => {
      const state = makeState({
        tasks: [
          {
            id: 'task1',
            title: 'Kontakta bank',
            description: '',
            status: 'ej_paborjad',
            step: 'akut',
            category: 'bank_ekonomi',
            priority: 'viktig',
          },
        ],
      });
      const next = dodsboReducer(state, {
        type: 'UPDATE_TASK',
        payload: { id: 'task1', status: 'klar' },
      });
      expect(next.tasks[0].status).toBe('klar');
      expect(next.tasks[0].completedAt).toBeTruthy();
    });
  });

  describe('ADD_KOSTNAD', () => {
    it('lägger till kostnad', () => {
      const state = makeState();
      const next = dodsboReducer(state, {
        type: 'ADD_KOSTNAD',
        payload: { id: 'k1', description: 'Begravning', amount: 35000, category: 'begravning', date: '2025-01-20' },
      });
      expect(next.kostnader).toHaveLength(1);
      expect(next.kostnader[0].amount).toBe(35000);
    });
  });

  describe('RESET', () => {
    it('återställer till initialt state', () => {
      const state = makeState({ deceasedName: 'Test', deathDate: '2025-01-01' });
      const next = dodsboReducer(state, { type: 'RESET' });
      expect(next.deceasedName).toBe('');
      expect(next.deathDate).toBe('');
      expect(next.delagare).toHaveLength(0);
    });
  });

  describe('LOAD_STATE', () => {
    it('laddar sparad state och fyller i saknade arrays', () => {
      const saved = { ...createInitialDodsbo(), deceasedName: 'Loaded' } as any;
      delete saved.losore;
      delete saved.kostnader;
      const next = dodsboReducer(createInitialDodsbo(), { type: 'LOAD_STATE', payload: saved });
      expect(next.deceasedName).toBe('Loaded');
      expect(next.losore).toEqual([]);
      expect(next.kostnader).toEqual([]);
    });
  });

  describe('SET_LOSORE', () => {
    it('sätter lösörelista', () => {
      const state = makeState();
      const items = [
        { id: 'l1', name: 'Soffa', category: 'mobler' as const, estimatedValue: 5000 },
        { id: 'l2', name: 'TV', category: 'elektronik' as const, estimatedValue: 8000 },
      ];
      const next = dodsboReducer(state, { type: 'SET_LOSORE', payload: items });
      expect(next.losore).toHaveLength(2);
    });
  });
});
