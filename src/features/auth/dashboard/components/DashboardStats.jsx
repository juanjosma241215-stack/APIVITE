import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registramos los módulos necesarios para que Chart.js pueda dibujar el gráfico circular.
ChartJS.register(ArcElement, Tooltip, Legend);

// Componente que transforma la lista de personajes en una gráfica por especie.
export const DashboardStats = ({ characters }) => {
  // Agrupa cuántos personajes hay por especie.
  const speciesCount = characters.reduce((acc, char) => {
    acc[char.species] = (acc[char.species] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(speciesCount),
    datasets: [
      {
        label: 'Cantidad por Especie',
        data: Object.values(speciesCount),
        backgroundColor: [
          'rgba(25, 135, 84, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(102, 16, 242, 0.8)'
        ],
        borderColor: '#000',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="card bg-dark border-success border-opacity-25 shadow-lg h-100">
      <div className="card-header border-success border-opacity-25">
        <h5 className="text-success mb-0 fw-bold small text-uppercase">Distribucion de Especies</h5>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center" style={{ maxHeight: '300px' }}>
        {characters.length > 0 ? (
          <Pie
            data={data}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#fff' } } }
            }}
          />
        ) : (
          <p className="text-secondary small">Cargando datos del multiverso...</p>
        )}
      </div>
    </div>
  );
};
