import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserReservationsPage = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/reservations/user');
      setReservations(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not load your reservations right now. Please try again.');
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
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not cancel this reservation. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <section className="reservations-page">
      <h1>Your reservations</h1>

      {!loading && error && reservations.length === 0 ? (
        <div className="error" role="alert">
          <div>
            <strong>Something went wrong.</strong>
            <p>{error}</p>
            <button type="button" className="retry-button" onClick={fetchReservations}>Try again</button>
          </div>
        </div>
      ) : (
        <>
          {error && <div className="error-banner" role="alert">{error}</div>}

          {loading && (
            <div className="loading" role="status" aria-label="Loading reservations">Loading your reservations...</div>
          )}

          {!loading && reservations.length === 0 && (
            <div className="empty-state">
              <div>
                <h2>No reservations yet</h2>
                <p>Find a place you love and your upcoming stays will appear here.</p>
                <button type="button" className="primary-button" onClick={() => navigate('/explore')}>Browse stays</button>
              </div>
            </div>
          )}

          {!loading && reservations.length > 0 && (
            <div className="reservations-list">
              {reservations.map((reservation) => (
                <article key={reservation._id} className="reservation-card">
                  <div className="reservation-content">
                    <h2>{reservation.accommodation?.title || 'Accommodation'}</h2>
                    <p>{reservation.accommodation?.location || 'Stay details'}</p>
                    <p>{new Date(reservation.checkIn).toLocaleDateString()} – {new Date(reservation.checkOut).toLocaleDateString()}</p>
                    <p>{reservation.guests} guest{reservation.guests === 1 ? '' : 's'} · R{reservation.totalCost}</p>
                  </div>
                  <button type="button" className="cancel-btn" disabled={cancelling === reservation._id} onClick={() => cancelReservation(reservation._id)}>
                    {cancelling === reservation._id ? 'Cancelling...' : 'Cancel reservation'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default UserReservationsPage;