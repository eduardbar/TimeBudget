// ===========================================
// TimeBudget - Formatters Utility
// ===========================================

/**
 * Formatea minutos a string legible (ej: "2h 30m", "45m", "3h")
 */
export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Formatea minutos a horas decimales (ej: 90 -> "1.5h")
 */
export function formatMinutesToHours(minutes: number): string {
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}

/**
 * Formatea un porcentaje (ej: 0.856 -> "86%")
 */
export function formatPercentage(value: number, decimals = 0): string {
  const percentage = value > 1 ? value : value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Formatea una fecha en español
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { day: 'numeric', month: 'short' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  }[format];
  
  return d.toLocaleDateString('es-ES', options);
}

/**
 * Formatea hora (ej: "09:30")
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formatea fecha y hora
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d, 'short')} ${formatTime(d)}`;
}

/**
 * Formatea número con separadores de miles
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('es-ES');
}
