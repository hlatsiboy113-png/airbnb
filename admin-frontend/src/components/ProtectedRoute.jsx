import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireHost = false, requireAdmin = false }) => {
  const { loading, isAuthenticated, isHost, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <div className="route-loading" role="status">Loading your workspace…</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (requireAdmin && !isAdmin) return <Navigate to={isHost ? '/host/dashboard' : '/admin/login'} replace />;
  if (requireHost && !isHost) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;
