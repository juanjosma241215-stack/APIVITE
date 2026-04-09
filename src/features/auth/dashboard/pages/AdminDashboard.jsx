import React, { useState } from 'react';
import { useRickAndMorty } from '../hooks/useRickAndMorty';
import { DashboardStats } from '../components/DashboardStats';
import { DimensionesView } from '../components/DimensionesView';
import { ProtocolosView } from '../components/ProtocolosView';
import { getAuthSession } from '../../../../shared/auth/session';

const initialFormState = {
  name: '',
  category: 'Alimentacion',
  amount: ''
};

const navItems = [
  {
    key: 'monitor',
    icon: 'bi-bar-chart-line',
    title: 'Resumen',
    subtitle: 'Panel principal con gastos, formulario y metricas'
  },
  {
    key: 'dimensiones',
    icon: 'bi-tags',
    title: 'Categorias',
    subtitle: 'Distribucion por tipo de gasto y peso en el mes'
  },
  {
    key: 'protocolos',
    icon: 'bi-bell',
    title: 'Alertas',
    subtitle: 'Movimientos altos y recordatorios de revision'
  }
];

// Dashboard privado adaptado a una experiencia de gastos diarios.
export const AdminDashboard = () => {
  const {
    filteredCharacters,
    allExpenses,
    stats,
    loading,
    submitting,
    error,
    searchTerm,
    setSearchTerm,
    addExpense,
    updateExpense,
    deleteExpense,
    resetExpenses
  } = useRickAndMorty();
  const [activeTab, setActiveTab] = useState('monitor');
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const userName = getAuthSession()?.name || 'Usuario';
  const currency = (value) => `$${value.toLocaleString('es-CO')}`;

  const handleChange = ({ target }) => {
    setFormData((current) => ({
      ...current,
      [target.name]: target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      if (editingId) {
        await updateExpense(editingId, formData);
      } else {
        await addExpense(formData);
      }

      setFormData(initialFormState);
      setEditingId(null);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setFormData({
      name: expense.name,
      category: expense.category,
      amount: String(expense.amount)
    });
    setActiveTab('monitor');
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleReset = async () => {
    try {
      await resetExpenses();
      setEditingId(null);
      setFormData(initialFormState);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setFormError('');
  };

  return (
    <div
      className="min-vh-100 d-flex bg-black text-white overflow-hidden flex-column flex-lg-row"
      style={{ fontFamily: 'sans-serif' }}
    >
      <aside
        className="border-end border-success border-opacity-10 p-4 d-none d-lg-flex flex-column dashboard-sidebar"
        style={{ width: '300px' }}
      >
        <div className="mb-5">
          <span className="dashboard-kicker">Centro financiero personal</span>
          <h3 className="fw-bold mb-1 mt-2">
            GASTOS <span className="text-success glow-green-soft">HUB</span>
          </h3>
          <p className="text-light opacity-75 small mb-3">
            Visualiza tu dinero, registra movimientos y toma decisiones con mas claridad.
          </p>
          <span className="badge border border-success text-success extra-small">CONTROL ACTIVO</span>
        </div>

        <nav className="nav flex-column gap-2 flex-grow-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`nav-link border-0 text-start px-3 py-3 rounded-4 sidebar-link ${
                activeTab === item.key ? 'active-neon' : 'text-secondary bg-transparent'
              }`}
            >
              <div className="d-flex align-items-start gap-3">
                <i className={`bi ${item.icon} mt-1`}></i>
                <div>
                  <span className="d-block fw-semibold text-white">{item.title}</span>
                  <span className="small opacity-75">{item.subtitle}</span>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-3 rounded-4 border border-success border-opacity-20 shadow-glow-green sidebar-budget-card">
          <i className="bi bi-wallet2 text-success"></i>
          <p className="extra-small mt-2 mb-1 fw-bold text-success">PRESUPUESTO VIGILADO</p>
          <p className="small text-light opacity-75 mb-0">
            {stats.budgetUsed} del presupuesto mensual ya fue utilizado.
          </p>
        </div>
      </aside>

      <main className="flex-grow-1 p-3 p-md-4 p-xl-5 overflow-auto custom-scrollbar">
        <div className="d-lg-none mb-4">
          <div className="dashboard-mobile-nav rounded-4 border border-success border-opacity-10 p-2">
            <div className="d-flex flex-column gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`nav-link border-0 text-start px-3 py-3 rounded-4 ${
                    activeTab === item.key ? 'active-neon' : 'text-secondary bg-transparent'
                  }`}
                >
                  <div className="d-flex align-items-start gap-3">
                    <i className={`bi ${item.icon} mt-1`}></i>
                    <div>
                      <span className="d-block fw-semibold text-white">{item.title}</span>
                      <span className="small opacity-75">{item.subtitle}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'monitor' && (
          <div className="animate__animated animate__fadeIn">
            <header className="dashboard-hero rounded-5 p-4 p-md-5 mb-4 mb-md-5">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
                <div>
                  <span className="dashboard-kicker">Resumen del mes</span>
                  <h1 className="fw-bold mb-2 mt-2 dashboard-title">
                    PANEL DE <span className="text-success">GASTOS</span>
                  </h1>
                  <p className="text-light opacity-75 mb-2 hero-subcopy">
                    Este panel centraliza el registro, la busqueda y el seguimiento de tus gastos
                    diarios para que entiendas rapido en que se va tu dinero.
                  </p>
                  <code className="text-success opacity-50 dashboard-code">
                    --daily_expense_tracking_enabled
                  </code>
                </div>

                <div className="dashboard-user-card d-flex align-items-center gap-3 px-3 py-3 rounded-4 w-100 w-md-auto">
                  <div className="text-end pe-3 border-end border-success border-opacity-25">
                    <p className="mb-0 small fw-bold">{userName}</p>
                    <span className="extra-small text-success">Sesion financiera activa</span>
                  </div>
                  <div
                    className="rounded-circle border border-success d-flex align-items-center justify-content-center bg-black"
                    style={{ width: '48px', height: '48px' }}
                  >
                    <i className="bi bi-person text-success"></i>
                  </div>
                </div>
              </div>
            </header>

            {(error || formError) && (
              <div className="alert alert-warning rounded-4 mb-4">
                {formError || error}
              </div>
            )}

            <div className="row g-3 g-md-4 mb-5">
              {[
                {
                  label: 'MOVIMIENTOS',
                  value: stats.total,
                  subtitle: 'Cantidad total de gastos registrados'
                },
                {
                  label: 'CATEGORIAS',
                  value: stats.species,
                  subtitle: 'Tipos de gasto que ya usaste este mes'
                },
                {
                  label: 'GASTOS ALTOS',
                  value: stats.alerts,
                  color: 'text-danger',
                  subtitle: 'Movimientos que superan el umbral de control'
                },
                {
                  label: 'PRESUPUESTO USADO',
                  value: stats.budgetUsed,
                  subtitle: 'Porcentaje consumido del presupuesto mensual'
                }
              ].map((item, i) => (
                <div className="col-6 col-xl-3" key={i}>
                  <div className="p-3 p-md-4 border border-success border-opacity-10 bg-black bg-opacity-40 rounded-4 shadow-sm h-100 metric-card">
                    <p className="extra-small text-success fw-bold opacity-50 mb-1">{item.label}</p>
                    <h2 className={`fw-bold mb-2 ${item.color || 'text-white'}`}>
                      {loading ? '...' : item.value}
                    </h2>
                    <p className="small text-light opacity-75 mb-0">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4 mb-4">
              <div className="col-lg-5">
                <div className="content-panel border border-success border-opacity-10 p-3 p-md-4 rounded-5 shadow-lg h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="fw-bold text-success mb-1">
                        <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                        {editingId ? 'Editar gasto' : 'Nuevo gasto'}
                      </h5>
                      <p className="small text-light opacity-75 mb-0">
                        {editingId
                          ? 'Modifica un movimiento existente y guarda los cambios.'
                          : 'Registra un movimiento para actualizar tu panel en tiempo real.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                      disabled={submitting}
                    >
                      Reiniciar demo
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="d-grid gap-3">
                    <div>
                      <label className="form-label text-light small fw-semibold mb-2">
                        Titulo del gasto
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control bg-dark text-white border-success border-opacity-25 rounded-4 py-3"
                        placeholder="Ej: Pago de arriendo"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label text-light small fw-semibold mb-2">
                        Categoria del gasto
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select bg-dark text-white border-success border-opacity-25 rounded-4 py-3"
                      >
                        {[
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
                        ].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label text-light small fw-semibold mb-2">
                        Monto del gasto
                      </label>
                      <input
                        name="amount"
                        type="number"
                        min="1000"
                        step="1000"
                        value={formData.amount}
                        onChange={handleChange}
                        className="form-control bg-dark text-white border-success border-opacity-25 rounded-4 py-3"
                        placeholder="Ej: 120000"
                        required
                      />
                    </div>

                    <button className="btn btn-success rounded-4 py-3 fw-bold" disabled={submitting}>
                      {submitting ? 'Guardando...' : editingId ? 'Actualizar gasto' : 'Guardar gasto'}
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

              <div className="col-lg-7">
                <div className="content-panel border border-success border-opacity-10 p-3 p-md-4 rounded-5 shadow-lg h-100">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                    <div>
                      <h5 className="fw-bold text-success mb-1">
                        <i className="bi bi-search me-2"></i> Historial de movimientos
                      </h5>
                      <p className="small text-light opacity-75 mb-0">
                        Revisa tus gastos guardados, edita valores o elimina registros que ya no necesites.
                      </p>
                      <p className="small text-light opacity-50 mt-1 mb-0">
                        Total registrado: {loading ? '...' : currency(stats.totalAmount)}
                      </p>
                    </div>
                    <input
                      type="text"
                      className="bg-transparent border border-success border-opacity-25 text-white small rounded-pill px-3 py-2 shadow-none tracker-search"
                      placeholder="Buscar gasto o categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div
                    className="row row-cols-1 row-cols-md-2 g-3 overflow-auto"
                    style={{ maxHeight: '420px' }}
                  >
                    {filteredCharacters.map((expense) => (
                      <div className="col" key={expense._id}>
                        <div className="card bg-black border border-success border-opacity-10 h-100 expense-card">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-start gap-3">
                              <div className="d-inline-flex align-items-center justify-content-center rounded-circle expense-icon-shell flex-shrink-0">
                                <i className={`bi ${expense.icon} text-success fs-4`}></i>
                              </div>

                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between gap-2 align-items-start">
                                  <div>
                                    <p className="fw-bold mb-1 text-white">{expense.name}</p>
                                    <p className="small text-info mb-1">{expense.category}</p>
                                    <p className="small text-light opacity-50 mb-1">
                                      Este registro representa un gasto almacenado en tu historial.
                                    </p>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEdit(expense)}
                                      className="btn btn-outline-info btn-sm rounded-pill"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(expense._id)}
                                      className="btn btn-outline-danger btn-sm rounded-pill"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>

                                <h6 className="text-white fw-bold mb-2">{currency(expense.amount)}</h6>
                                <span
                                  className={`extra-small ${
                                    expense.status === 'normal' ? 'text-success' : 'text-danger'
                                  }`}
                                >
                                  {expense.status === 'normal' ? 'Gasto controlado' : 'Exceso detectado'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!loading && filteredCharacters.length === 0 && (
                      <div className="col-12">
                        <div className="text-center border border-success border-opacity-10 rounded-4 p-4">
                          <i className="bi bi-search text-success fs-2 d-block mb-2"></i>
                          <p className="mb-1 text-white fw-semibold">Sin resultados para esta busqueda</p>
                          <p className="mb-0 text-light opacity-75">
                            Intenta con otro nombre o revisa si el gasto pertenece a otra categoria.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="content-panel border border-success border-opacity-10 p-3 p-md-4 rounded-5 shadow-lg">
                  <h6 className="text-success fw-bold mb-1">Distribucion de gastos</h6>
                  <p className="small text-light opacity-75 mb-4">
                    Este grafico te ayuda a entender en que categorias se concentra la mayor parte de tu dinero.
                  </p>
                  <DashboardStats characters={allExpenses} />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="content-panel warning-panel p-4 rounded-5 h-100">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="spinner-grow text-warning spinner-grow-sm"></div>
                    <h6 className="mb-0 fw-bold text-warning">Alerta de presupuesto</h6>
                  </div>
                  <p className="text-light opacity-75 mb-3">
                    Este bloque te resume rapidamente si tienes gastos altos que conviene revisar antes de cerrar el mes.
                  </p>
                  <div className="rounded-4 border border-warning border-opacity-25 p-3">
                    <span className="small text-warning fw-bold d-block mb-1">Estado actual</span>
                    <span className="text-white">
                      {stats.alerts > 0
                        ? `${stats.alerts} movimiento(s) requieren revision.`
                        : 'No hay gastos fuera del rango esperado.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dimensiones' && <DimensionesView expenses={allExpenses} />}
        {activeTab === 'protocolos' && <ProtocolosView expenses={allExpenses} stats={stats} />}
      </main>

      <style>{`
        .dashboard-sidebar {
          background:
            linear-gradient(180deg, rgba(4, 10, 7, 0.98) 0%, rgba(7, 18, 12, 0.96) 100%);
        }

        .dashboard-kicker {
          color: #7be0b3;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .dashboard-hero {
          background:
            radial-gradient(circle at top right, rgba(25, 135, 84, 0.18), transparent 35%),
            linear-gradient(135deg, rgba(8, 17, 12, 0.96) 0%, rgba(13, 30, 22, 0.92) 100%);
          border: 1px solid rgba(25, 135, 84, 0.14);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
        }

        .dashboard-user-card {
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(25, 135, 84, 0.12);
        }

        .active-neon {
          background: rgba(25, 135, 84, 0.14) !important;
          color: #b8ffd9 !important;
          border: 1px solid rgba(25, 135, 84, 0.28) !important;
          box-shadow: inset 0 0 0 1px rgba(25, 135, 84, 0.12);
        }

        .sidebar-link {
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .sidebar-link:hover {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.03) !important;
        }

        .glow-green-soft { text-shadow: 0 0 10px #198754; }
        .shadow-glow-green { box-shadow: 0 0 20px rgba(25, 135, 84, 0.1); }
        .extra-small { font-size: 0.65rem; letter-spacing: 1px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #198754; border-radius: 10px; }
        .dashboard-mobile-nav { background-color: rgba(2, 5, 2, 0.95); }
        .dashboard-title { font-size: clamp(2rem, 5vw, 3.7rem); }
        .hero-subcopy { max-width: 740px; }
        .tracker-search { width: 100%; max-width: 280px; }

        .content-panel {
          background:
            linear-gradient(180deg, rgba(6, 9, 8, 0.96) 0%, rgba(11, 16, 13, 0.92) 100%);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
        }

        .metric-card {
          background:
            linear-gradient(180deg, rgba(7, 12, 10, 0.96) 0%, rgba(10, 14, 12, 0.88) 100%) !important;
        }

        .expense-card {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .expense-card:hover {
          transform: translateY(-4px);
          border-color: rgba(25, 135, 84, 0.3) !important;
        }

        .expense-icon-shell {
          width: 64px;
          height: 64px;
          background: rgba(25, 135, 84, 0.12);
          border: 1px solid rgba(25, 135, 84, 0.2);
        }

        .warning-panel {
          background:
            linear-gradient(180deg, rgba(28, 22, 7, 0.96) 0%, rgba(23, 18, 5, 0.92) 100%);
          border: 1px solid rgba(255, 193, 7, 0.16);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
        }

        .sidebar-budget-card {
          background: rgba(25, 135, 84, 0.06);
        }

        @media (max-width: 767px) {
          .tracker-search { max-width: 100%; }
          .dashboard-code {
            display: inline-block;
            margin-top: 0.5rem;
            word-break: break-word;
          }
        }
      `}</style>
    </div>
  );
};
