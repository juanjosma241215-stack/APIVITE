import Expense from '../models/Expense.js';

const categoryIcons = {
  Alimentacion: 'bi-basket2-fill',
  Transporte: 'bi-bus-front-fill',
  Entretenimiento: 'bi-play-btn-fill',
  Salidas: 'bi-cup-hot-fill',
  Servicios: 'bi-router-fill',
  Compras: 'bi-bag-fill',
  Salud: 'bi-heart-pulse-fill',
  Hogar: 'bi-house-door-fill',
  Educacion: 'bi-book-fill',
  Ahorro: 'bi-piggy-bank-fill'
};

const defaultExpenses = [
  { name: 'Mercado semanal', category: 'Alimentacion', amount: 185000 },
  { name: 'Transporte diario', category: 'Transporte', amount: 42000 },
  { name: 'Suscripcion streaming', category: 'Entretenimiento', amount: 32000 },
  { name: 'Cena de fin de semana', category: 'Salidas', amount: 96000 },
  { name: 'Pago de internet', category: 'Servicios', amount: 89000 },
  { name: 'Compra impulsiva', category: 'Compras', amount: 210000 },
  { name: 'Farmacia', category: 'Salud', amount: 38000 },
  { name: 'Cafe y snacks', category: 'Alimentacion', amount: 27000 }
];

const normalizeExpense = ({ name, category, amount }) => {
  const parsedAmount = Number(amount);

  return {
    name: name?.trim(),
    category: category?.trim(),
    amount: parsedAmount,
    status: parsedAmount >= 90000 ? 'high' : 'normal',
    icon: categoryIcons[category] || 'bi-wallet2'
  };
};

export const getExpenses = async (_req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
};

export const createExpense = async (req, res) => {
  const { name, category, amount } = req.body;

  if (!name?.trim() || !category?.trim() || !amount) {
    return res.status(400).json({ message: 'Nombre, categoria y monto son obligatorios' });
  }

  const expense = await Expense.create(normalizeExpense({ name, category, amount }));
  return res.status(201).json(expense);
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { name, category, amount } = req.body;
  const expense = await Expense.findById(id);

  if (!expense) {
    return res.status(404).json({ message: 'Gasto no encontrado' });
  }

  if (!name?.trim() || !category?.trim() || !amount) {
    return res.status(400).json({ message: 'Nombre, categoria y monto son obligatorios' });
  }

  const normalized = normalizeExpense({ name, category, amount });
  expense.name = normalized.name;
  expense.category = normalized.category;
  expense.amount = normalized.amount;
  expense.status = normalized.status;
  expense.icon = normalized.icon;

  await expense.save();
  return res.json(expense);
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);

  if (!expense) {
    return res.status(404).json({ message: 'Gasto no encontrado' });
  }

  await expense.deleteOne();
  return res.json({ message: 'Gasto eliminado' });
};

export const resetExpenses = async (_req, res) => {
  await Expense.deleteMany({});
  const seeded = await Expense.insertMany(defaultExpenses.map(normalizeExpense));
  return res.json(seeded);
};
