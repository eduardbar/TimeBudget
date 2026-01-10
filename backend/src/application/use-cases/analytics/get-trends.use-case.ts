// ===========================================
// TimeBudget - Get Trends Use Case
// ===========================================

import type { IWeeklyReviewRepository } from '../../../domain/interfaces/repositories.js';
import type { TrendDataDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';

export interface GetTrendsDependencies {
  weeklyReviewRepository: IWeeklyReviewRepository;
}

export class GetTrendsUseCase {
  constructor(private readonly deps: GetTrendsDependencies) {}

  async execute(userId: string, weeks = 8): Promise<Result<TrendDataDto[], never>> {
    const reviews = await this.deps.weeklyReviewRepository.findByUser(userId, weeks);

    const trends: TrendDataDto[] = reviews
      .filter(r => r.isCompleted)
      .map(r => ({
        week: r.weekStart.toISOString(),
        totalTracked: r.totalTrackedMinutes,
        priorityAligned: r.priorityAlignedMinutes,
        score: r.overallScore ?? 0,
      }))
      .reverse(); // Ordenar de más antiguo a más reciente

    return success(trends);
  }
}
