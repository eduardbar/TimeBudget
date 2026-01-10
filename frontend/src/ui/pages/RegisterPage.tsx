// ===========================================
// TimeBudget - Register Page
// ===========================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    const success = await register(email, password, name);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-dark-900 text-center">Crear cuenta</h2>
      
      {(error || validationError) && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error || validationError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="label">Nombre</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="label">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="label">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Mínimo 8 caracteres"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
          placeholder="Repite la contraseña"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary"
      >
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center text-dark-500 text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
