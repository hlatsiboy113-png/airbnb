import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ViewListings from './pages/ViewListings';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import AllReservations from './pages/AllReservations';
import HostReservations from './pages/HostReservations';
import HostDashboard from './pages/HostDashboard';
import ManageUsers from './pages/ManageUsers';
import UserReservationsPage from './pages/UserReservationsPage';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LocationDetailsPage from './pages/LocationDetailsPage';

function NotFound() {
  return (
    <section className="admin-not-found">
      <p>404</p>
      <h1>Page not found</h1>
      <p>The place you are looking for has moved, or it is no longer available.</p>
      <a href="/">Return home</a>
    </section>
  );
}

function AdminFrame() {
  const { pathname } = useLocation();
  const showHeader = !['/admin/login', '/login', '/register'].includes(pathname);

  return (
    <div className="admin-app">
      {showHeader && <Header />}
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<LocationPage />} />
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/listing/:id" element={<LocationDetailsPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><ViewListings /></ProtectedRoute>} />
          <Route path="/admin/listings" element={<ProtectedRoute requireAdmin><ViewListings /></ProtectedRoute>} />
          <Route path="/admin/create" element={<ProtectedRoute requireHost><CreateListing /></ProtectedRoute>} />
          <Route path="/admin/update/:id" element={<ProtectedRoute requireHost><UpdateListing /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/reservations" element={<ProtectedRoute requireAdmin><AllReservations /></ProtectedRoute>} />
          <Route path="/host/dashboard" element={<ProtectedRoute requireHost><HostDashboard /></ProtectedRoute>} />
          <Route path="/host/listings" element={<ProtectedRoute requireHost><ViewListings /></ProtectedRoute>} />
          <Route path="/host/create" element={<ProtectedRoute requireHost><CreateListing /></ProtectedRoute>} />
          <Route path="/host/reservations" element={<ProtectedRoute requireHost><HostReservations /></ProtectedRoute>} />
          <Route path="/reservations" element={<ProtectedRoute><UserReservationsPage /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<Navigate to="/reservations" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return <AdminFrame />;
}

export default App;
