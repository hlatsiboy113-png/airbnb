import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute wrapper - redirects to login if not authenticated
 * Optionally checks for host/admin role
 */
const ProtectedRoute = ({ children, requireHost = false }) => {
  const { isAuthenticated, isHost, loading } = useAuth();

  if (loading) {
    return <div className="loading" role="status" aria-label="Checking your session">Checking your session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireHost && !isHost) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
