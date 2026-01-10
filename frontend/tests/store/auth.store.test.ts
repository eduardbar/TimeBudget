// ===========================================
// TimeBudget - Auth Store Tests
// ===========================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../../src/store/auth.store'
import { api } from '../../src/services/api'

// Mock the API
vi.mock('../../src/services/api', () => ({
  api: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      me: vi.fn(),
    },
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
      const mockToken = 'mock-jwt-token'

      vi.mocked(api.auth.login).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: mockToken },
      })

      const result = await useAuthStore.getState().login('test@example.com', 'password')

      expect(result).toBe(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().token).toBe(mockToken)
      expect(useAuthStore.getState().error).toBeNull()
    })

    it('should set error on failed login', async () => {
      vi.mocked(api.auth.login).mockResolvedValue({
        success: false,
        error: { message: 'Invalid credentials' },
      })

      const result = await useAuthStore.getState().login('test@example.com', 'wrong')

      expect(result).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().error).toBe('Invalid credentials')
    })

    it('should set isLoading during login', async () => {
      let resolveLogin: Function
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve
      })

      vi.mocked(api.auth.login).mockReturnValue(loginPromise as any)

      const loginCall = useAuthStore.getState().login('test@example.com', 'password')

      expect(useAuthStore.getState().isLoading).toBe(true)

      resolveLogin!({ success: true, data: { user: {}, token: 'token' } })
      await loginCall

      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('register', () => {
    it('should register successfully', async () => {
      const mockUser = { id: '1', email: 'new@example.com', name: 'New User' }
      const mockToken = 'mock-jwt-token'

      vi.mocked(api.auth.register).mockResolvedValue({
        success: true,
        data: { user: mockUser, token: mockToken },
      })

      const result = await useAuthStore.getState().register('new@example.com', 'password', 'New User')

      expect(result).toBe(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().token).toBe(mockToken)
    })

    it('should set error on failed registration', async () => {
      vi.mocked(api.auth.register).mockResolvedValue({
        success: false,
        error: { message: 'Email already exists' },
      })

      const result = await useAuthStore.getState().register('existing@example.com', 'password', 'User')

      expect(result).toBe(false)
      expect(useAuthStore.getState().error).toBe('Email already exists')
    })
  })

  describe('logout', () => {
    it('should clear all auth state', () => {
      // Set up authenticated state
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com', name: 'Test' },
        token: 'token',
        isAuthenticated: true,
        error: 'some error',
      })

      useAuthStore.getState().logout()

      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().token).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().error).toBeNull()
    })
  })

  describe('checkAuth', () => {
    it('should verify token and update user', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test' }

      useAuthStore.setState({ token: 'valid-token' })

      vi.mocked(api.auth.me).mockResolvedValue({
        success: true,
        data: mockUser,
      })

      await useAuthStore.getState().checkAuth()

      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().user).toEqual(mockUser)
    })

    it('should clear auth state on invalid token', async () => {
      useAuthStore.setState({
        token: 'invalid-token',
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', name: 'Test' },
      })

      vi.mocked(api.auth.me).mockResolvedValue({
        success: false,
        error: { message: 'Invalid token' },
      })

      await useAuthStore.getState().checkAuth()

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().token).toBeNull()
    })

    it('should not make API call without token', async () => {
      useAuthStore.setState({ token: null })

      await useAuthStore.getState().checkAuth()

      expect(api.auth.me).not.toHaveBeenCalled()
    })
  })

  describe('clearError', () => {
    it('should clear the error', () => {
      useAuthStore.setState({ error: 'Some error' })

      useAuthStore.getState().clearError()

      expect(useAuthStore.getState().error).toBeNull()
    })
  })
})
