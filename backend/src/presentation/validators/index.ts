// ===========================================
// TimeBudget - Zod Validators
// ===========================================

import { z } from 'zod';

// Auth Validators
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// TimeBudget Validators
export const createTimeBudgetSchema = z.object({
  weekStart: z.string().datetime().optional(),
  sleepMinutes: z.number().int().min(0).optional(),
  workMinutes: z.number().int().min(0).optional(),
  mealsMinutes: z.number().int().min(0).optional(),
  hygieneMinutes: z.number().int().min(0).optional(),
  transportMinutes: z.number().int().min(0).optional(),
});

export const updateTimeBudgetSchema = z.object({
  sleepMinutes: z.number().int().min(0).optional(),
  workMinutes: z.number().int().min(0).optional(),
  mealsMinutes: z.number().int().min(0).optional(),
  hygieneMinutes: z.number().int().min(0).optional(),
  transportMinutes: z.number().int().min(0).optional(),
});

// Activity Validators
export const createActivitySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  categoryId: z.string().uuid('ID de categoría inválido'),
  durationMinutes: z.number().int().positive('La duración debe ser positiva'),
  date: z.string().datetime('Fecha inválida'),
  alignedWithPriorities: z.boolean().optional(),
  satisfactionLevel: z.number().int().min(1).max(5).optional(),
});

export const updateActivitySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  durationMinutes: z.number().int().positive().optional(),
  date: z.string().datetime().optional(),
  alignedWithPriorities: z.boolean().optional(),
  satisfactionLevel: z.number().int().min(1).max(5).optional(),
});

// Priority Validators
export const createPrioritySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  allocatedMinutes: z.number().int().min(0).optional(),
});

export const updatePrioritySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  allocatedMinutes: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const reorderPrioritiesSchema = z.object({
  priorityIds: z.array(z.string().uuid()),
});

// Calendar Block Validators
export const createCalendarBlockSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  startTime: z.string().datetime('Hora de inicio inválida'),
  endTime: z.string().datetime('Hora de fin inválida'),
  blockType: z.enum(['PRIORITY', 'ROUTINE', 'PROTECTED']).optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.enum(['DAILY', 'WEEKLY', 'WEEKDAYS', 'CUSTOM']).optional(),
});

export const updateCalendarBlockSchema = z.object({
  title: z.string().min(1).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  blockType: z.enum(['PRIORITY', 'ROUTINE', 'PROTECTED']).optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.enum(['DAILY', 'WEEKLY', 'WEEKDAYS', 'CUSTOM']).nullable().optional(),
});

// Elimination Validators
export const createEliminationSchema = z.object({
  activityName: z.string().min(1, 'El nombre de la actividad es requerido'),
  reason: z.string().optional(),
  recoveredMinutes: z.number().int().min(0).optional(),
});

// Weekly Review Validators
export const completeWeeklyReviewSchema = z.object({
  wins: z.array(z.string()),
  challenges: z.array(z.string()),
  improvements: z.array(z.string()),
  overallScore: z.number().int().min(0).max(100),
});

// Validation helper
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
  return { success: false, errors };
};
