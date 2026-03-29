import { useState, useEffect } from 'react';
import { settlementRequestAPI } from '../services/api.js';
import { authService } from '../services/auth.js';

export const useSettlementRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = authService.getToken();

  const fetchRequests = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await settlementRequestAPI.getAll(token);
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData) => {
    setError('');
    try {
      await settlementRequestAPI.create(requestData, token);
      await fetchRequests(); // Refresh data
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const confirmRequest = async (id) => {
    setError('');
    try {
      await settlementRequestAPI.confirm(id, token);
      await fetchRequests(); // Refresh data
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const rejectRequest = async (id) => {
    setError('');
    try {
      await settlementRequestAPI.reject(id, token);
      await fetchRequests(); // Refresh data
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Load requests on mount if authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchRequests();
    }
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    confirmRequest,
    rejectRequest,
  };
};