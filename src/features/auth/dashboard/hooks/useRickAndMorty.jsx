import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const MONTHLY_BUDGET = 1050000;

// Hook conectado al backend real para el CRUD de gastos.
export const useRickAndMorty = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    species: 0,
    alerts: 0,
    budgetUsed: '0%',
    totalAmount: 0
  });

const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // CAMBIO AQUÍ: Asegúrate de usar tu clienteAxios configurado o poner la URL completa
      const { data } = await axios.get('/api/expenses'); 
      
      // SEGURIDAD: Solo guarda si la data es un Array
      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        setExpenses([]); // Si no es array, deja la lista vacía para que no explote
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible cargar los gastos.');
      setExpenses([]); // Limpia el estado en caso de error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // SEGURIDAD: No ejecutes cálculos si expenses no es una lista
    if (!Array.isArray(expenses)) return;

    const totalAmount = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const categoryCount = new Set(expenses.map((expense) => expense.category)).size;
    const highExpenses = expenses.filter((expense) => expense.status === 'high').length;
    const budgetUsed = `${Math.round((totalAmount / MONTHLY_BUDGET) * 100)}%`;

    setStats({
      total: expenses.length,
      species: categoryCount,
      alerts: highExpenses,
      budgetUsed,
      totalAmount
    });
  }, [expenses]);
  
  useEffect(() => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryCount = new Set(expenses.map((expense) => expense.category)).size;
    const highExpenses = expenses.filter((expense) => expense.status === 'high').length;
    const budgetUsed = `${Math.round((totalAmount / MONTHLY_BUDGET) * 100)}%`;

    setStats({
      total: expenses.length,
      species: categoryCount,
      alerts: highExpenses,
      budgetUsed,
      totalAmount
    });
  }, [expenses]);

  const addExpense = async ({ name, category, amount }) => {
    try {
      setSubmitting(true);
      setError('');
      const { data } = await axios.post('/api/expenses', {
        name,
        category,
        amount
      });
      setExpenses((current) => [data, ...current]);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible crear el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateExpense = async (id, payload) => {
    try {
      setSubmitting(true);
      setError('');
      const { data } = await axios.put(`/api/expenses/${id}`, payload);
      setExpenses((current) => current.map((expense) => (expense._id === id ? data : expense)));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible actualizar el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      setSubmitting(true);
      setError('');
      await axios.delete(`/api/expenses/${id}`);
      setExpenses((current) => current.filter((expense) => expense._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible eliminar el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetExpenses = async () => {
    try {
      setSubmitting(true);
      setError('');
      const { data } = await axios.post('/api/expenses/reset');
      setExpenses(data);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible reiniciar la demo.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCharacters = expenses.filter((expense) =>
    `${expense.name} ${expense.category}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    filteredCharacters,
    allExpenses: expenses,
    stats,
    loading,
    submitting,
    error,
    searchTerm,
    setSearchTerm,
    addExpense,
    updateExpense,
    deleteExpense,
    resetExpenses,
    refetchExpenses: fetchExpenses
  };
};
