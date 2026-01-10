// ===========================================
// TimeBudget - Dashboard Page
// ===========================================

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuthStore } from '../../store/auth.store';
import { useTimeBudgetStore } from '../../store/time-budget.store';
import { useAnalyticsStore } from '../../store/analytics.store';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

export function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const { currentBudget, fetchCurrentBudget } = useTimeBudgetStore();
  const { weeklyAnalytics, trends, fetchWeeklyAnalytics, fetchTrends } = useAnalyticsStore();

  useEffect(() => {
    fetchCurrentBudget();
    fetchWeeklyAnalytics();
    fetchTrends();
  }, []);

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900">
          Hola, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-dark-500 mt-1">
          Así va tu semana hasta ahora
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-dark-500 text-sm">Tiempo disponible</p>
          <p className="text-3xl font-bold text-dark-900 mt-1">
            {currentBudget ? formatMinutes(currentBudget.availableMinutes) : '--'}
          </p>
          <p className="text-dark-400 text-sm mt-2">esta semana</p>
        </div>

        <div className="card">
          <p className="text-dark-500 text-sm">Tiempo registrado</p>
          <p className="text-3xl font-bold text-primary-500 mt-1">
            {weeklyAnalytics ? formatMinutes(weeklyAnalytics.totalTrackedMinutes) : '--'}
          </p>
          <p className="text-dark-400 text-sm mt-2">
            {weeklyAnalytics ? `${weeklyAnalytics.usagePercentage}% del disponible` : ''}
          </p>
        </div>

        <div className="card">
          <p className="text-dark-500 text-sm">Alineación con prioridades</p>
          <p className="text-3xl font-bold text-green-500 mt-1">
            {weeklyAnalytics ? `${weeklyAnalytics.priorityAlignment}%` : '--'}
          </p>
          <p className="text-dark-400 text-sm mt-2">de tus actividades</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card">
          <h3 className="font-semibold text-dark-900 mb-4">Distribución por categoría</h3>
          {weeklyAnalytics && weeklyAnalytics.categoryBreakdown.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weeklyAnalytics.categoryBreakdown}
                      dataKey="totalMinutes"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                    >
                      {weeklyAnalytics.categoryBreakdown.map((entry, index) => (
                        <Cell key={entry.categoryId} fill={entry.categoryColor || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {weeklyAnalytics.categoryBreakdown.slice(0, 5).map((cat, index) => (
                  <div key={cat.categoryId} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.categoryColor || COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-dark-600 flex-1">{cat.categoryName}</span>
                    <span className="text-sm font-medium text-dark-900">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-dark-400">
              <p>No hay datos de actividades aún</p>
            </div>
          )}
        </div>

        {/* Trends */}
        <div className="card">
          <h3 className="font-semibold text-dark-900 mb-4">Tendencia semanal</h3>
          {trends.length > 0 ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-dark-400">
              <p>Completa tu primera revisión semanal</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-semibold text-dark-900 mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/activities" className="p-4 rounded-lg border border-dark-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-dark-700">Registrar actividad</span>
          </Link>

          <Link to="/budget" className="p-4 rounded-lg border border-dark-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-sm font-medium text-dark-700">Ver presupuesto</span>
          </Link>

          <Link to="/priorities" className="p-4 rounded-lg border border-dark-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-dark-700">Mis prioridades</span>
          </Link>

          <Link to="/review" className="p-4 rounded-lg border border-dark-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-dark-700">Revisión semanal</span>
          </Link>
        </div>
      </div>

      {/* No budget warning */}
      {!currentBudget && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-dark-900">Configura tu presupuesto de tiempo</h4>
              <p className="text-dark-600 text-sm mt-1">
                Define cuánto tiempo dedicas a dormir, trabajar, comer y otras actividades base para calcular tu tiempo disponible.
              </p>
              <Link to="/budget" className="btn-primary mt-3 inline-block text-sm">
                Configurar ahora
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
