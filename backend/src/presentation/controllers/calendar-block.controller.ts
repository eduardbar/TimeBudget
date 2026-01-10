// ===========================================
// TimeBudget - Calendar Block Controller
// ===========================================

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { CreateCalendarBlockUseCase } from '../../application/use-cases/calendar-blocking/create-calendar-block.use-case.js';
import { GetCalendarBlocksUseCase } from '../../application/use-cases/calendar-blocking/get-calendar-blocks.use-case.js';
import { DeleteCalendarBlockUseCase } from '../../application/use-cases/calendar-blocking/delete-calendar-block.use-case.js';
import { CalendarBlockRepository } from '../../infrastructure/database/repositories/calendar-block.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';
import { validate, createCalendarBlockSchema } from '../validators/index.js';
import { isFailure } from '../../domain/value-objects/result.js';

const calendarBlockRepository = new CalendarBlockRepository(prisma);

export const calendarBlockController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No autorizado' } });
        return;
      }

      const validation = validate(createCalendarBlockSchema, req.body);
      if (!validation.success) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') } });
        return;
      }

      const useCase = new CreateCalendarBlockUseCase({ calendarBlockRepository });
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

      const { startDate, endDate } = req.query;
      
      const useCase = new GetCalendarBlocksUseCase({ calendarBlockRepository });
      const result = await useCase.execute(req.userId, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
      });

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
      const useCase = new DeleteCalendarBlockUseCase({ calendarBlockRepository });
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
