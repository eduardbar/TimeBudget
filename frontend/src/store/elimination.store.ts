// ===========================================
// TimeBudget - Elimination Store
// ===========================================

import { create } from 'zustand';
import type { Elimination } from '../shared/types';
import { api } from '../services/api';
import { useAuthStore } from './auth.store';

interface CreateEliminationData {
  activityName: string;
  reason?: string;
  recoveredMinutes: number;
}

interface EliminationState {
  eliminations: Elimination[];
  totalRecoveredMinutes: number;
  isLoading: boolean;
  error: string | null;
}

interface EliminationActions {
  fetchEliminations: () => Promise<void>;
  createElimination: (data: CreateEliminationData) => Promise<boolean>;
  clearError: () => void;
}

export const useEliminationStore = create<EliminationState & EliminationActions>((set) => ({
  eliminations: [],
  totalRecoveredMinutes: 0,
  isLoading: false,
  error: null,

  fetchEliminations: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });

    const response = await api.eliminations.getAll(token);

    if (response.success && response.data) {
      const data = response.data as { eliminations: Elimination[]; totalRecoveredMinutes: number };
      set({ 
        eliminations: data.eliminations, 
        totalRecoveredMinutes: data.totalRecoveredMinutes, 
        isLoading: false 
      });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  createElimination: async (data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    const response = await api.eliminations.create(token, data as unknown as Record<string, unknown>);

    if (response.success && response.data) {
      const newElimination = response.data as Elimination;
      set((state) => ({
        eliminations: [newElimination, ...state.eliminations],
        totalRecoveredMinutes: state.totalRecoveredMinutes + newElimination.recoveredMinutes,
        isLoading: false,
      }));
      return true;
    }

    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  clearError: () => set({ error: null }),
}));
