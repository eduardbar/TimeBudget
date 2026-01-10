// ===========================================
// TimeBudget - Priority Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { IPriorityRepository } from '../../../domain/interfaces/repositories.js';
import type { PriorityEntity, CreatePriorityInput, UpdatePriorityInput } from '../../../domain/entities/priority.entity.js';

export class PriorityRepository implements IPriorityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<PriorityEntity | null> {
    return this.prisma.priority.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<PriorityEntity[]> {
    return this.prisma.priority.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  async findActiveByUser(userId: string): Promise<PriorityEntity[]> {
    return this.prisma.priority.findMany({
      where: { userId, isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async countActiveByUser(userId: string): Promise<number> {
    return this.prisma.priority.count({
      where: { userId, isActive: true },
    });
  }

  async create(data: CreatePriorityInput): Promise<PriorityEntity> {
    return this.prisma.priority.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        order: data.order ?? 0,
        allocatedMinutes: data.allocatedMinutes ?? 0,
      },
    });
  }

  async update(id: string, data: UpdatePriorityInput): Promise<PriorityEntity> {
    return this.prisma.priority.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.allocatedMinutes !== undefined && { allocatedMinutes: data.allocatedMinutes }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.priority.delete({
      where: { id },
    });
  }

  async reorder(userId: string, priorityIds: string[]): Promise<void> {
    const updates = priorityIds.map((id, index) =>
      this.prisma.priority.update({
        where: { id },
        data: { order: index + 1 },
      })
    );

    await this.prisma.$transaction(updates);
  }
}
