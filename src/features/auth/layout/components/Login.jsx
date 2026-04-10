import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveAuthSession } from '../../../../shared/auth/session';

// Datos iniciales para limpiar el formulario de registro
const initialRegisterData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

// URL BASE DEL BACKEND: Ajusta el puerto si tu servidor corre en otro (ej: 4000)
const API_URL = 'http://localhost:4000/api/auth';

export const Login = () => {
  // ESTADOS
  const [mode, setMode] = useState('login'); // Controla si mostramos Login o Registro
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false); // Estado de carga (Loading)
  const [feedback, setFeedback] = useState({ type: '', message: '' }); // Alertas visuales
  const navigate = useNavigate();

  // MANEJADORES DE INPUTS
  const handleLoginChange = ({ target }) => {
    setLoginData((current) => ({
      ...current,
      [target.name]: target.value
    }));
  };

  const handleRegisterChange = ({ target }) => {
    setRegisterData((current) => ({
      ...current,
      [target.name]: target.value
    }));
  };

  const handleBack = () => {
    navigate('/', { replace: true });
  };

  // --- LÓGICA DE INICIO DE SESIÓN ---
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });

      // Petición POST al backend real (MongoDB)
      const { data } = await axios.post(`${API_URL}/login`, {
        email: loginData.email,
        password: loginData.password
      });

      // Si el backend responde OK, guardamos la sesión en LocalStorage/Cookies
      saveAuthSession(data.user);
      
      // Redirección al panel de administración
      navigate('/admin', { replace: true });
    } catch (error) {
      // Manejo de errores (Credenciales incorrectas, servidor caído, etc.)
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'No fue posible iniciar sesión.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- LÓGICA DE REGISTRO ---
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    // Validación básica de contraseñas antes de enviar al servidor
    if (registerData.password !== registerData.confirmPassword) {
      setFeedback({
        type: 'danger',
        message: 'Las contraseñas no coinciden.'
      });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });

      // Enviamos los datos al backend. Nota: usamos 'name' porque así lo espera tu controller
      const { data } = await axios.post(`${API_URL}/register`, {
        name: registerData.fullName,
        email: registerData.email,
        password: registerData.password
      });

      // Tras registrarse, guardamos sesión y entramos automáticamente
      saveAuthSession(data.user);
      navigate('/admin', { replace: true });
    } catch (error) {
      // El backend enviará error 409 si el correo ya existe
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'No fue posible crear la cuenta.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="position-relative overflow-hidden px-3 py-5"
      style={{
        minHeight: 'calc(100vh - 140px)',
        background: 'radial-gradient(circle at top, rgba(25, 135, 84, 0.2) 0%, rgba(5, 5, 5, 1) 52%)'
      }}
    >
      {/* Fondo decorativo (Blur) */}
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
          
          {/* LADO IZQUIERDO: TEXTOS INFORMATIVOS */}
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
                <i className="bi bi-shield-lock"></i> Acceso seguro al sistema
              </span>

              <h1
                className="fw-bold text-white mb-3"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', lineHeight: 0.95 }}
              >
                Ingresa al <span className="d-block text-success">portal central</span>
              </h1>

              <p className="text-light opacity-75 fs-5 mb-4">
                El acceso ya usa tu base de datos real en MongoDB Atlas para gestionar usuarios.
              </p>

              {/* Lista de características (Features) */}
              <div className="row g-3 text-start">
                {[
                  { icon: 'bi-person-check', title: 'Inicio validado', text: 'Verificamos credenciales desde MongoDB.' },
                  { icon: 'bi-person-plus', title: 'Registro real', text: 'Usuarios persistentes en tu colección.' },
                  { icon: 'bi-shield-check', title: 'Contraseña protegida', text: 'Backend usa hashing (Bcrypt).' }
                ].map((item) => (
                  <div className="col-12" key={item.title}>
                    <div
                      className="d-flex align-items-start gap-3 rounded-4 border border-success border-opacity-10 p-3"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 text-success"
                        style={{ width: '48px', height: '48px', backgroundColor: 'rgba(25, 135, 84, 0.12)' }}
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

          {/* LADO DERECHO: FORMULARIO CARD */}
          <div className="col-12 col-lg-6 col-xl-5">
            <div
              className="rounded-5 border border-success border-opacity-25 p-4 p-md-5 text-white shadow-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(9, 14, 11, 0.97) 0%, rgba(6, 8, 7, 0.95) 100%)',
                backdropFilter: 'blur(18px)'
              }}
            >
              {/* SELECTOR: LOGIN O REGISTRO */}
              <div className="d-flex rounded-pill p-1 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setFeedback({ type: '', message: '' }); }}
                  className={`btn rounded-pill flex-fill fw-semibold ${mode === 'login' ? 'btn-success text-dark' : 'btn-link text-light text-decoration-none'}`}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setFeedback({ type: '', message: '' }); }}
                  className={`btn rounded-pill flex-fill fw-semibold ${mode === 'register' ? 'btn-success text-dark' : 'btn-link text-light text-decoration-none'}`}
                >
                  Registrarse
                </button>
              </div>

              {/* ALERTAS DE FEEDBACK */}
              {feedback.message && (
                <div className={`alert alert-${feedback.type} rounded-4`} role="alert">
                  {feedback.message}
                </div>
              )}

              {/* --- FORMULARIO DE LOGIN --- */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4 text-start">
                    <h2 className="text-white fw-bold mb-2">Bienvenido</h2>
                    <p className="text-light opacity-75 mb-0">Usa tus credenciales guardadas.</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small">Correo electrónico</label>
                    <input
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="tu-correo@dominio.com"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small">Contraseña</label>
                    <input
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="Ingresa tu contraseña"
                      required
                    />
                  </div>

                  <button className="btn btn-success w-100 rounded-4 py-3 fw-bold mt-2" disabled={submitting}>
                    {submitting ? 'Verificando...' : 'Entrar al dashboard'}
                  </button>
                </form>
              )}

              {/* --- FORMULARIO DE REGISTRO --- */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-4 text-start">
                    <h2 className="text-white fw-bold mb-2">Crea tu cuenta</h2>
                    <p className="text-light opacity-75 mb-0">Los datos se guardarán en MongoDB Atlas.</p>
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
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light small">Correo electrónico</label>
                    <input
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={{ backgroundColor: '#1d2320', color: 'white' }}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small">Contraseña</label>
                      <input
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="form-control border-0 rounded-4 px-3 py-3"
                        style={{ backgroundColor: '#1d2320', color: 'white' }}
                        placeholder="Mín. 8 caracteres"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small">Confirmar</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="form-control border-0 rounded-4 px-3 py-3"
                        style={{ backgroundColor: '#1d2320', color: 'white' }}
                        placeholder="Repite contraseña"
                        required
                      />
                    </div>
                  </div>

                  <button className="btn btn-success w-100 rounded-4 py-3 fw-bold mt-4" disabled={submitting}>
                    {submitting ? 'Creando...' : 'Registrar y Entrar'}
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