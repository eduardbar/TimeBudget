// ===========================================
// TimeBudget - Get Priorities Use Case
// ===========================================

import type { IPriorityRepository } from '../../../domain/interfaces/repositories.js';
import type { PriorityResponseDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';

export interface GetPrioritiesDependencies {
  priorityRepository: IPriorityRepository;
}

export class GetPrioritiesUseCase {
  constructor(private readonly deps: GetPrioritiesDependencies) {}

  async execute(userId: string, onlyActive = true): Promise<Result<PriorityResponseDto[], never>> {
    const priorities = onlyActive
      ? await this.deps.priorityRepository.findActiveByUser(userId)
      : await this.deps.priorityRepository.findByUser(userId);

    const response: PriorityResponseDto[] = priorities.map(p => ({
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
