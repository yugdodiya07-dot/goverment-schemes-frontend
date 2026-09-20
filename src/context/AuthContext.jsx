import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('govsmart_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const storedToken = localStorage.getItem('govsmart_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      if (data && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('govsmart_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Session verify failed:', error?.response?.data?.message || error.message);
      localStorage.removeItem('govsmart_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('govsmart_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(data.message || 'Login successful!');
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('govsmart_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Registration successful! Welcome to GovSmart India.');
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Registration failed. Please check your inputs.';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('govsmart_token');
    setToken(null);
    setUser(null);
    toast.info('You have logged out of GovSmart India.');
  };

  const updateUserData = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserData,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
