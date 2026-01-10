// ===========================================
// TimeBudget - Priorities Page
// ===========================================

import { useEffect, useState } from 'react';
import { usePriorityStore } from '../../store/priority.store';

export function PrioritiesPage() {
  const { priorities, fetchPriorities, createPriority, updatePriority, deletePriority, isLoading } = usePriorityStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    allocatedMinutes: 0,
  });

  useEffect(() => {
    fetchPriorities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createPriority(form);
    
    if (success) {
      setShowForm(false);
      setForm({ name: '', description: '', allocatedMinutes: 0 });
    }
  };

  const handleUpdate = async (id: string, data: Partial<typeof form>) => {
    await updatePriority(id, data);
    setEditingId(null);
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const canAddMore = priorities.length < 4;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Prioridades Vitales</h1>
          <p className="text-dark-500 mt-1">
            Define 2-4 prioridades que guiarán tu inversión de tiempo
          </p>
        </div>
        {canAddMore && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancelar' : '+ Nueva prioridad'}
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-dark-700 text-sm">
              Las prioridades vitales son las 2-4 áreas más importantes de tu vida en este momento.
              Todo tu tiempo disponible debería invertirse conscientemente en función de ellas.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="font-semibold text-dark-900 mb-4">Nueva prioridad</h3>
          
          <div className="space-y-4">
            <div>
              <label className="label">Nombre de la prioridad</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="input"
                placeholder="Ej: Salud, Familia, Proyecto personal..."
                required
              />
            </div>

            <div>
              <label className="label">Descripción (opcional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                className="input"
                rows={2}
                placeholder="¿Por qué es importante para ti?"
              />
            </div>

            <div>
              <label className="label">
                Tiempo semanal asignado: {formatMinutes(form.allocatedMinutes)}
              </label>
              <input
                type="range"
                min={0}
                max={1200}
                step={30}
                value={form.allocatedMinutes}
                onChange={(e) => setForm(f => ({ ...f, allocatedMinutes: parseInt(e.target.value) }))}
                className="w-full accent-primary-500"
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary mt-4">
            {isLoading ? 'Guardando...' : 'Crear prioridad'}
          </button>
        </form>
      )}

      {/* Priority List */}
      <div className="space-y-4">
        {priorities.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="font-semibold text-dark-900">Define tus prioridades</h3>
            <p className="text-dark-500 text-sm mt-1">
              ¿Qué es lo más importante para ti en este momento de tu vida?
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
              Crear primera prioridad
            </button>
          </div>
        ) : (
          priorities.map((priority, index) => (
            <div key={priority.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  {editingId === priority.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        defaultValue={priority.name}
                        className="input"
                        onBlur={(e) => handleUpdate(priority.id, { name: e.target.value })}
                      />
                      <textarea
                        defaultValue={priority.description || ''}
                        className="input"
                        rows={2}
                        onBlur={(e) => handleUpdate(priority.id, { description: e.target.value })}
                      />
                      <button onClick={() => setEditingId(null)} className="btn-secondary text-sm">
                        Listo
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-dark-900">{priority.name}</h3>
                      {priority.description && (
                        <p className="text-dark-500 text-sm mt-1">{priority.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-dark-600">
                          <span className="font-medium text-primary-600">{formatMinutes(priority.allocatedMinutes)}</span>
                          {' '}asignados por semana
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(editingId === priority.id ? null : priority.id)}
                    className="p-2 text-dark-400 hover:text-dark-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deletePriority(priority.id)}
                    className="p-2 text-dark-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!canAddMore && priorities.length > 0 && (
        <p className="text-dark-500 text-sm text-center">
          Has alcanzado el máximo de 4 prioridades. Elimina una para agregar otra.
        </p>
      )}
    </div>
  );
}
