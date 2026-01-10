// ===========================================
// TimeBudget - Create Priority Use Case
// ===========================================

import type { IPriorityRepository } from '../../../domain/interfaces/repositories.js';
import type { CreatePriorityDto, PriorityResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { MaxPrioritiesExceededError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { MAX_PRIORITIES } from '../../../domain/entities/priority.entity.js';

export interface CreatePriorityDependencies {
  priorityRepository: IPriorityRepository;
}

export class CreatePriorityUseCase {
  constructor(private readonly deps: CreatePriorityDependencies) {}

  async execute(
    userId: string,
    dto: CreatePriorityDto
  ): Promise<Result<PriorityResponseDto, MaxPrioritiesExceededError | ValidationError>> {
    // Validar nombre
    if (!dto.name || dto.name.trim().length === 0) {
      return failure(new ValidationError('El nombre de la prioridad es requerido'));
    }

    // Verificar límite de prioridades activas
    const activeCount = await this.deps.priorityRepository.countActiveByUser(userId);
    if (activeCount >= MAX_PRIORITIES) {
      return failure(new MaxPrioritiesExceededError());
    }

    // Crear prioridad con el siguiente orden
    const priority = await this.deps.priorityRepository.create({
      userId,
      name: dto.name.trim(),
      description: dto.description?.trim(),
      order: activeCount + 1,
      allocatedMinutes: dto.allocatedMinutes ?? 0,
    });

    return success({
      id: priority.id,
      name: priority.name,
      description: priority.description,
      order: priority.order,
      allocatedMinutes: priority.allocatedMinutes,
      isActive: priority.isActive,
    });
  }
}
