// ===========================================
// TimeBudget - Error Handler Middleware
// ===========================================

import type { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/domain-errors.js';

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message,
    },
  });
};
