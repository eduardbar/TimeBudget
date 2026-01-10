// ===========================================
// TimeBudget - Get Current User Use Case
// ===========================================

import type { IUserRepository } from '../../../domain/interfaces/repositories.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { UserNotFoundError } from '../../../domain/errors/domain-errors.js';
import { toUserWithoutPassword, type UserWithoutPassword } from '../../../domain/entities/user.entity.js';

export interface GetCurrentUserDependencies {
  userRepository: IUserRepository;
}

export class GetCurrentUserUseCase {
  constructor(private readonly deps: GetCurrentUserDependencies) {}

  async execute(userId: string): Promise<Result<UserWithoutPassword, UserNotFoundError>> {
    const user = await this.deps.userRepository.findById(userId);
    
    if (!user) {
      return failure(new UserNotFoundError());
    }

    return success(toUserWithoutPassword(user));
  }
}
