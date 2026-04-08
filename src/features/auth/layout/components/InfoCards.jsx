// Tarjetas informativas que complementan la landing.
export const InfoCards = () => {
  return (
    <div className="row g-4 mt-4 pb-5 text-start">
      {/* Tarjeta para la documentación pública de Rick and Morty API */}
      <div className="col-12 col-md-6">
        <div
          className="p-4 h-100 shadow-lg transition-all"
          style={{
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
            borderLeft: '4px solid #198754',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(25, 135, 84, 0.2)'
          }}
        >
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-3 gap-3">
            <div className="p-2 bg-success bg-opacity-10 rounded">
              <i className="bi bi-journal-code text-success fs-3"></i>
            </div>
            <h3 className="h5 fw-bold mb-0 text-white">Documentacion API</h3>
          </div>
          <p className="text-secondary small mb-4">
            Consulta la fuente oficial de datos para obtener mas detalles sobre los personajes y
            episodios del multiverso.
          </p>
          <a
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-success w-100 fw-bold"
          >
            Ver API <i className="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      </div>

      {/* Tarjeta para enviar al usuario al repositorio del proyecto */}
      <div className="col-12 col-md-6">
        <div
          className="p-4 h-100 shadow-lg"
          style={{
            backgroundColor: 'rgba(20, 20, 20, 0.8)',
            borderLeft: '4px solid #0dcaf0',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(13, 202, 240, 0.2)'
          }}
        >
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-3 gap-3">
            <div className="p-2 bg-info bg-opacity-10 rounded">
              <i className="bi bi-terminal text-info fs-3"></i>
            </div>
            <h3 className="h5 fw-bold mb-0 text-white">Codigo Fuente</h3>
          </div>
          <p className="text-secondary small mb-4">
            Explora el repositorio de este proyecto para ver como se integraron los componentes y
            la logica de la Ciudadela.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-info w-100 fw-bold text-dark"
          >
            GitHub <i className="bi bi-github ms-1"></i>
          </a>
        </div>
      </div>
    </div>
  );
};
