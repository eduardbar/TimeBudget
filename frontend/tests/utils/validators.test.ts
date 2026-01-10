// ===========================================
// TimeBudget - Validators Tests
// ===========================================

import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidPassword,
  isNotEmpty,
  isInRange,
  isValidMinutes,
  isValidScore,
  isValidSatisfaction,
  isValidTimeRange,
  getEmailError,
  getPasswordError,
} from '../../src/shared/utils/validators'

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.org')).toBe(true)
    expect(isValidEmail('test+tag@example.co.uk')).toBe(true)
  })

  it('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('invalid@')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('test@.com')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('should return true for passwords with 6+ characters', () => {
    expect(isValidPassword('123456')).toBe(true)
    expect(isValidPassword('password123')).toBe(true)
    expect(isValidPassword('a very long password')).toBe(true)
  })

  it('should return false for passwords under 6 characters', () => {
    expect(isValidPassword('')).toBe(false)
    expect(isValidPassword('12345')).toBe(false)
    expect(isValidPassword('abc')).toBe(false)
  })
})

describe('isNotEmpty', () => {
  it('should return true for non-empty strings', () => {
    expect(isNotEmpty('hello')).toBe(true)
    expect(isNotEmpty('  hello  ')).toBe(true)
    expect(isNotEmpty('a')).toBe(true)
  })

  it('should return false for empty strings', () => {
    expect(isNotEmpty('')).toBe(false)
    expect(isNotEmpty('   ')).toBe(false)
    expect(isNotEmpty('\t\n')).toBe(false)
  })
})

describe('isInRange', () => {
  it('should return true when value is in range', () => {
    expect(isInRange(5, 1, 10)).toBe(true)
    expect(isInRange(1, 1, 10)).toBe(true)
    expect(isInRange(10, 1, 10)).toBe(true)
  })

  it('should return false when value is out of range', () => {
    expect(isInRange(0, 1, 10)).toBe(false)
    expect(isInRange(11, 1, 10)).toBe(false)
    expect(isInRange(-5, 1, 10)).toBe(false)
  })
})

describe('isValidMinutes', () => {
  it('should return true for positive integers', () => {
    expect(isValidMinutes(1)).toBe(true)
    expect(isValidMinutes(30)).toBe(true)
    expect(isValidMinutes(1440)).toBe(true)
  })

  it('should return false for non-positive or non-integer values', () => {
    expect(isValidMinutes(0)).toBe(false)
    expect(isValidMinutes(-10)).toBe(false)
    expect(isValidMinutes(30.5)).toBe(false)
  })
})

describe('isValidScore', () => {
  it('should return true for scores between 1 and 10', () => {
    expect(isValidScore(1)).toBe(true)
    expect(isValidScore(5)).toBe(true)
    expect(isValidScore(10)).toBe(true)
  })

  it('should return false for scores outside 1-10', () => {
    expect(isValidScore(0)).toBe(false)
    expect(isValidScore(11)).toBe(false)
    expect(isValidScore(-1)).toBe(false)
  })
})

describe('isValidSatisfaction', () => {
  it('should return true for satisfaction levels between 1 and 5', () => {
    expect(isValidSatisfaction(1)).toBe(true)
    expect(isValidSatisfaction(3)).toBe(true)
    expect(isValidSatisfaction(5)).toBe(true)
  })

  it('should return false for values outside 1-5', () => {
    expect(isValidSatisfaction(0)).toBe(false)
    expect(isValidSatisfaction(6)).toBe(false)
  })
})

describe('isValidTimeRange', () => {
  it('should return true when end is after start', () => {
    expect(isValidTimeRange('2024-01-01T09:00:00', '2024-01-01T17:00:00')).toBe(true)
    expect(isValidTimeRange('2024-01-01T09:00:00', '2024-01-02T09:00:00')).toBe(true)
  })

  it('should return false when end is before or equal to start', () => {
    expect(isValidTimeRange('2024-01-01T17:00:00', '2024-01-01T09:00:00')).toBe(false)
    expect(isValidTimeRange('2024-01-01T09:00:00', '2024-01-01T09:00:00')).toBe(false)
  })
})

describe('getEmailError', () => {
  it('should return null for valid email', () => {
    expect(getEmailError('test@example.com')).toBeNull()
  })

  it('should return error message for empty email', () => {
    expect(getEmailError('')).toBe('El email es requerido')
  })

  it('should return error message for invalid email', () => {
    expect(getEmailError('invalid')).toBe('Formato de email inválido')
  })
})

describe('getPasswordError', () => {
  it('should return null for valid password', () => {
    expect(getPasswordError('password123')).toBeNull()
  })

  it('should return error message for empty password', () => {
    expect(getPasswordError('')).toBe('La contraseña es requerida')
  })

  it('should return error message for short password', () => {
    expect(getPasswordError('12345')).toBe('La contraseña debe tener al menos 6 caracteres')
  })
})
