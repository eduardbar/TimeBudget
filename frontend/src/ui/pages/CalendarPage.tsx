// ===========================================
// TimeBudget - Calendar Page
// ===========================================

import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCalendarBlockStore } from '../../store/calendar-block.store';
import type { BlockType, RecurrenceType, CalendarBlock } from '../../shared/types';

const BLOCK_TYPES: { value: BlockType; label: string; color: string }[] = [
  { value: 'PRIORITY', label: 'Prioridad', color: 'bg-primary-500' },
  { value: 'ROUTINE', label: 'Rutina', color: 'bg-blue-500' },
  { value: 'PROTECTED', label: 'Protegido', color: 'bg-green-500' },
];

const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: 'DAILY', label: 'Diario' },
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'WEEKDAYS', label: 'Días laborales' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function CalendarPage() {
  const { blocks, isLoading, fetchCalendarBlocks, createCalendarBlock, deleteCalendarBlock } =
    useCalendarBlockStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startHour: '09',
    startMinute: '00',
    endHour: '10',
    endMinute: '00',
    blockType: 'PRIORITY' as BlockType,
    isRecurring: false,
    recurrence: 'WEEKLY' as RecurrenceType,
  });

  useEffect(() => {
    fetchCalendarBlocks(format(currentWeekStart, 'yyyy-MM-dd'));
  }, [currentWeekStart]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startTime = `${formData.date}T${formData.startHour}:${formData.startMinute}:00`;
    const endTime = `${formData.date}T${formData.endHour}:${formData.endMinute}:00`;

    const success = await createCalendarBlock({
      title: formData.title,
      startTime,
      endTime,
      blockType: formData.blockType,
      isRecurring: formData.isRecurring,
      recurrence: formData.isRecurring ? formData.recurrence : undefined,
    });

    if (success) {
      setShowForm(false);
      setFormData({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startHour: '09',
        startMinute: '00',
        endHour: '10',
        endMinute: '00',
        blockType: 'PRIORITY',
        isRecurring: false,
        recurrence: 'WEEKLY',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este bloque de tiempo?')) {
      await deleteCalendarBlock(id);
    }
  };

  const getBlocksForDay = (day: Date): CalendarBlock[] => {
    return blocks.filter((block) => {
      const blockDate = parseISO(block.startTime);
      return isSameDay(blockDate, day);
    });
  };

  const getBlockStyle = (block: CalendarBlock) => {
    const start = parseISO(block.startTime);
    const end = parseISO(block.endTime);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const top = (startHour / 24) * 100;
    const height = ((endHour - startHour) / 24) * 100;

    const typeConfig = BLOCK_TYPES.find((t) => t.value === block.blockType);

    return {
      top: `${top}%`,
      height: `${Math.max(height, 2)}%`,
      backgroundColor: typeConfig?.value === 'PRIORITY' ? '#f97316' : typeConfig?.value === 'ROUTINE' ? '#3b82f6' : '#10b981',
    };
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const totalBlockedMinutes = blocks.reduce((sum, block) => sum + block.durationMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Calendario de Bloques</h1>
          <p className="text-dark-500 mt-1">
            Bloquea tiempo para tus prioridades y protege tu agenda
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Nuevo bloque
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center py-4">
          <p className="text-dark-500 text-sm">Bloques esta semana</p>
          <p className="text-2xl font-bold text-dark-900">{blocks.length}</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-dark-500 text-sm">Tiempo bloqueado</p>
          <p className="text-2xl font-bold text-primary-500">{formatMinutes(totalBlockedMinutes)}</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-dark-500 text-sm">Prioridades</p>
          <p className="text-2xl font-bold text-primary-500">
            {blocks.filter((b) => b.blockType === 'PRIORITY').length}
          </p>
        </div>
        <div className="card text-center py-4">
          <p className="text-dark-500 text-sm">Rutinas</p>
          <p className="text-2xl font-bold text-blue-500">
            {blocks.filter((b) => b.blockType === 'ROUTINE').length}
          </p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentWeekStart((prev) => addDays(prev, -7))}
          className="btn-secondary"
        >
          &larr; Semana anterior
        </button>
        <h2 className="text-lg font-semibold text-dark-900">
          {format(currentWeekStart, "d 'de' MMMM", { locale: es })} -{' '}
          {format(addDays(currentWeekStart, 6), "d 'de' MMMM yyyy", { locale: es })}
        </h2>
        <button
          onClick={() => setCurrentWeekStart((prev) => addDays(prev, 7))}
          className="btn-secondary"
        >
          Semana siguiente &rarr;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="card p-0 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b border-dark-200">
          <div className="p-3 text-center text-sm font-medium text-dark-500 bg-dark-50"></div>
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-3 text-center border-l border-dark-200 ${
                isSameDay(day, new Date()) ? 'bg-primary-50' : 'bg-dark-50'
              }`}
            >
              <p className="text-sm font-medium text-dark-500">
                {format(day, 'EEE', { locale: es })}
              </p>
              <p
                className={`text-lg font-bold ${
                  isSameDay(day, new Date()) ? 'text-primary-500' : 'text-dark-900'
                }`}
              >
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8" style={{ height: '600px' }}>
          {/* Hour Labels */}
          <div className="relative border-r border-dark-200 bg-dark-50">
            {HOURS.filter((h) => h % 2 === 0).map((hour) => (
              <div
                key={hour}
                className="absolute text-xs text-dark-400 -translate-y-1/2"
                style={{ top: `${(hour / 24) * 100}%`, right: '8px' }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="relative border-l border-dark-200">
              {/* Hour Lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute w-full border-t border-dark-100"
                  style={{ top: `${(hour / 24) * 100}%` }}
                />
              ))}

              {/* Blocks */}
              {getBlocksForDay(day).map((block) => (
                <div
                  key={block.id}
                  className="absolute left-1 right-1 rounded px-1 py-0.5 text-white text-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  style={getBlockStyle(block)}
                  onClick={() => handleDelete(block.id)}
                  title={`${block.title} - Click para eliminar`}
                >
                  <p className="font-medium truncate">{block.title}</p>
                  {block.durationMinutes >= 60 && (
                    <p className="opacity-80 truncate">
                      {format(parseISO(block.startTime), 'HH:mm')} -{' '}
                      {format(parseISO(block.endTime), 'HH:mm')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Block List */}
      <div className="card">
        <h3 className="font-semibold text-dark-900 mb-4">Bloques de esta semana</h3>
        {blocks.length > 0 ? (
          <div className="space-y-2">
            {blocks.map((block) => {
              const typeConfig = BLOCK_TYPES.find((t) => t.value === block.blockType);
              return (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${typeConfig?.color}`} />
                    <div>
                      <p className="font-medium text-dark-900">{block.title}</p>
                      <p className="text-sm text-dark-500">
                        {format(parseISO(block.startTime), "EEEE d 'de' MMMM, HH:mm", {
                          locale: es,
                        })}{' '}
                        - {format(parseISO(block.endTime), 'HH:mm')}
                        {block.isRecurring && (
                          <span className="ml-2 text-primary-500">
                            (Recurrente: {block.recurrence})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-dark-600">
                      {formatMinutes(block.durationMinutes)}
                    </span>
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-dark-400 py-8">
            No hay bloques de tiempo esta semana. Crea uno para proteger tu tiempo.
          </p>
        )}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark-900">Nuevo bloque de tiempo</h3>
              <button onClick={() => setShowForm(false)} className="text-dark-400 hover:text-dark-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Ej: Tiempo para proyecto personal"
                  required
                />
              </div>

              <div>
                <label className="label">Tipo de bloque</label>
                <div className="grid grid-cols-3 gap-2">
                  {BLOCK_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, blockType: type.value })}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.blockType === type.value
                          ? `${type.color} text-white`
                          : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Fecha</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Hora inicio</label>
                  <div className="flex gap-1">
                    <select
                      value={formData.startHour}
                      onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                      className="input"
                    >
                      {HOURS.map((h) => (
                        <option key={h} value={h.toString().padStart(2, '0')}>
                          {h.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.startMinute}
                      onChange={(e) => setFormData({ ...formData, startMinute: e.target.value })}
                      className="input"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Hora fin</label>
                  <div className="flex gap-1">
                    <select
                      value={formData.endHour}
                      onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                      className="input"
                    >
                      {HOURS.map((h) => (
                        <option key={h} value={h.toString().padStart(2, '0')}>
                          {h.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.endMinute}
                      onChange={(e) => setFormData({ ...formData, endMinute: e.target.value })}
                      className="input"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <label htmlFor="isRecurring" className="text-sm text-dark-700">
                  Bloque recurrente
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="label">Recurrencia</label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) =>
                      setFormData({ ...formData, recurrence: e.target.value as RecurrenceType })
                    }
                    className="input"
                  >
                    {RECURRENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                  {isLoading ? 'Guardando...' : 'Crear bloque'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
