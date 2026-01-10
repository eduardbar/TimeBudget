// ===========================================
// TimeBudget - Weekly Review Controller
// ===========================================

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { GetWeeklyReviewUseCase } from '../../application/use-cases/weekly-review/get-weekly-review.use-case.js';
import { CompleteWeeklyReviewUseCase } from '../../application/use-cases/weekly-review/complete-weekly-review.use-case.js';
import { GetReviewHistoryUseCase } from '../../application/use-cases/weekly-review/get-review-history.use-case.js';
import { WeeklyReviewRepository } from '../../infrastructure/database/repositories/weekly-review.repository.js';
import { ActivityRepository } from '../../infrastructure/database/repositories/activity.repository.js';
import { TimeBudgetRepository } from '../../infrastructure/database/repositories/time-budget.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';
import { validate, completeWeeklyReviewSchema } from '../validators/index.js';
import { isFailure, isSuccess } from '../../domain/value-objects/result.js';

const weeklyReviewRepository = new WeeklyReviewRepository(prisma);
const activityRepository = new ActivityRepository(prisma);
const timeBudgetRepository = new TimeBudgetRepository(prisma);

export const weeklyReviewController = {
  async getCurrent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const weekStart = req.query.weekStart as string | undefined;
      
      const useCase = new GetWeeklyReviewUseCase({ weeklyReviewRepository, activityRepository, timeBudgetRepository });
      const result = await useCase.execute(req.userId, weekStart);

      if (isSuccess(result)) {
        res.json({ success: true, data: result.value });
        return;
      }
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error al obtener revisión semanal' } });
    } catch (error) {
      next(error);
    }
  },

  async complete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const { id } = req.params;
      const validation = validate(completeWeeklyReviewSchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new CompleteWeeklyReviewUseCase({ weeklyReviewRepository });
      const result = await useCase.execute(req.userId, id, validation.data);

      if (isFailure(result)) {
        res.status(result.error.statusCode).json({ success: false, error: { code: result.error.code, message: result.error.message } });
        return;
      }

      res.json({ success: true, data: result.value });
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      
      const useCase = new GetReviewHistoryUseCase({ weeklyReviewRepository });
      const result = await useCase.execute(req.userId, limit);

      if (isSuccess(result)) {
        res.json({ success: true, data: result.value });
        return;
      }
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error al obtener historial' } });
    } catch (error) {
      next(error);
    }
  },
};
