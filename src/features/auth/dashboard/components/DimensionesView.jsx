import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Vista secundaria del dashboard para mostrar ubicaciones/dimensiones.
export const DimensionesView = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargamos la primera página de ubicaciones de la API pública.
    axios.get('https://rickandmortyapi.com/api/location?page=1').then((res) => {
      setLocations(res.data.results);
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate__animated animate__fadeIn">
      <h2 className="text-success fw-bold mb-4 px-2" style={{ letterSpacing: '2px' }}>
        <i className="bi bi-geo-fill me-2"></i>MAPA DIMENSIONAL
      </h2>
      <div className="row g-4">
        {loading ? (
          <div className="text-success p-5 text-center w-100">ESCANEANDO SECTOR...</div>
        ) : (
          locations.map((loc) => (
            <div className="col-md-4" key={loc.id}>
              <div className="p-3 border border-success border-opacity-25 bg-black bg-opacity-50 rounded-4 shadow-glow-sm h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 extra-small">
                    ID: {loc.id}
                  </span>
                  <i className="bi bi-broadcast text-success opacity-50"></i>
                </div>
                <h6 className="fw-bold text-white mb-1">{loc.name}</h6>
                <p className="text-success extra-small opacity-75 mb-3">
                  {loc.type} - {loc.dimension}
                </p>
                <div className="d-flex align-items-center gap-2">
                  <div className="flex-grow-1 bg-dark rounded-pill" style={{ height: '4px' }}>
                    <div className="bg-success rounded-pill" style={{ width: '70%', height: '100%' }}></div>
                  </div>
                  <span className="extra-small opacity-50 text-white">ESTABLE</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
