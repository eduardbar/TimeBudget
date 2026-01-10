// ===========================================
// TimeBudget - Weekly Review Page
// ===========================================

import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '../../store/analytics.store';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

export function ReviewPage() {
  const {
    currentReview,
    reviewHistory,
    isLoading,
    fetchCurrentReview,
    fetchReviewHistory,
    completeReview,
  } = useAnalyticsStore();

  const [selectedWeek, setSelectedWeek] = useState<string>(() => {
    const now = new Date();
    return format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  });

  const [formData, setFormData] = useState({
    wins: ['', '', ''],
    challenges: ['', '', ''],
    improvements: ['', '', ''],
    overallScore: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchCurrentReview(selectedWeek);
    fetchReviewHistory(8);
  }, [selectedWeek]);

  useEffect(() => {
    if (currentReview) {
      setFormData({
        wins: currentReview.wins.length > 0 ? [...currentReview.wins, '', '', ''].slice(0, 3) : ['', '', ''],
        challenges: currentReview.challenges.length > 0 ? [...currentReview.challenges, '', '', ''].slice(0, 3) : ['', '', ''],
        improvements: currentReview.improvements.length > 0 ? [...currentReview.improvements, '', '', ''].slice(0, 3) : ['', '', ''],
        overallScore: currentReview.overallScore || 5,
      });
    }
  }, [currentReview]);

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const handleArrayChange = (field: 'wins' | 'challenges' | 'improvements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReview) return;

    setIsSubmitting(true);

    const cleanedData = {
      wins: formData.wins.filter(w => w.trim() !== ''),
      challenges: formData.challenges.filter(c => c.trim() !== ''),
      improvements: formData.improvements.filter(i => i.trim() !== ''),
      overallScore: formData.overallScore,
    };

    const success = await completeReview(currentReview.id, cleanedData);
    
    if (success) {
      fetchReviewHistory(8);
    }

    setIsSubmitting(false);
  };

  const getWeekOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      options.push({
        value: format(weekStart, 'yyyy-MM-dd'),
        label: format(weekStart, "'Semana del' d 'de' MMMM", { locale: es }),
      });
    }
    return options;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🌟';
    if (score >= 7) return '😊';
    if (score >= 5) return '😐';
    if (score >= 3) return '😕';
    return '😞';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Revisión Semanal</h1>
          <p className="text-dark-500 mt-1">
            Reflexiona sobre tu semana y mejora tu gestión del tiempo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="input-field text-sm"
          >
            {getWeekOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn-secondary text-sm"
          >
            {showHistory ? 'Ver actual' : 'Historial'}
          </button>
        </div>
      </div>

      {showHistory ? (
        /* Review History */
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-dark-900">Historial de revisiones</h2>
          {reviewHistory.length > 0 ? (
            <div className="grid gap-4">
              {reviewHistory.map(review => (
                <div key={review.id} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-dark-900">
                        {format(new Date(review.weekStart), "'Semana del' d 'de' MMMM yyyy", { locale: es })}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-dark-500">
                        <span>Tiempo registrado: {formatMinutes(review.totalTrackedMinutes)}</span>
                        <span>Alineación: {review.alignmentPercentage}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {review.isCompleted ? (
                        <div className={`text-2xl font-bold ${getScoreColor(review.overallScore || 0)}`}>
                          {review.overallScore}/10 {getScoreEmoji(review.overallScore || 0)}
                        </div>
                      ) : (
                        <span className="px-2 py-1 bg-dark-100 text-dark-500 rounded text-sm">
                          Sin completar
                        </span>
                      )}
                    </div>
                  </div>
                  {review.isCompleted && (
                    <div className="mt-4 pt-4 border-t border-dark-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {review.wins.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">Victorias</p>
                          <ul className="text-sm text-dark-600 space-y-1">
                            {review.wins.map((win, i) => (
                              <li key={i}>• {win}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.challenges.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-yellow-600 mb-1">Desafíos</p>
                          <ul className="text-sm text-dark-600 space-y-1">
                            {review.challenges.map((challenge, i) => (
                              <li key={i}>• {challenge}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.improvements.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-1">Mejoras</p>
                          <ul className="text-sm text-dark-600 space-y-1">
                            {review.improvements.map((improvement, i) => (
                              <li key={i}>• {improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12 text-dark-400">
              No hay revisiones anteriores
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Current Week Stats */}
          {currentReview && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <p className="text-dark-500 text-sm">Tiempo registrado</p>
                <p className="text-2xl font-bold text-dark-900 mt-1">
                  {formatMinutes(currentReview.totalTrackedMinutes)}
                </p>
              </div>
              <div className="card text-center">
                <p className="text-dark-500 text-sm">Alineado con prioridades</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {currentReview.alignmentPercentage}%
                </p>
              </div>
              <div className="card text-center">
                <p className="text-dark-500 text-sm">Tiempo desperdiciado</p>
                <p className="text-2xl font-bold text-red-500 mt-1">
                  {currentReview.wastedPercentage}%
                </p>
              </div>
              <div className="card text-center">
                <p className="text-dark-500 text-sm">Estado</p>
                <p className={`text-2xl font-bold mt-1 ${currentReview.isCompleted ? 'text-green-500' : 'text-yellow-500'}`}>
                  {currentReview.isCompleted ? 'Completada' : 'Pendiente'}
                </p>
              </div>
            </div>
          )}

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wins */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark-900">Victorias de la semana</h3>
              </div>
              <p className="text-dark-500 text-sm mb-4">
                ¿Qué hiciste bien esta semana? ¿Qué logros tuviste?
              </p>
              <div className="space-y-3">
                {formData.wins.map((win, index) => (
                  <input
                    key={index}
                    type="text"
                    value={win}
                    onChange={(e) => handleArrayChange('wins', index, e.target.value)}
                    placeholder={`Victoria ${index + 1}`}
                    className="input-field"
                    disabled={currentReview?.isCompleted}
                  />
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark-900">Desafíos enfrentados</h3>
              </div>
              <p className="text-dark-500 text-sm mb-4">
                ¿Qué obstáculos encontraste? ¿Qué te costó más?
              </p>
              <div className="space-y-3">
                {formData.challenges.map((challenge, index) => (
                  <input
                    key={index}
                    type="text"
                    value={challenge}
                    onChange={(e) => handleArrayChange('challenges', index, e.target.value)}
                    placeholder={`Desafío ${index + 1}`}
                    className="input-field"
                    disabled={currentReview?.isCompleted}
                  />
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark-900">Mejoras para la próxima semana</h3>
              </div>
              <p className="text-dark-500 text-sm mb-4">
                ¿Qué vas a hacer diferente? ¿Qué vas a mejorar?
              </p>
              <div className="space-y-3">
                {formData.improvements.map((improvement, index) => (
                  <input
                    key={index}
                    type="text"
                    value={improvement}
                    onChange={(e) => handleArrayChange('improvements', index, e.target.value)}
                    placeholder={`Mejora ${index + 1}`}
                    className="input-field"
                    disabled={currentReview?.isCompleted}
                  />
                ))}
              </div>
            </div>

            {/* Overall Score */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark-900">Puntuación general</h3>
              </div>
              <p className="text-dark-500 text-sm mb-4">
                ¿Cómo calificarías tu semana del 1 al 10?
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.overallScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, overallScore: parseInt(e.target.value) }))}
                  className="flex-1 h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  disabled={currentReview?.isCompleted}
                />
                <span className={`text-3xl font-bold ${getScoreColor(formData.overallScore)}`}>
                  {formData.overallScore}/10 {getScoreEmoji(formData.overallScore)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            {!currentReview?.isCompleted && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="btn-primary px-8"
                >
                  {isSubmitting ? 'Guardando...' : 'Completar revisión'}
                </button>
              </div>
            )}

            {currentReview?.isCompleted && (
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900">Revisión completada</p>
                    <p className="text-sm text-dark-600">
                      Completada el {currentReview.completedAt ? format(new Date(currentReview.completedAt), "d 'de' MMMM 'a las' HH:mm", { locale: es }) : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}
