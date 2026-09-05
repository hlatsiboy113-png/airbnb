import axios from 'axios';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('REACT_APP_API_URL is required when building for production. Configure it in the deployment environment.');
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');
export const getImageUrl = (image) => (
  image?.startsWith('http') ? image : `${BACKEND_URL}/uploads/${image}`
);

/**
 * Axios instance with base URL and auth interceptor
 * Automatically attaches JWT token to all requests
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isSessionProbe = (error.config?.url || '').includes('/users/me');
      if (currentPath !== '/login' && currentPath !== '/register' && !isSessionProbe) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
