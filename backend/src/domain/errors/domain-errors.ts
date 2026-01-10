// ===========================================
// TimeBudget - Domain Errors
// ===========================================
// Errores de dominio tipados
// ===========================================

export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      name: this.name,
    };
  }
}

// Auth Errors
export class InvalidCredentialsError extends DomainError {
  readonly code = 'AUTH_INVALID_CREDENTIALS';
  readonly statusCode = 401;

  constructor() {
    super('Credenciales inválidas');
  }
}

export class EmailAlreadyExistsError extends DomainError {
  readonly code = 'AUTH_EMAIL_EXISTS';
  readonly statusCode = 409;

  constructor(email: string) {
    super(`El email ${email} ya está registrado`);
  }
}

export class UserNotFoundError extends DomainError {
  readonly code = 'AUTH_USER_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Usuario no encontrado');
  }
}

export class InvalidTokenError extends DomainError {
  readonly code = 'AUTH_INVALID_TOKEN';
  readonly statusCode = 401;

  constructor() {
    super('Token inválido o expirado');
  }
}

// TimeBudget Errors
export class TimeBudgetNotFoundError extends DomainError {
  readonly code = 'BUDGET_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Presupuesto de tiempo no encontrado');
  }
}

export class TimeBudgetAlreadyExistsError extends DomainError {
  readonly code = 'BUDGET_ALREADY_EXISTS';
  readonly statusCode = 409;

  constructor() {
    super('Ya existe un presupuesto para esta semana');
  }
}

export class InsufficientTimeError extends DomainError {
  readonly code = 'BUDGET_INSUFFICIENT_TIME';
  readonly statusCode = 400;

  constructor(available: number, requested: number) {
    super(`Tiempo insuficiente. Disponible: ${available} min, Solicitado: ${requested} min`);
  }
}

// Activity Errors
export class ActivityNotFoundError extends DomainError {
  readonly code = 'ACTIVITY_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Actividad no encontrada');
  }
}

export class InvalidActivityDurationError extends DomainError {
  readonly code = 'ACTIVITY_INVALID_DURATION';
  readonly statusCode = 400;

  constructor() {
    super('La duración de la actividad debe ser mayor a 0');
  }
}

// Category Errors
export class CategoryNotFoundError extends DomainError {
  readonly code = 'CATEGORY_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Categoría no encontrada');
  }
}

// Priority Errors
export class PriorityNotFoundError extends DomainError {
  readonly code = 'PRIORITY_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Prioridad no encontrada');
  }
}

export class MaxPrioritiesExceededError extends DomainError {
  readonly code = 'PRIORITY_MAX_EXCEEDED';
  readonly statusCode = 400;

  constructor() {
    super('No puedes tener más de 4 prioridades vitales');
  }
}

// Calendar Block Errors
export class CalendarBlockNotFoundError extends DomainError {
  readonly code = 'CALENDAR_BLOCK_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Bloque de calendario no encontrado');
  }
}

export class CalendarBlockOverlapError extends DomainError {
  readonly code = 'CALENDAR_BLOCK_OVERLAP';
  readonly statusCode = 400;

  constructor() {
    super('El bloque se superpone con otro existente');
  }
}

// Weekly Review Errors
export class WeeklyReviewNotFoundError extends DomainError {
  readonly code = 'WEEKLY_REVIEW_NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('Revisión semanal no encontrada');
  }
}

export class WeeklyReviewAlreadyCompletedError extends DomainError {
  readonly code = 'WEEKLY_REVIEW_ALREADY_COMPLETED';
  readonly statusCode = 400;

  constructor() {
    super('La revisión semanal ya fue completada');
  }
}

// Validation Error
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}
