// ===========================================
// TimeBudget - Activities Page
// ===========================================

import { useEffect, useState } from 'react';
import { useActivityStore } from '../../store/activity.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ActivitiesPage() {
  const { activities, categories, fetchActivities, fetchCategories, createActivity, deleteActivity, isLoading } = useActivityStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    durationMinutes: 30,
    date: new Date().toISOString().split('T')[0],
    alignedWithPriorities: false,
    satisfactionLevel: 3,
  });

  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createActivity({
      ...form,
      date: new Date(form.date).toISOString(),
      satisfactionLevel: form.satisfactionLevel || undefined,
    });
    
    if (success) {
      setShowForm(false);
      setForm({
        name: '',
        description: '',
        categoryId: '',
        durationMinutes: 30,
        date: new Date().toISOString().split('T')[0],
        alignedWithPriorities: false,
        satisfactionLevel: 3,
      });
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6B7280';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Registro de Actividades</h1>
          <p className="text-dark-500 mt-1">Registra cómo inviertes tu tiempo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancelar' : '+ Nueva actividad'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="font-semibold text-dark-900 mb-4">Nueva actividad</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="input"
                placeholder="¿Qué hiciste?"
                required
              />
            </div>

            <div>
              <label className="label">Categoría</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))}
                className="input"
                required
              >
                <option value="">Selecciona...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Duración: {formatMinutes(form.durationMinutes)}</label>
              <input
                type="range"
                min={5}
                max={480}
                step={5}
                value={form.durationMinutes}
                onChange={(e) => setForm(f => ({ ...f, durationMinutes: parseInt(e.target.value) }))}
                className="w-full accent-primary-500"
              />
            </div>

            <div>
              <label className="label">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Satisfacción: {form.satisfactionLevel}/5</label>
              <input
                type="range"
                min={1}
                max={5}
                value={form.satisfactionLevel}
                onChange={(e) => setForm(f => ({ ...f, satisfactionLevel: parseInt(e.target.value) }))}
                className="w-full accent-primary-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="aligned"
                checked={form.alignedWithPriorities}
                onChange={(e) => setForm(f => ({ ...f, alignedWithPriorities: e.target.checked }))}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
              />
              <label htmlFor="aligned" className="text-dark-700">
                Alineada con mis prioridades
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="label">Descripción (opcional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                className="input"
                rows={2}
                placeholder="Notas adicionales..."
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary mt-4">
            {isLoading ? 'Guardando...' : 'Guardar actividad'}
          </button>
        </form>
      )}

      {/* Activity List */}
      <div className="card">
        <h3 className="font-semibold text-dark-900 mb-4">Actividades recientes</h3>
        
        {activities.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            <p>No hay actividades registradas</p>
            <p className="text-sm mt-1">Comienza registrando tu primera actividad</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map(activity => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-dark-200 hover:border-dark-300 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(activity.categoryId) }}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-dark-900 truncate">{activity.name}</h4>
                    {activity.alignedWithPriorities && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Alineada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-dark-500 mt-1">
                    <span>{activity.categoryName}</span>
                    <span>•</span>
                    <span>{formatMinutes(activity.durationMinutes)}</span>
                    <span>•</span>
                    <span>{format(new Date(activity.date), 'dd MMM', { locale: es })}</span>
                    {activity.satisfactionLevel && (
                      <>
                        <span>•</span>
                        <span>{'★'.repeat(activity.satisfactionLevel)}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteActivity(activity.id)}
                  className="text-dark-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
