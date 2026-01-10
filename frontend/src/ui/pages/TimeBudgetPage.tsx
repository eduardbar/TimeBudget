// ===========================================
// TimeBudget - Time Budget Page
// ===========================================

import { useEffect, useState } from 'react';
import { useTimeBudgetStore } from '../../store/time-budget.store';

const MINUTES_PER_WEEK = 10080;

export function TimeBudgetPage() {
  const { currentBudget, fetchCurrentBudget, createBudget, updateBudget, isLoading } = useTimeBudgetStore();
  
  const [form, setForm] = useState({
    sleepMinutes: 3360,
    workMinutes: 2400,
    mealsMinutes: 630,
    hygieneMinutes: 420,
    transportMinutes: 300,
  });

  useEffect(() => {
    fetchCurrentBudget();
  }, []);

  useEffect(() => {
    if (currentBudget) {
      setForm({
        sleepMinutes: currentBudget.sleepMinutes,
        workMinutes: currentBudget.workMinutes,
        mealsMinutes: currentBudget.mealsMinutes,
        hygieneMinutes: currentBudget.hygieneMinutes,
        transportMinutes: currentBudget.transportMinutes,
      });
    }
  }, [currentBudget]);

  const baseMinutes = form.sleepMinutes + form.workMinutes + form.mealsMinutes + form.hygieneMinutes + form.transportMinutes;
  const availableMinutes = MINUTES_PER_WEEK - baseMinutes;

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatHoursPerDay = (weeklyMinutes: number) => {
    const dailyMinutes = weeklyMinutes / 7;
    const hours = Math.floor(dailyMinutes / 60);
    const mins = Math.round(dailyMinutes % 60);
    return `${hours}h ${mins}m/día`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentBudget) {
      await updateBudget(currentBudget.id, form);
    } else {
      await createBudget(form);
    }
  };

  const handleSliderChange = (field: keyof typeof form, value: number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const budgetItems = [
    { key: 'sleepMinutes' as const, label: 'Sueño', color: 'bg-indigo-500', max: 4200, description: 'Horas de descanso nocturno' },
    { key: 'workMinutes' as const, label: 'Trabajo', color: 'bg-blue-500', max: 3600, description: 'Tiempo laboral incluyendo pausas' },
    { key: 'mealsMinutes' as const, label: 'Comidas', color: 'bg-green-500', max: 1260, description: 'Preparación y consumo de alimentos' },
    { key: 'hygieneMinutes' as const, label: 'Higiene', color: 'bg-cyan-500', max: 840, description: 'Aseo personal y rutinas' },
    { key: 'transportMinutes' as const, label: 'Transporte', color: 'bg-yellow-500', max: 1260, description: 'Desplazamientos' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Presupuesto de Tiempo</h1>
        <p className="text-dark-500 mt-1">
          Define tu tiempo base para calcular cuántas horas tienes disponibles cada semana
        </p>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-primary-100 text-sm">Total semanal</p>
            <p className="text-3xl font-bold mt-1">{formatMinutes(MINUTES_PER_WEEK)}</p>
            <p className="text-primary-200 text-sm">168 horas</p>
          </div>
          <div>
            <p className="text-primary-100 text-sm">Tiempo base</p>
            <p className="text-3xl font-bold mt-1">{formatMinutes(baseMinutes)}</p>
            <p className="text-primary-200 text-sm">{Math.round((baseMinutes / MINUTES_PER_WEEK) * 100)}% del total</p>
          </div>
          <div>
            <p className="text-primary-100 text-sm">Tiempo disponible</p>
            <p className="text-3xl font-bold mt-1">{formatMinutes(availableMinutes)}</p>
            <p className="text-primary-200 text-sm">{Math.round((availableMinutes / MINUTES_PER_WEEK) * 100)}% del total</p>
          </div>
        </div>
      </div>

      {/* Budget Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="font-semibold text-dark-900 mb-6">Configura tu tiempo base</h3>
          
          <div className="space-y-8">
            {budgetItems.map(item => (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-dark-900">{item.label}</span>
                    <p className="text-sm text-dark-400">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-dark-900">{formatMinutes(form[item.key])}</span>
                    <p className="text-sm text-dark-400">{formatHoursPerDay(form[item.key])}</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={item.max}
                    step={30}
                    value={form[item.key]}
                    onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div
                    className={`absolute top-0 left-0 h-2 ${item.color} rounded-lg pointer-events-none`}
                    style={{ width: `${(form[item.key] / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual breakdown */}
        <div className="card">
          <h3 className="font-semibold text-dark-900 mb-4">Distribución visual</h3>
          <div className="h-8 rounded-lg overflow-hidden flex">
            {budgetItems.map(item => (
              <div
                key={item.key}
                className={`${item.color} transition-all duration-300`}
                style={{ width: `${(form[item.key] / MINUTES_PER_WEEK) * 100}%` }}
                title={`${item.label}: ${formatMinutes(form[item.key])}`}
              />
            ))}
            <div
              className="bg-primary-500"
              style={{ width: `${(availableMinutes / MINUTES_PER_WEEK) * 100}%` }}
              title={`Disponible: ${formatMinutes(availableMinutes)}`}
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {budgetItems.map(item => (
              <div key={item.key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-dark-600">{item.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-sm text-dark-600">Disponible</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || availableMinutes < 0}
          className="btn-primary"
        >
          {isLoading ? 'Guardando...' : currentBudget ? 'Actualizar presupuesto' : 'Crear presupuesto'}
        </button>

        {availableMinutes < 0 && (
          <p className="text-red-500 text-sm">
            El tiempo base excede las horas de la semana. Ajusta los valores.
          </p>
        )}
      </form>
    </div>
  );
}
