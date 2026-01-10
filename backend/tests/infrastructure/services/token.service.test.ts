// ===========================================
// TimeBudget - Token Service Tests
// ===========================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock config before importing tokenService
vi.mock('../../../src/infrastructure/config/index.js', () => ({
  config: {
    jwt: {
      secret: 'test-secret-key-for-testing-only',
      expiresIn: '1h',
    },
  },
}));

// Import after mock
import { tokenService } from '../../../src/infrastructure/services/token.service';

describe('tokenService', () => {
  describe('generate', () => {
    it('should generate a valid JWT token', () => {
      // Arrange
      const userId = 'user-123';

      // Act
      const token = tokenService.generate(userId);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different users', () => {
      // Arrange
      const userId1 = 'user-123';
      const userId2 = 'user-456';

      // Act
      const token1 = tokenService.generate(userId1);
      const token2 = tokenService.generate(userId2);

      // Assert
      expect(token1).not.toBe(token2);
    });
  });

  describe('verify', () => {
    it('should verify a valid token and return payload', () => {
      // Arrange
      const userId = 'user-123';
      const token = tokenService.generate(userId);

      // Act
      const payload = tokenService.verify(token);

      // Assert
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(userId);
    });

    it('should return null for invalid token', () => {
      // Arrange
      const invalidToken = 'invalid.token.string';

      // Act
      const payload = tokenService.verify(invalidToken);

      // Assert
      expect(payload).toBeNull();
    });

    it('should return null for empty token', () => {
      // Arrange
      const emptyToken = '';

      // Act
      const payload = tokenService.verify(emptyToken);

      // Assert
      expect(payload).toBeNull();
    });
  });

  describe('decode', () => {
    it('should decode a token without verifying', () => {
      // Arrange
      const userId = 'user-123';
      const token = tokenService.generate(userId);

      // Act
      const payload = tokenService.decode(token);

      // Assert
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(userId);
    });

    it('should return null for invalid token structure', () => {
      // Arrange
      const invalidToken = 'not-a-jwt';

      // Act
      const payload = tokenService.decode(invalidToken);

      // Assert
      expect(payload).toBeNull();
    });
  });
});
