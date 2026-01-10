// ===========================================
// TimeBudget - Delete Activity Use Case
// ===========================================

import type { IActivityRepository } from '../../../domain/interfaces/repositories.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { ActivityNotFoundError } from '../../../domain/errors/domain-errors.js';

export interface DeleteActivityDependencies {
  activityRepository: IActivityRepository;
}

export class DeleteActivityUseCase {
  constructor(private readonly deps: DeleteActivityDependencies) {}

  async execute(userId: string, activityId: string): Promise<Result<void, ActivityNotFoundError>> {
    // Verificar que la actividad existe y pertenece al usuario
    const existing = await this.deps.activityRepository.findById(activityId);

    if (!existing || existing.userId !== userId) {
      return failure(new ActivityNotFoundError());
    }

    // Eliminar actividad
    await this.deps.activityRepository.delete(activityId);

    return success(undefined);
  }
}
