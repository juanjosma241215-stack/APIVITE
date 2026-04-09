import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  clearAuthSession,
  getAuthSession,
  subscribeToAuthSession
} from '../../../../shared/auth/session';

// Header compartido: muestra navegacion publica y el estado visible de la sesion.
export const Header = () => {
  const [session, setSession] = useState(() => getAuthSession());
  const isUserAuthenticated = Boolean(session);
  const userName = session?.name || 'Usuario';

  useEffect(() => subscribeToAuthSession(() => setSession(getAuthSession())), []);

  // Al cerrar sesion limpiamos el estado global y regresamos al inicio.
  const handleLogout = () => {
    clearAuthSession();
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-dark bg-black border-bottom border-success border-opacity-25 py-3 shadow-sm">
      <div className="container-fluid px-3 px-md-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <Link className="navbar-brand fw-bold text-success fs-4 me-0" to="/">
          GASTOS <span className="text-info">DIARIOS</span>
        </Link>

        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 gap-md-3 ms-auto header-actions">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `btn btn-sm px-3 px-md-4 rounded-pill border border-success border-opacity-50 header-action ${
                isActive ? 'btn-success text-black' : 'btn-outline-success text-success'
              }`
            }
          >
            <i className="bi bi-house-door-fill me-2"></i>Inicio
          </NavLink>

          <NavLink
            to="/api"
            className={({ isActive }) =>
              `btn btn-sm px-3 px-md-4 rounded-pill border border-info border-opacity-50 header-action ${
                isActive ? 'btn-info text-dark' : 'btn-outline-info text-info'
              }`
            }
          >
            <i className="bi bi-search me-2"></i>API
          </NavLink>

          {isUserAuthenticated ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `btn btn-sm px-3 px-md-4 rounded-pill border border-success border-opacity-50 header-action ${
                    isActive ? 'btn-success text-black' : 'btn-outline-success text-success'
                  }`
                }
              >
                <i className="bi bi-grid-1x2-fill me-2"></i>Dashboard
              </NavLink>

              <div className="d-flex align-items-center gap-2 rounded-pill border border-success border-opacity-25 px-3 py-2 text-light header-user">
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-dark fw-bold header-avatar">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <div className="text-start">
                  <p className="mb-0 small fw-semibold text-white">{userName}</p>
                  <span className="small text-success">Sesion iniciada</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm px-3 px-md-4 rounded-pill border border-danger header-action"
              >
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-outline-success btn-sm px-3 px-md-4 rounded-pill border border-success header-action"
            >
              <i className="bi bi-person-fill me-2"></i>Iniciar Sesion
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .header-avatar {
          width: 32px;
          height: 32px;
          font-size: 0.9rem;
        }

        .header-user {
          background: rgba(25, 135, 84, 0.08);
        }

        @media (max-width: 576px) {
          .header-actions {
            width: 100%;
          }

          .header-action,
          .header-user {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};
