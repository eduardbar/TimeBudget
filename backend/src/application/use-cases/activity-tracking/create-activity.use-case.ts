// ===========================================
// TimeBudget - Create Activity Use Case
// ===========================================

import type { IActivityRepository, ICategoryRepository, ITimeBudgetRepository } from '../../../domain/interfaces/repositories.js';
import type { CreateActivityDto, ActivityResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { CategoryNotFoundError, InvalidActivityDurationError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { isValidDuration, isValidSatisfactionLevel } from '../../../domain/entities/activity.entity.js';
import { getWeekStart } from '../../../domain/entities/time-budget.entity.js';

export interface CreateActivityDependencies {
  activityRepository: IActivityRepository;
  categoryRepository: ICategoryRepository;
  timeBudgetRepository: ITimeBudgetRepository;
}

export class CreateActivityUseCase {
  constructor(private readonly deps: CreateActivityDependencies) {}

  async execute(
    userId: string,
    dto: CreateActivityDto
  ): Promise<Result<ActivityResponseDto, CategoryNotFoundError | InvalidActivityDurationError | ValidationError>> {
    // Validar duración
    if (!isValidDuration(dto.durationMinutes)) {
      return failure(new InvalidActivityDurationError());
    }

    // Validar nivel de satisfacción si se proporciona
    if (dto.satisfactionLevel !== undefined && !isValidSatisfactionLevel(dto.satisfactionLevel)) {
      return failure(new ValidationError('El nivel de satisfacción debe estar entre 1 y 5'));
    }

    // Verificar que la categoría existe
    const category = await this.deps.categoryRepository.findById(dto.categoryId);
    if (!category) {
      return failure(new CategoryNotFoundError());
    }

    // Buscar el presupuesto de la semana correspondiente
    const activityDate = new Date(dto.date);
    const weekStart = getWeekStart(activityDate);
    const timeBudget = await this.deps.timeBudgetRepository.findByUserAndWeek(userId, weekStart);

    // Crear actividad
    const activity = await this.deps.activityRepository.create({
      userId,
      timeBudgetId: timeBudget?.id,
      name: dto.name.trim(),
      description: dto.description?.trim(),
      categoryId: dto.categoryId,
      durationMinutes: dto.durationMinutes,
      date: activityDate,
      alignedWithPriorities: dto.alignedWithPriorities ?? false,
      satisfactionLevel: dto.satisfactionLevel,
    });

    return success({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      categoryId: activity.categoryId,
      categoryName: category.name,
      durationMinutes: activity.durationMinutes,
      date: activity.date.toISOString(),
      alignedWithPriorities: activity.alignedWithPriorities,
      satisfactionLevel: activity.satisfactionLevel,
      createdAt: activity.createdAt.toISOString(),
    });
  }
}
