// ===========================================
// TimeBudget - Analytics Store
// ===========================================

import { create } from 'zustand';
import type { WeeklyAnalytics, TrendData, WeeklyReview } from '../shared/types';
import { api } from '../services/api';
import { useAuthStore } from './auth.store';

interface AnalyticsState {
  weeklyAnalytics: WeeklyAnalytics | null;
  trends: TrendData[];
  currentReview: WeeklyReview | null;
  reviewHistory: WeeklyReview[];
  isLoading: boolean;
  error: string | null;
}

interface AnalyticsActions {
  fetchWeeklyAnalytics: (weekStart?: string) => Promise<void>;
  fetchTrends: (weeks?: number) => Promise<void>;
  fetchCurrentReview: (weekStart?: string) => Promise<void>;
  fetchReviewHistory: (limit?: number) => Promise<void>;
  completeReview: (id: string, data: {
    wins: string[];
    challenges: string[];
    improvements: string[];
    overallScore: number;
  }) => Promise<boolean>;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>((set) => ({
  weeklyAnalytics: null,
  trends: [],
  currentReview: null,
  reviewHistory: [],
  isLoading: false,
  error: null,

  fetchWeeklyAnalytics: async (weekStart) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    
    const response = await api.analytics.getWeekly(token, weekStart);
    
    if (response.success && response.data) {
      set({ weeklyAnalytics: response.data as WeeklyAnalytics, isLoading: false });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  fetchTrends: async (weeks) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    
    const response = await api.analytics.getTrends(token, weeks);
    
    if (response.success && response.data) {
      set({ trends: response.data as TrendData[], isLoading: false });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  fetchCurrentReview: async (weekStart) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    
    const response = await api.weeklyReviews.getCurrent(token, weekStart);
    
    if (response.success && response.data) {
      set({ currentReview: response.data as WeeklyReview, isLoading: false });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  fetchReviewHistory: async (limit) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    
    const response = await api.weeklyReviews.getHistory(token, limit);
    
    if (response.success && response.data) {
      set({ reviewHistory: response.data as WeeklyReview[], isLoading: false });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  completeReview: async (id, data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });
    
    const response = await api.weeklyReviews.complete(token, id, data);
    
    if (response.success && response.data) {
      set({ currentReview: response.data as WeeklyReview, isLoading: false });
      return true;
    }
    
    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  clearError: () => set({ error: null }),
}));
