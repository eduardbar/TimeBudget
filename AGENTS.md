# AGENTS.md - TimeBudget

This document provides guidance for AI coding agents working in this repository.

## Project Overview

TimeBudget is a full-stack time management application with:
- **Backend**: Node.js + Express + TypeScript + Prisma (PostgreSQL)
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Zustand

Architecture follows **Clean Architecture** with Domain, Application, Infrastructure, and Presentation layers.

## Build, Lint, and Test Commands

### Backend (`cd backend`)

```bash
npm run dev           # Development with hot reload (tsx watch)
npm run build         # Build: prisma generate && tsc
npm run start         # Production: node dist/index.js
npm run lint          # ESLint check
npm run typecheck     # TypeScript check (tsc --noEmit)
npm run test          # Run all tests with Vitest
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage

# Database
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio GUI
```

### Frontend (`cd frontend`)

```bash
npm run dev           # Development server (port 5173)
npm run build         # Build: tsc -b && vite build
npm run preview       # Preview production build
npm run lint          # ESLint check
npm run typecheck     # TypeScript check (tsc --noEmit)
npm run test          # Run all tests with Vitest
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Running Single Tests

```bash
# Run specific test file
npx vitest tests/application/auth/register-user.test.ts

# Run tests matching a pattern
npx vitest -t "should register a new user"

# Watch mode for single file
npx vitest tests/path/to/test.ts --watch

# Run and exit (CI mode)
npx vitest run tests/path/to/test.ts
```

## Code Style Guidelines

### File Naming

- **Files**: kebab-case with descriptive suffixes
  - Use cases: `register-user.use-case.ts`
  - Controllers: `auth.controller.ts`
  - Stores: `auth.store.ts`
  - Components: `Button.tsx` (PascalCase for React components)
  - Tests: `*.test.ts` or `*.test.tsx`

### File Headers

All source files should start with a comment block:
```typescript
// ===========================================
// TimeBudget - [Component/Module Name]
// ===========================================
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Classes | PascalCase | `RegisterUserUseCase` |
| Interfaces | PascalCase, `I` prefix for repos | `IUserRepository` |
| Types | PascalCase | `AuthState`, `ApiResponse<T>` |
| Functions/Variables | camelCase | `getUserById`, `isLoading` |
| Constants (colors) | UPPER_SNAKE_CASE | `COLORS` |
| React Components | PascalCase | `DashboardPage` |
| Zustand Stores | `use[Name]Store` | `useAuthStore` |

### Import Style

```typescript
// Use type imports for type-only imports
import type { Request, Response } from 'express';

// Backend: Use .js extension for ESM compatibility
import { UserRepository } from '../infrastructure/repositories/user.repository.js';

// Frontend: Use path aliases
import { Button } from '@shared/components/Button';
import { useAuthStore } from '@store/auth.store';
```

**Path aliases (frontend)**:
- `@/*` → `src/*`
- `@modules/*` → `src/modules/*`
- `@shared/*` → `src/shared/*`
- `@store/*` → `src/store/*`
- `@services/*` → `src/services/*`

### Formatting Rules (ESLint enforced)

- **Semicolons**: Always required
- **Quotes**: Single quotes (JSX uses double quotes)
- **Indentation**: 2 spaces
- **Trailing commas**: Always in multiline
- **Max line length**: 120 characters
- **Braces**: Always use braces (`curly: 'all'`)
- **Const**: Prefer `const` over `let`; no `var`
- **Equality**: Use strict equality (`===`, `!==`)

### TypeScript Guidelines

- **Strict mode**: Enabled in both frontend and backend
- **No unused variables**: Enabled (`noUnusedLocals`, `noUnusedParameters`)
- **Explicit types**: Prefer explicit return types for public functions
- **Avoid `any`**: Use `unknown` and type guards when type is uncertain

## Architecture Patterns

### Backend - Clean Architecture

```
src/
├── domain/           # Business entities, interfaces, errors
├── application/      # Use cases, DTOs
├── infrastructure/   # Database, external services
└── presentation/     # HTTP controllers, routes, middlewares
```

**Use Case Pattern**:
```typescript
export class RegisterUserUseCase {
  constructor(private readonly deps: {
    userRepository: IUserRepository;
    passwordService: IPasswordService;
  }) {}

  async execute(dto: RegisterUserDTO): Promise<Result<User, DomainError>> {
    // Implementation using Result pattern
  }
}
```

### Error Handling

**Backend - Result Pattern** (no exceptions for business logic):
```typescript
import { Success, Failure, Result } from '../value-objects/result.js';

// In use case
if (!user) {
  return Failure(new UserNotFoundError(userId));
}
return Success(user);

// In controller
const result = await useCase.execute(dto);
if (isFailure(result)) {
  return res.status(result.error.statusCode).json({
    success: false,
    error: { code: result.error.code, message: result.error.message }
  });
}
return res.json({ success: true, data: result.value });
```

**Domain Errors** extend `DomainError`:
```typescript
export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User not found: ${userId}`, 'USER_NOT_FOUND', 404);
  }
}
```

### Frontend - Zustand Stores

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      login: async (credentials) => {
        set({ isLoading: true });
        // API call
        set({ user, isLoading: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
```

### React Components

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx('btn', `btn-${variant}`, className)}
        {...props}
      />
    );
  }
);
```

## Testing Guidelines

- **Pattern**: Arrange-Act-Assert with comments
- **Mocking**: Use `vi.fn()` and `vi.mocked()`
- **Setup**: Reset mocks in `beforeEach`
- **Backend mocks**: Located in `tests/mocks/`
- **Frontend mocks**: Setup mocks localStorage, fetch, matchMedia

```typescript
describe('RegisterUserUseCase', () => {
  it('should register a new user successfully', async () => {
    // Arrange
    const dto = { email: 'test@example.com', password: 'password123' };
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe(dto.email);
    }
  });
});
```

## API Response Format

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: { code: string, message: string } }
```

## Key Files Reference

| Purpose | Path |
|---------|------|
| Backend entry | `backend/src/index.ts` |
| Database schema | `backend/prisma/schema.prisma` |
| Domain errors | `backend/src/domain/errors/domain-errors.ts` |
| Result pattern | `backend/src/domain/value-objects/result.ts` |
| Frontend entry | `frontend/src/main.tsx` |
| API service | `frontend/src/services/api.ts` |
| Type definitions | `frontend/src/shared/types/index.ts` |
