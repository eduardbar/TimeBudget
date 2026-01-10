// ===========================================
// TimeBudget - Get Current Time Budget Use Case
// ===========================================

import type { ITimeBudgetRepository } from '../../../domain/interfaces/repositories.js';
import type { TimeBudgetResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { TimeBudgetNotFoundError } from '../../../domain/errors/domain-errors.js';
import { MINUTES_PER_WEEK } from '../../../domain/entities/time-budget.entity.js';

export interface GetCurrentTimeBudgetDependencies {
  timeBudgetRepository: ITimeBudgetRepository;
}

export class GetCurrentTimeBudgetUseCase {
  constructor(private readonly deps: GetCurrentTimeBudgetDependencies) {}

  async execute(userId: string): Promise<Result<TimeBudgetResponseDto, TimeBudgetNotFoundError>> {
    const timeBudget = await this.deps.timeBudgetRepository.findCurrentByUser(userId);

    if (!timeBudget) {
      return failure(new TimeBudgetNotFoundError());
    }

    const baseMinutes = MINUTES_PER_WEEK - timeBudget.availableMinutes;

    return success({
      id: timeBudget.id,
      weekStart: timeBudget.weekStart.toISOString(),
      sleepMinutes: timeBudget.sleepMinutes,
      workMinutes: timeBudget.workMinutes,
      mealsMinutes: timeBudget.mealsMinutes,
      hygieneMinutes: timeBudget.hygieneMinutes,
      transportMinutes: timeBudget.transportMinutes,
      availableMinutes: timeBudget.availableMinutes,
      baseMinutes,
      createdAt: timeBudget.createdAt.toISOString(),
    });
  }
}
