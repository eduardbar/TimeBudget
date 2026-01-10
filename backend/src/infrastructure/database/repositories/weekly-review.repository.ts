// ===========================================
// TimeBudget - WeeklyReview Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { IWeeklyReviewRepository } from '../../../domain/interfaces/repositories.js';
import type { WeeklyReviewEntity, CreateWeeklyReviewInput, UpdateWeeklyReviewInput } from '../../../domain/entities/weekly-review.entity.js';
import { getWeekStart } from '../../../domain/entities/time-budget.entity.js';

export class WeeklyReviewRepository implements IWeeklyReviewRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<WeeklyReviewEntity | null> {
    return this.prisma.weeklyReview.findUnique({
      where: { id },
    });
  }

  async findByUserAndWeek(userId: string, weekStart: Date): Promise<WeeklyReviewEntity | null> {
    const normalizedWeekStart = getWeekStart(weekStart);
    return this.prisma.weeklyReview.findUnique({
      where: {
        userId_weekStart: {
          userId,
          weekStart: normalizedWeekStart,
        },
      },
    });
  }

  async findByUser(userId: string, limit = 10): Promise<WeeklyReviewEntity[]> {
    return this.prisma.weeklyReview.findMany({
      where: { userId },
      orderBy: { weekStart: 'desc' },
      take: limit,
    });
  }

  async findPendingByUser(userId: string): Promise<WeeklyReviewEntity[]> {
    return this.prisma.weeklyReview.findMany({
      where: {
        userId,
        isCompleted: false,
      },
      orderBy: { weekStart: 'desc' },
    });
  }

  async create(data: CreateWeeklyReviewInput): Promise<WeeklyReviewEntity> {
    return this.prisma.weeklyReview.create({
      data: {
        userId: data.userId,
        weekStart: getWeekStart(data.weekStart),
      },
    });
  }

  async update(id: string, data: UpdateWeeklyReviewInput): Promise<WeeklyReviewEntity> {
    return this.prisma.weeklyReview.update({
      where: { id },
      data: {
        ...(data.totalTrackedMinutes !== undefined && { totalTrackedMinutes: data.totalTrackedMinutes }),
        ...(data.priorityAlignedMinutes !== undefined && { priorityAlignedMinutes: data.priorityAlignedMinutes }),
        ...(data.wastedMinutes !== undefined && { wastedMinutes: data.wastedMinutes }),
        ...(data.wins !== undefined && { wins: data.wins }),
        ...(data.challenges !== undefined && { challenges: data.challenges }),
        ...(data.improvements !== undefined && { improvements: data.improvements }),
        ...(data.overallScore !== undefined && { overallScore: data.overallScore }),
      },
    });
  }

  async complete(id: string, data: UpdateWeeklyReviewInput): Promise<WeeklyReviewEntity> {
    return this.prisma.weeklyReview.update({
      where: { id },
      data: {
        wins: data.wins ?? [],
        challenges: data.challenges ?? [],
        improvements: data.improvements ?? [],
        overallScore: data.overallScore,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.weeklyReview.delete({
      where: { id },
    });
  }
}
