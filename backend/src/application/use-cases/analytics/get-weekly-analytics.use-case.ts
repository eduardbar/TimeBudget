// ===========================================
// TimeBudget - Get Weekly Analytics Use Case
// ===========================================

import type { IActivityRepository, ITimeBudgetRepository, ICategoryRepository } from '../../../domain/interfaces/repositories.js';
import type { WeeklyAnalyticsDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';
import { getWeekStart } from '../../../domain/entities/time-budget.entity.js';

export interface GetWeeklyAnalyticsDependencies {
  activityRepository: IActivityRepository;
  timeBudgetRepository: ITimeBudgetRepository;
  categoryRepository: ICategoryRepository;
}

export class GetWeeklyAnalyticsUseCase {
  constructor(private readonly deps: GetWeeklyAnalyticsDependencies) {}

  async execute(userId: string, weekStartDate?: string): Promise<Result<WeeklyAnalyticsDto, never>> {
    const weekStart = weekStartDate 
      ? getWeekStart(new Date(weekStartDate))
      : getWeekStart(new Date());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Obtener presupuesto de la semana
    const timeBudget = await this.deps.timeBudgetRepository.findByUserAndWeek(userId, weekStart);
    const availableMinutes = timeBudget?.availableMinutes ?? 0;

    // Obtener actividades de la semana
    const activities = await this.deps.activityRepository.findByDateRange(userId, weekStart, weekEnd);

    // Calcular métricas
    const totalTrackedMinutes = activities.reduce((sum, a) => sum + a.durationMinutes, 0);
    const priorityAlignedMinutes = activities
      .filter(a => a.alignedWithPriorities)
      .reduce((sum, a) => sum + a.durationMinutes, 0);

    // Calcular satisfacción promedio
    const satisfactionActivities = activities.filter(a => a.satisfactionLevel !== null);
    const averageSatisfaction = satisfactionActivities.length > 0
      ? satisfactionActivities.reduce((sum, a) => sum + (a.satisfactionLevel ?? 0), 0) / satisfactionActivities.length
      : 0;

    // Obtener desglose por categoría
    const categoryBreakdown = await this.deps.activityRepository.sumDurationByCategory(userId, weekStart, weekEnd);
    const categories = await this.deps.categoryRepository.findAll();
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const categoryBreakdownDto = categoryBreakdown.map(cb => {
      const category = categoryMap.get(cb.categoryId);
      return {
        categoryId: cb.categoryId,
        categoryName: cb.categoryName,
        categoryColor: category?.color ?? '#6B7280',
        totalMinutes: cb.totalMinutes,
        percentage: totalTrackedMinutes > 0 
          ? Math.round((cb.totalMinutes / totalTrackedMinutes) * 100)
          : 0,
      };
    });

    // Calcular porcentaje de uso
    const usagePercentage = availableMinutes > 0
      ? Math.round((totalTrackedMinutes / availableMinutes) * 100)
      : 0;

    // Calcular alineación con prioridades
    const priorityAlignment = totalTrackedMinutes > 0
      ? Math.round((priorityAlignedMinutes / totalTrackedMinutes) * 100)
      : 0;

    return success({
      weekStart: weekStart.toISOString(),
      totalTrackedMinutes,
      availableMinutes,
      usagePercentage,
      categoryBreakdown: categoryBreakdownDto,
      priorityAlignment,
      averageSatisfaction: Math.round(averageSatisfaction * 10) / 10,
    });
  }
}
