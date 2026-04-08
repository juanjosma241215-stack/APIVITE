import React from 'react';

// Vista secundaria del dashboard con protocolos ficticios del universo del proyecto.
export const ProtocolosView = () => {
  // Lista local de protocolos; no depende de backend por ahora.
  const protocolos = [
    { id: 'C-137', name: 'PURGA CRONOLOGICA', status: 'WAITING', color: 'danger' },
    { id: 'B-042', name: 'BLOQUEO DE CIUDADELA', status: 'ACTIVE', color: 'success' },
    { id: 'X-900', name: 'AUTO-DESTRUCCION', status: 'OFFLINE', color: 'secondary' }
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <h2 className="text-danger fw-bold mb-4 px-2" style={{ letterSpacing: '2px' }}>
        <i className="bi bi-shield-slash-fill me-2"></i>PROTOCOLOS DE EMERGENCIA
      </h2>
      <div className="row g-3">
        {protocolos.map((p) => (
          <div className="col-12" key={p.id}>
            <div
              className={`p-3 border border-${p.color} border-opacity-20 rounded-3 d-flex justify-content-between align-items-center`}
              style={{ backgroundColor: p.color === 'danger' ? '#1a0505' : '#050a05' }}
            >
              <div>
                <span className={`text-${p.color} extra-small fw-bold`}>CODE: {p.id}</span>
                <h6 className="mb-0 text-white fw-bold">{p.name}</h6>
              </div>
              <button className={`btn btn-outline-${p.color} btn-sm px-4 rounded-pill extra-small fw-bold`}>
                {p.status === 'ACTIVE' ? 'DESACTIVAR' : 'EJECUTAR'}
              </button>
            </div>
          </div>
        ))}

        {/* Widget decorativo de estado crítico */}
        <div className="col-12 mt-4">
          <div
            className="p-4 rounded-4 border border-danger border-opacity-30 shadow-glow-red text-center"
            style={{ backgroundColor: '#150505' }}
          >
            <i className="bi bi-exclamation-octagon fs-1 text-danger d-block mb-2"></i>
            <h4 className="text-danger fw-bold glow-red mb-0">C-137 PROTECTED</h4>
            <p className="extra-small text-danger opacity-50">
              ELIMINACION DE RASTROS INTERDIMENSIONALES ACTIVA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
