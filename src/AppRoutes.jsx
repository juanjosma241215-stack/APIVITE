import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ApiRyC_Axios } from './features/auth/api/components/ApiRyC_Axios';
import { AdminDashboard } from './features/auth/dashboard/pages/AdminDashboard';
import { Inicio } from './features/auth/layout/components/Inicio';
import { Login } from './features/auth/layout/components/Login';
import { getAuthSession, subscribeToAuthSession } from './shared/auth/session';

// Protege las rutas privadas y redirige al login cuando no hay sesion activa.
const ProtectedRoute = ({ children }) => {
  if (!getAuthSession()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Definicion central de rutas publicas y privadas.
export const AppRoutes = () => {
  const [session, setSession] = useState(() => getAuthSession());

  useEffect(() => subscribeToAuthSession(() => setSession(getAuthSession())), []);

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />

      <Route
        path="/api"
        element={
          <div className="container py-4 py-md-5">
            <ApiRyC_Axios />
          </div>
        }
      />

      <Route path="/login" element={session ? <Navigate to="/admin" replace /> : <Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
