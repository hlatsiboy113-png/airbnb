import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

/**
 * View Listings Page
 * Displays all accommodations in a responsive table/grid
 * Provides update and delete actions
 */
const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  /**
   * Fetch all accommodations from API
   */
  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/accommodations');
      setListings(response.data.data);
    } catch (err) {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  /**
   * Delete a listing by ID
   * @param {string} id - Accommodation ID
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    setDeleteLoading(id);
    try {
      await api.delete(`/accommodations/${id}`);
      // Remove from local state for immediate UI update
      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeleteLoading(null);
    }
  };

  /**
   * Navigate to update page
   */
  const handleUpdate = (id) => {
    navigate(`/admin/update/${id}`);
  };

  if (loading) {
    return (
      <div style={containerStyle} className="container">
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle} className="container">
        <div className="alert alert-error">{error}</div>
        <button onClick={fetchListings} className="btn btn-secondary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="container">
      <div style={headerRowStyle}>
        <h1 style={pageTitleStyle}>Your Listings</h1>
        <button
          onClick={() => navigate('/admin/create')}
          className="btn btn-primary"
        >
          + Create New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>No listings yet. Create your first listing to get started.</p>
          <button
            onClick={() => navigate('/admin/create')}
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            Create Listing
          </button>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadRowStyle}>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Price/Night</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id} style={trStyle}>
                  <td style={tdStyle}>
                    {listing.images?.[0] ? (
                      <img src={getImageUrl(listing.images[0])} alt={listing.title} style={thumbnailStyle} />
                    ) : (
                      <div style={thumbnailStyle}>No Image</div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={titleCellStyle}>{listing.title}</div>
                  </td>
                  <td style={tdStyle}>{listing.location}</td>
                  <td style={tdStyle}>${listing.price}</td>
                  <td style={tdStyle}>{listing.type}</td>
                  <td style={tdStyle}>
                    <div style={actionsStyle}>
                      <button
                        onClick={() => handleUpdate(listing._id)}
                        className="btn btn-secondary"
                        style={actionBtnStyle}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="btn btn-danger"
                        style={actionBtnStyle}
                        disabled={deleteLoading === listing._id}
                      >
                        {deleteLoading === listing._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  padding: '40px 24px',
};

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
};

const pageTitleStyle = {
  fontSize: '28px',
  fontWeight: 700,
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '80px 24px',
  background: 'white',
  borderRadius: '12px',
  color: '#717171',
};

const tableContainerStyle = {
  background: 'white',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
};

const theadRowStyle = {
  background: '#f7f7f7',
  borderBottom: '2px solid #ebebeb',
};

const thStyle = {
  padding: '16px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#717171',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const trStyle = {
  borderBottom: '1px solid #ebebeb',
  transition: 'background 0.2s',
};

const tdStyle = {
  padding: '16px',
  verticalAlign: 'middle',
};

const thumbnailStyle = {
  width: '80px',
  height: '60px',
  objectFit: 'cover',
  borderRadius: '8px',
};

const titleCellStyle = {
  fontWeight: 600,
  color: '#222',
};

const actionsStyle = {
  display: 'flex',
  gap: '8px',
};

const actionBtnStyle = {
  padding: '8px 16px',
  fontSize: '13px',
};

export default ViewListings;
