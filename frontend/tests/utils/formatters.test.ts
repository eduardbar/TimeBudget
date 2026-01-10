// ===========================================
// TimeBudget - Formatters Tests
// ===========================================

import { describe, it, expect } from 'vitest'
import {
  formatMinutes,
  formatMinutesToHours,
  formatPercentage,
  formatNumber,
} from '../../src/shared/utils/formatters'

describe('formatMinutes', () => {
  it('should return "0m" for zero minutes', () => {
    expect(formatMinutes(0)).toBe('0m')
  })

  it('should return "0m" for negative minutes', () => {
    expect(formatMinutes(-10)).toBe('0m')
  })

  it('should return only minutes when less than 60', () => {
    expect(formatMinutes(30)).toBe('30m')
    expect(formatMinutes(45)).toBe('45m')
  })

  it('should return only hours when exact hours', () => {
    expect(formatMinutes(60)).toBe('1h')
    expect(formatMinutes(120)).toBe('2h')
    expect(formatMinutes(180)).toBe('3h')
  })

  it('should return hours and minutes for mixed values', () => {
    expect(formatMinutes(90)).toBe('1h 30m')
    expect(formatMinutes(150)).toBe('2h 30m')
    expect(formatMinutes(75)).toBe('1h 15m')
  })
})

describe('formatMinutesToHours', () => {
  it('should convert minutes to hours with one decimal', () => {
    expect(formatMinutesToHours(60)).toBe('1.0h')
    expect(formatMinutesToHours(90)).toBe('1.5h')
    expect(formatMinutesToHours(45)).toBe('0.8h')
    expect(formatMinutesToHours(120)).toBe('2.0h')
  })

  it('should handle zero minutes', () => {
    expect(formatMinutesToHours(0)).toBe('0.0h')
  })
})

describe('formatPercentage', () => {
  it('should format decimal values as percentage', () => {
    expect(formatPercentage(0.5)).toBe('50%')
    expect(formatPercentage(0.856)).toBe('86%')
    expect(formatPercentage(1)).toBe('100%')
  })

  it('should handle values already as percentage', () => {
    expect(formatPercentage(50)).toBe('50%')
    expect(formatPercentage(85.6)).toBe('86%')
  })

  it('should respect decimal places parameter', () => {
    expect(formatPercentage(0.8567, 1)).toBe('85.7%')
    expect(formatPercentage(0.8567, 2)).toBe('85.67%')
  })
})

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    // Note: es-ES uses . as thousand separator
    expect(formatNumber(1000)).toMatch(/1[.\s]?000/)
    expect(formatNumber(1234567)).toMatch(/1[.\s]?234[.\s]?567/)
  })

  it('should handle small numbers', () => {
    expect(formatNumber(100)).toBe('100')
    expect(formatNumber(0)).toBe('0')
  })
})
