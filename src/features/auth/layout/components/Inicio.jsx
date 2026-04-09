import { Link } from 'react-router-dom';
import { InfoCards } from './InfoCards';
import { isAuthenticated } from '../../../../shared/auth/session';

// Landing principal del proyecto. Ahora presenta la app con enfoque de gastos diarios.
export const Inicio = () => {
  const hasSession = isAuthenticated();

  return (
    <div className="animate-fade-in text-light" style={{ backgroundColor: '#050505' }}>
      <section
        className="py-5 text-center position-relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at center, #10261a 0%, #050505 100%)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="mb-4">
            <i className="bi bi-wallet2 text-success hero-icon portal-glow"></i>
          </div>

          <h1 className="fw-black mb-0 hero-title" style={{ letterSpacing: '-3px' }}>
            GASTOS <span className="text-success glow-green">DIARIOS</span>
          </h1>

          <p className="text-uppercase fw-bold text-success mt-2 mb-4 hero-subtitle">
            Controla tu dinero sin perder de vista cada movimiento
          </p>

          <p className="lead mx-auto mb-5 fw-light opacity-75 hero-copy" style={{ maxWidth: '760px' }}>
            Registra compras, revisa tus categorias, detecta en que estas gastando mas y
            mantén una vista clara de tu presupuesto personal desde un solo lugar.
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
            <Link
              to={hasSession ? '/admin' : '/login'}
              className="btn btn-outline-success btn-lg px-4 px-md-5 py-3 fw-bold rounded-pill shadow-glow hero-cta"
            >
              <i className={`bi ${hasSession ? 'bi-bar-chart-fill' : 'bi-person-fill'} me-2`}></i>
              {hasSession ? 'VER MI PANEL' : 'INICIAR SESION'}
            </Link>

            <Link
              to="/api"
              className="btn btn-outline-info btn-lg px-4 py-3 rounded-pill shadow-sm hero-cta"
              style={{
                border: '1px solid rgba(13,202,240,0.35)',
                backgroundColor: 'rgba(13,202,240,0.04)',
                color: '#9eeaf9'
              }}
            >
              <i className="bi bi-graph-up-arrow me-2"></i>VER MODULO API
            </Link>

            <a
              href="https://github.com/juanjosma241215-stack/APIVITE"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill github-btn shadow-sm hero-cta"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}
            >
              <i className="bi bi-github fs-4"></i>
            </a>
          </div>
        </div>

        <div
          className="position-absolute top-50 start-50 translate-middle opacity-25 hero-glow"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, #198754 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        ></div>
      </section>

      <div id="main-content" className="container py-5">
        <div className="row g-4 mb-5">
          {[
            {
              icon: 'bi-receipt-cutoff',
              title: 'Registro rapido',
              text: 'Anota tus gastos del dia en segundos para no perder detalle de tus movimientos.'
            },
            {
              icon: 'bi-pie-chart-fill',
              title: 'Categorias claras',
              text: 'Visualiza cuanto gastas en transporte, comida, ocio, servicios y otras areas.'
            },
            {
              icon: 'bi-piggy-bank-fill',
              title: 'Mejor control mensual',
              text: 'Detecta fugas de dinero y toma decisiones mas inteligentes para ahorrar.'
            }
          ].map((item) => (
            <div className="col-12 col-md-6 col-xl-4" key={item.title}>
              <div
                className="h-100 rounded-4 border p-4 landing-feature-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(25, 135, 84, 0.18)'
                }}
              >
                <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 landing-feature-icon">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h3 className="h5 text-white fw-bold">{item.title}</h3>
                <p className="text-light opacity-75 mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-5 border border-success border-opacity-25 p-4 p-md-5 mb-5"
          style={{
            background:
              'linear-gradient(135deg, rgba(9, 14, 11, 0.96) 0%, rgba(7, 22, 17, 0.92) 100%)'
          }}
        >
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <p className="text-success fw-bold text-uppercase small mb-2">Tu rutina financiera</p>
              <h2 className="text-white fw-bold mb-3">Convierte tus gastos diarios en decisiones mas inteligentes</h2>
              <p className="text-light opacity-75 mb-0">
                La idea de esta landing es que el usuario entienda rapidamente que la plataforma le
                ayuda a registrar, revisar y mejorar sus habitos financieros todos los dias.
              </p>
            </div>
            <div className="col-12 col-lg-5">
              <div className="d-grid gap-3">
                <div className="rounded-4 border border-success border-opacity-10 p-3 bg-black bg-opacity-25">
                  <span className="small text-success fw-bold d-block mb-1">1. Registra</span>
                  <span className="text-light opacity-75">Apunta cada gasto apenas ocurra.</span>
                </div>
                <div className="rounded-4 border border-info border-opacity-10 p-3 bg-black bg-opacity-25">
                  <span className="small text-info fw-bold d-block mb-1">2. Analiza</span>
                  <span className="text-light opacity-75">Observa tendencias y categorias.</span>
                </div>
                <div className="rounded-4 border border-success border-opacity-10 p-3 bg-black bg-opacity-25">
                  <span className="small text-success fw-bold d-block mb-1">3. Ajusta</span>
                  <span className="text-light opacity-75">Corrige excesos y mejora tu ahorro.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-center text-success mb-4 mb-md-5 fw-bold text-uppercase section-title">
            Recursos del proyecto
          </h3>
          <InfoCards />
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .glow-green { text-shadow: 0 0 20px rgba(25, 135, 84, 0.8); }
        .portal-glow { filter: drop-shadow(0 0 15px #198754); }
        .hero-title { font-size: clamp(3rem, 10vw, 6rem); }
        .hero-icon { font-size: clamp(4rem, 12vw, 6rem); }
        .hero-subtitle { letter-spacing: 6px; }

        .shadow-glow:hover {
          box-shadow: 0 0 20px rgba(25, 135, 84, 0.5);
          transform: translateY(-3px);
          transition: 0.3s;
        }

        .github-btn {
          transition: all 0.3s ease;
        }

        .github-btn:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          color: #fff !important;
        }

        .landing-feature-card {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .landing-feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(25, 135, 84, 0.4) !important;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
        }

        .landing-feature-icon {
          width: 52px;
          height: 52px;
          background: rgba(25, 135, 84, 0.12);
          color: #73e2a7;
          font-size: 1.2rem;
        }

        .animate-fade-in { animation: fadeIn 1.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .hero-subtitle {
            letter-spacing: 3px;
            font-size: 0.8rem;
          }

          .hero-copy {
            font-size: 1rem;
          }

          .hero-cta {
            width: 100%;
            max-width: 340px;
          }

          .hero-glow {
            width: 320px !important;
            height: 320px !important;
          }

          .section-title {
            font-size: 1.15rem;
            letter-spacing: 2px;
          }
        }
      `}</style>
    </div>
  );
};
