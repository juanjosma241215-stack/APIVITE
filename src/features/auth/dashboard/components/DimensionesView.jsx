import React from 'react';

// Vista de categorías calculada a partir de los gastos guardados.
export const DimensionesView = ({ expenses = [] }) => {
  const categoriesMap = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = {
        id: expense.category,
        name: expense.category,
        amount: 0,
        count: 0
      };
    }

    acc[expense.category].amount += expense.amount;
    acc[expense.category].count += 1;
    return acc;
  }, {});

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categories = Object.values(categoriesMap).sort((a, b) => b.amount - a.amount);

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="mb-4">
        <h2 className="text-success fw-bold mb-1 px-2" style={{ letterSpacing: '2px' }}>
          <i className="bi bi-tags-fill me-2"></i>CATEGORIAS DE GASTO
        </h2>
        <p className="text-light opacity-75 px-2 mb-0">
          Esta vista resume cuanto pesa cada categoria dentro de todos tus gastos registrados.
        </p>
      </div>

      <div className="row g-4">
        {categories.map((category) => {
          const percentage = totalAmount > 0 ? Math.round((category.amount / totalAmount) * 100) : 0;

          return (
            <div className="col-md-4" key={category.id}>
              <div className="p-4 border border-success border-opacity-25 bg-black bg-opacity-50 rounded-5 shadow-glow-sm h-100 category-card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 extra-small">
                    {category.count} movimiento(s)
                  </span>
                  <i className="bi bi-wallet2 text-success opacity-50"></i>
                </div>
                <h6 className="fw-bold text-white mb-1">{category.name}</h6>
                <p className="small text-light opacity-75 mb-2">
                  Categoria usada para clasificar y entender en que area se va tu presupuesto.
                </p>
                <p className="text-success extra-small opacity-75 mb-3">
                  ${category.amount.toLocaleString('es-CO')} - {percentage}% del total
                </p>
                <div className="d-flex align-items-center gap-2">
                  <div className="flex-grow-1 bg-dark rounded-pill" style={{ height: '4px' }}>
                    <div
                      className="bg-success rounded-pill"
                      style={{ width: `${Math.min(percentage, 100)}%`, height: '100%' }}
                    ></div>
                  </div>
                  <span className="extra-small opacity-50 text-white">{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="col-12">
            <div className="text-center border border-success border-opacity-10 rounded-4 p-4">
              <i className="bi bi-tags text-success fs-2 d-block mb-2"></i>
              <p className="mb-1 text-white fw-semibold">Sin categorias para mostrar</p>
              <p className="mb-0 text-light opacity-75">
                Aun no hay gastos registrados para calcular categorias.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .category-card {
          background:
            linear-gradient(180deg, rgba(6, 9, 8, 0.96) 0%, rgba(11, 16, 13, 0.92) 100%);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .category-card:hover {
          transform: translateY(-4px);
          border-color: rgba(25, 135, 84, 0.32) !important;
        }
      `}</style>
    </div>
  );
};
