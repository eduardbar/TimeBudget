// ===========================================
// TimeBudget - Create/Get Weekly Review Use Case
// ===========================================

import type { IWeeklyReviewRepository, IActivityRepository, ITimeBudgetRepository } from '../../../domain/interfaces/repositories.js';
import type { WeeklyReviewResponseDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';
import { getWeekStart } from '../../../domain/entities/time-budget.entity.js';
import { calculateAlignmentPercentage, calculateWastedPercentage } from '../../../domain/entities/weekly-review.entity.js';

export interface GetWeeklyReviewDependencies {
  weeklyReviewRepository: IWeeklyReviewRepository;
  activityRepository: IActivityRepository;
  timeBudgetRepository: ITimeBudgetRepository;
}

export class GetWeeklyReviewUseCase {
  constructor(private readonly deps: GetWeeklyReviewDependencies) {}

  async execute(userId: string, weekStartDate?: string): Promise<Result<WeeklyReviewResponseDto, never>> {
    const weekStart = weekStartDate 
      ? getWeekStart(new Date(weekStartDate))
      : getWeekStart(new Date());

    // Buscar revisión existente o crear una nueva
    let review = await this.deps.weeklyReviewRepository.findByUserAndWeek(userId, weekStart);

    if (!review) {
      review = await this.deps.weeklyReviewRepository.create({
        userId,
        weekStart,
      });
    }

    // Calcular métricas si no está completada
    if (!review.isCompleted) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      // Obtener actividades de la semana
      const activities = await this.deps.activityRepository.findByDateRange(userId, weekStart, weekEnd);

      const totalTrackedMinutes = activities.reduce((sum, a) => sum + a.durationMinutes, 0);
      const priorityAlignedMinutes = activities
        .filter(a => a.alignedWithPriorities)
        .reduce((sum, a) => sum + a.durationMinutes, 0);
      
      // Actualizar métricas
      review = await this.deps.weeklyReviewRepository.update(review.id, {
        totalTrackedMinutes,
        priorityAlignedMinutes,
      });
    }

    return success({
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
    });
  }
}
