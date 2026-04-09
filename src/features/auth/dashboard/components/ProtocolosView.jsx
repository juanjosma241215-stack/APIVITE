import React from 'react';

// Vista de alertas generada desde los gastos guardados.
export const ProtocolosView = ({ expenses = [], stats }) => {
  const alerts = expenses
    .filter((expense) => expense.status === 'high')
    .map((expense) => ({
      id: expense._id,
      name: expense.name,
      color: 'warning',
      amount: expense.amount,
      category: expense.category
    }));

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-4">
        <h2 className="text-warning fw-bold mb-1 px-2" style={{ letterSpacing: '2px' }}>
          <i className="bi bi-bell-fill me-2"></i>ALERTAS Y RECORDATORIOS
        </h2>
        <p className="text-light opacity-75 px-2 mb-0">
          Aqui aparecen los movimientos que merecen atencion porque tienen montos altos o impacto fuerte en el presupuesto.
        </p>
      </div>

      <div className="row g-3">
        {alerts.map((alert) => (
          <div className="col-12" key={alert.id}>
            <div className="p-4 border border-warning border-opacity-20 rounded-4 d-flex justify-content-between align-items-center alert-card">
              <div>
                <span className="text-warning extra-small fw-bold">
                  {alert.category} - ${alert.amount.toLocaleString('es-CO')}
                </span>
                <h6 className="mb-1 text-white fw-bold">{alert.name}</h6>
                <p className="small text-light opacity-75 mb-0">
                  Este gasto supero el umbral sugerido y conviene revisarlo con mas detalle.
                </p>
              </div>
              <button className="btn btn-outline-warning btn-sm px-4 rounded-pill extra-small fw-bold">
                REVISAR
              </button>
            </div>
          </div>
        ))}

        <div className="col-12 mt-4">
          <div className="p-4 rounded-5 border border-warning border-opacity-30 shadow-glow-red text-center monthly-review-card">
            <i className="bi bi-exclamation-triangle fs-1 text-warning d-block mb-2"></i>
            <h4 className="text-warning fw-bold mb-1">REVISION DE CIERRE MENSUAL</h4>
            <p className="small text-light opacity-75 mb-2">
              Este resumen te ayuda a identificar rapido si el mes necesita ajustes.
            </p>
            <p className="extra-small text-warning opacity-50 mb-0">
              {stats?.alerts > 0
                ? `Tienes ${stats.alerts} gasto(s) altos que conviene revisar.`
                : 'No hay alertas activas en este momento.'}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .alert-card {
          background:
            linear-gradient(180deg, rgba(28, 22, 7, 0.96) 0%, rgba(23, 18, 5, 0.92) 100%);
        }

        .monthly-review-card {
          background:
            radial-gradient(circle at top, rgba(255, 193, 7, 0.12), transparent 45%),
            linear-gradient(180deg, rgba(26, 20, 5, 0.96) 0%, rgba(23, 18, 5, 0.92) 100%);
        }
      `}</style>
    </div>
  );
};
