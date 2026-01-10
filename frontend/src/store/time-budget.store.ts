// ===========================================
// TimeBudget - TimeBudget Store
// ===========================================

import { create } from 'zustand';
import type { TimeBudget } from '../shared/types';
import { api } from '../services/api';
import { useAuthStore } from './auth.store';

interface TimeBudgetState {
  currentBudget: TimeBudget | null;
  isLoading: boolean;
  error: string | null;
}

interface TimeBudgetActions {
  fetchCurrentBudget: () => Promise<void>;
  createBudget: (data: Partial<TimeBudget>) => Promise<boolean>;
  updateBudget: (id: string, data: Partial<TimeBudget>) => Promise<boolean>;
  clearError: () => void;
}

export const useTimeBudgetStore = create<TimeBudgetState & TimeBudgetActions>((set) => ({
  currentBudget: null,
  isLoading: false,
  error: null,

  fetchCurrentBudget: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    
    const response = await api.timeBudget.getCurrent(token);
    
    if (response.success && response.data) {
      set({ currentBudget: response.data as TimeBudget, isLoading: false });
    } else {
      set({ 
        currentBudget: null, 
        isLoading: false,
        // No es error si simplemente no hay presupuesto
        error: response.error?.code === 'BUDGET_NOT_FOUND' ? null : response.error?.message,
      });
    }
  },

  createBudget: async (data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.timeBudget.create(token, data);
    
    if (response.success && response.data) {
      set({ currentBudget: response.data as TimeBudget, isLoading: false });
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  updateBudget: async (id, data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.timeBudget.update(token, id, data);
    
    if (response.success && response.data) {
      set({ currentBudget: response.data as TimeBudget, isLoading: false });
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  clearError: () => set({ error: null }),
}));
