// ===========================================
// TimeBudget - Elimination Entity
// ===========================================

export interface EliminationEntity {
  id: string;
  userId: string;
  activityName: string;
  reason: string | null;
  recoveredMinutes: number;
  eliminatedAt: Date;
}

export interface CreateEliminationInput {
  userId: string;
  activityName: string;
  reason?: string;
  recoveredMinutes?: number;
}

/**
 * Calcula el tiempo total recuperado de una lista de eliminaciones
 */
export const calculateTotalRecoveredTime = (eliminations: EliminationEntity[]): number => {
  return eliminations.reduce((total, e) => total + e.recoveredMinutes, 0);
};
