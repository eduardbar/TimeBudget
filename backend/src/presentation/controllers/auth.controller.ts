// ===========================================
// TimeBudget - Auth Controller
// ===========================================

import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case.js';
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.use-case.js';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/get-current-user.use-case.js';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository.js';
import { passwordService } from '../../infrastructure/services/password.service.js';
import { tokenService } from '../../infrastructure/services/token.service.js';
import prisma from '../../infrastructure/database/prisma/client.js';
import { validate, registerSchema, loginSchema } from '../validators/index.js';
import { isFailure } from '../../domain/value-objects/result.js';

const userRepository = new UserRepository(prisma);

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validate(registerSchema, req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') },
        });
        return;
      }

      const useCase = new RegisterUserUseCase({
        userRepository,
        passwordHasher: passwordService,
        tokenGenerator: tokenService,
      });

      const result = await useCase.execute(validation.data);

      if (isFailure(result)) {
        res.status(result.error.statusCode).json({
          success: false,
          error: { code: result.error.code, message: result.error.message },
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.value,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = validate(loginSchema, req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: validation.errors.join(', ') },
        });
        return;
      }

      const useCase = new LoginUserUseCase({
        userRepository,
        passwordComparer: passwordService,
        tokenGenerator: tokenService,
      });

      const result = await useCase.execute(validation.data);

      if (isFailure(result)) {
        res.status(result.error.statusCode).json({
          success: false,
          error: { code: result.error.code, message: result.error.message },
        });
        return;
      }

      res.json({
        success: true,
        data: result.value,
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'No autorizado' },
        });
        return;
      }

      const useCase = new GetCurrentUserUseCase({ userRepository });
      const result = await useCase.execute(req.userId);

      if (isFailure(result)) {
        res.status(result.error.statusCode).json({
          success: false,
          error: { code: result.error.code, message: result.error.message },
        });
        return;
      }

      res.json({
        success: true,
        data: result.value,
      });
    } catch (error) {
      next(error);
    }
  },
};
