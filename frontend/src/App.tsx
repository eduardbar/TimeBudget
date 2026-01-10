import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

// Layouts
import { AuthLayout } from './ui/layouts/AuthLayout';
import { AppLayout } from './ui/layouts/AppLayout';

// Pages
import { LoginPage } from './ui/pages/LoginPage';
import { RegisterPage } from './ui/pages/RegisterPage';
import { DashboardPage } from './ui/pages/DashboardPage';
import { TimeBudgetPage } from './ui/pages/TimeBudgetPage';
import { ActivitiesPage } from './ui/pages/ActivitiesPage';
import { PrioritiesPage } from './ui/pages/PrioritiesPage';
import { CalendarPage } from './ui/pages/CalendarPage';
import { EliminationPage } from './ui/pages/EliminationPage';
import { ReviewPage } from './ui/pages/ReviewPage';

// Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route (redirige si ya está autenticado)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />
      </Route>
      
      {/* Rutas protegidas */}
      <Route element={
        <ProtectedRoute><AppLayout /></ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/budget" element={<TimeBudgetPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/priorities" element={<PrioritiesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/eliminations" element={<EliminationPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Route>
      
      {/* Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
