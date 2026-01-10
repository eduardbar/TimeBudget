// ===========================================
// TimeBudget - Delete Priority Use Case
// ===========================================

import type { IPriorityRepository } from '../../../domain/interfaces/repositories.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { PriorityNotFoundError } from '../../../domain/errors/domain-errors.js';

export interface DeletePriorityDependencies {
  priorityRepository: IPriorityRepository;
}

export class DeletePriorityUseCase {
  constructor(private readonly deps: DeletePriorityDependencies) {}

  async execute(userId: string, priorityId: string): Promise<Result<void, PriorityNotFoundError>> {
    // Verificar que la prioridad existe y pertenece al usuario
    const existing = await this.deps.priorityRepository.findById(priorityId);

    if (!existing || existing.userId !== userId) {
      return failure(new PriorityNotFoundError());
    }

    // Eliminar prioridad
    await this.deps.priorityRepository.delete(priorityId);

    return success(undefined);
  }
}
