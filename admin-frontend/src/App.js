import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import LoginPage from './pages/LoginPage';
import ViewListings from './pages/ViewListings';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import ReservationsPage from './pages/ReservationsPage';
import RegisterPage from './pages/RegisterPage';
import UserReservationsPage from './pages/UserReservationsPage';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/explore" element={<LocationPage />} />
          <Route path="/listing/:id" element={<LocationDetailsPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <UserReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireHost>
                <ViewListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create"
            element={
              <ProtectedRoute requireHost>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/update/:id"
            element={
              <ProtectedRoute requireHost>
                <UpdateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute requireHost>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div style={{ padding: '80px 24px', textAlign: 'center' }}><h1>404</h1><p>Page not found.</p></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
