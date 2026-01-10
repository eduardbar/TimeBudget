// ===========================================
// TimeBudget - Register User Use Case Tests
// ===========================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUserUseCase, RegisterUserDependencies } from '../../../src/application/use-cases/auth/register-user.use-case';
import { EmailAlreadyExistsError, ValidationError } from '../../../src/domain/errors/domain-errors';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockDeps: RegisterUserDependencies;

  beforeEach(() => {
    mockDeps = {
      userRepository: {
        findById: vi.fn(),
        findByEmail: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      passwordHasher: {
        hash: vi.fn(),
      },
      tokenGenerator: {
        generate: vi.fn(),
      },
    };
    useCase = new RegisterUserUseCase(mockDeps);
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createdUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockDeps.passwordHasher.hash).mockResolvedValue('hashed-password');
      vi.mocked(mockDeps.userRepository.create).mockResolvedValue(createdUser);
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
      expect(mockDeps.userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockDeps.passwordHasher.hash).toHaveBeenCalledWith('password123');
    });

    it('should fail if email already exists', async () => {
      // Arrange
      const dto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const existingUser = {
        id: 'existing-user',
        email: 'existing@example.com',
        password: 'hashed',
        name: 'Existing',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.userRepository.findByEmail).mockResolvedValue(existingUser);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(EmailAlreadyExistsError);
      }
    });

    it('should fail if email is missing', async () => {
      // Arrange
      const dto = {
        email: '',
        password: 'password123',
        name: 'Test User',
      };

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('should fail if password is too short', async () => {
      // Arrange
      const dto = {
        email: 'test@example.com',
        password: 'short',
        name: 'Test User',
      };

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.message).toContain('8 caracteres');
      }
    });

    it('should normalize email to lowercase', async () => {
      // Arrange
      const dto = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
        name: 'Test User',
      };

      const createdUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockDeps.passwordHasher.hash).mockResolvedValue('hashed-password');
      vi.mocked(mockDeps.userRepository.create).mockResolvedValue(createdUser);
      vi.mocked(mockDeps.tokenGenerator.generate).mockReturnValue('jwt-token');

      // Act
      await useCase.execute(dto);

      // Assert
      expect(mockDeps.userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
        })
      );
    });
  });
});
