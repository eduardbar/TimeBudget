// ===========================================
// TimeBudget - Activity Controller
// ===========================================

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { CreateActivityUseCase } from '../../application/use-cases/activity-tracking/create-activity.use-case.js';
import { GetActivitiesUseCase } from '../../application/use-cases/activity-tracking/get-activities.use-case.js';
import { UpdateActivityUseCase } from '../../application/use-cases/activity-tracking/update-activity.use-case.js';
import { DeleteActivityUseCase } from '../../application/use-cases/activity-tracking/delete-activity.use-case.js';
import { ActivityRepository } from '../../infrastructure/database/repositories/activity.repository.js';
import { CategoryRepository } from '../../infrastructure/database/repositories/category.repository.js';
import { TimeBudgetRepository } from '../../infrastructure/database/repositories/time-budget.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';
import { validate, createActivitySchema, updateActivitySchema } from '../validators/index.js';
import { isFailure } from '../../domain/value-objects/result.js';

const activityRepository = new ActivityRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const timeBudgetRepository = new TimeBudgetRepository(prisma);

export const activityController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const validation = validate(createActivitySchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new CreateActivityUseCase({ activityRepository, categoryRepository, timeBudgetRepository });
      const result = await useCase.execute(req.userId, validation.data);

      if (isFailure(result)) {
        res.status(result.error.statusCode).json({ success: false, error: { code: result.error.code, message: result.error.message } });
        return;
      }

      res.status(201).json({ success: true, data: result.value });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const { startDate, endDate, categoryId, limit, offset } = req.query;
      
      const useCase = new GetActivitiesUseCase({ activityRepository, categoryRepository });
      const result = await useCase.execute(req.userId, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        categoryId: categoryId as string | undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });

      res.json({ success: true, data: result.value });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const { id } = req.params;
      const validation = validate(updateActivitySchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new UpdateActivityUseCase({ activityRepository, categoryRepository });
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

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const { id } = req.params;
      const useCase = new DeleteActivityUseCase({ activityRepository });
      const result = await useCase.execute(req.userId, id);

      if (isFailure(result)) {
        res.status(result.error.statusCode).json({ success: false, error: { code: result.error.code, message: result.error.message } });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
