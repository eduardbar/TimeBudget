// ===========================================
// TimeBudget - Elimination Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { IEliminationRepository } from '../../../domain/interfaces/repositories.js';
import type { EliminationEntity, CreateEliminationInput } from '../../../domain/entities/elimination.entity.js';

export class EliminationRepository implements IEliminationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<EliminationEntity | null> {
    return this.prisma.elimination.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<EliminationEntity[]> {
    return this.prisma.elimination.findMany({
      where: { userId },
      orderBy: { eliminatedAt: 'desc' },
    });
  }

  async create(data: CreateEliminationInput): Promise<EliminationEntity> {
    return this.prisma.elimination.create({
      data: {
        userId: data.userId,
        activityName: data.activityName,
        reason: data.reason,
        recoveredMinutes: data.recoveredMinutes ?? 0,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.elimination.delete({
      where: { id },
    });
  }

  async sumRecoveredMinutes(userId: string): Promise<number> {
    const result = await this.prisma.elimination.aggregate({
      where: { userId },
      _sum: {
        recoveredMinutes: true,
      },
    });

    return result._sum.recoveredMinutes ?? 0;
  }
}
