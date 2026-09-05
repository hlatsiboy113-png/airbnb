import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserReservationsPage from './pages/UserReservationsPage';

function NotFound() {
  return (
    <section className="not-found page-shell">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The place you are looking for has moved, or it is no longer available.</p>
      <Link to="/" className="primary-button">Return home</Link>
    </section>
  );
}

function App() {
  return (
    <div className="public-app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/explore" element={<LocationPage />} />
          <Route path="/listing/:id" element={<LocationDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reservations" element={<ProtectedRoute><UserReservationsPage /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<Navigate to="/reservations" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
