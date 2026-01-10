// ===========================================
// TimeBudget - Activity Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { IActivityRepository, ActivityQueryOptions, CategoryDurationSum } from '../../../domain/interfaces/repositories.js';
import type { ActivityEntity, CreateActivityInput, UpdateActivityInput } from '../../../domain/entities/activity.entity.js';

export class ActivityRepository implements IActivityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ActivityEntity | null> {
    return this.prisma.activity.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string, options?: ActivityQueryOptions): Promise<ActivityEntity[]> {
    return this.prisma.activity.findMany({
      where: {
        userId,
        ...(options?.startDate && options?.endDate && {
          date: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
        ...(options?.categoryId && { categoryId: options.categoryId }),
      },
      orderBy: { date: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async findByTimeBudget(timeBudgetId: string): Promise<ActivityEntity[]> {
    return this.prisma.activity.findMany({
      where: { timeBudgetId },
      orderBy: { date: 'desc' },
    });
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<ActivityEntity[]> {
    return this.prisma.activity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: CreateActivityInput): Promise<ActivityEntity> {
    return this.prisma.activity.create({
      data: {
        userId: data.userId,
        timeBudgetId: data.timeBudgetId,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        durationMinutes: data.durationMinutes,
        date: data.date,
        alignedWithPriorities: data.alignedWithPriorities ?? false,
        satisfactionLevel: data.satisfactionLevel,
      },
    });
  }

  async update(id: string, data: UpdateActivityInput): Promise<ActivityEntity> {
    return this.prisma.activity.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.durationMinutes !== undefined && { durationMinutes: data.durationMinutes }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.alignedWithPriorities !== undefined && { alignedWithPriorities: data.alignedWithPriorities }),
        ...(data.satisfactionLevel !== undefined && { satisfactionLevel: data.satisfactionLevel }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.activity.delete({
      where: { id },
    });
  }

  async sumDurationByCategory(userId: string, startDate: Date, endDate: Date): Promise<CategoryDurationSum[]> {
    const results = await this.prisma.activity.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        durationMinutes: true,
      },
    });

    // Obtener nombres de categorías
    const categoryIds = results.map(r => r.categoryId);
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });
    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    return results.map(r => ({
      categoryId: r.categoryId,
      categoryName: categoryMap.get(r.categoryId) ?? 'Desconocido',
      totalMinutes: r._sum.durationMinutes ?? 0,
    }));
  }
}
