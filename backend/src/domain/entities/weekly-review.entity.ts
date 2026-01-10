// ===========================================
// TimeBudget - Weekly Review Entity
// ===========================================

export interface WeeklyReviewEntity {
  id: string;
  userId: string;
  weekStart: Date;
  totalTrackedMinutes: number;
  priorityAlignedMinutes: number;
  wastedMinutes: number;
  wins: string[];
  challenges: string[];
  improvements: string[];
  overallScore: number | null;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWeeklyReviewInput {
  userId: string;
  weekStart: Date;
}

export interface UpdateWeeklyReviewInput {
  totalTrackedMinutes?: number;
  priorityAlignedMinutes?: number;
  wastedMinutes?: number;
  wins?: string[];
  challenges?: string[];
  improvements?: string[];
  overallScore?: number;
}

export interface CompleteWeeklyReviewInput {
  wins: string[];
  challenges: string[];
  improvements: string[];
  overallScore: number;
}

/**
 * Calcula el porcentaje de tiempo alineado con prioridades
 */
export const calculateAlignmentPercentage = (
  totalTracked: number,
  priorityAligned: number
): number => {
  if (totalTracked === 0) return 0;
  return Math.round((priorityAligned / totalTracked) * 100);
};

/**
 * Calcula el porcentaje de tiempo desperdiciado
 */
export const calculateWastedPercentage = (
  totalTracked: number,
  wasted: number
): number => {
  if (totalTracked === 0) return 0;
  return Math.round((wasted / totalTracked) * 100);
};

/**
 * Valida que la puntuación esté entre 0 y 100
 */
export const isValidScore = (score: number): boolean => {
  return score >= 0 && score <= 100;
};
