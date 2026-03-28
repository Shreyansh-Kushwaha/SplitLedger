import { useState, useEffect, useMemo } from 'react';
import { transactionAPI, userAPI } from '../services/api.js';
import { authService } from '../services/auth.js';

export const useTransactions = () => {
  const [transactionsData, setTransactionsData] = useState({ totalLent: 0, totalBorrowed: 0, transactions: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = authService.getToken();

  const fetchTransactions = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await transactionAPI.getAll(token);
      setTransactionsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    setError('');
    try {
      await transactionAPI.create(transactionData, token);
      await fetchTransactions(); // Refresh data
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const settleTransaction = async (id) => {
    setError('');
    try {
      await transactionAPI.settle(id, token);
      await fetchTransactions(); // Refresh data
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Calculate net effective amounts per person
  const netAmounts = useMemo(() => {
    const nets = {};
    transactionsData.transactions.forEach((tx) => {
      if (tx.status === 'settled') return; // Skip settled transactions

      const mine = tx.fromUser?.email === authService.getUser()?.email;
      const other = mine ? tx.toUser : tx.fromUser;
      const otherEmail = other?.email || 'unknown';

      if (!nets[otherEmail]) {
        nets[otherEmail] = { name: other?.name || 'Unknown', lent: 0, borrowed: 0, net: 0 };
      }

      if (mine) {
        nets[otherEmail].lent += tx.amount;
      } else {
        nets[otherEmail].borrowed += tx.amount;
      }

      nets[otherEmail].net = nets[otherEmail].lent - nets[otherEmail].borrowed;
    });

    return Object.values(nets).filter(person => person.net !== 0);
  }, [transactionsData.transactions]);

  // Load transactions on mount if authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchTransactions();
    }
  }, []);

  return {
    transactionsData,
    netAmounts,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    settleTransaction,
  };
};