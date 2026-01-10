// ===========================================
// TimeBudget - Update Activity Use Case
// ===========================================

import type { IActivityRepository, ICategoryRepository } from '../../../domain/interfaces/repositories.js';
import type { UpdateActivityDto, ActivityResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { ActivityNotFoundError, CategoryNotFoundError, InvalidActivityDurationError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { isValidDuration, isValidSatisfactionLevel } from '../../../domain/entities/activity.entity.js';

export interface UpdateActivityDependencies {
  activityRepository: IActivityRepository;
  categoryRepository: ICategoryRepository;
}

export class UpdateActivityUseCase {
  constructor(private readonly deps: UpdateActivityDependencies) {}

  async execute(
    userId: string,
    activityId: string,
    dto: UpdateActivityDto
  ): Promise<Result<ActivityResponseDto, ActivityNotFoundError | CategoryNotFoundError | InvalidActivityDurationError | ValidationError>> {
    // Obtener actividad existente
    const existing = await this.deps.activityRepository.findById(activityId);

    if (!existing || existing.userId !== userId) {
      return failure(new ActivityNotFoundError());
    }

    // Validar duración si se proporciona
    if (dto.durationMinutes !== undefined && !isValidDuration(dto.durationMinutes)) {
      return failure(new InvalidActivityDurationError());
    }

    // Validar nivel de satisfacción si se proporciona
    if (dto.satisfactionLevel !== undefined && !isValidSatisfactionLevel(dto.satisfactionLevel)) {
      return failure(new ValidationError('El nivel de satisfacción debe estar entre 1 y 5'));
    }

    // Verificar categoría si se cambia
    let categoryName = '';
    if (dto.categoryId) {
      const category = await this.deps.categoryRepository.findById(dto.categoryId);
      if (!category) {
        return failure(new CategoryNotFoundError());
      }
      categoryName = category.name;
    } else {
      const category = await this.deps.categoryRepository.findById(existing.categoryId);
      categoryName = category?.name || '';
    }

    // Actualizar actividad
    const updated = await this.deps.activityRepository.update(activityId, {
      name: dto.name?.trim(),
      description: dto.description?.trim(),
      categoryId: dto.categoryId,
      durationMinutes: dto.durationMinutes,
      date: dto.date ? new Date(dto.date) : undefined,
      alignedWithPriorities: dto.alignedWithPriorities,
      satisfactionLevel: dto.satisfactionLevel,
    });

    return success({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      categoryId: updated.categoryId,
      categoryName,
      durationMinutes: updated.durationMinutes,
      date: updated.date.toISOString(),
      alignedWithPriorities: updated.alignedWithPriorities,
      satisfactionLevel: updated.satisfactionLevel,
      createdAt: updated.createdAt.toISOString(),
    });
  }
}
