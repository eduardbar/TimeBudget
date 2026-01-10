// ===========================================
// TimeBudget - Mock Repositories
// ===========================================

import { vi } from 'vitest';
import type { IUserRepository, ITimeBudgetRepository } from '../../src/domain/interfaces/repositories';

export const createMockUserRepository = (): IUserRepository => ({
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const createMockTimeBudgetRepository = (): ITimeBudgetRepository => ({
  findById: vi.fn(),
  findByUserAndWeek: vi.fn(),
  findCurrentByUser: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
