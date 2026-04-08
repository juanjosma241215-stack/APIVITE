import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de demostración que consulta la API pública de Rick and Morty.
export const ApiRyC_Axios = ({ onDataUpdate }) => {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const source = axios.CancelToken.source();

    // Consulta remota con filtros de página y nombre.
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://rickandmortyapi.com/api/character', {
          params: { page, name: query },
          cancelToken: source.token
        });

        const results = data.results || [];
        setCharacters(results);
        setInfo(data.info || {});

        // Si el padre necesita estos datos, se los notificamos.
        if (onDataUpdate) onDataUpdate(results);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Peticion cancelada');
        } else if (err.response?.status === 404) {
          // Un 404 aquí significa "sin resultados", no error crítico.
          setCharacters([]);
          setInfo({});
          if (onDataUpdate) onDataUpdate([]);
        }
      }
    };

    fetchData();
    return () => source.cancel('Operacion cancelada');
  }, [page, query, onDataUpdate]);

  return (
    <section
      className="rounded-4 border border-success border-opacity-25 p-3 p-md-4 api-shell"
      style={{
        background:
          'linear-gradient(180deg, rgba(3, 8, 5, 0.96) 0%, rgba(10, 16, 13, 0.9) 100%)'
      }}
    >
      {/* Cabecera del módulo con resumen y paginación */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">
        <div>
          <p className="text-success small fw-bold text-uppercase mb-2 api-kicker">
            Explorador de la API
          </p>
          <h3 className="text-white fw-bold mb-1">Directorio de especimenes</h3>
          <p className="text-light opacity-75 small mb-0">
            Busca personajes y cambia de pagina desde la parte superior.
          </p>
        </div>

        {info.pages > 1 && (
          <div className="d-flex flex-wrap align-items-center gap-2 api-pagination-top">
            <button
              className="btn btn-outline-success rounded-pill px-3"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <i className="bi bi-chevron-left me-2"></i>Anterior
            </button>
            <span className="badge rounded-pill text-bg-dark border border-success border-opacity-25 px-3 py-2">
              Pagina {page} de {info.pages}
            </span>
            <button
              className="btn btn-outline-success rounded-pill px-3"
              disabled={page === info.pages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente<i className="bi bi-chevron-right ms-2"></i>
            </button>
          </div>
        )}
      </div>

      {/* Buscador principal */}
      <div className="position-relative mb-4">
        <i className="bi bi-search api-search-icon"></i>
        <input
          type="text"
          className="form-control rounded-pill border border-success border-opacity-25 api-search-input"
          placeholder="Buscar personaje por nombre..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Rejilla de personajes */}
      <div className="row g-3">
        {characters.map((char) => (
          <div key={char.id} className="col-6 col-md-4 col-xl-3">
            <article className="card h-100 border-0 api-card overflow-hidden">
              <div className="position-relative">
                <img src={char.image} className="card-img-top api-card-image" alt={char.name} />
                <span
                  className={`badge position-absolute top-0 end-0 m-2 rounded-pill ${
                    char.status === 'Alive' ? 'text-bg-success' : 'text-bg-danger'
                  }`}
                >
                  {char.status}
                </span>
              </div>

              <div className="card-body p-3">
                <h6 className="text-white fw-bold mb-2 text-truncate">{char.name}</h6>
                <div className="d-flex flex-column gap-2">
                  <span className="badge rounded-pill text-bg-dark border border-info border-opacity-25 text-info px-3 py-2 align-self-start">
                    {char.species}
                  </span>
                  <span className="small text-light opacity-75 text-truncate">
                    <i className="bi bi-globe2 me-2 text-success"></i>
                    {char.origin?.name || 'Origen desconocido'}
                  </span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Estado vacío cuando la búsqueda no devuelve resultados */}
      {characters.length === 0 && (
        <div className="text-center py-5">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 api-empty-icon">
            <i className="bi bi-search text-success fs-3"></i>
          </div>
          <h5 className="text-white fw-bold">No se encontraron resultados</h5>
          <p className="text-light opacity-75 mb-0">
            Intenta con otro nombre o vuelve a la pagina anterior.
          </p>
        </div>
      )}

      <style>{`
        .api-shell {
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 25px 60px rgba(0,0,0,0.25);
        }

        .api-kicker {
          letter-spacing: 2px;
        }

        .api-search-input {
          background: rgba(12, 18, 14, 0.95);
          color: white;
          padding: 0.95rem 1.25rem 0.95rem 3rem;
          box-shadow: none;
        }

        .api-search-input::placeholder {
          color: rgba(255,255,255,0.5);
        }

        .api-search-input:focus {
          background: rgba(12, 18, 14, 0.98);
          color: white;
          border-color: rgba(25, 135, 84, 0.65);
          box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15);
        }

        .api-search-icon {
          position: absolute;
          top: 50%;
          left: 1.1rem;
          transform: translateY(-50%);
          color: #19a974;
          z-index: 2;
        }

        .api-card {
          background: linear-gradient(180deg, rgba(12, 18, 14, 1) 0%, rgba(17, 24, 19, 0.94) 100%);
          border: 1px solid rgba(25, 135, 84, 0.12);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .api-card:hover {
          transform: translateY(-4px);
          border-color: rgba(25, 135, 84, 0.4);
          box-shadow: 0 18px 35px rgba(0, 0, 0, 0.35);
        }

        .api-card-image {
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }

        .api-empty-icon {
          width: 72px;
          height: 72px;
          background: rgba(25, 135, 84, 0.08);
          border: 1px solid rgba(25, 135, 84, 0.2);
        }

        @media (max-width: 768px) {
          .api-pagination-top {
            width: 100%;
          }

          .api-pagination-top .btn,
          .api-pagination-top .badge {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
