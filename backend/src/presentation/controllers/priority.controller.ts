// ===========================================
// TimeBudget - Priority Controller
// ===========================================

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { CreatePriorityUseCase } from '../../application/use-cases/priorities/create-priority.use-case.js';
import { GetPrioritiesUseCase } from '../../application/use-cases/priorities/get-priorities.use-case.js';
import { UpdatePriorityUseCase } from '../../application/use-cases/priorities/update-priority.use-case.js';
import { ReorderPrioritiesUseCase } from '../../application/use-cases/priorities/reorder-priorities.use-case.js';
import { DeletePriorityUseCase } from '../../application/use-cases/priorities/delete-priority.use-case.js';
import { PriorityRepository } from '../../infrastructure/database/repositories/priority.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';
import { validate, createPrioritySchema, updatePrioritySchema, reorderPrioritiesSchema } from '../validators/index.js';
import { isFailure } from '../../domain/value-objects/result.js';

const priorityRepository = new PriorityRepository(prisma);

export const priorityController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const validation = validate(createPrioritySchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new CreatePriorityUseCase({ priorityRepository });
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

      const onlyActive = req.query.active !== 'false';
      const useCase = new GetPrioritiesUseCase({ priorityRepository });
      const result = await useCase.execute(req.userId, onlyActive);

      if (isFailure(result)) {
        res.status(500).json({ success: false, error: { code: 'ERROR', message: 'Error fetching priorities' } });
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
      const validation = validate(updatePrioritySchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new UpdatePriorityUseCase({ priorityRepository });
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

  async reorder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const validation = validate(reorderPrioritiesSchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new ReorderPrioritiesUseCase({ priorityRepository });
      const result = await useCase.execute(req.userId, validation.data);

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
      const useCase = new DeletePriorityUseCase({ priorityRepository });
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
