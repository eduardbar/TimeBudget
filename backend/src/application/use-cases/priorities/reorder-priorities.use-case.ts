// ===========================================
// TimeBudget - Reorder Priorities Use Case
// ===========================================

import type { IPriorityRepository } from '../../../domain/interfaces/repositories.js';
import type { ReorderPrioritiesDto, PriorityResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { ValidationError } from '../../../domain/errors/domain-errors.js';
import { MAX_PRIORITIES } from '../../../domain/entities/priority.entity.js';

export interface ReorderPrioritiesDependencies {
  priorityRepository: IPriorityRepository;
}

export class ReorderPrioritiesUseCase {
  constructor(private readonly deps: ReorderPrioritiesDependencies) {}

  async execute(
    userId: string,
    dto: ReorderPrioritiesDto
  ): Promise<Result<PriorityResponseDto[], ValidationError>> {
    // Validar cantidad de IDs
    if (dto.priorityIds.length > MAX_PRIORITIES) {
      return failure(new ValidationError(`No puedes tener más de ${MAX_PRIORITIES} prioridades`));
    }

    // Verificar que todas las prioridades pertenecen al usuario
    const userPriorities = await this.deps.priorityRepository.findActiveByUser(userId);
    const userPriorityIds = new Set(userPriorities.map(p => p.id));

    for (const id of dto.priorityIds) {
      if (!userPriorityIds.has(id)) {
        return failure(new ValidationError('Una o más prioridades no pertenecen al usuario'));
      }
    }

    // Reordenar
    await this.deps.priorityRepository.reorder(userId, dto.priorityIds);

    // Obtener prioridades actualizadas
    const updated = await this.deps.priorityRepository.findActiveByUser(userId);

    const response: PriorityResponseDto[] = updated.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      order: p.order,
      allocatedMinutes: p.allocatedMinutes,
      isActive: p.isActive,
    }));

    return success(response);
  }
}
