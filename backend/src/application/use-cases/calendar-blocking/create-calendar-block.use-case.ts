// ===========================================
// TimeBudget - Create Calendar Block Use Case
// ===========================================

import type { ICalendarBlockRepository } from '../../../domain/interfaces/repositories.js';
import type { CreateCalendarBlockDto, CalendarBlockResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { CalendarBlockOverlapError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { isValidTimeRange, calculateBlockDuration } from '../../../domain/entities/calendar-block.entity.js';

export interface CreateCalendarBlockDependencies {
  calendarBlockRepository: ICalendarBlockRepository;
}

export class CreateCalendarBlockUseCase {
  constructor(private readonly deps: CreateCalendarBlockDependencies) {}

  async execute(
    userId: string,
    dto: CreateCalendarBlockDto
  ): Promise<Result<CalendarBlockResponseDto, CalendarBlockOverlapError | ValidationError>> {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // Validar rango de tiempo
    if (!isValidTimeRange(startTime, endTime)) {
      return failure(new ValidationError('La hora de fin debe ser posterior a la de inicio'));
    }

    // Verificar solapamiento
    const overlapping = await this.deps.calendarBlockRepository.findOverlapping(
      userId,
      startTime,
      endTime
    );

    if (overlapping.length > 0) {
      return failure(new CalendarBlockOverlapError());
    }

    // Crear bloque
    const block = await this.deps.calendarBlockRepository.create({
      userId,
      title: dto.title.trim(),
      startTime,
      endTime,
      blockType: dto.blockType ?? 'PRIORITY',
      isRecurring: dto.isRecurring ?? false,
      recurrence: dto.recurrence,
    });

    return success({
      id: block.id,
      title: block.title,
      startTime: block.startTime.toISOString(),
      endTime: block.endTime.toISOString(),
      durationMinutes: calculateBlockDuration(block.startTime, block.endTime),
      blockType: block.blockType,
      isRecurring: block.isRecurring,
      recurrence: block.recurrence,
    });
  }
}
