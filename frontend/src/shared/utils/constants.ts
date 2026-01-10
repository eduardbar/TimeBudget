// ===========================================
// TimeBudget - Constants
// ===========================================

/**
 * Minutos totales en una semana (7 días * 24 horas * 60 minutos)
 */
export const MINUTES_PER_WEEK = 10080;

/**
 * Minutos en un día
 */
export const MINUTES_PER_DAY = 1440;

/**
 * Minutos en una hora
 */
export const MINUTES_PER_HOUR = 60;

/**
 * Valores predeterminados del presupuesto de tiempo (en minutos por semana)
 */
export const DEFAULT_BUDGET = {
  sleep: 3360,      // 8h * 7 días
  work: 2400,       // 8h * 5 días
  meals: 630,       // 1.5h * 7 días
  hygiene: 420,     // 1h * 7 días
  transport: 300,   // ~43min por día
} as const;

/**
 * Número máximo de prioridades permitidas
 */
export const MAX_PRIORITIES = 4;

/**
 * Número mínimo de prioridades requeridas
 */
export const MIN_PRIORITIES = 2;

/**
 * Colores predeterminados para categorías
 */
export const CATEGORY_COLORS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#10b981', // green
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#ef4444', // red
] as const;

/**
 * Tipos de bloque de calendario
 */
export const BLOCK_TYPES = {
  PRIORITY: { label: 'Prioridad', color: 'bg-primary-500' },
  ROUTINE: { label: 'Rutina', color: 'bg-blue-500' },
  PROTECTED: { label: 'Protegido', color: 'bg-green-500' },
} as const;

/**
 * Opciones de recurrencia
 */
export const RECURRENCE_OPTIONS = {
  DAILY: 'Diario',
  WEEKLY: 'Semanal',
  WEEKDAYS: 'Días laborales',
  CUSTOM: 'Personalizado',
} as const;

/**
 * Niveles de satisfacción
 */
export const SATISFACTION_LEVELS = [
  { value: 1, label: 'Muy insatisfecho', emoji: '😞' },
  { value: 2, label: 'Insatisfecho', emoji: '😕' },
  { value: 3, label: 'Neutral', emoji: '😐' },
  { value: 4, label: 'Satisfecho', emoji: '😊' },
  { value: 5, label: 'Muy satisfecho', emoji: '😄' },
] as const;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  BUDGET: '/budget',
  ACTIVITIES: '/activities',
  PRIORITIES: '/priorities',
  CALENDAR: '/calendar',
  ELIMINATIONS: '/eliminations',
  REVIEW: '/review',
} as const;
