// ===========================================
// TimeBudget - Test Setup
// ===========================================

import { vi } from 'vitest';

// Mock Prisma Client
vi.mock('./src/infrastructure/database/prisma/client', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    timeBudget: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    activity: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    priority: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    calendarBlock: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    elimination: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    weeklyReview: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({
      user: { findUnique: vi.fn(), create: vi.fn() },
      priority: { update: vi.fn() },
    })),
  },
}));

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
