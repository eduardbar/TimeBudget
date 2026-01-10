// ===========================================
// TimeBudget - TimeBudget Entity
// ===========================================

// Constantes de tiempo (minutos por semana)
export const MINUTES_PER_WEEK = 10080; // 7 días * 24 horas * 60 min
export const DEFAULT_SLEEP_MINUTES = 3360; // 8h * 7 días
export const DEFAULT_WORK_MINUTES = 2400; // 8h * 5 días
export const DEFAULT_MEALS_MINUTES = 630; // 1.5h * 7 días
export const DEFAULT_HYGIENE_MINUTES = 420; // 1h * 7 días
export const DEFAULT_TRANSPORT_MINUTES = 300; // Variable

export interface TimeBudgetEntity {
  id: string;
  userId: string;
  weekStart: Date;
  sleepMinutes: number;
  workMinutes: number;
  mealsMinutes: number;
  hygieneMinutes: number;
  transportMinutes: number;
  availableMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTimeBudgetInput {
  userId: string;
  weekStart: Date;
  sleepMinutes?: number;
  workMinutes?: number;
  mealsMinutes?: number;
  hygieneMinutes?: number;
  transportMinutes?: number;
}

export interface UpdateTimeBudgetInput {
  sleepMinutes?: number;
  workMinutes?: number;
  mealsMinutes?: number;
  hygieneMinutes?: number;
  transportMinutes?: number;
}

/**
 * Calcula el tiempo disponible después de restar el presupuesto base
 */
export const calculateAvailableMinutes = (
  sleepMinutes: number,
  workMinutes: number,
  mealsMinutes: number,
  hygieneMinutes: number,
  transportMinutes: number
): number => {
  const baseMinutes = sleepMinutes + workMinutes + mealsMinutes + hygieneMinutes + transportMinutes;
  return MINUTES_PER_WEEK - baseMinutes;
};

/**
 * Formatea minutos a formato legible (ej: 2h 30m)
 */
export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Obtiene el inicio de la semana (lunes) para una fecha dada
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};
