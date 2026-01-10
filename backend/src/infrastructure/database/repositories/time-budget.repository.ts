// ===========================================
// TimeBudget - TimeBudget Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { ITimeBudgetRepository } from '../../../domain/interfaces/repositories.js';
import type { TimeBudgetEntity, CreateTimeBudgetInput, UpdateTimeBudgetInput } from '../../../domain/entities/time-budget.entity.js';
import { calculateAvailableMinutes, getWeekStart } from '../../../domain/entities/time-budget.entity.js';

export class TimeBudgetRepository implements ITimeBudgetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<TimeBudgetEntity | null> {
    return this.prisma.timeBudget.findUnique({
      where: { id },
    });
  }

  async findByUserAndWeek(userId: string, weekStart: Date): Promise<TimeBudgetEntity | null> {
    const normalizedWeekStart = getWeekStart(weekStart);
    return this.prisma.timeBudget.findUnique({
      where: {
        userId_weekStart: {
          userId,
          weekStart: normalizedWeekStart,
        },
      },
    });
  }

  async findByUser(userId: string): Promise<TimeBudgetEntity[]> {
    return this.prisma.timeBudget.findMany({
      where: { userId },
      orderBy: { weekStart: 'desc' },
    });
  }

  async findCurrentByUser(userId: string): Promise<TimeBudgetEntity | null> {
    const currentWeekStart = getWeekStart(new Date());
    return this.findByUserAndWeek(userId, currentWeekStart);
  }

  async create(data: CreateTimeBudgetInput): Promise<TimeBudgetEntity> {
    const availableMinutes = calculateAvailableMinutes(
      data.sleepMinutes ?? 3360,
      data.workMinutes ?? 2400,
      data.mealsMinutes ?? 630,
      data.hygieneMinutes ?? 420,
      data.transportMinutes ?? 300
    );

    return this.prisma.timeBudget.create({
      data: {
        userId: data.userId,
        weekStart: getWeekStart(data.weekStart),
        sleepMinutes: data.sleepMinutes ?? 3360,
        workMinutes: data.workMinutes ?? 2400,
        mealsMinutes: data.mealsMinutes ?? 630,
        hygieneMinutes: data.hygieneMinutes ?? 420,
        transportMinutes: data.transportMinutes ?? 300,
        availableMinutes,
      },
    });
  }

  async update(id: string, data: UpdateTimeBudgetInput): Promise<TimeBudgetEntity> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('TimeBudget not found');

    const sleepMinutes = data.sleepMinutes ?? existing.sleepMinutes;
    const workMinutes = data.workMinutes ?? existing.workMinutes;
    const mealsMinutes = data.mealsMinutes ?? existing.mealsMinutes;
    const hygieneMinutes = data.hygieneMinutes ?? existing.hygieneMinutes;
    const transportMinutes = data.transportMinutes ?? existing.transportMinutes;

    const availableMinutes = calculateAvailableMinutes(
      sleepMinutes,
      workMinutes,
      mealsMinutes,
      hygieneMinutes,
      transportMinutes
    );

    return this.prisma.timeBudget.update({
      where: { id },
      data: {
        sleepMinutes,
        workMinutes,
        mealsMinutes,
        hygieneMinutes,
        transportMinutes,
        availableMinutes,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.timeBudget.delete({
      where: { id },
    });
  }
}
