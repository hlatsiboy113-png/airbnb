import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        const response = await api.get('/users/me');
        if (localStorage.getItem('token') !== token) return;
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      } catch (err) {
        if (err.response?.status === 401 && localStorage.getItem('token') === token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common.Authorization;
          setUser(null);
        }
        // Network errors or server downtime keep the cached session intact.
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const persistSession = ({ token, user: account }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(account));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(account);
    return account;
  };

  const login = async (email, password, role) => {
    const response = await api.post('/users/login', { email, password, role });
    return persistSession(response.data);
  };

  const register = async (username, email, password, role = 'user') => {
    const response = await api.post('/users/register', { username, email, password, role });
    return persistSession(response.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const isHost = user?.role === 'host' || isAdmin;
  const isGuest = isAuthenticated && !isHost;

  return <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, isHost, isAdmin, isGuest }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
