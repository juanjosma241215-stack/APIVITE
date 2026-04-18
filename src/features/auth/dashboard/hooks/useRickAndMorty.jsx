import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const MONTHLY_BUDGET = 1050000;
const API_URL = 'https://apivite.onrender.com';

export const useRickAndMorty = (userId) => {
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

  // 1. OBTENER GASTOS FILTRADOS POR USUARIO
  const fetchExpenses = useCallback(async () => {
    if (!userId) return; // Si no hay usuario, no pedimos nada
    try {
      setLoading(true);
      setError('');
      
      // Enviamos el userId como query parameter
      const response = await axios.get(`${API_URL}/api/expenses`, {
        params: { userId }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setExpenses(response.data);
      } else {
        setExpenses([]); 
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error al cargar tus datos financieros.');
      setExpenses([]); 
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // 2. CÁLCULO DE ESTADÍSTICAS EN TIEMPO REAL
  useEffect(() => {
    if (!Array.isArray(expenses)) return;

    const totalAmount = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const categoryCount = new Set(expenses.map((expense) => expense.category || 'Sin categoría')).size;
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

  // 3. AGREGAR GASTO (Ahora incluye el userId)
  const addExpense = async (payload) => {
    try {
      setSubmitting(true);
      // El payload ya trae { name, category, amount, userId } desde AdminDashboard
      const { data } = await axios.post(`${API_URL}/api/expenses`, payload);
      setExpenses((current) => [data, ...current]);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al crear el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. ACTUALIZAR GASTO
  const updateExpense = async (id, payload) => {
    try {
      setSubmitting(true);
      const { data } = await axios.put(`${API_URL}/api/expenses/${id}`, payload);
      setExpenses((current) => 
        current.map((e) => (e._id === id ? data : e))
      );
    } catch (err) {
      throw new Error('Error al actualizar el registro.');
    } finally {
      setSubmitting(false);
    }
  };

  // 5. ELIMINAR GASTO (Ahora incluye validación por userId)
  const deleteExpense = async (id, uId) => {
    try {
      setSubmitting(true);
      await axios.delete(`${API_URL}/api/expenses/${id}`, {
        params: { userId: uId }
      });
      setExpenses((current) => current.filter((e) => e._id !== id));
    } catch (err) {
      throw new Error('Error al eliminar el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  // 6. RESETEAR GASTOS DEL USUARIO
  const resetExpenses = async (uId) => {
    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/api/expenses/reset`, { userId: uId });
      setExpenses([]); // Limpiamos la vista
    } catch (err) {
      throw new Error('Error al limpiar el historial.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCharacters = Array.isArray(expenses) 
    ? expenses.filter((expense) => {
        const name = expense?.name || '';
        const category = expense?.category || '';
        return `${name} ${category}`.toLowerCase().includes(searchTerm.toLowerCase());
      })
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
    resetExpenses,
    refetchExpenses: fetchExpenses
  };
};