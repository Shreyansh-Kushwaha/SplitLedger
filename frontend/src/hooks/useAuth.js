import { useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';
import { authService } from '../services/auth.js';

export const useAuth = () => {
  const [token, setToken] = useState(authService.getToken());
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.login(credentials);
      authService.setToken(data.token);
      authService.setUser(data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.register(userData);
      authService.setToken(data.token);
      authService.setUser(data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clear();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => authService.isAuthenticated();

  return {
    token,
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };
};