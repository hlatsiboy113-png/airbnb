import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ViewListings from './pages/ViewListings';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';

/**
 * Main App Component
 * Defines routing for the Admin Dashboard
 * Protected routes require authentication
 */
const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Routes */}
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

        {/* Redirect root to dashboard or login */}
        <Route path="/admin" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
