// ===========================================
// TimeBudget - Validators Utility
// ===========================================

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida contraseña (mínimo 6 caracteres)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Valida que un string no esté vacío
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Valida que un número esté en un rango
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Valida que los minutos sean positivos
 */
export function isValidMinutes(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes > 0;
}

/**
 * Valida puntuación (1-10)
 */
export function isValidScore(score: number): boolean {
  return isInRange(score, 1, 10);
}

/**
 * Valida nivel de satisfacción (1-5)
 */
export function isValidSatisfaction(level: number): boolean {
  return isInRange(level, 1, 5);
}

/**
 * Valida que la hora de fin sea posterior a la de inicio
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  return new Date(endTime) > new Date(startTime);
}

/**
 * Obtiene mensaje de error para email
 */
export function getEmailError(email: string): string | null {
  if (!email) return 'El email es requerido';
  if (!isValidEmail(email)) return 'Formato de email inválido';
  return null;
}

/**
 * Obtiene mensaje de error para contraseña
 */
export function getPasswordError(password: string): string | null {
  if (!password) return 'La contraseña es requerida';
  if (!isValidPassword(password)) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
}
