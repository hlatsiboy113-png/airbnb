import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reservations/user');
      setReservations(res.data.data);
    } catch (err) {
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px' }}>Loading reservations...</div>;
  if (error) return <div className="container" style={{ padding: '40px' }}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>My Reservations</h1>
      <p style={{ color: '#717171', marginBottom: '24px' }}>Guest · {user?.username}</p>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>You have no reservations yet.</p>
        </div>
      ) : (
        <div className="reservations-grid">
          {reservations.map((r) => (
            <div key={r._id} className="reservation-card">
              <img
                src={r.accommodation?.images?.[0] ? `${BACKEND_URL}/uploads/${r.accommodation.images[0]}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={r.accommodation?.title}
                className="reservation-img"
              />
              <div className="reservation-info">
                <h3>{r.accommodation?.title}</h3>
                <p>{r.accommodation?.location}</p>
                <p>Check-in: {new Date(r.checkIn).toLocaleDateString()}</p>
                <p>Check-out: {new Date(r.checkOut).toLocaleDateString()}</p>
                <p>Guests: {r.guests}</p>
                <p className="reservation-cost">Total: ${r.totalCost?.toFixed(2)}</p>
                <button className="btn btn-secondary" onClick={() => handleCancel(r._id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;