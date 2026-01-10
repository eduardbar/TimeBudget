// ===========================================
// TimeBudget - Login User Use Case Tests
// ===========================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUserUseCase, LoginUserDependencies } from '../../../src/application/use-cases/auth/login-user.use-case';
import { InvalidCredentialsError, ValidationError } from '../../../src/domain/errors/domain-errors';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let mockDeps: LoginUserDependencies;

  beforeEach(() => {
    mockDeps = {
      userRepository: {
        findById: vi.fn(),
        findByEmail: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      passwordComparer: {
        compare: vi.fn(),
      },
      tokenGenerator: {
        generate: vi.fn(),
      },
    };
    useCase = new LoginUserUseCase(mockDeps);
  });

  describe('execute', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.userRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(mockDeps.passwordComparer.compare).mockResolvedValue(true);
      vi.mocked(mockDeps.tokenGenerator.generate).mockReturnValue('jwt-token');

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.user.email).toBe('test@example.com');
        expect(result.value.user.name).toBe('Test User');
        expect(result.value.token).toBe('jwt-token');
      }
    });

    it('should fail if user does not exist', async () => {
      // Arrange
      const dto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      vi.mocked(mockDeps.userRepository.findByEmail).mockResolvedValue(null);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCredentialsError);
      }
    });

    it('should fail if password is incorrect', async () => {
      // Arrange
      const dto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.userRepository.findByEmail).mockResolvedValue(existingUser);
      vi.mocked(mockDeps.passwordComparer.compare).mockResolvedValue(false);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(InvalidCredentialsError);
      }
    });

    it('should fail if email is missing', async () => {
      // Arrange
      const dto = {
        email: '',
        password: 'password123',
      };

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('should fail if password is missing', async () => {
      // Arrange
      const dto = {
        email: 'test@example.com',
        password: '',
      };

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('should normalize email to lowercase before lookup', async () => {
      // Arrange
      const dto = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      };

      vi.mocked(mockDeps.userRepository.findByEmail).mockResolvedValue(null);

      // Act
      await useCase.execute(dto);

      // Assert
      expect(mockDeps.userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});
