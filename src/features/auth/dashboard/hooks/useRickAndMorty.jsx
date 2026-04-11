import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const MONTHLY_BUDGET = 1050000;

// URL absoluta para asegurar que la petición salga de Vercel hacia Render
const API_URL = 'https://apivite.onrender.com';

export const useRickAndMorty = () => {
  // Aseguramos que el estado inicial sea SIEMPRE un array vacío
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
      
      // Petición directa al backend en Render
      const response = await axios.get(`${API_URL}/api/expenses`);
      
      // Validamos rigurosamente que la respuesta sea un Array
      if (response.data && Array.isArray(response.data)) {
        setExpenses(response.data);
      } else {
        console.error('La API no devolvió un array:', response.data);
        setExpenses([]); 
      }
    } catch (err) {
      console.error('Error de conexión con Render:', err);
      setError('Error al cargar datos del servidor. Verifica la conexión.');
      setExpenses([]); // Evitamos que el error ponga la pantalla negra
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    // Si expenses no es un array (seguridad extra), cancelamos los cálculos
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

  const addExpense = async ({ name, category, amount }) => {
    try {
      setSubmitting(true);
      const { data } = await axios.post(`${API_URL}/api/expenses`, { name, category, amount });
      setExpenses((current) => Array.isArray(current) ? [data, ...current] : [data]);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error al crear el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateExpense = async (id, payload) => {
    try {
      setSubmitting(true);
      const { data } = await axios.put(`${API_URL}/api/expenses/${id}`, payload);
      setExpenses((current) => 
        Array.isArray(current) ? current.map((e) => (e._id === id ? data : e)) : []
      );
    } catch (err) {
      throw new Error('Error al actualizar.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      setSubmitting(true);
      await axios.delete(`${API_URL}/api/expenses/${id}`);
      setExpenses((current) => 
        Array.isArray(current) ? current.filter((e) => e._id !== id) : []
      );
    } catch (err) {
      throw new Error('Error al eliminar.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtro con validación de existencia de propiedades para evitar errores de undefined
  const filteredCharacters = Array.isArray(expenses) 
    ? expenses.filter((expense) => {
        const name = expense?.name || '';
        const category = expense?.category || '';
        return `${name} ${category}`.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  return {
    filteredCharacters,
    allExpenses: Array.isArray(expenses) ? expenses : [],
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