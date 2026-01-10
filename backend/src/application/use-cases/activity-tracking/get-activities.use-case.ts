// ===========================================
// TimeBudget - Get Activities Use Case
// ===========================================

import type { IActivityRepository, ICategoryRepository } from '../../../domain/interfaces/repositories.js';
import type { ActivityResponseDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';

export interface GetActivitiesOptions {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

export interface GetActivitiesDependencies {
  activityRepository: IActivityRepository;
  categoryRepository: ICategoryRepository;
}

export class GetActivitiesUseCase {
  constructor(private readonly deps: GetActivitiesDependencies) {}

  async execute(
    userId: string,
    options?: GetActivitiesOptions
  ): Promise<Result<ActivityResponseDto[], never>> {
    // Obtener actividades
    const activities = await this.deps.activityRepository.findByUser(userId, {
      startDate: options?.startDate ? new Date(options.startDate) : undefined,
      endDate: options?.endDate ? new Date(options.endDate) : undefined,
      categoryId: options?.categoryId,
      limit: options?.limit,
      offset: options?.offset,
    });

    // Obtener categorías para mapear nombres
    const categories = await this.deps.categoryRepository.findAll();
    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    // Mapear a DTOs
    const response: ActivityResponseDto[] = activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      description: activity.description,
      categoryId: activity.categoryId,
      categoryName: categoryMap.get(activity.categoryId),
      durationMinutes: activity.durationMinutes,
      date: activity.date.toISOString(),
      alignedWithPriorities: activity.alignedWithPriorities,
      satisfactionLevel: activity.satisfactionLevel,
      createdAt: activity.createdAt.toISOString(),
    }));

    return success(response);
  }
}
