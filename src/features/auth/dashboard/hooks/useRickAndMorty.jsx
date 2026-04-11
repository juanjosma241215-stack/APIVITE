import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const MONTHLY_BUDGET = 1050000;

// Configuramos la URL base para que apunte a Render y no a Vercel
const API_URL = import.meta.env.VITE_API_URL || 'https://apivite.onrender.com';

export const useRickAndMorty = () => {
  const [expenses, setExpenses] = useState([]); // Siempre inicia como array vacío
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
      // Usamos la URL completa para evitar que busque en el dominio de Vercel
      const { data } = await axios.get(`${API_URL}/api/expenses`);
      
      // Validamos que la respuesta sea un array antes de guardarla
      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        console.error('La API no devolvió un array:', data);
        setExpenses([]);
      }
    } catch (err) {
      console.error('Error al cargar gastos:', err);
      setError(err.response?.data?.message || 'No fue posible cargar los gastos.');
      setExpenses([]); // Evita que el estado quede como undefined
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    // Si expenses no es un array, no ejecutamos los cálculos para evitar el error .filter/.reduce
    if (!Array.isArray(expenses)) return;

    const totalAmount = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
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
      const { data } = await axios.post(`${API_URL}/api/expenses`, {
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
      const { data } = await axios.put(`${API_URL}/api/expenses/${id}`, payload);
      setExpenses((current) => 
        Array.isArray(current) ? current.map((expense) => (expense._id === id ? data : expense)) : []
      );
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
      await axios.delete(`${API_URL}/api/expenses/${id}`);
      setExpenses((current) => 
        Array.isArray(current) ? current.filter((expense) => expense._id !== id) : []
      );
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible eliminar el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtro seguro: verifica que expenses sea array antes de filtrar
  const filteredCharacters = Array.isArray(expenses) 
    ? expenses.filter((expense) =>
        `${expense.name} ${expense.category}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
    refetchExpenses: fetchExpenses
  };
};