// ===========================================
// TimeBudget - Calendar Block Entity
// ===========================================

export type BlockType = 'PRIORITY' | 'ROUTINE' | 'PROTECTED';
export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'CUSTOM';

export interface CalendarBlockEntity {
  id: string;
  userId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  blockType: BlockType;
  isRecurring: boolean;
  recurrence: RecurrenceType | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCalendarBlockInput {
  userId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  blockType?: BlockType;
  isRecurring?: boolean;
  recurrence?: RecurrenceType;
}

export interface UpdateCalendarBlockInput {
  title?: string;
  startTime?: Date;
  endTime?: Date;
  blockType?: BlockType;
  isRecurring?: boolean;
  recurrence?: RecurrenceType | null;
}

/**
 * Valida que el tiempo de fin sea posterior al de inicio
 */
export const isValidTimeRange = (startTime: Date, endTime: Date): boolean => {
  return endTime > startTime;
};

/**
 * Calcula la duración del bloque en minutos
 */
export const calculateBlockDuration = (startTime: Date, endTime: Date): number => {
  return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
};

/**
 * Verifica si dos bloques se superponen
 */
export const blocksOverlap = (
  block1Start: Date,
  block1End: Date,
  block2Start: Date,
  block2End: Date
): boolean => {
  return block1Start < block2End && block1End > block2Start;
};
