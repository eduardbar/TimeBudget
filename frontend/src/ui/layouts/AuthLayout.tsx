// ===========================================
// TimeBudget - Auth Layout
// ===========================================

import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-900">
            Time<span className="text-primary-500">Budget</span>
          </h1>
          <p className="text-dark-500 mt-2">Gestiona tu tiempo como un presupuesto</p>
        </div>
        
        {/* Content */}
        <div className="card">
          <Outlet />
        </div>
        
        {/* Footer */}
        <p className="text-center text-dark-400 text-sm mt-6">
          Tu tiempo es tu recurso más valioso
        </p>
      </div>
    </div>
  );
}
