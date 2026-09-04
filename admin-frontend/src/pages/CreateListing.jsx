import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ListingForm from '../components/ListingForm';

/**
 * Create Listing Page
 * Wraps the reusable ListingForm with create-specific logic
 */
const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  /**
   * Submit new listing to API
   * @param {FormData} formData - FormData with images and fields
   */
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/accommodations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Listing created successfully!');
      const workspaceBase = user?.role === 'admin' ? '/admin' : '/host';
      setTimeout(() => navigate(`${workspaceBase}/dashboard`), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create listing';
      const errors = err.response?.data?.errors;
      setError(errors ? errors.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle} className="container">
      <h1 style={pageTitleStyle}>Create New Listing</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div style={cardStyle} className="card">
        <ListingForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '40px 24px',
};

const pageTitleStyle = {
  fontSize: '28px',
  fontWeight: 700,
  marginBottom: '24px',
};

const cardStyle = {
  padding: '32px',
};

export default CreateListing;
