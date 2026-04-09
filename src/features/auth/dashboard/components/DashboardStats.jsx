import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Gráfico basado en la categoría de cada gasto.
export const DashboardStats = ({ characters }) => {
  const categoryCount = characters.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: 'Distribucion de gastos',
        data: Object.values(categoryCount),
        backgroundColor: [
          'rgba(25, 135, 84, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(102, 16, 242, 0.8)',
          'rgba(253, 126, 20, 0.8)'
        ],
        borderColor: '#000',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="card bg-dark border-success border-opacity-25 shadow-lg h-100 rounded-5">
      <div className="card-header border-success border-opacity-25">
        <h5 className="text-success mb-1 fw-bold small text-uppercase">Distribucion por categoria</h5>
        <p className="small text-light opacity-75 mb-0">
          Compara visualmente cuales categorias concentran la mayor parte de tus gastos.
        </p>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center" style={{ maxHeight: '320px', minHeight: '320px' }}>
        {characters.length > 0 ? (
          <Pie
            data={data}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: '#fff' } },
                tooltip: {
                  callbacks: {
                    label: (context) => `$${context.raw.toLocaleString('es-CO')}`
                  }
                }
              }
            }}
          />
        ) : (
          <p className="text-secondary small">Cargando resumen financiero...</p>
        )}
      </div>
    </div>
  );
};
