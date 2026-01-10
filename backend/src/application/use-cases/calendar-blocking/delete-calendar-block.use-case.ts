// ===========================================
// TimeBudget - Delete Calendar Block Use Case
// ===========================================

import type { ICalendarBlockRepository } from '../../../domain/interfaces/repositories.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { CalendarBlockNotFoundError } from '../../../domain/errors/domain-errors.js';

export interface DeleteCalendarBlockDependencies {
  calendarBlockRepository: ICalendarBlockRepository;
}

export class DeleteCalendarBlockUseCase {
  constructor(private readonly deps: DeleteCalendarBlockDependencies) {}

  async execute(userId: string, blockId: string): Promise<Result<void, CalendarBlockNotFoundError>> {
    // Verificar que el bloque existe y pertenece al usuario
    const existing = await this.deps.calendarBlockRepository.findById(blockId);

    if (!existing || existing.userId !== userId) {
      return failure(new CalendarBlockNotFoundError());
    }

    // Eliminar bloque
    await this.deps.calendarBlockRepository.delete(blockId);

    return success(undefined);
  }
}
