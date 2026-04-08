import React from 'react';

// Vista opcional del dashboard con estilo de laboratorio.
export const LaboratorioView = () => {
  return (
    <div className="animate__animated animate__fadeIn text-center py-5">
      <div className="p-5 border border-info border-opacity-25 rounded-5 bg-info bg-opacity-5 shadow-glow-blue">
        <i className="bi bi-flask fs-1 text-info mb-3 d-block"></i>
        <h2 className="text-info fw-bold">LABORATORIO BIO-GENETICO</h2>
        <p className="text-secondary small mb-4">Analizando muestras de ADN de universos paralelos...</p>
        <div className="d-flex justify-content-center gap-3">
          <div className="spinner-border text-info" role="status"></div>
          <div className="spinner-grow text-info" role="status"></div>
        </div>
        <button className="btn btn-info text-dark fw-bold mt-4 px-5 rounded-pill shadow-glow-blue">
          INICIAR SECUENCIACION
        </button>
      </div>
    </div>
  );
};
