// ===========================================
// TimeBudget - Category Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { ICategoryRepository } from '../../../domain/interfaces/repositories.js';
import type { CategoryEntity } from '../../../domain/entities/category.entity.js';
import { DEFAULT_CATEGORIES } from '../../../domain/entities/category.entity.js';

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findDefaults(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany({
      where: { isDefault: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: Omit<CategoryEntity, 'id'>): Promise<CategoryEntity> {
    return this.prisma.category.create({
      data,
    });
  }

  async seedDefaults(): Promise<void> {
    for (const category of DEFAULT_CATEGORIES) {
      await this.prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }
  }
}
