// ===========================================
// TimeBudget - Calendar Block Store
// ===========================================

import { create } from 'zustand';
import type { CalendarBlock, BlockType, RecurrenceType } from '../shared/types';
import { api } from '../services/api';
import { useAuthStore } from './auth.store';

interface CreateCalendarBlockData {
  title: string;
  startTime: string;
  endTime: string;
  blockType: BlockType;
  isRecurring: boolean;
  recurrence?: RecurrenceType;
}

interface CalendarBlockState {
  blocks: CalendarBlock[];
  isLoading: boolean;
  error: string | null;
}

interface CalendarBlockActions {
  fetchCalendarBlocks: (weekStart?: string) => Promise<void>;
  createCalendarBlock: (data: CreateCalendarBlockData) => Promise<boolean>;
  deleteCalendarBlock: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useCalendarBlockStore = create<CalendarBlockState & CalendarBlockActions>((set, get) => ({
  blocks: [],
  isLoading: false,
  error: null,

  fetchCalendarBlocks: async (weekStart) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });

    const params = weekStart ? { weekStart } : undefined;
    const response = await api.calendarBlocks.getAll(token, params);

    if (response.success && response.data) {
      set({ blocks: response.data as CalendarBlock[], isLoading: false });
    } else {
      set({ error: response.error?.message, isLoading: false });
    }
  },

  createCalendarBlock: async (data) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    const response = await api.calendarBlocks.create(token, data);

    if (response.success && response.data) {
      const newBlock = response.data as CalendarBlock;
      set((state) => ({
        blocks: [...state.blocks, newBlock],
        isLoading: false,
      }));
      return true;
    }

    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  deleteCalendarBlock: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ isLoading: true, error: null });

    const response = await api.calendarBlocks.delete(token, id);

    if (response.success) {
      set((state) => ({
        blocks: state.blocks.filter((block) => block.id !== id),
        isLoading: false,
      }));
      return true;
    }

    set({ error: response.error?.message, isLoading: false });
    return false;
  },

  clearError: () => set({ error: null }),
}));
