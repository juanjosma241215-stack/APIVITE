import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Estado inicial del formulario de registro.
const initialRegisterData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

// Pantalla de autenticación: login, registro y recuperación en un mismo componente.
export const Login = () => {
  const [mode, setMode] = useState('login');
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Actualiza en tiempo real los campos del login.
  const handleLoginChange = ({ target }) => {
    setLoginData((current) => ({
      ...current,
      [target.name]: target.value
    }));
  };

  // Actualiza en tiempo real los campos del registro.
  const handleRegisterChange = ({ target }) => {
    setRegisterData((current) => ({
      ...current,
      [target.name]: target.value
    }));
  };

  // Guarda una sesión simulada en localStorage para el flujo actual del frontend.
  const saveSession = (name, email) => {
    const cleanName = name?.trim();
    const fallbackName = email?.split('@')[0]?.trim() || 'Usuario';

    localStorage.setItem('auth', 'true');
    localStorage.setItem('authUserName', cleanName || fallbackName);
    localStorage.setItem('authUserEmail', email || '');
  };

  // En login usamos el correo para derivar un nombre visible si no existe nombre completo.
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    saveSession('', loginData.email);
    navigate('/admin', { replace: true });
  };

  // En registro validamos las contraseñas antes de guardar la sesión.
  const handleRegisterSubmit = (event) => {
    event.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      window.alert('Las contrasenas no coinciden.');
      return;
    }

    saveSession(registerData.fullName, registerData.email);
    navigate('/admin', { replace: true });
  };

  // Regresa al usuario a la landing.
  const handleBack = () => {
    navigate('/', { replace: true });
  };

  return (
    <section
      className="position-relative overflow-hidden px-3 py-5"
      style={{
        minHeight: 'calc(100vh - 140px)',
        background:
          'radial-gradient(circle at top, rgba(25, 135, 84, 0.2) 0%, rgba(5, 5, 5, 1) 52%)'
      }}
    >
      <div
        className="position-absolute top-0 start-50 translate-middle-x rounded-circle"
        style={{
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(13, 202, 240, 0.18) 0%, transparent 70%)',
          filter: 'blur(70px)'
        }}
      />

      <div className="container position-relative">
        <div className="row justify-content-center align-items-center g-4">
          {/* Columna izquierda con copy y beneficios del acceso */}
          <div className="col-12 col-lg-5">
            <div className="text-light text-center text-lg-start">
              <button
                onClick={handleBack}
                className="btn btn-link text-info text-decoration-none px-0 mb-3"
              >
                <i className="bi bi-arrow-left me-2"></i>Volver al Inicio
              </button>

              <span
                className="d-inline-flex align-items-center gap-2 rounded-pill border border-success border-opacity-25 px-3 py-2 small text-success mb-4"
                style={{ backgroundColor: 'rgba(25, 135, 84, 0.08)' }}
              >
                <i className="bi bi-shield-lock"></i>
                Acceso seguro al sistema
              </span>

              <h1
                className="fw-bold text-white mb-3"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', lineHeight: 0.95 }}
              >
                Ingresa al
                <span className="d-block text-success">portal central</span>
              </h1>

              <p className="text-light opacity-75 fs-5 mb-4">
                Organice el ingreso con formularios mas claros para iniciar sesion, crear cuenta
                y recuperar acceso sin perder el estilo del proyecto.
              </p>

              <div className="row g-3 text-start">
                {[
                  {
                    icon: 'bi-person-check',
                    title: 'Acceso rapido',
                    text: 'Entra al dashboard despues de autenticarte.'
                  },
                  {
                    icon: 'bi-person-plus',
                    title: 'Registro guiado',
                    text: 'Crea tu cuenta con una estructura mas ordenada.'
                  },
                  {
                    icon: 'bi-key',
                    title: 'Recuperacion simple',
                    text: 'Vuelve al login con un solo clic.'
                  }
                ].map((item) => (
                  <div className="col-12" key={item.title}>
                    <div
                      className="d-flex align-items-start gap-3 rounded-4 border border-success border-opacity-10 p-3"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 text-success"
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: 'rgba(25, 135, 84, 0.12)'
                        }}
                      >
                        <i className={`bi ${item.icon}`}></i>
                      </div>
                      <div>
                        <p className="fw-semibold text-white mb-1">{item.title}</p>
                        <p className="small text-light opacity-75">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha con formularios de autenticación */}
          <div className="col-12 col-lg-6 col-xl-5">
            <div
              className="rounded-5 border border-success border-opacity-25 p-4 p-md-5 text-white shadow-lg"
              style={{
                background:
                  'linear-gradient(180deg, rgba(9, 14, 11, 0.97) 0%, rgba(6, 8, 7, 0.95) 100%)',
                backdropFilter: 'blur(18px)'
              }}
            >
              {/* Interruptor visual para cambiar entre login y registro */}
              <div
                className="d-flex rounded-pill p-1 mb-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`btn rounded-pill flex-fill fw-semibold ${
                    mode === 'login' ? 'btn-success text-dark' : 'btn-link text-light text-decoration-none'
                  }`}
                >
                  Iniciar sesion
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`btn rounded-pill flex-fill fw-semibold ${
                    mode === 'register'
                      ? 'btn-success text-dark'
                      : 'btn-link text-light text-decoration-none'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4 text-start">
                    <h2 className="text-white fw-bold mb-2">Bienvenido de nuevo</h2>
                    <p className="text-light opacity-75 mb-0">
                      Ingresa tus datos para acceder al dashboard.
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small">Correo electronico</label>
                    <input
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="rick@c137.com"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label text-light small mb-0">Contrasena</label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="btn btn-link text-info text-decoration-none small p-0"
                      >
                        Olvide mi contrasena
                      </button>
                    </div>
                    <input
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="Ingresa tu contrasena"
                      required
                    />
                  </div>

                  <button className="btn btn-success w-100 rounded-4 py-3 fw-bold mt-2">
                    Entrar al dashboard
                  </button>

                  <p className="text-center text-light opacity-75 small mt-4 mb-0">
                    Aun no tienes cuenta?
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="btn btn-link text-success text-decoration-none fw-semibold ms-1 p-0"
                    >
                      Registrate aqui
                    </button>
                  </p>
                </form>
              )}

              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-4 text-start">
                    <h2 className="text-white fw-bold mb-2">Crea tu cuenta</h2>
                    <p className="text-light opacity-75 mb-0">
                      Completa el registro para habilitar el acceso al portal.
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small">Nombre completo</label>
                    <input
                      name="fullName"
                      type="text"
                      value={registerData.fullName}
                      onChange={handleRegisterChange}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="Morty Smith"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small">Correo electronico</label>
                    <input
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="morty@portal.com"
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small">Contrasena</label>
                      <input
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="form-control border-0 rounded-4 px-3 py-3"
                        style={{ backgroundColor: '#1d2320', color: 'white' }}
                        placeholder="Minimo 8 caracteres"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small">Confirmar contrasena</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="form-control border-0 rounded-4 px-3 py-3"
                        style={{ backgroundColor: '#1d2320', color: 'white' }}
                        placeholder="Repite la contrasena"
                        required
                      />
                    </div>
                  </div>

                  <button className="btn btn-success w-100 rounded-4 py-3 fw-bold mt-4">
                    Crear cuenta y entrar
                  </button>

                  <p className="text-center text-light opacity-75 small mt-4 mb-0">
                    Ya tienes cuenta?
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="btn btn-link text-info text-decoration-none fw-semibold ms-1 p-0"
                    >
                      Inicia sesion
                    </button>
                  </p>
                </form>
              )}

              {/* Modo auxiliar de recuperación de acceso */}
              {mode === 'forgot' && (
                <form onSubmit={(event) => event.preventDefault()}>
                  <div className="mb-4 text-start">
                    <h2 className="text-white fw-bold mb-2">Recuperar acceso</h2>
                    <p className="text-light opacity-75 mb-0">
                      Escribe tu correo y luego vuelve al login para continuar.
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small">Correo electronico</label>
                    <input
                      type="email"
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="tu-email@universo.com"
                      required
                    />
                  </div>

                  <button className="btn btn-info text-dark w-100 rounded-4 py-3 fw-bold mt-2">
                    Enviar solicitud
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="btn btn-link text-success text-decoration-none w-100 mt-3"
                  >
                    Volver al login
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
