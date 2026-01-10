// ===========================================
// TimeBudget - Get Calendar Blocks Use Case
// ===========================================

import type { ICalendarBlockRepository } from '../../../domain/interfaces/repositories.js';
import type { CalendarBlockResponseDto } from '../../dtos/index.js';
import { Result, success } from '../../../domain/value-objects/result.js';
import { calculateBlockDuration } from '../../../domain/entities/calendar-block.entity.js';

export interface GetCalendarBlocksOptions {
  startDate?: string;
  endDate?: string;
}

export interface GetCalendarBlocksDependencies {
  calendarBlockRepository: ICalendarBlockRepository;
}

export class GetCalendarBlocksUseCase {
  constructor(private readonly deps: GetCalendarBlocksDependencies) {}

  async execute(
    userId: string,
    options?: GetCalendarBlocksOptions
  ): Promise<Result<CalendarBlockResponseDto[], never>> {
    let blocks;

    if (options?.startDate && options?.endDate) {
      blocks = await this.deps.calendarBlockRepository.findByDateRange(
        userId,
        new Date(options.startDate),
        new Date(options.endDate)
      );
    } else {
      blocks = await this.deps.calendarBlockRepository.findByUser(userId);
    }

    const response: CalendarBlockResponseDto[] = blocks.map(block => ({
      id: block.id,
      title: block.title,
      startTime: block.startTime.toISOString(),
      endTime: block.endTime.toISOString(),
      durationMinutes: calculateBlockDuration(block.startTime, block.endTime),
      blockType: block.blockType,
      isRecurring: block.isRecurring,
      recurrence: block.recurrence,
    }));

    return success(response);
  }
}
