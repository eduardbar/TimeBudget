// ===========================================
// TimeBudget - Update Priority Use Case
// ===========================================

import type { IPriorityRepository } from '../../../domain/interfaces/repositories.js';
import type { UpdatePriorityDto, PriorityResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { PriorityNotFoundError, ValidationError } from '../../../domain/errors/domain-errors.js';

export interface UpdatePriorityDependencies {
  priorityRepository: IPriorityRepository;
}

export class UpdatePriorityUseCase {
  constructor(private readonly deps: UpdatePriorityDependencies) {}

  async execute(
    userId: string,
    priorityId: string,
    dto: UpdatePriorityDto
  ): Promise<Result<PriorityResponseDto, PriorityNotFoundError | ValidationError>> {
    // Obtener prioridad existente
    const existing = await this.deps.priorityRepository.findById(priorityId);

    if (!existing || existing.userId !== userId) {
      return failure(new PriorityNotFoundError());
    }

    // Validar tiempo asignado
    if (dto.allocatedMinutes !== undefined && dto.allocatedMinutes < 0) {
      return failure(new ValidationError('El tiempo asignado debe ser positivo'));
    }

    // Actualizar prioridad
    const updated = await this.deps.priorityRepository.update(priorityId, {
      name: dto.name?.trim(),
      description: dto.description?.trim(),
      allocatedMinutes: dto.allocatedMinutes,
      isActive: dto.isActive,
    });

    return success({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      order: updated.order,
      allocatedMinutes: updated.allocatedMinutes,
      isActive: updated.isActive,
    });
  }
}
