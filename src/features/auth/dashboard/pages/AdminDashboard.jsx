import React, { useEffect, useMemo, useState } from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { DimensionesView } from '../components/DimensionesView';
import { ProtocolosView } from '../components/ProtocolosView';
import { useRickAndMorty } from '../hooks/useRickAndMorty';
import { getAuthSession } from '../../../../shared/auth/session';

const initialExpenseState = {
  name: '',
  category: 'Alimentacion',
  amount: ''
};

const navItems = [
  {
    key: 'overview',
    icon: 'bi-grid',
    title: 'Panel',
    subtitle: 'Resumen general, presupuesto y registro diario'
  },
  {
    key: 'categories',
    icon: 'bi-tags',
    title: 'Categorias',
    subtitle: 'Distribucion de gasto por area'
  },
  {
    key: 'alerts',
    icon: 'bi-bell',
    title: 'Alertas',
    subtitle: 'Avisos de sobrecosto y revision'
  }
];

const categories = [
  'Alimentacion',
  'Transporte',
  'Entretenimiento',
  'Salidas',
  'Servicios',
  'Compras',
  'Salud',
  'Hogar',
  'Educacion',
  'Ahorro'
];

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString('es-CO')}`;

export const AdminDashboard = () => {
  const session = getAuthSession();
  const userId = session?.id;
  const userName = session?.name || 'Usuario';
  const {
    filteredCharacters,
    allExpenses,
    stats,
    budgetStatus,
    profile,
    loading,
    submitting,
    error,
    searchTerm,
    setSearchTerm,
    addExpense,
    updateExpense,
    deleteExpense,
    resetExpenses,
    updateBudgetSettings
  } = useRickAndMorty(userId);

  const [activeTab, setActiveTab] = useState('overview');
  const [expenseForm, setExpenseForm] = useState(initialExpenseState);
  const [budgetForm, setBudgetForm] = useState({
    monthlyBudget: String(session?.monthlyBudget || 1200000),
    budgetAlertThreshold: String(session?.budgetAlertThreshold || 100)
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setBudgetForm({
      monthlyBudget: String(profile.monthlyBudget || 1200000),
      budgetAlertThreshold: String(profile.budgetAlertThreshold || 100)
    });
  }, [profile.monthlyBudget, profile.budgetAlertThreshold]);

  useEffect(() => {
    if (!budgetStatus.isOverBudget) {
      return;
    }

    const storageKey = `budget-alert-${userId}-${Math.floor(budgetStatus.used)}`;

    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    sessionStorage.setItem(storageKey, 'shown');

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Presupuesto excedido', {
          body: `Has gastado ${formatCurrency(budgetStatus.used)} y superaste tu limite mensual.`
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [budgetStatus.isOverBudget, budgetStatus.used, userId]);

  const recentExpenses = useMemo(() => filteredCharacters.slice(0, 12), [filteredCharacters]);

  const handleExpenseChange = ({ target }) => {
    setExpenseForm((current) => ({
      ...current,
      [target.name]: target.value
    }));
  };

  const handleBudgetChange = ({ target }) => {
    setBudgetForm((current) => ({
      ...current,
      [target.name]: target.value
    }));
  };

  const handleExpenseSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    try {
      if (editingId) {
        await updateExpense(editingId, expenseForm);
        setSuccessMessage('El gasto fue actualizado correctamente.');
      } else {
        await addExpense(expenseForm);
        setSuccessMessage('El gasto fue registrado correctamente.');
      }

      setExpenseForm(initialExpenseState);
      setEditingId(null);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleBudgetSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    try {
      await updateBudgetSettings({
        monthlyBudget: budgetForm.monthlyBudget,
        budgetAlertThreshold: budgetForm.budgetAlertThreshold
      });
      setSuccessMessage('Tu presupuesto personal fue actualizado.');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setExpenseForm({
      name: expense.name,
      category: expense.category,
      amount: String(expense.amount)
    });
    setActiveTab('overview');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este gasto de tu historial?')) {
      return;
    }

    try {
      await deleteExpense(id);
      setSuccessMessage('El gasto fue eliminado.');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Esto borrara todos tus gastos personales. Deseas continuar?')) {
      return;
    }

    try {
      await resetExpenses();
      setEditingId(null);
      setExpenseForm(initialExpenseState);
      setSuccessMessage('Tu historial fue limpiado.');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setExpenseForm(initialExpenseState);
    setFormError('');
  };

  return (
    <div className="budget-app-shell min-vh-100 text-white">
      <div className="container-fluid px-3 px-lg-4 py-4 py-xl-5">
        <div className="row g-4">
          <div className="col-12 col-xl-3">
            <aside className="dashboard-sidebar-panel p-3 p-lg-4 rounded-5 h-100">
              <div className="mb-4">
                <span className="dashboard-eyebrow">Control financiero real</span>
                <h2 className="fw-bold mb-2 mt-2">
                  Presupuesto de <span className="text-success">{userName}</span>
                </h2>
                <p className="text-light opacity-75 mb-0">
                  Cada cuenta tiene su propio panel, su propio limite y su propio historial.
                </p>
              </div>

              <div className="d-grid gap-2 mb-4">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`sidebar-tab text-start rounded-4 p-3 ${
                      activeTab === item.key ? 'active' : ''
                    }`}
                  >
                    <div className="d-flex gap-3 align-items-start">
                      <i className={`bi ${item.icon} fs-5`}></i>
                      <div>
                        <div className="fw-semibold">{item.title}</div>
                        <div className="small opacity-75">{item.subtitle}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="budget-status-card rounded-4 p-4">
                <span className="small text-success fw-bold d-block mb-2">Estado del limite</span>
                <h4 className={`fw-bold mb-2 ${budgetStatus.isOverBudget ? 'text-danger' : 'text-white'}`}>
                  {budgetStatus.isOverBudget
                    ? 'Presupuesto excedido'
                    : budgetStatus.thresholdReached
                      ? 'Cerca del limite'
                      : 'Bajo control'}
                </h4>
                <p className="small text-light opacity-75 mb-3">
                  {formatCurrency(budgetStatus.used)} usados de {formatCurrency(budgetStatus.limit)}
                </p>
                <div className="progress bg-dark-subtle mb-2" style={{ height: '8px' }}>
                  <div
                    className={`progress-bar ${
                      budgetStatus.isOverBudget
                        ? 'bg-danger'
                        : budgetStatus.thresholdReached
                          ? 'bg-warning'
                          : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                  ></div>
                </div>
                <span className="small text-light opacity-75">
                  Restante: {formatCurrency(budgetStatus.remaining)}
                </span>
              </div>
            </aside>
          </div>

          <div className="col-12 col-xl-9">
            <div className="dashboard-main-panel p-3 p-md-4 p-xl-5 rounded-5">
              <header className="hero-panel rounded-5 p-4 p-lg-5 mb-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-start">
                  <div>
                    <span className="dashboard-eyebrow">Panel personalizado</span>
                    <h1 className="display-6 fw-bold mt-2 mb-3">
                      Administra tus <span className="text-success">gastos diarios</span>
                    </h1>
                    <p className="text-light opacity-75 mb-0 hero-copy">
                      Bienvenido, {userName}. Este panel te ayuda a registrar movimientos, ajustar tu
                      presupuesto y detectar cuando una categoria o el mes completo se esta saliendo
                      de control.
                    </p>
                  </div>

                  <div className="session-chip rounded-4 p-3">
                    <div className="small text-success fw-bold">Cuenta activa</div>
                    <div className="fw-semibold">{session?.email}</div>
                    <div className="small text-light opacity-75">
                      Presupuesto actual: {formatCurrency(profile.monthlyBudget)}
                    </div>
                  </div>
                </div>
              </header>

              {(error || formError) && (
                <div className="alert alert-warning rounded-4 mb-4">{formError || error}</div>
              )}

              {successMessage && (
                <div className="alert alert-success rounded-4 mb-4">{successMessage}</div>
              )}

              {activeTab === 'overview' && (
                <>
                  {(budgetStatus.isOverBudget || budgetStatus.thresholdReached) && (
                    <div
                      className={`alert rounded-4 mb-4 ${
                        budgetStatus.isOverBudget ? 'alert-danger' : 'alert-warning'
                      }`}
                    >
                      {budgetStatus.isOverBudget
                        ? `Atencion: ya superaste tu presupuesto mensual por ${formatCurrency(
                            budgetStatus.used - budgetStatus.limit
                          )}.`
                        : `Aviso: ya consumiste ${budgetStatus.percentage.toFixed(
                            1
                          )}% de tu presupuesto mensual.`}
                    </div>
                  )}

                  <div className="row g-3 mb-4">
                    {[
                      {
                        label: 'Gastado',
                        value: formatCurrency(stats.totalAmount),
                        subtitle: 'Total acumulado del periodo'
                      },
                      {
                        label: 'Restante',
                        value: formatCurrency(budgetStatus.remaining),
                        subtitle: 'Dinero disponible antes del limite'
                      },
                      {
                        label: 'Movimientos',
                        value: loading ? '...' : stats.total,
                        subtitle: 'Registros guardados en tu cuenta'
                      },
                      {
                        label: 'Promedio',
                        value: formatCurrency(stats.averageAmount),
                        subtitle: 'Valor medio por gasto'
                      }
                    ].map((item) => (
                      <div className="col-12 col-sm-6 col-xxl-3" key={item.label}>
                        <div className="metric-tile rounded-4 p-4 h-100">
                          <div className="small text-success fw-bold mb-2">{item.label}</div>
                          <div className="fs-3 fw-bold mb-2">{item.value}</div>
                          <div className="small text-light opacity-75">{item.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="row g-4">
                    <div className="col-12 col-xxl-4">
                      <div className="dashboard-card rounded-5 p-4 h-100">
                        <div className="mb-4">
                          <h5 className="fw-bold text-success mb-1">Presupuesto mensual</h5>
                          <p className="small text-light opacity-75 mb-0">
                            Ajusta tu limite y el punto exacto en el que quieres ser alertado.
                          </p>
                        </div>

                        <form className="d-grid gap-3" onSubmit={handleBudgetSubmit}>
                          <div>
                            <label className="form-label small text-light fw-semibold">
                              Presupuesto del mes
                            </label>
                            <input
                              name="monthlyBudget"
                              type="number"
                              min="0"
                              step="1000"
                              value={budgetForm.monthlyBudget}
                              onChange={handleBudgetChange}
                              className="form-control dashboard-input"
                              required
                            />
                          </div>

                          <div>
                            <label className="form-label small text-light fw-semibold">
                              Avisar cuando llegue al (%)
                            </label>
                            <input
                              name="budgetAlertThreshold"
                              type="number"
                              min="1"
                              max="300"
                              value={budgetForm.budgetAlertThreshold}
                              onChange={handleBudgetChange}
                              className="form-control dashboard-input"
                              required
                            />
                          </div>

                          <button className="btn btn-success rounded-4 py-3 fw-bold" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Guardar presupuesto'}
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="col-12 col-xxl-4">
                      <div className="dashboard-card rounded-5 p-4 h-100">
                        <div className="mb-4">
                          <h5 className="fw-bold text-success mb-1">
                            {editingId ? 'Editar movimiento' : 'Nuevo movimiento'}
                          </h5>
                          <p className="small text-light opacity-75 mb-0">
                            Registra tus gastos para que el panel te muestre un control real.
                          </p>
                        </div>

                        <form className="d-grid gap-3" onSubmit={handleExpenseSubmit}>
                          <div>
                            <label className="form-label small text-light fw-semibold">
                              Nombre del gasto
                            </label>
                            <input
                              name="name"
                              type="text"
                              value={expenseForm.name}
                              onChange={handleExpenseChange}
                              className="form-control dashboard-input"
                              placeholder="Ej. Mercado de la semana"
                              required
                            />
                          </div>

                          <div>
                            <label className="form-label small text-light fw-semibold">
                              Categoria
                            </label>
                            <select
                              name="category"
                              value={expenseForm.category}
                              onChange={handleExpenseChange}
                              className="form-select dashboard-input"
                            >
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="form-label small text-light fw-semibold">
                              Monto
                            </label>
                            <input
                              name="amount"
                              type="number"
                              value={expenseForm.amount}
                              onChange={handleExpenseChange}
                              className="form-control dashboard-input"
                              min="0"
                              step="1000"
                              placeholder="85000"
                              required
                            />
                          </div>

                          <button className="btn btn-success rounded-4 py-3 fw-bold" disabled={submitting}>
                            {submitting
                              ? 'Procesando...'
                              : editingId
                                ? 'Guardar cambios'
                                : 'Registrar gasto'}
                          </button>

                          {editingId && (
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="btn btn-outline-light rounded-4 py-3"
                            >
                              Cancelar edicion
                            </button>
                          )}
                        </form>
                      </div>
                    </div>

                    <div className="col-12 col-xxl-4">
                      <div className="dashboard-card rounded-5 p-4 h-100">
                        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                          <div>
                            <h5 className="fw-bold text-success mb-1">Historial reciente</h5>
                            <p className="small text-light opacity-75 mb-0">
                              Solo ves movimientos de tu propia cuenta.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline-danger btn-sm rounded-pill"
                          >
                            Limpiar
                          </button>
                        </div>

                        <div className="mb-3">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="form-control dashboard-input rounded-pill"
                            placeholder="Buscar por nombre o categoria"
                          />
                        </div>

                        <div className="d-grid gap-3 expense-list">
                          {recentExpenses.map((expense) => (
                            <div className="expense-row rounded-4 p-3" key={expense._id}>
                              <div className="d-flex justify-content-between gap-3">
                                <div>
                                  <div className="fw-semibold text-white">{expense.name}</div>
                                  <div className="small text-light opacity-75">
                                    {expense.category} · {formatCurrency(expense.amount)}
                                  </div>
                                </div>
                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(expense)}
                                    className="btn btn-outline-info btn-sm rounded-pill"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(expense._id)}
                                    className="btn btn-outline-danger btn-sm rounded-pill"
                                  >
                                    Borrar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {recentExpenses.length === 0 && (
                            <div className="empty-state rounded-4 p-4 text-center">
                              <i className="bi bi-inbox fs-1 text-success d-block mb-2"></i>
                              <div className="fw-semibold mb-1">Todavia no hay gastos</div>
                              <div className="small text-light opacity-75">
                                Empieza registrando tu primer movimiento para activar el control.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-4 mt-1">
                    <div className="col-12 col-xxl-8">
                      <div className="dashboard-card rounded-5 p-4 h-100">
                        <DashboardStats characters={allExpenses} />
                      </div>
                    </div>
                    <div className="col-12 col-xxl-4">
                      <div className="dashboard-card rounded-5 p-4 h-100">
                        <h5 className="fw-bold text-success mb-3">Lectura inteligente</h5>
                        <div className="d-grid gap-3">
                          <div className="insight-card rounded-4 p-3">
                            <div className="small text-success fw-bold mb-1">Presupuesto restante</div>
                            <div className="fw-semibold">{formatCurrency(budgetStatus.remaining)}</div>
                          </div>
                          <div className="insight-card rounded-4 p-3">
                            <div className="small text-info fw-bold mb-1">Categorias activas</div>
                            <div className="fw-semibold">{stats.species} categorias con movimiento</div>
                          </div>
                          <div className="insight-card rounded-4 p-3">
                            <div className="small text-warning fw-bold mb-1">Alertas por monto</div>
                            <div className="fw-semibold">{stats.alerts} gasto(s) altos detectados</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'categories' && <DimensionesView expenses={allExpenses} />}
              {activeTab === 'alerts' && (
                <ProtocolosView expenses={allExpenses} stats={stats} budgetStatus={budgetStatus} />
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .budget-app-shell {
          background:
            radial-gradient(circle at top left, rgba(13, 110, 253, 0.08), transparent 32%),
            radial-gradient(circle at top right, rgba(25, 135, 84, 0.14), transparent 32%),
            linear-gradient(180deg, #040706 0%, #08110d 100%);
        }

        .dashboard-sidebar-panel,
        .dashboard-main-panel,
        .dashboard-card,
        .hero-panel {
          background: rgba(7, 12, 10, 0.82);
          border: 1px solid rgba(120, 255, 187, 0.08);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(20px);
        }

        .dashboard-eyebrow {
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #78f3ad;
          font-weight: 700;
        }

        .sidebar-tab {
          background: transparent;
          border: 1px solid rgba(120, 255, 187, 0.08);
          color: #c2d6cc;
          transition: all 0.2s ease;
        }

        .sidebar-tab.active,
        .sidebar-tab:hover {
          background: linear-gradient(135deg, rgba(25, 135, 84, 0.18), rgba(10, 20, 16, 0.95));
          border-color: rgba(120, 255, 187, 0.2);
          color: white;
        }

        .budget-status-card,
        .session-chip,
        .metric-tile,
        .insight-card,
        .expense-row,
        .empty-state {
          background: rgba(10, 18, 14, 0.88);
          border: 1px solid rgba(120, 255, 187, 0.08);
        }

        .dashboard-input {
          background: rgba(16, 24, 20, 0.95);
          color: white;
          border: 1px solid rgba(120, 255, 187, 0.14);
          border-radius: 1rem;
          padding: 0.9rem 1rem;
        }

        .dashboard-input:focus {
          background: rgba(16, 24, 20, 0.98);
          color: white;
          border-color: rgba(120, 255, 187, 0.4);
          box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.15);
        }

        .expense-list {
          max-height: 520px;
          overflow: auto;
        }

        .hero-copy {
          max-width: 720px;
        }

        @media (max-width: 1199px) {
          .dashboard-sidebar-panel {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};
