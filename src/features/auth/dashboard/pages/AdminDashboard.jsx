import React, { useState } from 'react';
import { useRickAndMorty } from '../hooks/useRickAndMorty';
import { DashboardStats } from '../components/DashboardStats';
import { DimensionesView } from '../components/DimensionesView';
import { ProtocolosView } from '../components/ProtocolosView';

// Página privada principal. Organiza tabs, métricas y paneles del dashboard.
export const AdminDashboard = () => {
  const { filteredCharacters, stats, loading, searchTerm, setSearchTerm } = useRickAndMorty();
  const [activeTab, setActiveTab] = useState('monitor');
  const userName = localStorage.getItem('authUserName') || 'Usuario';

  return (
    <div
      className="min-vh-100 d-flex bg-black text-white overflow-hidden flex-column flex-lg-row"
      style={{ fontFamily: 'sans-serif' }}
    >
      {/* Sidebar de escritorio */}
      <aside
        className="border-end border-success border-opacity-10 p-4 d-none d-lg-flex flex-column"
        style={{ width: '280px', backgroundColor: '#020502' }}
      >
        <div className="mb-5">
          <h3 className="fw-bold mb-0">
            C-137 <span className="text-success glow-green-soft">HUB</span>
          </h3>
          <span className="badge border border-success text-success extra-small">SISTEMA ACTIVO</span>
        </div>

        {/* Navegación por pestañas internas */}
        <nav className="nav flex-column gap-2 flex-grow-1">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`nav-link border-0 text-start px-3 py-2 rounded-2 ${
              activeTab === 'monitor' ? 'active-neon' : 'text-secondary bg-transparent'
            }`}
          >
            <i className="bi bi-cpu me-2"></i> MONITOR
          </button>
          <button
            onClick={() => setActiveTab('dimensiones')}
            className={`nav-link border-0 text-start px-3 py-2 rounded-2 ${
              activeTab === 'dimensiones' ? 'active-neon' : 'text-secondary bg-transparent'
            }`}
          >
            <i className="bi bi-geo-alt me-2"></i> DIMENSIONES
          </button>
          <button
            onClick={() => setActiveTab('protocolos')}
            className={`nav-link border-0 text-start px-3 py-2 rounded-2 ${
              activeTab === 'protocolos' ? 'active-neon' : 'text-secondary bg-transparent'
            }`}
          >
            <i className="bi bi-shield-lock me-2"></i> PROTOCOLOS
          </button>
        </nav>

        <div
          className="p-3 rounded-4 border border-success border-opacity-20 shadow-glow-green"
          style={{ backgroundColor: '#051a0b' }}
        >
          <i className="bi bi-shield-check text-success"></i>
          <p className="extra-small mt-2 mb-0 fw-bold text-success">ENCRIPTACION ACTIVA</p>
        </div>
      </aside>

      <main className="flex-grow-1 p-3 p-md-4 p-xl-5 overflow-auto custom-scrollbar">
        {/* Navegación alternativa para móvil */}
        <div className="d-lg-none mb-4">
          <div className="dashboard-mobile-nav rounded-4 border border-success border-opacity-10 p-2">
            <div className="d-flex flex-column gap-2">
              <button
                onClick={() => setActiveTab('monitor')}
                className={`nav-link border-0 text-start px-3 py-2 rounded-3 ${
                  activeTab === 'monitor' ? 'active-neon' : 'text-secondary bg-transparent'
                }`}
              >
                <i className="bi bi-cpu me-2"></i> MONITOR
              </button>
              <button
                onClick={() => setActiveTab('dimensiones')}
                className={`nav-link border-0 text-start px-3 py-2 rounded-3 ${
                  activeTab === 'dimensiones' ? 'active-neon' : 'text-secondary bg-transparent'
                }`}
              >
                <i className="bi bi-geo-alt me-2"></i> DIMENSIONES
              </button>
              <button
                onClick={() => setActiveTab('protocolos')}
                className={`nav-link border-0 text-start px-3 py-2 rounded-3 ${
                  activeTab === 'protocolos' ? 'active-neon' : 'text-secondary bg-transparent'
                }`}
              >
                <i className="bi bi-shield-lock me-2"></i> PROTOCOLOS
              </button>
            </div>
          </div>
        </div>

        {/* Tab principal del monitor */}
        {activeTab === 'monitor' && (
          <div className="animate__animated animate__fadeIn">
            <header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 mb-md-5">
              <div>
                <h1 className="fw-bold mb-0 dashboard-title">
                  TERMINAL DE <span className="text-success">CONTROL</span>
                </h1>
                <code className="text-success opacity-50 dashboard-code">
                  --multiverse_access_granted
                </code>
              </div>

              {/* Bloque de usuario de la sesión */}
              <div className="d-flex align-items-center gap-3 bg-dark bg-opacity-50 p-2 rounded-pill border border-success border-opacity-10 px-3 w-100 w-md-auto justify-content-between justify-content-md-start">
                <div className="text-end pe-2 border-end border-success border-opacity-25">
                  <p className="mb-0 small fw-bold">{userName}</p>
                  <span className="extra-small text-success">Sesion iniciada</span>
                </div>
                <img
                  src="https://rickandmortyapi.com/api/character/avatar/1.jpeg"
                  className="rounded-circle border border-success"
                  width="40"
                  alt="rick"
                />
              </div>
            </header>

            {/* Métricas rápidas */}
            <div className="row g-3 g-md-4 mb-5">
              {[
                { label: 'ESPECIMENES', value: stats.total },
                { label: 'DIMENSIONES', value: '126' },
                { label: 'ESPECIES', value: stats.species },
                { label: 'BAJAS', value: stats.alerts, color: 'text-danger' }
              ].map((item, i) => (
                <div className="col-6 col-xl-3" key={i}>
                  <div className="p-3 p-md-4 border border-success border-opacity-10 bg-black bg-opacity-40 rounded-3 shadow-sm h-100">
                    <p className="extra-small text-success fw-bold opacity-50 mb-1">{item.label}</p>
                    <h2 className={`fw-bold mb-0 ${item.color || 'text-white'}`}>
                      {loading ? '...' : item.value}
                    </h2>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel principal con rastreo y gráfico */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="border border-success border-opacity-10 p-3 p-md-4 bg-black bg-opacity-40 rounded-4 shadow-lg">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                    <h5 className="fw-bold text-success mb-0">
                      <i className="bi bi-search me-2"></i> RASTREO DE UNIDADES
                    </h5>
                    <input
                      type="text"
                      className="bg-transparent border border-success border-opacity-25 text-white small rounded-pill px-3 py-2 shadow-none tracker-search"
                      placeholder="Buscar unidad..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div
                    className="row row-cols-2 row-cols-sm-3 row-cols-xl-4 g-3 overflow-auto"
                    style={{ maxHeight: '400px' }}
                  >
                    {filteredCharacters.map((char) => (
                      <div className="col" key={char.id}>
                        <div className="card bg-black border border-success border-opacity-10 h-100">
                          <img src={char.image} className="card-img-top grayscale-hover" alt={char.name} />
                          <div className="card-body p-2 text-center">
                            <p className="extra-small fw-bold mb-0 text-truncate">{char.name}</p>
                            <span
                              className={`extra-small ${
                                char.status === 'Alive' ? 'text-success' : 'text-danger'
                              }`}
                            >
                              {char.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="border border-success border-opacity-10 p-3 p-md-4 bg-black bg-opacity-40 rounded-4 mb-4 text-center">
                  <h6 className="text-success fw-bold mb-4">DISTRIBUCION BIOLOGICA</h6>
                  <DashboardStats characters={filteredCharacters} />
                </div>

                <div
                  className="p-4 rounded-4 border border-danger border-opacity-20 shadow-glow-red"
                  style={{ backgroundColor: '#1a0505' }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="spinner-grow text-danger spinner-grow-sm"></div>
                    <h6 className="mb-0 fw-bold text-danger glow-red">C-137 PROTECTED</h6>
                  </div>
                  <p className="extra-small text-danger opacity-75 mb-0">
                    FIREWALL INTERDIMENSIONAL ACTIVO
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs secundarias */}
        {activeTab === 'dimensiones' && <DimensionesView />}
        {activeTab === 'protocolos' && <ProtocolosView />}
      </main>

      <style>{`
        .active-neon { background: rgba(25, 135, 84, 0.1) !important; color: #198754 !important; border-left: 3px solid #198754 !important; }
        .glow-red { text-shadow: 0 0 10px #dc3545; }
        .glow-green-soft { text-shadow: 0 0 10px #198754; }
        .shadow-glow-green { box-shadow: 0 0 20px rgba(25, 135, 84, 0.1); }
        .shadow-glow-red { box-shadow: 0 0 20px rgba(220, 53, 69, 0.1); }
        .extra-small { font-size: 0.65rem; letter-spacing: 1px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #198754; border-radius: 10px; }
        .grayscale-hover { filter: grayscale(100%); transition: 0.3s; }
        .grayscale-hover:hover { filter: grayscale(0%); }
        .dashboard-mobile-nav { background-color: rgba(2, 5, 2, 0.95); }
        .dashboard-title { font-size: clamp(1.8rem, 5vw, 3.5rem); }
        .tracker-search { width: 100%; max-width: 280px; }

        @media (max-width: 767px) {
          .tracker-search { max-width: 100%; }
          .dashboard-code {
            display: inline-block;
            margin-top: 0.5rem;
            word-break: break-word;
          }
        }
      `}</style>
    </div>
  );
};
