// ===========================================
// TimeBudget - TimeBudget Controller
// ===========================================

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { CreateTimeBudgetUseCase } from '../../application/use-cases/time-budget/create-time-budget.use-case.js';
import { GetCurrentTimeBudgetUseCase } from '../../application/use-cases/time-budget/get-current-time-budget.use-case.js';
import { UpdateTimeBudgetUseCase } from '../../application/use-cases/time-budget/update-time-budget.use-case.js';
import { TimeBudgetRepository } from '../../infrastructure/database/repositories/time-budget.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';
import { validate, createTimeBudgetSchema, updateTimeBudgetSchema } from '../validators/index.js';
import { isFailure } from '../../domain/value-objects/result.js';

const timeBudgetRepository = new TimeBudgetRepository(prisma);

export const timeBudgetController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const validation = validate(createTimeBudgetSchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new CreateTimeBudgetUseCase({ timeBudgetRepository });
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

  async getCurrent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const useCase = new GetCurrentTimeBudgetUseCase({ timeBudgetRepository });
      const result = await useCase.execute(req.userId);

      if (isFailure(result)) {
        res.status(result.error.statusCode).json({ success: false, error: { code: result.error.code, message: result.error.message } });
        return;
      }

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
      const validation = validate(updateTimeBudgetSchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new UpdateTimeBudgetUseCase({ timeBudgetRepository });
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
};
