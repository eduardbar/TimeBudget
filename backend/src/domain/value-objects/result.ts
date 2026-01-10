// ===========================================
// TimeBudget - Result Pattern
// ===========================================
// Manejo de errores sin excepciones
// ===========================================

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly isSuccess = true;
  readonly isFailure = false;

  constructor(public readonly value: T) {}

  static create<T>(value: T): Success<T> {
    return new Success(value);
  }
}

export class Failure<E> {
  readonly isSuccess = false;
  readonly isFailure = true;

  constructor(public readonly error: E) {}

  static create<E>(error: E): Failure<E> {
    return new Failure(error);
  }
}

// Helpers
export const success = <T>(value: T): Result<T, never> => Success.create(value);
export const failure = <E>(error: E): Result<never, E> => Failure.create(error);

// Type guards
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => {
  return result.isSuccess;
};

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => {
  return result.isFailure;
};
