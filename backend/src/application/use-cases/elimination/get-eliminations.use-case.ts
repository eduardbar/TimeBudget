// ===========================================
// TimeBudget - Get Eliminations Use Case
// ===========================================

import type { IEliminationRepository } from '../../../domain/interfaces/repositories.js';
import type { EliminationResponseDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';

export interface GetEliminationsDependencies {
  eliminationRepository: IEliminationRepository;
}

export interface EliminationsSummary {
  eliminations: EliminationResponseDto[];
  totalRecoveredMinutes: number;
}

export class GetEliminationsUseCase {
  constructor(private readonly deps: GetEliminationsDependencies) {}

  async execute(userId: string): Promise<Result<EliminationsSummary, never>> {
    const eliminations = await this.deps.eliminationRepository.findByUser(userId);
    const totalRecovered = await this.deps.eliminationRepository.sumRecoveredMinutes(userId);

    const response: EliminationsSummary = {
      eliminations: eliminations.map(e => ({
        id: e.id,
        activityName: e.activityName,
        reason: e.reason,
        recoveredMinutes: e.recoveredMinutes,
        eliminatedAt: e.eliminatedAt.toISOString(),
      })),
      totalRecoveredMinutes: totalRecovered,
    };

    return success(response);
  }
}
