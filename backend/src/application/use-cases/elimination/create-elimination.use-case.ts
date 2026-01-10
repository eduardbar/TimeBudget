// ===========================================
// TimeBudget - Create Elimination Use Case
// ===========================================

import type { IEliminationRepository } from '../../../domain/interfaces/repositories.js';
import type { CreateEliminationDto, EliminationResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { ValidationError } from '../../../domain/errors/domain-errors.js';

export interface CreateEliminationDependencies {
  eliminationRepository: IEliminationRepository;
}

export class CreateEliminationUseCase {
  constructor(private readonly deps: CreateEliminationDependencies) {}

  async execute(
    userId: string,
    dto: CreateEliminationDto
  ): Promise<Result<EliminationResponseDto, ValidationError>> {
    // Validar nombre de actividad
    if (!dto.activityName || dto.activityName.trim().length === 0) {
      return failure(new ValidationError('El nombre de la actividad es requerido'));
    }

    // Crear eliminación
    const elimination = await this.deps.eliminationRepository.create({
      userId,
      activityName: dto.activityName.trim(),
      reason: dto.reason?.trim(),
      recoveredMinutes: dto.recoveredMinutes ?? 0,
    });

    return success({
      id: elimination.id,
      activityName: elimination.activityName,
      reason: elimination.reason,
      recoveredMinutes: elimination.recoveredMinutes,
      eliminatedAt: elimination.eliminatedAt.toISOString(),
    });
  }
}
