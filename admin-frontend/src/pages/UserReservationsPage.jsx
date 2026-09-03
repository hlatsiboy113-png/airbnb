import React, { useEffect, useState } from 'react';
import api from '../services/api';

const UserReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservations/user');
      setReservations(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const cancelReservation = async (id) => {
    setCancelling(id);
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((current) => current.filter((reservation) => reservation._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div className="container" style={containerStyle}>Loading reservations...</div>;
  if (error && reservations.length === 0) return <div className="container" style={containerStyle}><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container" style={containerStyle}>
      <h1>Your Reservations</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {reservations.length === 0 ? <p>No reservations yet.</p> : (
        <div style={listStyle}>
          {reservations.map((reservation) => (
            <article key={reservation._id} className="card" style={cardStyle}>
              <div>
                <h2>{reservation.accommodation?.title || 'Accommodation'}</h2>
                <p>{reservation.accommodation?.location || ''}</p>
                <p>{new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}</p>
                <p>{reservation.guests} guest{reservation.guests === 1 ? '' : 's'} · R{reservation.totalCost}</p>
              </div>
              <button type="button" className="btn btn-danger" disabled={cancelling === reservation._id} onClick={() => cancelReservation(reservation._id)}>
                {cancelling === reservation._id ? 'Cancelling...' : 'Cancel reservation'}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle = { padding: '40px 24px' };
const listStyle = { display: 'grid', gap: '16px', marginTop: '24px' };
const cardStyle = { padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' };

export default UserReservationsPage;
