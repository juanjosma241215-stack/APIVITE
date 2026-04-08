import { Routes, Route, Navigate } from 'react-router-dom';
import { Inicio } from './features/auth/layout/components/Inicio';
import { Login } from './features/auth/layout/components/Login';
import { AdminDashboard } from './features/auth/dashboard/pages/AdminDashboard';

// Esta utilidad centraliza la lectura de la sesión guardada en localStorage.
const isAuthenticated = () => localStorage.getItem('auth') === 'true';

// Este wrapper protege rutas privadas y redirige al login si no hay sesión.
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Definición de todas las rutas del frontend.
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Página pública principal */}
      <Route path="/" element={<Inicio />} />

      {/* Si el usuario ya inició sesión, ir al login lo envía al dashboard */}
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/admin" replace /> : <Login />}
      />

      {/* Ruta privada del dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Cualquier ruta desconocida vuelve al inicio */}
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
