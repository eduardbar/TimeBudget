// ===========================================
// TimeBudget - API Service
// ===========================================

import type { ApiResponse } from '../shared/types';

const API_BASE = '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Error de conexión',
      },
    };
  }
}

export const api = {
  // Auth
  auth: {
    register: (data: { email: string; password: string; name: string }) =>
      request<{ user: { id: string; email: string; name: string }; token: string }>('/auth/register', { method: 'POST', body: data }),
    
    login: (data: { email: string; password: string }) =>
      request<{ user: { id: string; email: string; name: string }; token: string }>('/auth/login', { method: 'POST', body: data }),
    
    me: (token: string) =>
      request<{ id: string; email: string; name: string }>('/auth/me', { token }),
  },

  // Categories
  categories: {
    getAll: () => request<Array<{ id: string; name: string; color: string; icon: string | null }>>('/categories'),
  },

  // TimeBudget
  timeBudget: {
    create: (token: string, data: Record<string, unknown>) =>
      request('/time-budget', { method: 'POST', body: data, token }),
    
    getCurrent: (token: string) =>
      request('/time-budget/current', { token }),
    
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/time-budget/${id}`, { method: 'PATCH', body: data, token }),
  },

  // Activities
  activities: {
    create: (token: string, data: Record<string, unknown>) =>
      request('/activities', { method: 'POST', body: data, token }),
    
    getAll: (token: string, params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/activities${query}`, { token });
    },
    
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/activities/${id}`, { method: 'PATCH', body: data, token }),
    
    delete: (token: string, id: string) =>
      request(`/activities/${id}`, { method: 'DELETE', token }),
  },

  // Priorities
  priorities: {
    create: (token: string, data: Record<string, unknown>) =>
      request('/priorities', { method: 'POST', body: data, token }),
    
    getAll: (token: string) =>
      request('/priorities', { token }),
    
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/priorities/${id}`, { method: 'PATCH', body: data, token }),
    
    reorder: (token: string, priorityIds: string[]) =>
      request('/priorities/reorder', { method: 'POST', body: { priorityIds }, token }),
    
    delete: (token: string, id: string) =>
      request(`/priorities/${id}`, { method: 'DELETE', token }),
  },

  // Calendar Blocks
  calendarBlocks: {
    create: (token: string, data: Record<string, unknown>) =>
      request('/calendar-blocks', { method: 'POST', body: data, token }),
    
    getAll: (token: string, params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/calendar-blocks${query}`, { token });
    },
    
    delete: (token: string, id: string) =>
      request(`/calendar-blocks/${id}`, { method: 'DELETE', token }),
  },

  // Eliminations
  eliminations: {
    create: (token: string, data: Record<string, unknown>) =>
      request('/eliminations', { method: 'POST', body: data, token }),
    
    getAll: (token: string) =>
      request('/eliminations', { token }),
  },

  // Weekly Reviews
  weeklyReviews: {
    getCurrent: (token: string, weekStart?: string) => {
      const query = weekStart ? `?weekStart=${weekStart}` : '';
      return request(`/weekly-reviews/current${query}`, { token });
    },
    
    complete: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/weekly-reviews/${id}/complete`, { method: 'POST', body: data, token }),
    
    getHistory: (token: string, limit?: number) => {
      const query = limit ? `?limit=${limit}` : '';
      return request(`/weekly-reviews/history${query}`, { token });
    },
  },

  // Analytics
  analytics: {
    getWeekly: (token: string, weekStart?: string) => {
      const query = weekStart ? `?weekStart=${weekStart}` : '';
      return request(`/analytics/weekly${query}`, { token });
    },
    
    getTrends: (token: string, weeks?: number) => {
      const query = weeks ? `?weeks=${weeks}` : '';
      return request(`/analytics/trends${query}`, { token });
    },
  },
};
