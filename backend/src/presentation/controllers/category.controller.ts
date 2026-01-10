// ===========================================
// TimeBudget - Category Controller
// ===========================================

import type { Request, Response, NextFunction } from 'express';
import { CategoryRepository } from '../../infrastructure/database/repositories/category.repository.js';
import prisma from '../../infrastructure/database/prisma/client.js';

const categoryRepository = new CategoryRepository(prisma);

export const categoryController = {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryRepository.findAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },
};
