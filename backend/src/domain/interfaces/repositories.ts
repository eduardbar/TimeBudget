// ===========================================
// TimeBudget - Repository Interfaces
// ===========================================
// Contratos para la capa de infraestructura
// ===========================================

import type { UserEntity, CreateUserInput } from '../entities/user.entity.js';
import type { TimeBudgetEntity, CreateTimeBudgetInput, UpdateTimeBudgetInput } from '../entities/time-budget.entity.js';
import type { ActivityEntity, CreateActivityInput, UpdateActivityInput } from '../entities/activity.entity.js';
import type { CategoryEntity } from '../entities/category.entity.js';
import type { PriorityEntity, CreatePriorityInput, UpdatePriorityInput } from '../entities/priority.entity.js';
import type { CalendarBlockEntity, CreateCalendarBlockInput, UpdateCalendarBlockInput } from '../entities/calendar-block.entity.js';
import type { EliminationEntity, CreateEliminationInput } from '../entities/elimination.entity.js';
import type { WeeklyReviewEntity, CreateWeeklyReviewInput, UpdateWeeklyReviewInput } from '../entities/weekly-review.entity.js';

// ===========================================
// User Repository
// ===========================================
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserInput): Promise<UserEntity>;
  update(id: string, data: Partial<CreateUserInput>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}

// ===========================================
// TimeBudget Repository
// ===========================================
export interface ITimeBudgetRepository {
  findById(id: string): Promise<TimeBudgetEntity | null>;
  findByUserAndWeek(userId: string, weekStart: Date): Promise<TimeBudgetEntity | null>;
  findByUser(userId: string): Promise<TimeBudgetEntity[]>;
  findCurrentByUser(userId: string): Promise<TimeBudgetEntity | null>;
  create(data: CreateTimeBudgetInput): Promise<TimeBudgetEntity>;
  update(id: string, data: UpdateTimeBudgetInput): Promise<TimeBudgetEntity>;
  delete(id: string): Promise<void>;
}

// ===========================================
// Activity Repository
// ===========================================
export interface IActivityRepository {
  findById(id: string): Promise<ActivityEntity | null>;
  findByUser(userId: string, options?: ActivityQueryOptions): Promise<ActivityEntity[]>;
  findByTimeBudget(timeBudgetId: string): Promise<ActivityEntity[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<ActivityEntity[]>;
  create(data: CreateActivityInput): Promise<ActivityEntity>;
  update(id: string, data: UpdateActivityInput): Promise<ActivityEntity>;
  delete(id: string): Promise<void>;
  sumDurationByCategory(userId: string, startDate: Date, endDate: Date): Promise<CategoryDurationSum[]>;
}

export interface ActivityQueryOptions {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryDurationSum {
  categoryId: string;
  categoryName: string;
  totalMinutes: number;
}

// ===========================================
// Category Repository
// ===========================================
export interface ICategoryRepository {
  findById(id: string): Promise<CategoryEntity | null>;
  findByName(name: string): Promise<CategoryEntity | null>;
  findAll(): Promise<CategoryEntity[]>;
  findDefaults(): Promise<CategoryEntity[]>;
  create(data: Omit<CategoryEntity, 'id'>): Promise<CategoryEntity>;
  seedDefaults(): Promise<void>;
}

// ===========================================
// Priority Repository
// ===========================================
export interface IPriorityRepository {
  findById(id: string): Promise<PriorityEntity | null>;
  findByUser(userId: string): Promise<PriorityEntity[]>;
  findActiveByUser(userId: string): Promise<PriorityEntity[]>;
  countActiveByUser(userId: string): Promise<number>;
  create(data: CreatePriorityInput): Promise<PriorityEntity>;
  update(id: string, data: UpdatePriorityInput): Promise<PriorityEntity>;
  delete(id: string): Promise<void>;
  reorder(userId: string, priorityIds: string[]): Promise<void>;
}

// ===========================================
// CalendarBlock Repository
// ===========================================
export interface ICalendarBlockRepository {
  findById(id: string): Promise<CalendarBlockEntity | null>;
  findByUser(userId: string): Promise<CalendarBlockEntity[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<CalendarBlockEntity[]>;
  findOverlapping(userId: string, startTime: Date, endTime: Date, excludeId?: string): Promise<CalendarBlockEntity[]>;
  create(data: CreateCalendarBlockInput): Promise<CalendarBlockEntity>;
  update(id: string, data: UpdateCalendarBlockInput): Promise<CalendarBlockEntity>;
  delete(id: string): Promise<void>;
}

// ===========================================
// Elimination Repository
// ===========================================
export interface IEliminationRepository {
  findById(id: string): Promise<EliminationEntity | null>;
  findByUser(userId: string): Promise<EliminationEntity[]>;
  create(data: CreateEliminationInput): Promise<EliminationEntity>;
  delete(id: string): Promise<void>;
  sumRecoveredMinutes(userId: string): Promise<number>;
}

// ===========================================
// WeeklyReview Repository
// ===========================================
export interface IWeeklyReviewRepository {
  findById(id: string): Promise<WeeklyReviewEntity | null>;
  findByUserAndWeek(userId: string, weekStart: Date): Promise<WeeklyReviewEntity | null>;
  findByUser(userId: string, limit?: number): Promise<WeeklyReviewEntity[]>;
  findPendingByUser(userId: string): Promise<WeeklyReviewEntity[]>;
  create(data: CreateWeeklyReviewInput): Promise<WeeklyReviewEntity>;
  update(id: string, data: UpdateWeeklyReviewInput): Promise<WeeklyReviewEntity>;
  complete(id: string, data: UpdateWeeklyReviewInput): Promise<WeeklyReviewEntity>;
  delete(id: string): Promise<void>;
}
