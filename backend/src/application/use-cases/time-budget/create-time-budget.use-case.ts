// ===========================================
// TimeBudget - Create Time Budget Use Case
// ===========================================

import type { ITimeBudgetRepository } from '../../../domain/interfaces/repositories.js';
import type { CreateTimeBudgetDto, TimeBudgetResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { TimeBudgetAlreadyExistsError, ValidationError } from '../../../domain/errors/domain-errors.js';
import {
  calculateAvailableMinutes,
  getWeekStart,
  DEFAULT_SLEEP_MINUTES,
  DEFAULT_WORK_MINUTES,
  DEFAULT_MEALS_MINUTES,
  DEFAULT_HYGIENE_MINUTES,
  DEFAULT_TRANSPORT_MINUTES,
  MINUTES_PER_WEEK,
} from '../../../domain/entities/time-budget.entity.js';

export interface CreateTimeBudgetDependencies {
  timeBudgetRepository: ITimeBudgetRepository;
}

export class CreateTimeBudgetUseCase {
  constructor(private readonly deps: CreateTimeBudgetDependencies) {}

  async execute(
    userId: string,
    dto: CreateTimeBudgetDto
  ): Promise<Result<TimeBudgetResponseDto, TimeBudgetAlreadyExistsError | ValidationError>> {
    // Determinar inicio de semana
    const weekStart = dto.weekStart 
      ? getWeekStart(new Date(dto.weekStart))
      : getWeekStart(new Date());

    // Verificar si ya existe un presupuesto para esta semana
    const existing = await this.deps.timeBudgetRepository.findByUserAndWeek(userId, weekStart);
    if (existing) {
      return failure(new TimeBudgetAlreadyExistsError());
    }

    // Valores de presupuesto base
    const sleepMinutes = dto.sleepMinutes ?? DEFAULT_SLEEP_MINUTES;
    const workMinutes = dto.workMinutes ?? DEFAULT_WORK_MINUTES;
    const mealsMinutes = dto.mealsMinutes ?? DEFAULT_MEALS_MINUTES;
    const hygieneMinutes = dto.hygieneMinutes ?? DEFAULT_HYGIENE_MINUTES;
    const transportMinutes = dto.transportMinutes ?? DEFAULT_TRANSPORT_MINUTES;

    // Validar que los valores sean positivos
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

    // Crear presupuesto
    const timeBudget = await this.deps.timeBudgetRepository.create({
      userId,
      weekStart,
      sleepMinutes,
      workMinutes,
      mealsMinutes,
      hygieneMinutes,
      transportMinutes,
    });

    const baseMinutes = MINUTES_PER_WEEK - availableMinutes;

    return success({
      id: timeBudget.id,
      weekStart: timeBudget.weekStart.toISOString(),
      sleepMinutes: timeBudget.sleepMinutes,
      workMinutes: timeBudget.workMinutes,
      mealsMinutes: timeBudget.mealsMinutes,
      hygieneMinutes: timeBudget.hygieneMinutes,
      transportMinutes: timeBudget.transportMinutes,
      availableMinutes: timeBudget.availableMinutes,
      baseMinutes,
      createdAt: timeBudget.createdAt.toISOString(),
    });
  }
}
