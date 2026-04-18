import React, { useState, useEffect } from 'react';
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

// --- CONFIGURACIÓN DE PRESUPUESTO ---
const BUDGET_LIMIT = 1000000; // Define aquí tu límite mensual (ej: 1 millón)

export const AdminDashboard = () => {
  const session = getAuthSession();
  const userId = session?.id; // ID real del usuario logueado
  const userName = session?.name || 'Usuario';

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
  } = useRickAndMorty(userId); // Pasamos el userId al hook

  const [activeTab, setActiveTab] = useState('monitor');
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  const currency = (value) => `$${(value || 0).toLocaleString('es-CO')}`;

  // Cálculo de alerta de presupuesto
  const isOverBudget = stats.totalAmount > BUDGET_LIMIT;
  const budgetPercentage = Math.min((stats.totalAmount / BUDGET_LIMIT) * 100, 100).toFixed(1);

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
        await updateExpense(editingId, { ...formData, userId });
      } else {
        await addExpense({ ...formData, userId });
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
    if (window.confirm('¿Eliminar este gasto?')) {
      try {
        await deleteExpense(id, userId);
      } catch (err) {
        setFormError(err.message);
      }
    }
  };

  const handleReset = async () => {
    if (window.confirm('Esto borrará todos tus gastos. ¿Continuar?')) {
      try {
        await resetExpenses(userId);
        setEditingId(null);
        setFormData(initialFormState);
      } catch (err) {
        setFormError(err.message);
      }
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
            Visualiza tu dinero, registra movimientos y toma decisiones con claridad.
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

        <div className={`p-3 rounded-4 border border-opacity-20 sidebar-budget-card ${isOverBudget ? 'border-danger shadow-glow-red' : 'border-success shadow-glow-green'}`}>
          <i className={`bi bi-wallet2 ${isOverBudget ? 'text-danger' : 'text-success'}`}></i>
          <p className={`extra-small mt-2 mb-1 fw-bold ${isOverBudget ? 'text-danger' : 'text-success'}`}>
            {isOverBudget ? 'PRESUPUESTO EXCEDIDO' : 'PRESUPUESTO VIGILADO'}
          </p>
          <div className="progress bg-dark mb-2" style={{ height: '6px' }}>
            <div 
              className={`progress-bar ${isOverBudget ? 'bg-danger' : 'bg-success'}`} 
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>
          <p className="small text-light opacity-75 mb-0">
            {budgetPercentage}% del límite mensual utilizado.
          </p>
        </div>
      </aside>

      <main className="flex-grow-1 p-3 p-md-4 p-xl-5 overflow-auto custom-scrollbar">
        {/* Mobile Nav */}
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
                    Bienvenido, <strong>{userName}</strong>. Aquí tienes el control de tus finanzas personales sincronizado en tiempo real.
                  </p>
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
                { label: 'MOVIMIENTOS', value: stats.total, subtitle: 'Cantidad de registros' },
                { label: 'TOTAL GASTADO', value: currency(stats.totalAmount), color: isOverBudget ? 'text-danger' : 'text-success', subtitle: 'Suma total del mes' },
                { label: 'GASTOS ALTOS', value: stats.alerts, color: 'text-warning', subtitle: 'Gastos mayores a $90.000' },
                { label: 'PROMEDIO', value: currency(stats.totalAmount / (stats.total || 1)), subtitle: 'Gasto medio por registro' }
              ].map((item, i) => (
                <div className="col-6 col-xl-3" key={i}>
                  <div className="p-3 p-md-4 border border-success border-opacity-10 bg-black bg-opacity-40 rounded-4 shadow-sm h-100 metric-card">
                    <p className="extra-small text-success fw-bold opacity-50 mb-1">{item.label}</p>
                    <h2 className={`fw-bold mb-2 ${item.color || 'text-white'}`} style={{ fontSize: '1.4rem' }}>
                      {loading ? '...' : item.value}
                    </h2>
                    <p className="small text-light opacity-75 mb-0">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4 mb-4">
              {/* FORMULARIO */}
              <div className="col-lg-5">
                <div className="content-panel border border-success border-opacity-10 p-3 p-md-4 rounded-5 shadow-lg h-100">
                  <h5 className="fw-bold text-success mb-4">
                    <i className={`bi ${editingId ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                    {editingId ? 'Editar gasto' : 'Nuevo gasto'}
                  </h5>

                  <form onSubmit={handleSubmit} className="d-grid gap-3">
                    <div>
                      <label className="form-label text-light small fw-semibold">Nombre</label>
                      <input name="name" type="text" value={formData.name} onChange={handleChange} className="form-control bg-dark text-white border-success border-opacity-25 rounded-4 py-3" required />
                    </div>
                    <div>
                      <label className="form-label text-light small fw-semibold">Categoría</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="form-select bg-dark text-white border-success border-opacity-25 rounded-4 py-3">
                        {['Alimentacion', 'Transporte', 'Entretenimiento', 'Salidas', 'Servicios', 'Compras', 'Salud', 'Hogar', 'Educacion', 'Ahorro'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label text-light small fw-semibold">Monto ($)</label>
                      <input name="amount" type="number" value={formData.amount} onChange={handleChange} className="form-control bg-dark text-white border-success border-opacity-25 rounded-4 py-3" required />
                    </div>
                    <button className="btn btn-success rounded-4 py-3 fw-bold mt-2" disabled={submitting}>
                      {submitting ? 'Procesando...' : editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
                    </button>
                    {editingId && <button type="button" onClick={handleCancelEdit} className="btn btn-outline-light rounded-4 py-3">Cancelar</button>}
                  </form>
                </div>
              </div>

              {/* LISTADO */}
              <div className="col-lg-7">
                <div className="content-panel border border-success border-opacity-10 p-3 p-md-4 rounded-5 shadow-lg h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-success mb-0">Historial</h5>
                    <input type="text" className="bg-transparent border border-success border-opacity-25 text-white small rounded-pill px-3 py-2 tracker-search" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>

                  <div className="row row-cols-1 row-cols-md-2 g-3 overflow-auto" style={{ maxHeight: '420px' }}>
                    {filteredCharacters.map((expense) => (
                      <div className="col" key={expense._id}>
                        <div className="card bg-black border border-success border-opacity-10 expense-card">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="expense-icon-shell rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                                <i className={`bi ${expense.icon} text-success fs-4`}></i>
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <div className="d-flex justify-content-between">
                                  <p className="fw-bold mb-0 text-truncate">{expense.name}</p>
                                  <div className="d-flex gap-1">
                                    <button onClick={() => handleEdit(expense)} className="btn btn-link text-info p-0 px-1"><i className="bi bi-pencil"></i></button>
                                    <button onClick={() => handleDelete(expense._id)} className="btn btn-link text-danger p-0 px-1"><i className="bi bi-trash"></i></button>
                                  </div>
                                </div>
                                <h6 className="text-white mb-0">{currency(expense.amount)}</h6>
                                <span className={`extra-small ${expense.status === 'normal' ? 'text-success' : 'text-danger'}`}>
                                  {expense.status === 'normal' ? 'Normal' : 'Alto'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ALERTAS Y GRÁFICOS */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="content-panel border border-success border-opacity-10 p-4 rounded-5">
                  <h6 className="text-success fw-bold mb-3">Distribución por Categorías</h6>
                  <DashboardStats characters={allExpenses} />
                </div>
              </div>

              <div className="col-lg-4">
                <div className={`content-panel p-4 rounded-5 h-100 ${isOverBudget ? 'bg-danger-subtle border-danger' : 'warning-panel'}`}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className={`spinner-grow spinner-grow-sm ${isOverBudget ? 'text-danger' : 'text-warning'}`}></div>
                    <h6 className={`mb-0 fw-bold ${isOverBudget ? 'text-danger' : 'text-warning'}`}>Estado del Presupuesto</h6>
                  </div>
                  <div className={`rounded-4 border p-3 ${isOverBudget ? 'border-danger bg-black' : 'border-warning border-opacity-25'}`}>
                    <p className="mb-2">
                      {isOverBudget 
                        ? '🚨 ¡ATENCIÓN! Has superado tu límite mensual.' 
                        : '✅ Vas por buen camino con tu presupuesto.'}
                    </p>
                    <div className="small opacity-75">
                      Límite: {currency(BUDGET_LIMIT)} <br />
                      Consumido: {currency(stats.totalAmount)}
                    </div>
                  </div>
                  <button onClick={handleReset} className="btn btn-outline-secondary btn-sm w-100 mt-4 rounded-pill">Limpiar historial</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dimensiones' && <DimensionesView expenses={allExpenses} />}
        {activeTab === 'protocolos' && <ProtocolosView expenses={allExpenses} stats={stats} />}
      </main>

      {/* ESTILOS ADICIONALES */}
      <style>{`
        .shadow-glow-red { box-shadow: 0 0 20px rgba(220, 53, 69, 0.15); }
        .bg-danger-subtle { background: linear-gradient(180deg, rgba(40, 0, 0, 0.9) 0%, rgba(20, 0, 0, 0.9) 100%) !important; }
        /* ... el resto de tus estilos se mantienen ... */
      `}</style>
    </div>
  );
};