// ===========================================
// TimeBudget - Mock Services
// ===========================================

import { vi } from 'vitest';

export const createMockPasswordService = () => ({
  hash: vi.fn(),
  compare: vi.fn(),
});

export const createMockTokenService = () => ({
  generate: vi.fn(),
  verify: vi.fn(),
});
