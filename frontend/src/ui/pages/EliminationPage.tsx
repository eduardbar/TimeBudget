// ===========================================
// TimeBudget - Elimination Page
// ===========================================

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEliminationStore } from '../../store/elimination.store';

export function EliminationPage() {
  const { eliminations, totalRecoveredMinutes, isLoading, fetchEliminations, createElimination } =
    useEliminationStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    activityName: '',
    reason: '',
    recoveredMinutes: 30,
  });

  useEffect(() => {
    fetchEliminations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await createElimination({
      activityName: formData.activityName,
      reason: formData.reason || undefined,
      recoveredMinutes: formData.recoveredMinutes,
    });

    if (success) {
      setShowForm(false);
      setFormData({
        activityName: '',
        reason: '',
        recoveredMinutes: 30,
      });
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatHoursPerWeek = (minutes: number) => {
    const hoursPerWeek = minutes / 60;
    return hoursPerWeek.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Eliminación de Actividades</h1>
          <p className="text-dark-500 mt-1">
            Identifica y elimina actividades que no aportan valor a tu vida
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Registrar eliminación
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-green-700 text-sm font-medium">Tiempo recuperado</p>
              <p className="text-3xl font-bold text-green-800">
                {formatMinutes(totalRecoveredMinutes)}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-blue-700 text-sm font-medium">Horas por semana liberadas</p>
              <p className="text-3xl font-bold text-blue-800">
                {formatHoursPerWeek(totalRecoveredMinutes)}h
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <p className="text-purple-700 text-sm font-medium">Actividades eliminadas</p>
              <p className="text-3xl font-bold text-purple-800">{eliminations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-dark-900">Consejos para eliminar actividades</h4>
            <ul className="text-dark-600 text-sm mt-2 space-y-1">
              <li>
                <strong>Redes sociales sin propósito:</strong> Scrolling infinito que no aporta valor
              </li>
              <li>
                <strong>Reuniones innecesarias:</strong> Reuniones que podrían ser un email
              </li>
              <li>
                <strong>Multitasking ineficiente:</strong> Tareas que requieren contexto repetido
              </li>
              <li>
                <strong>Procrastinación:</strong> Tiempo perdido evitando tareas importantes
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Eliminations List */}
      <div className="card">
        <h3 className="font-semibold text-dark-900 mb-4">Historial de eliminaciones</h3>

        {eliminations.length > 0 ? (
          <div className="space-y-3">
            {eliminations.map((elimination) => (
              <div
                key={elimination.id}
                className="flex items-center justify-between p-4 rounded-lg bg-dark-50 hover:bg-dark-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-dark-900">{elimination.activityName}</p>
                    {elimination.reason && (
                      <p className="text-sm text-dark-500">{elimination.reason}</p>
                    )}
                    <p className="text-xs text-dark-400 mt-1">
                      Eliminada el{' '}
                      {format(new Date(elimination.eliminatedAt), "d 'de' MMMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-500">
                    +{formatMinutes(elimination.recoveredMinutes)}
                  </p>
                  <p className="text-xs text-dark-400">recuperados/semana</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-dark-100 text-dark-400 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <p className="text-dark-500">No has eliminado ninguna actividad todavía</p>
            <p className="text-dark-400 text-sm mt-1">
              Identifica actividades que no aportan valor y recupéra tu tiempo
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
              Registrar primera eliminación
            </button>
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-900">Registrar eliminación</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-dark-400 hover:text-dark-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Nombre de la actividad</label>
                <input
                  type="text"
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                  className="input"
                  placeholder="Ej: Scrolling en Instagram"
                  required
                />
              </div>

              <div>
                <label className="label">Razón de eliminación (opcional)</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="¿Por qué decidiste eliminar esta actividad?"
                />
              </div>

              <div>
                <label className="label">Tiempo recuperado por semana (minutos)</label>
                <input
                  type="number"
                  value={formData.recoveredMinutes}
                  onChange={(e) =>
                    setFormData({ ...formData, recoveredMinutes: parseInt(e.target.value) || 0 })
                  }
                  className="input"
                  min="1"
                  required
                />
                <p className="text-sm text-dark-400 mt-1">
                  Equivale a {formatMinutes(formData.recoveredMinutes)} por semana
                </p>
              </div>

              {/* Quick presets */}
              <div>
                <p className="text-sm text-dark-500 mb-2">Presets rápidos:</p>
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 60, 120, 180].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setFormData({ ...formData, recoveredMinutes: mins })}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.recoveredMinutes === mins
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                      }`}
                    >
                      {formatMinutes(mins)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                  {isLoading ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
