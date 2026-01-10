// ===========================================
// TimeBudget - Shared Types
// ===========================================

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
}

// TimeBudget Types
export interface TimeBudget {
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

// Activity Types
export interface Activity {
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

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  isDefault: boolean;
}

// Priority Types
export interface Priority {
  id: string;
  name: string;
  description: string | null;
  order: number;
  allocatedMinutes: number;
  isActive: boolean;
}

// Calendar Block Types
export type BlockType = 'PRIORITY' | 'ROUTINE' | 'PROTECTED';
export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'CUSTOM';

export interface CalendarBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  blockType: BlockType;
  isRecurring: boolean;
  recurrence: RecurrenceType | null;
}

// Elimination Types
export interface Elimination {
  id: string;
  activityName: string;
  reason: string | null;
  recoveredMinutes: number;
  eliminatedAt: string;
}

// Weekly Review Types
export interface WeeklyReview {
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

// Analytics Types
export interface WeeklyAnalytics {
  weekStart: string;
  totalTrackedMinutes: number;
  availableMinutes: number;
  usagePercentage: number;
  categoryBreakdown: CategoryBreakdown[];
  priorityAlignment: number;
  averageSatisfaction: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalMinutes: number;
  percentage: number;
}

export interface TrendData {
  week: string;
  totalTracked: number;
  priorityAligned: number;
  score: number;
}
