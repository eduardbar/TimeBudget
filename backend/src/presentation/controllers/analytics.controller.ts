// ===========================================
// TimeBudget - Analytics Controller
// ===========================================

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { GetWeeklyAnalyticsUseCase } from '../../application/use-cases/analytics/get-weekly-analytics.use-case.js';
import { GetTrendsUseCase } from '../../application/use-cases/analytics/get-trends.use-case.js';
import { ActivityRepository } from '../../infrastructure/database/repositories/activity.repository.js';
import { TimeBudgetRepository } from '../../infrastructure/database/repositories/time-budget.repository.js';
import { CategoryRepository } from '../../infrastructure/database/repositories/category.repository.js';
import { WeeklyReviewRepository } from '../../infrastructure/database/repositories/weekly-review.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';

const activityRepository = new ActivityRepository(prisma);
const timeBudgetRepository = new TimeBudgetRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const weeklyReviewRepository = new WeeklyReviewRepository(prisma);

export const analyticsController = {
  async getWeekly(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const weekStart = req.query.weekStart as string | undefined;
      
      const useCase = new GetWeeklyAnalyticsUseCase({ activityRepository, timeBudgetRepository, categoryRepository });
      const result = await useCase.execute(req.userId, weekStart);

      res.json({ success: true, data: result.value });
    } catch (error) {
      next(error);
    }
  },

  async getTrends(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const weeks = req.query.weeks ? parseInt(req.query.weeks as string, 10) : 8;
      
      const useCase = new GetTrendsUseCase({ weeklyReviewRepository });
      const result = await useCase.execute(req.userId, weeks);

      res.json({ success: true, data: result.value });
    } catch (error) {
      next(error);
    }
  },
};
