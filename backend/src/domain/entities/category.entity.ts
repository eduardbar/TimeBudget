// ===========================================
// TimeBudget - Category Entity
// ===========================================

export interface CategoryEntity {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  isDefault: boolean;
}

// Categorías predeterminadas del sistema
export const DEFAULT_CATEGORIES: Omit<CategoryEntity, 'id'>[] = [
  { name: 'Trabajo', description: 'Actividades laborales', color: '#3B82F6', icon: 'briefcase', isDefault: true },
  { name: 'Ejercicio', description: 'Actividad física y deporte', color: '#10B981', icon: 'dumbbell', isDefault: true },
  { name: 'Familia', description: 'Tiempo con familia', color: '#F59E0B', icon: 'users', isDefault: true },
  { name: 'Estudio', description: 'Aprendizaje y formación', color: '#8B5CF6', icon: 'book', isDefault: true },
  { name: 'Ocio', description: 'Entretenimiento y relajación', color: '#EC4899', icon: 'gamepad', isDefault: true },
  { name: 'Social', description: 'Actividades sociales', color: '#06B6D4', icon: 'chat', isDefault: true },
  { name: 'Salud', description: 'Cuidado de la salud', color: '#EF4444', icon: 'heart', isDefault: true },
  { name: 'Hogar', description: 'Tareas del hogar', color: '#84CC16', icon: 'home', isDefault: true },
  { name: 'Proyectos', description: 'Proyectos personales', color: '#F97316', icon: 'rocket', isDefault: true },
  { name: 'Otro', description: 'Otras actividades', color: '#6B7280', icon: 'dots', isDefault: true },
];
