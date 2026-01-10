// ===========================================
// TimeBudget - Register User Use Case
// ===========================================

import type { IUserRepository } from '../../../domain/interfaces/repositories.js';
import type { RegisterUserDto, AuthResponseDto } from '../../dtos/index.js';
import { Result, success, failure } from '../../../domain/value-objects/result.js';
import { EmailAlreadyExistsError, ValidationError } from '../../../domain/errors/domain-errors.js';
import { toUserWithoutPassword } from '../../../domain/entities/user.entity.js';

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export interface ITokenGenerator {
  generate(userId: string): string;
}

export interface RegisterUserDependencies {
  userRepository: IUserRepository;
  passwordHasher: IPasswordHasher;
  tokenGenerator: ITokenGenerator;
}

export class RegisterUserUseCase {
  constructor(private readonly deps: RegisterUserDependencies) {}

  async execute(dto: RegisterUserDto): Promise<Result<AuthResponseDto, EmailAlreadyExistsError | ValidationError>> {
    // Validar datos de entrada
    if (!dto.email || !dto.password || !dto.name) {
      return failure(new ValidationError('Email, contraseña y nombre son requeridos'));
    }

    if (dto.password.length < 8) {
      return failure(new ValidationError('La contraseña debe tener al menos 8 caracteres'));
    }

    // Verificar si el email ya existe
    const existingUser = await this.deps.userRepository.findByEmail(dto.email);
    if (existingUser) {
      return failure(new EmailAlreadyExistsError(dto.email));
    }

    // Hashear contraseña
    const hashedPassword = await this.deps.passwordHasher.hash(dto.password);

    // Crear usuario
    const user = await this.deps.userRepository.create({
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      name: dto.name.trim(),
    });

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
