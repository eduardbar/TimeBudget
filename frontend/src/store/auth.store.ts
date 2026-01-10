// ===========================================
// TimeBudget - Auth Store
// ===========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../shared/types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        const response = await api.auth.login({ email, password });
        
        if (response.success && response.data) {
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        
        set({
          error: response.error?.message || 'Error al iniciar sesión',
          isLoading: false,
        });
        return false;
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        
        const response = await api.auth.register({ email, password, name });
        
        if (response.success && response.data) {
          set({
            user: response.data.user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        
        set({
          error: response.error?.message || 'Error al registrarse',
          isLoading: false,
        });
        return false;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        
        const response = await api.auth.me(token);
        
        if (response.success && response.data) {
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'timebudget-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
