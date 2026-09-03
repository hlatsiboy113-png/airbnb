import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../services/api';

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      // Fetch all accommodations then aggregate reservations, or use a dedicated endpoint
      // Since there's no dedicated /all endpoint, we'll fetch host reservations for all hosts
      // For now, this is a placeholder that shows a message. In a real app, add GET /api/reservations (admin)
      setReservations([]);
    } catch (err) {
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>All Reservations</h1>
      <div className="alert alert-info">
        Admin reservation overview. To fully implement, add a <code>GET /api/reservations</code> endpoint (admin-only) to the backend.
      </div>
    </div>
  );
};

export default AllReservations;
