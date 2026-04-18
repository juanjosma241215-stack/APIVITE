import React from 'react';

export const ProtocolosView = ({ expenses = [], stats, budgetStatus }) => {
  const alerts = expenses
    .filter((expense) => expense.status === 'high')
    .map((expense) => ({
      id: expense._id,
      name: expense.name,
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
          Aqui aparecen los movimientos mas pesados y el estado actual de tu presupuesto personal.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-6">
          <div className="p-4 rounded-5 border border-warning border-opacity-25 alert-card h-100">
            <span className="small text-warning fw-bold d-block mb-2">Presupuesto mensual</span>
            <h4 className={`fw-bold mb-2 ${budgetStatus?.isOverBudget ? 'text-danger' : 'text-white'}`}>
              {budgetStatus?.isOverBudget
                ? 'Has superado tu presupuesto'
                : budgetStatus?.thresholdReached
                  ? 'Estas muy cerca del limite'
                  : 'Tu presupuesto sigue controlado'}
            </h4>
            <p className="small text-light opacity-75 mb-3">
              Usado: ${Number(budgetStatus?.used || 0).toLocaleString('es-CO')} de $
              {Number(budgetStatus?.limit || 0).toLocaleString('es-CO')}
            </p>
            <div className="progress bg-dark" style={{ height: '8px' }}>
              <div
                className={`progress-bar ${
                  budgetStatus?.isOverBudget
                    ? 'bg-danger'
                    : budgetStatus?.thresholdReached
                      ? 'bg-warning'
                      : 'bg-success'
                }`}
                style={{ width: `${Math.min(budgetStatus?.percentage || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="p-4 rounded-5 border border-info border-opacity-25 info-card h-100">
            <span className="small text-info fw-bold d-block mb-2">Revision del mes</span>
            <h4 className="fw-bold text-white mb-2">
              {stats?.alerts > 0 ? `${stats.alerts} gastos requieren revision` : 'Sin alertas fuertes por monto'}
            </h4>
            <p className="small text-light opacity-75 mb-0">
              Usa este espacio para detectar si conviene reducir compras impulsivas, transporte,
              ocio o gastos recurrentes.
            </p>
          </div>
        </div>
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
              <span className="badge rounded-pill text-bg-warning text-dark px-3 py-2">
                Prioridad alta
              </span>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="col-12">
            <div className="text-center border border-success border-opacity-10 rounded-4 p-4">
              <i className="bi bi-bell-slash text-success fs-2 d-block mb-2"></i>
              <p className="mb-1 text-white fw-semibold">No hay alertas criticas</p>
              <p className="mb-0 text-light opacity-75">
                Tus gastos altos y el presupuesto estan bajo control por ahora.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .alert-card {
          background:
            linear-gradient(180deg, rgba(28, 22, 7, 0.96) 0%, rgba(23, 18, 5, 0.92) 100%);
        }

        .info-card {
          background:
            linear-gradient(180deg, rgba(6, 18, 28, 0.96) 0%, rgba(5, 13, 23, 0.92) 100%);
        }
      `}</style>
    </div>
  );
};
