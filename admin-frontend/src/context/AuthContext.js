import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) { api.defaults.headers.common['Authorization'] = `Bearer ${token}`; fetchUser(); }
    else setLoading(false);
  }, []);
  const fetchUser = async () => {
    try { const res = await api.get('/users/me'); setUser(res.data.data); }
    catch { logout(); } finally { setLoading(false); }
  };
  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user); return user;
  };
  const logout = () => { localStorage.removeItem('token'); delete api.defaults.headers.common['Authorization']; setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
