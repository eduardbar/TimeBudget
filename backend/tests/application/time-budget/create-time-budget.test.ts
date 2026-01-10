// ===========================================
// TimeBudget - Create Time Budget Use Case Tests
// ===========================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTimeBudgetUseCase, CreateTimeBudgetDependencies } from '../../../src/application/use-cases/time-budget/create-time-budget.use-case';
import { TimeBudgetAlreadyExistsError, ValidationError } from '../../../src/domain/errors/domain-errors';

describe('CreateTimeBudgetUseCase', () => {
  let useCase: CreateTimeBudgetUseCase;
  let mockDeps: CreateTimeBudgetDependencies;

  beforeEach(() => {
    mockDeps = {
      timeBudgetRepository: {
        findById: vi.fn(),
        findByUserAndWeek: vi.fn(),
        findCurrentByUser: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
    useCase = new CreateTimeBudgetUseCase(mockDeps);
  });

  describe('execute', () => {
    const userId = 'user-123';

    it('should create a time budget with default values', async () => {
      // Arrange
      const dto = {};

      const createdBudget = {
        id: 'budget-123',
        userId,
        weekStart: new Date('2024-01-08'),
        sleepMinutes: 3360,
        workMinutes: 2400,
        mealsMinutes: 630,
        hygieneMinutes: 420,
        transportMinutes: 300,
        availableMinutes: 2970,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.timeBudgetRepository.findByUserAndWeek).mockResolvedValue(null);
      vi.mocked(mockDeps.timeBudgetRepository.create).mockResolvedValue(createdBudget);

      // Act
      const result = await useCase.execute(userId, dto);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.sleepMinutes).toBe(3360);
        expect(result.value.workMinutes).toBe(2400);
      }
    });

    it('should create a time budget with custom values', async () => {
      // Arrange
      const dto = {
        sleepMinutes: 3000,
        workMinutes: 2000,
        mealsMinutes: 500,
        hygieneMinutes: 350,
        transportMinutes: 200,
      };

      const createdBudget = {
        id: 'budget-123',
        userId,
        weekStart: new Date('2024-01-08'),
        ...dto,
        availableMinutes: 4030,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.timeBudgetRepository.findByUserAndWeek).mockResolvedValue(null);
      vi.mocked(mockDeps.timeBudgetRepository.create).mockResolvedValue(createdBudget);

      // Act
      const result = await useCase.execute(userId, dto);

      // Assert
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.sleepMinutes).toBe(3000);
        expect(result.value.workMinutes).toBe(2000);
      }
    });

    it('should fail if budget already exists for the week', async () => {
      // Arrange
      const dto = {};

      const existingBudget = {
        id: 'existing-budget',
        userId,
        weekStart: new Date('2024-01-08'),
        sleepMinutes: 3360,
        workMinutes: 2400,
        mealsMinutes: 630,
        hygieneMinutes: 420,
        transportMinutes: 300,
        availableMinutes: 2970,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockDeps.timeBudgetRepository.findByUserAndWeek).mockResolvedValue(existingBudget);

      // Act
      const result = await useCase.execute(userId, dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(TimeBudgetAlreadyExistsError);
      }
    });

    it('should fail if values are negative', async () => {
      // Arrange
      const dto = {
        sleepMinutes: -100,
      };

      vi.mocked(mockDeps.timeBudgetRepository.findByUserAndWeek).mockResolvedValue(null);

      // Act
      const result = await useCase.execute(userId, dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.message).toContain('positivos');
      }
    });

    it('should fail if base budget exceeds week hours', async () => {
      // Arrange
      const dto = {
        sleepMinutes: 5000,
        workMinutes: 5000,
        mealsMinutes: 1000,
        hygieneMinutes: 500,
        transportMinutes: 500,
      };

      vi.mocked(mockDeps.timeBudgetRepository.findByUserAndWeek).mockResolvedValue(null);

      // Act
      const result = await useCase.execute(userId, dto);

      // Assert
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.message).toContain('excede');
      }
    });
  });
});
