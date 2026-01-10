// ===========================================
// TimeBudget - Activity Entity
// ===========================================

export interface ActivityEntity {
  id: string;
  userId: string;
  timeBudgetId: string | null;
  name: string;
  description: string | null;
  categoryId: string;
  durationMinutes: number;
  date: Date;
  alignedWithPriorities: boolean;
  satisfactionLevel: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateActivityInput {
  userId: string;
  timeBudgetId?: string;
  name: string;
  description?: string;
  categoryId: string;
  durationMinutes: number;
  date: Date;
  alignedWithPriorities?: boolean;
  satisfactionLevel?: number;
}

export interface UpdateActivityInput {
  name?: string;
  description?: string;
  categoryId?: string;
  durationMinutes?: number;
  date?: Date;
  alignedWithPriorities?: boolean;
  satisfactionLevel?: number;
}

/**
 * Valida que el nivel de satisfacción esté entre 1 y 5
 */
export const isValidSatisfactionLevel = (level: number): boolean => {
  return level >= 1 && level <= 5;
};

/**
 * Valida que la duración sea positiva
 */
export const isValidDuration = (minutes: number): boolean => {
  return minutes > 0;
};
