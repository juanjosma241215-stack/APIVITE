import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveAuthSession } from '../../../../shared/auth/session';

const initialRegisterData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

// --- SOLO ESTO CAMBIÓ PARA LA CONEXIÓN ---
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_URL = `${API_BASE}/api/auth`;
// -----------------------------------------

export const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Estados para mostrar/ocultar contraseñas
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  const navigate = useNavigate();

  const handleLoginChange = ({ target }) =>
    setLoginData((c) => ({ ...c, [target.name]: target.value }));

  const handleRegisterChange = ({ target }) =>
    setRegisterData((c) => ({ ...c, [target.name]: target.value }));

  const handleBack = () => navigate('/', { replace: true });

  const switchMode = (newMode) => {
    setMode(newMode);
    setFeedback({ type: '', message: '' });
  };

  // --- LOGIN ---
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });
      const { data } = await axios.post(`${API_URL}/login`, {
        email: loginData.email,
        password: loginData.password
      });
      saveAuthSession(data.user);
      navigate('/admin', { replace: true });
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'No fue posible iniciar sesión.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- REGISTRO ---
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setFeedback({ type: 'danger', message: 'Las contraseñas no coinciden.' });
      return;
    }
    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });
      const { data } = await axios.post(`${API_URL}/register`, {
        // Asegúrate de que tu backend reciba 'name' o 'fullName'
        name: registerData.fullName, 
        email: registerData.email,
        password: registerData.password
      });
      saveAuthSession(data.user);
      navigate('/admin', { replace: true });
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'No fue posible crear la cuenta.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- RECUPERAR CONTRASEÑA ---
  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });
      await axios.post(`${API_URL}/forgot-password`, { email: forgotEmail });
      setFeedback({
        type: 'success',
        message: 'Si el correo está registrado, recibirás un enlace de recuperación en tu bandeja de entrada.'
      });
      setForgotEmail('');
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: error.response?.data?.message || 'No fue posible procesar la solicitud.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Estilos reutilizables
  const inputStyle = { backgroundColor: '#1d2320', color: 'white' };

  // CSS para suprimir el ícono de ojo nativo de Edge/Chrome
  const hideNativeEye = `
    input[type="password"]::-ms-reveal,
    input[type="password"]::-ms-clear,
    input[type="password"]::-webkit-contacts-auto-fill-button,
    input[type="password"]::-webkit-credentials-auto-fill-button {
      display: none !important;
      visibility: hidden;
      pointer-events: none;
    }
  `;

  // Botón para mostrar/ocultar contraseña
  const TogglePasswordBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary pe-3"
      style={{ zIndex: 5, textDecoration: 'none', fontSize: '1.1rem' }}
      tabIndex={-1}
      aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`}></i>
    </button>
  );

  return (
    <>
    <style>{hideNativeEye}</style>
    <section
      className="position-relative overflow-hidden px-3 py-5"
      style={{
        minHeight: 'calc(100vh - 140px)',
        background: 'radial-gradient(circle at top, rgba(25, 135, 84, 0.2) 0%, rgba(5, 5, 5, 1) 52%)'
      }}
    >
      {/* Fondo decorativo */}
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

          {/* LADO IZQUIERDO */}
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

          {/* LADO DERECHO: CARD */}
          <div className="col-12 col-lg-6 col-xl-5">
            <div
              className="rounded-5 border border-success border-opacity-25 p-4 p-md-5 text-white shadow-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(9, 14, 11, 0.97) 0%, rgba(6, 8, 7, 0.95) 100%)',
                backdropFilter: 'blur(18px)'
              }}
            >
              {/* SELECTOR: LOGIN / REGISTRO — oculto en modo forgot */}
              {mode !== 'forgot' && (
                <div className="d-flex rounded-pill p-1 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={`btn rounded-pill flex-fill fw-semibold ${mode === 'login' ? 'btn-success text-dark' : 'btn-link text-light text-decoration-none'}`}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className={`btn rounded-pill flex-fill fw-semibold ${mode === 'register' ? 'btn-success text-dark' : 'btn-link text-light text-decoration-none'}`}
                  >
                    Registrarse
                  </button>
                </div>
              )}

              {/* ALERTAS */}
              {feedback.message && (
                <div className={`alert alert-${feedback.type} rounded-4`} role="alert">
                  {feedback.message}
                </div>
              )}

              {/* ——— FORMULARIO LOGIN ——— */}
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
                      style={inputStyle}
                      placeholder="tu-correo@dominio.com"
                      required
                    />
                  </div>

                  <div className="mb-1">
                    <label className="form-label text-light small">Contraseña</label>
                    <div className="position-relative">
                      <input
                        name="password"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="form-control border-0 rounded-4 px-3 py-3 pe-5"
                        style={inputStyle}
                        placeholder="Ingresa tu contraseña"
                        required
                      />
                      <TogglePasswordBtn
                        show={showLoginPassword}
                        onToggle={() => setShowLoginPassword((v) => !v)}
                      />
                    </div>
                  </div>

                  {/* ENLACE OLVIDÉ CONTRASEÑA */}
                  <div className="text-end mb-3">
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="btn btn-link text-success text-decoration-none small p-0"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button
                    className="btn btn-success w-100 rounded-4 py-3 fw-bold mt-1"
                    disabled={submitting}
                  >
                    {submitting ? 'Verificando...' : 'Entrar al dashboard'}
                  </button>
                </form>
              )}

              {/* ——— FORMULARIO REGISTRO ——— */}
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
                      style={inputStyle}
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
                      style={inputStyle}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small">Contraseña</label>
                      <div className="position-relative">
                        <input
                          name="password"
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          className="form-control border-0 rounded-4 px-3 py-3 pe-5"
                          style={inputStyle}
                          placeholder="Mín. 8 caracteres"
                          required
                        />
                        <TogglePasswordBtn
                          show={showRegisterPassword}
                          onToggle={() => setShowRegisterPassword((v) => !v)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light small">Confirmar</label>
                      <div className="position-relative">
                        <input
                          name="confirmPassword"
                          type={showRegisterConfirm ? 'text' : 'password'}
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          className="form-control border-0 rounded-4 px-3 py-3 pe-5"
                          style={inputStyle}
                          placeholder="Repite contraseña"
                          required
                        />
                        <TogglePasswordBtn
                          show={showRegisterConfirm}
                          onToggle={() => setShowRegisterConfirm((v) => !v)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-success w-100 rounded-4 py-3 fw-bold mt-4"
                    disabled={submitting}
                  >
                    {submitting ? 'Creando...' : 'Registrar y Entrar'}
                  </button>
                </form>
              )}

              {/* ——— FORMULARIO OLVIDÉ CONTRASEÑA ——— */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSubmit}>
                  <div className="mb-4 text-start">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="btn btn-link text-info text-decoration-none px-0 mb-3 small"
                    >
                      <i className="bi bi-arrow-left me-2"></i>Volver al inicio de sesión
                    </button>
                    <h2 className="text-white fw-bold mb-2">Recuperar contraseña</h2>
                    <p className="text-light opacity-75 mb-0">
                      Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-light small">Correo electrónico</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="form-control border-0 rounded-4 px-3 py-3"
                      style={inputStyle}
                      placeholder="tu-correo@dominio.com"
                      required
                    />
                  </div>

                  <button
                    className="btn btn-success w-100 rounded-4 py-3 fw-bold"
                    disabled={submitting}
                  >
                    {submitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};