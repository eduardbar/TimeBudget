// ===========================================
// TimeBudget - Update Time Budget Use Case
// ===========================================

import type { ITimeBudgetRepository } from '../../../domain/interfaces/repositories.js';
import type { UpdateTimeBudgetDto, TimeBudgetResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { TimeBudgetNotFoundError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { calculateAvailableMinutes, MINUTES_PER_WEEK } from '../../../domain/entities/time-budget.entity.js';

export interface UpdateTimeBudgetDependencies {
  timeBudgetRepository: ITimeBudgetRepository;
}

export class UpdateTimeBudgetUseCase {
  constructor(private readonly deps: UpdateTimeBudgetDependencies) {}

  async execute(
    userId: string,
    budgetId: string,
    dto: UpdateTimeBudgetDto
  ): Promise<Result<TimeBudgetResponseDto, TimeBudgetNotFoundError | ValidationError>> {
    // Obtener presupuesto existente
    const existing = await this.deps.timeBudgetRepository.findById(budgetId);

    if (!existing || existing.userId !== userId) {
      return failure(new TimeBudgetNotFoundError());
    }

    // Calcular nuevos valores
    const sleepMinutes = dto.sleepMinutes ?? existing.sleepMinutes;
    const workMinutes = dto.workMinutes ?? existing.workMinutes;
    const mealsMinutes = dto.mealsMinutes ?? existing.mealsMinutes;
    const hygieneMinutes = dto.hygieneMinutes ?? existing.hygieneMinutes;
    const transportMinutes = dto.transportMinutes ?? existing.transportMinutes;

    // Validar valores positivos
    if (sleepMinutes < 0 || workMinutes < 0 || mealsMinutes < 0 || hygieneMinutes < 0 || transportMinutes < 0) {
      return failure(new ValidationError('Los valores de tiempo deben ser positivos'));
    }

    // Calcular tiempo disponible
    const availableMinutes = calculateAvailableMinutes(
      sleepMinutes,
      workMinutes,
      mealsMinutes,
      hygieneMinutes,
      transportMinutes
    );

    if (availableMinutes < 0) {
      return failure(new ValidationError('El presupuesto base excede las horas de la semana'));
    }

    // Actualizar presupuesto
    const updated = await this.deps.timeBudgetRepository.update(budgetId, {
      sleepMinutes,
      workMinutes,
      mealsMinutes,
      hygieneMinutes,
      transportMinutes,
    });

    const baseMinutes = MINUTES_PER_WEEK - updated.availableMinutes;

    return success({
      id: updated.id,
      weekStart: updated.weekStart.toISOString(),
      sleepMinutes: updated.sleepMinutes,
      workMinutes: updated.workMinutes,
      mealsMinutes: updated.mealsMinutes,
      hygieneMinutes: updated.hygieneMinutes,
      transportMinutes: updated.transportMinutes,
      availableMinutes: updated.availableMinutes,
      baseMinutes,
      createdAt: updated.createdAt.toISOString(),
    });
  }
}
