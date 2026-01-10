// ===========================================
// TimeBudget - Auth Middleware
// ===========================================

import type { Request, Response, NextFunction } from 'express';
import { tokenService } from '../../infrastructure/services/token.service.js';
import { InvalidTokenError } from '../../domain/errors/domain-errors.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new InvalidTokenError();
    }

    const token = authHeader.substring(7);
    const payload = tokenService.verify(token);

    if (!payload) {
      throw new InvalidTokenError();
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      res.status(401).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }
    next(error);
  }
};
