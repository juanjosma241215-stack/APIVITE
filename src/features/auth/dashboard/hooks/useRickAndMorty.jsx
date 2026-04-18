import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { updateAuthSession } from '../../../../shared/auth/session';

const DEFAULT_BUDGET = 1200000;
const API_URL = import.meta.env.VITE_API_URL || '';

const buildUrl = (path) => `${API_URL}${path}`;

export const useRickAndMorty = (userId) => {
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState({
    monthlyBudget: DEFAULT_BUDGET,
    budgetAlertThreshold: 100
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [expensesResponse, profileResponse] = await Promise.all([
        axios.get(buildUrl('/api/expenses'), {
          params: { userId }
        }),
        axios.get(buildUrl(`/api/auth/profile/${userId}`))
      ]);

      const nextExpenses = Array.isArray(expensesResponse.data) ? expensesResponse.data : [];
      const nextUser = profileResponse.data?.user || {};

      setExpenses(nextExpenses);
      setProfile({
        monthlyBudget: Number(nextUser.monthlyBudget || DEFAULT_BUDGET),
        budgetAlertThreshold: Number(nextUser.budgetAlertThreshold || 100)
      });
      updateAuthSession(nextUser);
    } catch (err) {
      setExpenses([]);
      setError(err.response?.data?.message || 'No fue posible cargar tu informacion financiera.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const normalizedExpenses = useMemo(
    () =>
      expenses.map((expense) => ({
        ...expense,
        amount: Number(expense.amount || 0)
      })),
    [expenses]
  );

  const stats = useMemo(() => {
    const totalAmount = normalizedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryCount = new Set(normalizedExpenses.map((expense) => expense.category)).size;
    const highExpenses = normalizedExpenses.filter((expense) => expense.status === 'high').length;
    const averageAmount = normalizedExpenses.length ? totalAmount / normalizedExpenses.length : 0;
    const budgetLimit = Number(profile.monthlyBudget || DEFAULT_BUDGET);
    const budgetPercentage = budgetLimit > 0 ? Math.round((totalAmount / budgetLimit) * 100) : 0;

    return {
      total: normalizedExpenses.length,
      species: categoryCount,
      alerts: highExpenses,
      budgetUsed: `${budgetPercentage}%`,
      totalAmount,
      averageAmount
    };
  }, [normalizedExpenses, profile.monthlyBudget]);

  const budgetStatus = useMemo(() => {
    const limit = Number(profile.monthlyBudget || DEFAULT_BUDGET);
    const threshold = Number(profile.budgetAlertThreshold || 100);
    const used = stats.totalAmount;
    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    const remaining = Math.max(limit - used, 0);

    return {
      limit,
      threshold,
      used,
      remaining,
      percentage,
      isOverBudget: used > limit,
      thresholdReached: percentage >= threshold
    };
  }, [profile, stats.totalAmount]);

  const addExpense = async ({ name, category, amount }) => {
    try {
      setSubmitting(true);
      setError('');
      const { data } = await axios.post(buildUrl('/api/expenses'), {
        userId,
        name,
        category,
        amount
      });
      setExpenses((current) => [data, ...current]);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible registrar el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateExpense = async (id, payload) => {
    try {
      setSubmitting(true);
      setError('');
      const { data } = await axios.put(buildUrl(`/api/expenses/${id}`), {
        ...payload,
        userId
      });
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
      await axios.delete(buildUrl(`/api/expenses/${id}`), {
        params: { userId }
      });
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
      await axios.post(buildUrl('/api/expenses/reset'), { userId });
      setExpenses([]);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible limpiar el historial.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateBudgetSettings = async ({ monthlyBudget, budgetAlertThreshold }) => {
    try {
      setSubmitting(true);
      setError('');
      const { data } = await axios.put(buildUrl('/api/auth/budget'), {
        userId,
        monthlyBudget,
        budgetAlertThreshold
      });
      const nextUser = data.user;
      setProfile({
        monthlyBudget: Number(nextUser.monthlyBudget || DEFAULT_BUDGET),
        budgetAlertThreshold: Number(nextUser.budgetAlertThreshold || 100)
      });
      updateAuthSession(nextUser);
      return nextUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'No fue posible actualizar el presupuesto.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCharacters = normalizedExpenses.filter((expense) =>
    `${expense.name} ${expense.category}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    filteredCharacters,
    allExpenses: normalizedExpenses,
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
    updateBudgetSettings,
    refetchExpenses: fetchDashboardData
  };
};
