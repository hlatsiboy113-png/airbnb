import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ListingForm from '../components/ListingForm';
import { useAuth } from '../context/AuthContext';

/**
 * Update Listing Page
 * Fetches existing data, pre-fills form, and submits updates
 */
const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const workspaceBase = user?.role === 'admin' ? '/admin' : '/host';
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  /**
   * Fetch existing listing data on mount
   */
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/accommodations/${id}`);
        setListing(response.data.data);
      } catch (err) {
        setError('Failed to load listing data');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  /**
   * Submit updated listing to API
   * @param {FormData} formData - FormData with updated fields and images
   */
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/accommodations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Listing updated successfully!');
      setTimeout(() => navigate(`${workspaceBase}/dashboard`), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update listing';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={containerStyle} className="container">
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading listing data...</div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div style={containerStyle} className="container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate(`${workspaceBase}/dashboard`)} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="container">
      <h1 style={pageTitleStyle}>Update Listing</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div style={cardStyle} className="card">
        <ListingForm
          initialData={listing}
          onSubmit={handleSubmit}
          isUpdate={true}
          loading={loading}
        />
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

export default UpdateListing;
