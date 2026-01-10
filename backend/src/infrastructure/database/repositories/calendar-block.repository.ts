// ===========================================
// TimeBudget - CalendarBlock Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { ICalendarBlockRepository } from '../../../domain/interfaces/repositories.js';
import type { CalendarBlockEntity, CreateCalendarBlockInput, UpdateCalendarBlockInput } from '../../../domain/entities/calendar-block.entity.js';

export class CalendarBlockRepository implements ICalendarBlockRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<CalendarBlockEntity | null> {
    return this.prisma.calendarBlock.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<CalendarBlockEntity[]> {
    return this.prisma.calendarBlock.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
    });
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<CalendarBlockEntity[]> {
    return this.prisma.calendarBlock.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOverlapping(
    userId: string,
    startTime: Date,
    endTime: Date,
    excludeId?: string
  ): Promise<CalendarBlockEntity[]> {
    return this.prisma.calendarBlock.findMany({
      where: {
        userId,
        ...(excludeId && { id: { not: excludeId } }),
        OR: [
          {
            startTime: {
              lt: endTime,
            },
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });
  }

  async create(data: CreateCalendarBlockInput): Promise<CalendarBlockEntity> {
    return this.prisma.calendarBlock.create({
      data: {
        userId: data.userId,
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        blockType: data.blockType ?? 'PRIORITY',
        isRecurring: data.isRecurring ?? false,
        recurrence: data.recurrence,
      },
    });
  }

  async update(id: string, data: UpdateCalendarBlockInput): Promise<CalendarBlockEntity> {
    return this.prisma.calendarBlock.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.startTime !== undefined && { startTime: new Date(data.startTime) }),
        ...(data.endTime !== undefined && { endTime: new Date(data.endTime) }),
        ...(data.blockType !== undefined && { blockType: data.blockType }),
        ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
        ...(data.recurrence !== undefined && { recurrence: data.recurrence }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.calendarBlock.delete({
      where: { id },
    });
  }
}
