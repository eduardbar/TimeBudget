// ===========================================
// TimeBudget - DTOs
// ===========================================
// Data Transfer Objects para la capa de aplicación
// ===========================================

// Auth DTOs
export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

// TimeBudget DTOs
export interface CreateTimeBudgetDto {
  weekStart?: string; // ISO date string
  sleepMinutes?: number;
  workMinutes?: number;
  mealsMinutes?: number;
  hygieneMinutes?: number;
  transportMinutes?: number;
}

export interface UpdateTimeBudgetDto {
  sleepMinutes?: number;
  workMinutes?: number;
  mealsMinutes?: number;
  hygieneMinutes?: number;
  transportMinutes?: number;
}

export interface TimeBudgetResponseDto {
  id: string;
  weekStart: string;
  sleepMinutes: number;
  workMinutes: number;
  mealsMinutes: number;
  hygieneMinutes: number;
  transportMinutes: number;
  availableMinutes: number;
  baseMinutes: number;
  createdAt: string;
}

// Activity DTOs
export interface CreateActivityDto {
  name: string;
  description?: string;
  categoryId: string;
  durationMinutes: number;
  date: string; // ISO date string
  alignedWithPriorities?: boolean;
  satisfactionLevel?: number;
}

export interface UpdateActivityDto {
  name?: string;
  description?: string;
  categoryId?: string;
  durationMinutes?: number;
  date?: string;
  alignedWithPriorities?: boolean;
  satisfactionLevel?: number;
}

export interface ActivityResponseDto {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName?: string;
  durationMinutes: number;
  date: string;
  alignedWithPriorities: boolean;
  satisfactionLevel: number | null;
  createdAt: string;
}

// Priority DTOs
export interface CreatePriorityDto {
  name: string;
  description?: string;
  allocatedMinutes?: number;
}

export interface UpdatePriorityDto {
  name?: string;
  description?: string;
  allocatedMinutes?: number;
  isActive?: boolean;
}

export interface ReorderPrioritiesDto {
  priorityIds: string[];
}

export interface PriorityResponseDto {
  id: string;
  name: string;
  description: string | null;
  order: number;
  allocatedMinutes: number;
  isActive: boolean;
}

// Calendar Block DTOs
export interface CreateCalendarBlockDto {
  title: string;
  startTime: string; // ISO date string
  endTime: string;
  blockType?: 'PRIORITY' | 'ROUTINE' | 'PROTECTED';
  isRecurring?: boolean;
  recurrence?: 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'CUSTOM';
}

export interface UpdateCalendarBlockDto {
  title?: string;
  startTime?: string;
  endTime?: string;
  blockType?: 'PRIORITY' | 'ROUTINE' | 'PROTECTED';
  isRecurring?: boolean;
  recurrence?: 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'CUSTOM' | null;
}

export interface CalendarBlockResponseDto {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  blockType: string;
  isRecurring: boolean;
  recurrence: string | null;
}

// Elimination DTOs
export interface CreateEliminationDto {
  activityName: string;
  reason?: string;
  recoveredMinutes?: number;
}

export interface EliminationResponseDto {
  id: string;
  activityName: string;
  reason: string | null;
  recoveredMinutes: number;
  eliminatedAt: string;
}

// Weekly Review DTOs
export interface CompleteWeeklyReviewDto {
  wins: string[];
  challenges: string[];
  improvements: string[];
  overallScore: number;
}

export interface WeeklyReviewResponseDto {
  id: string;
  weekStart: string;
  totalTrackedMinutes: number;
  priorityAlignedMinutes: number;
  wastedMinutes: number;
  alignmentPercentage: number;
  wastedPercentage: number;
  wins: string[];
  challenges: string[];
  improvements: string[];
  overallScore: number | null;
  isCompleted: boolean;
  completedAt: string | null;
}

// Analytics DTOs
export interface WeeklyAnalyticsDto {
  weekStart: string;
  totalTrackedMinutes: number;
  availableMinutes: number;
  usagePercentage: number;
  categoryBreakdown: CategoryBreakdownDto[];
  priorityAlignment: number;
  averageSatisfaction: number;
}

export interface CategoryBreakdownDto {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalMinutes: number;
  percentage: number;
}

export interface TrendDataDto {
  week: string;
  totalTracked: number;
  priorityAligned: number;
  score: number;
}
