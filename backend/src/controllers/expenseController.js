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

const normalizeExpense = ({ name, category, amount, userId }) => {
  const parsedAmount = Number(amount);

  return {
    name: name?.trim(),
    category: category?.trim(),
    amount: parsedAmount,
    status: parsedAmount >= 90000 ? 'high' : 'normal',
    icon: categoryIcons[category] || 'bi-wallet2',
    user: userId // Vinculamos el gasto al ID del usuario
  };
};

// 1. Obtener gastos SOLO del usuario logueado
export const getExpenses = async (req, res) => {
  try {
    const { userId } = req.query; // Lo recibiremos desde el frontend
    if (!userId) return res.status(400).json({ message: 'Usuario no identificado' });

    const expenses = await Expense.find({ user: userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener gastos' });
  }
};

// 2. Crear gasto vinculado al usuario
export const createExpense = async (req, res) => {
  try {
    const { name, category, amount, userId } = req.body;

    if (!name?.trim() || !category?.trim() || !amount || !userId) {
      return res.status(400).json({ message: 'Datos incompletos o usuario no identificado' });
    }

    const expense = await Expense.create(normalizeExpense({ name, category, amount, userId }));
    return res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el gasto' });
  }
};

// 3. Actualizar gasto (verificando propiedad)
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, amount, userId } = req.body;

    const expense = await Expense.findOne({ _id: id, user: userId });

    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado o no autorizado' });
    }

    const normalized = normalizeExpense({ name, category, amount, userId });
    Object.assign(expense, normalized);

    await expense.save();
    return res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar' });
  }
};

// 4. Eliminar gasto (verificando propiedad)
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const expense = await Expense.findOneAndDelete({ _id: id, user: userId });

    if (!expense) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }

    return res.json({ message: 'Gasto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
};

// 5. Resetear gastos (Solo para ese usuario)
export const resetExpenses = async (req, res) => {
  try {
    const { userId } = req.body;
    await Expense.deleteMany({ user: userId });
    return res.json({ message: 'Tus gastos han sido limpiados' });
  } catch (error) {
    res.status(500).json({ message: 'Error al resetear' });
  }
};