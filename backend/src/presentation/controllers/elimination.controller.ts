// ===========================================
// TimeBudget - Elimination Controller
// ===========================================

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { CreateEliminationUseCase } from '../../application/use-cases/elimination/create-elimination.use-case.js';
import { GetEliminationsUseCase } from '../../application/use-cases/elimination/get-eliminations.use-case.js';
import { EliminationRepository } from '../../infrastructure/database/repositories/elimination.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';
import { validate, createEliminationSchema } from '../validators/index.js';
import { isFailure } from '../../domain/value-objects/result.js';

const eliminationRepository = new EliminationRepository(prisma);

export const eliminationController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const validation = validate(createEliminationSchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new CreateEliminationUseCase({ eliminationRepository });
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

      const useCase = new GetEliminationsUseCase({ eliminationRepository });
      const result = await useCase.execute(req.userId);

      res.json({ success: true, data: result.value });
    } catch (error) {
      next(error);
    }
  },
};
