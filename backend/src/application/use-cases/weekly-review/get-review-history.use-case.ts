// ===========================================
// TimeBudget - Get Review History Use Case
// ===========================================

import type { IWeeklyReviewRepository } from '../../../domain/interfaces/repositories.js';
import type { WeeklyReviewResponseDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';
import { calculateAlignmentPercentage, calculateWastedPercentage } from '../../../domain/entities/weekly-review.entity.js';

export interface GetReviewHistoryDependencies {
  weeklyReviewRepository: IWeeklyReviewRepository;
}

export class GetReviewHistoryUseCase {
  constructor(private readonly deps: GetReviewHistoryDependencies) {}

  async execute(userId: string, limit = 10): Promise<Result<WeeklyReviewResponseDto[], never>> {
    const reviews = await this.deps.weeklyReviewRepository.findByUser(userId, limit);

    const response: WeeklyReviewResponseDto[] = reviews.map(review => ({
      id: review.id,
      weekStart: review.weekStart.toISOString(),
      totalTrackedMinutes: review.totalTrackedMinutes,
      priorityAlignedMinutes: review.priorityAlignedMinutes,
      wastedMinutes: review.wastedMinutes,
      alignmentPercentage: calculateAlignmentPercentage(review.totalTrackedMinutes, review.priorityAlignedMinutes),
      wastedPercentage: calculateWastedPercentage(review.totalTrackedMinutes, review.wastedMinutes),
      wins: review.wins,
      challenges: review.challenges,
      improvements: review.improvements,
      overallScore: review.overallScore,
      isCompleted: review.isCompleted,
      completedAt: review.completedAt?.toISOString() ?? null,
    }));

    return success(response);
  }
}
