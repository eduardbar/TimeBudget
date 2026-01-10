// ===========================================
// TimeBudget - Login User Use Case
// ===========================================

import type { IUserRepository } from '../../../domain/interfaces/repositories.js';
import type { LoginUserDto, AuthResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { InvalidCredentialsError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { toUserWithoutPassword } from '../../../domain/entities/user.entity.js';

export interface IPasswordComparer {
  compare(password: string, hash: string): Promise<boolean>;
}

export interface ITokenGenerator {
  generate(userId: string): string;
}

export interface LoginUserDependencies {
  userRepository: IUserRepository;
  passwordComparer: IPasswordComparer;
  tokenGenerator: ITokenGenerator;
}

export class LoginUserUseCase {
  constructor(private readonly deps: LoginUserDependencies) {}

  async execute(dto: LoginUserDto): Promise<Result<AuthResponseDto, InvalidCredentialsError | ValidationError>> {
    // Validar datos de entrada
    if (!dto.email || !dto.password) {
      return failure(new ValidationError('Email y contraseña son requeridos'));
    }

    // Buscar usuario por email
    const user = await this.deps.userRepository.findByEmail(dto.email.toLowerCase().trim());
    if (!user) {
      return failure(new InvalidCredentialsError());
    }

    // Verificar contraseña
    const isValidPassword = await this.deps.passwordComparer.compare(dto.password, user.password);
    if (!isValidPassword) {
      return failure(new InvalidCredentialsError());
    }

    // Generar token
    const token = this.deps.tokenGenerator.generate(user.id);

    // Retornar respuesta
    const userWithoutPassword = toUserWithoutPassword(user);
    return success({
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
      },
      token,
    });
  }
}
