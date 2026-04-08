import { ApiRyC_Axios } from '../../api/components/ApiRyC_Axios';
import { InfoCards } from './InfoCards';

// Landing principal del proyecto. Resume el tema visual y muestra la demo de la API.
export const Inicio = () => {
  return (
    <div className="animate-fade-in text-light" style={{ backgroundColor: '#050505' }}>
      {/* Hero principal con CTA para bajar a la sección de contenido */}
      <section
        className="py-5 text-center position-relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at center, #0a2f0a 0%, #050505 100%)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="mb-4">
            <i className="bi bi-portal text-success hero-icon portal-glow anim-spin"></i>
          </div>

          <h1 className="fw-black mb-0 hero-title" style={{ letterSpacing: '-3px' }}>
            C-137 <span className="text-success glow-green">HUB</span>
          </h1>

          <p className="text-uppercase fw-bold text-success mt-2 mb-4 hero-subtitle">
            Multi-Universal Tracking System
          </p>

          <p className="lead mx-auto mb-5 fw-light opacity-75 hero-copy" style={{ maxWidth: '700px' }}>
            Terminal de acceso prioritario. Monitorea variantes biologicas, analiza dimensiones
            y asegura la estabilidad del multiverso central finito.
          </p>

          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
            <button
              className="btn btn-outline-success btn-lg px-4 px-md-5 py-3 fw-bold rounded-pill shadow-glow hero-cta"
              onClick={() => document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="bi bi-cpu-fill me-2"></i>VINCULAR ADN
            </button>

            <a
              href="https://github.com/tu-usuario/tu-repositorio"
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

        {/* Resplandor decorativo del hero */}
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

      {/* Contenido principal debajo del hero */}
      <div id="main-content" className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 bg-dark bg-opacity-50 border border-success border-opacity-25 rounded-4 p-3 p-md-4 mb-5 shadow-lg">
            <ApiRyC_Axios />
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-center text-success mb-4 mb-md-5 fw-bold text-uppercase section-title">
            Registros de la Ciudadela
          </h3>
          <InfoCards />
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .glow-green { text-shadow: 0 0 20px rgba(25, 135, 84, 0.8); }
        .portal-glow { filter: drop-shadow(0 0 15px #198754); }
        .anim-spin { animation: spin 25s linear infinite; display: inline-block; }
        .hero-title { font-size: clamp(3rem, 10vw, 6rem); }
        .hero-icon { font-size: clamp(4rem, 12vw, 6rem); }
        .hero-subtitle { letter-spacing: 8px; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

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

        .animate-fade-in { animation: fadeIn 1.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .hero-subtitle {
            letter-spacing: 4px;
            font-size: 0.8rem;
          }

          .hero-copy {
            font-size: 1rem;
          }

          .hero-cta {
            width: 100%;
            max-width: 320px;
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
