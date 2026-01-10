// ===========================================
// TimeBudget - User Repository Implementation
// ===========================================

import type { PrismaClient } from '@prisma/client';
import type { IUserRepository } from '../../../domain/interfaces/repositories.js';
import type { UserEntity, CreateUserInput } from '../../../domain/entities/user.entity.js';

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async create(data: CreateUserInput): Promise<UserEntity> {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
      },
    });
  }

  async update(id: string, data: Partial<CreateUserInput>): Promise<UserEntity> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email.toLowerCase() }),
        ...(data.password && { password: data.password }),
        ...(data.name && { name: data.name }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
