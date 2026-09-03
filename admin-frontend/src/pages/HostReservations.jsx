import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HostReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reservations/host');
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

  if (loading) return <div className="container" style={{ padding: '40px' }}>Loading reservations...</div>;
  if (error) return <div className="container" style={{ padding: '40px' }}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Host Reservations</h1>
      <p style={{ color: '#717171', marginBottom: '24px' }}>Host · {user?.username}</p>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations for your properties yet.</p>
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
                <p>Guest: {r.user?.username} ({r.user?.email})</p>
                <p>Check-in: {new Date(r.checkIn).toLocaleDateString()}</p>
                <p>Check-out: {new Date(r.checkOut).toLocaleDateString()}</p>
                <p>Guests: {r.guests}</p>
                <p className="reservation-cost">Total: ${r.totalCost?.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostReservations;