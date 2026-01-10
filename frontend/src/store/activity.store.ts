// ===========================================
// TimeBudget - Activity Store
// ===========================================

import { create } from 'zustand';
import type { Activity, Category } from '../shared/types';
import { api } from '../services/api';
import { useAuthStore } from './auth.store';

interface ActivityState {
  activities: Activity[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface ActivityActions {
  fetchActivities: (params?: Record<string, string>) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createActivity: (data: Record<string, unknown>) => Promise<boolean>;
  updateActivity: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  deleteActivity: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useActivityStore = create<ActivityState & ActivityActions>((set) => ({
  activities: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchActivities: async (params) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    
    const response = await api.activities.getAll(token, params);
    
    if (response.success && response.data) {
      set({ activities: response.data as Activity[], isLoading: false });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    const response = await api.categories.getAll();
    
    if (response.success && response.data) {
      set({ categories: response.data as Category[] });
    }
  },

  createActivity: async (data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.activities.create(token, data);
    
    if (response.success && response.data) {
      const newActivity = response.data as Activity;
      set(state => ({
        activities: [newActivity, ...state.activities],
        isLoading: false,
      }));
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  updateActivity: async (id, data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.activities.update(token, id, data);
    
    if (response.success && response.data) {
      const updatedActivity = response.data as Activity;
      set(state => ({
        activities: state.activities.map(a => a.id === id ? updatedActivity : a),
        isLoading: false,
      }));
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  deleteActivity: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.activities.delete(token, id);
    
    if (response.success) {
      set(state => ({
        activities: state.activities.filter(a => a.id !== id),
        isLoading: false,
      }));
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  clearError: () => set({ error: null }),
}));
