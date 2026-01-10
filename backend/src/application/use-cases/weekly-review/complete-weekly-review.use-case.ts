// ===========================================
// TimeBudget - Complete Weekly Review Use Case
// ===========================================

import type { IWeeklyReviewRepository } from '../../../domain/interfaces/repositories.js';
import type { CompleteWeeklyReviewDto, WeeklyReviewResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { WeeklyReviewNotFoundError, WeeklyReviewAlreadyCompletedError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { calculateAlignmentPercentage, calculateWastedPercentage, isValidScore } from '../../../domain/entities/weekly-review.entity.js';

export interface CompleteWeeklyReviewDependencies {
  weeklyReviewRepository: IWeeklyReviewRepository;
}

export class CompleteWeeklyReviewUseCase {
  constructor(private readonly deps: CompleteWeeklyReviewDependencies) {}

  async execute(
    userId: string,
    reviewId: string,
    dto: CompleteWeeklyReviewDto
  ): Promise<Result<WeeklyReviewResponseDto, WeeklyReviewNotFoundError | WeeklyReviewAlreadyCompletedError | ValidationError>> {
    // Obtener revisión existente
    const existing = await this.deps.weeklyReviewRepository.findById(reviewId);

    if (!existing || existing.userId !== userId) {
      return failure(new WeeklyReviewNotFoundError());
    }

    if (existing.isCompleted) {
      return failure(new WeeklyReviewAlreadyCompletedError());
    }

    // Validar puntuación
    if (!isValidScore(dto.overallScore)) {
      return failure(new ValidationError('La puntuación debe estar entre 0 y 100'));
    }

    // Completar revisión
    const completed = await this.deps.weeklyReviewRepository.complete(reviewId, {
      wins: dto.wins,
      challenges: dto.challenges,
      improvements: dto.improvements,
      overallScore: dto.overallScore,
    });

    return success({
      id: completed.id,
      weekStart: completed.weekStart.toISOString(),
      totalTrackedMinutes: completed.totalTrackedMinutes,
      priorityAlignedMinutes: completed.priorityAlignedMinutes,
      wastedMinutes: completed.wastedMinutes,
      alignmentPercentage: calculateAlignmentPercentage(completed.totalTrackedMinutes, completed.priorityAlignedMinutes),
      wastedPercentage: calculateWastedPercentage(completed.totalTrackedMinutes, completed.wastedMinutes),
      wins: completed.wins,
      challenges: completed.challenges,
      improvements: completed.improvements,
      overallScore: completed.overallScore,
      isCompleted: completed.isCompleted,
      completedAt: completed.completedAt?.toISOString() ?? null,
    });
  }
}
