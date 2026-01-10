// ===========================================
// TimeBudget - Password Service Tests
// ===========================================

import { describe, it, expect } from 'vitest';
import { passwordService } from '../../../src/infrastructure/services/password.service';

describe('passwordService', () => {
  describe('hash', () => {
    it('should hash a password', async () => {
      // Arrange
      const password = 'testPassword123';

      // Act
      const hash = await passwordService.hash(password);

      // Assert
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      // Arrange
      const password = 'testPassword123';

      // Act
      const hash1 = await passwordService.hash(password);
      const hash2 = await passwordService.hash(password);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      // Arrange
      const password = 'testPassword123';
      const hash = await passwordService.hash(password);

      // Act
      const result = await passwordService.compare(password, hash);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      // Arrange
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await passwordService.hash(password);

      // Act
      const result = await passwordService.compare(wrongPassword, hash);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty password', async () => {
      // Arrange
      const password = 'testPassword123';
      const hash = await passwordService.hash(password);

      // Act
      const result = await passwordService.compare('', hash);

      // Assert
      expect(result).toBe(false);
    });
  });
});
