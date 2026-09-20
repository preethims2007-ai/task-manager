import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('taskflow_token');
      const savedUser = localStorage.getItem('taskflow_user');

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('taskflow_token', res.data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    localStorage.setItem('taskflow_token', res.data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
