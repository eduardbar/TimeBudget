// ===========================================
// TimeBudget - Priority Entity
// ===========================================

export const MAX_PRIORITIES = 4;
export const MIN_PRIORITIES = 2;

export interface PriorityEntity {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  order: number;
  allocatedMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePriorityInput {
  userId: string;
  name: string;
  description?: string;
  order?: number;
  allocatedMinutes?: number;
}

export interface UpdatePriorityInput {
  name?: string;
  description?: string;
  order?: number;
  allocatedMinutes?: number;
  isActive?: boolean;
}

/**
 * Valida que el orden esté entre 1 y MAX_PRIORITIES
 */
export const isValidPriorityOrder = (order: number): boolean => {
  return order >= 1 && order <= MAX_PRIORITIES;
};

/**
 * Valida que el tiempo asignado sea positivo
 */
export const isValidAllocatedTime = (minutes: number): boolean => {
  return minutes >= 0;
};
