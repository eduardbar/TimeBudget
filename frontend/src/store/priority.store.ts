// ===========================================
// TimeBudget - Priority Store
// ===========================================

import { create } from 'zustand';
import type { Priority } from '../shared/types';
import { api } from '../services/api';
import { useAuthStore } from './auth.store';

interface PriorityState {
  priorities: Priority[];
  isLoading: boolean;
  error: string | null;
}

interface PriorityActions {
  fetchPriorities: () => Promise<void>;
  createPriority: (data: { name: string; description?: string; allocatedMinutes?: number }) => Promise<boolean>;
  updatePriority: (id: string, data: Partial<Priority>) => Promise<boolean>;
  reorderPriorities: (priorityIds: string[]) => Promise<boolean>;
  deletePriority: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const usePriorityStore = create<PriorityState & PriorityActions>((set) => ({
  priorities: [],
  isLoading: false,
  error: null,

  fetchPriorities: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    
    const response = await api.priorities.getAll(token);
    
    if (response.success && response.data) {
      set({ priorities: response.data as Priority[], isLoading: false });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  createPriority: async (data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.priorities.create(token, data);
    
    if (response.success && response.data) {
      const newPriority = response.data as Priority;
      set(state => ({
        priorities: [...state.priorities, newPriority],
        isLoading: false,
      }));
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  updatePriority: async (id, data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.priorities.update(token, id, data);
    
    if (response.success && response.data) {
      const updatedPriority = response.data as Priority;
      set(state => ({
        priorities: state.priorities.map(p => p.id === id ? updatedPriority : p),
        isLoading: false,
      }));
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  reorderPriorities: async (priorityIds) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.priorities.reorder(token, priorityIds);
    
    if (response.success && response.data) {
      set({ priorities: response.data as Priority[], isLoading: false });
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  deletePriority: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.priorities.delete(token, id);
    
    if (response.success) {
      set(state => ({
        priorities: state.priorities.filter(p => p.id !== id),
        isLoading: false,
      }));
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  clearError: () => set({ error: null }),
}));
