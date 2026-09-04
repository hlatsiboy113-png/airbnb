import { useEffect, useState } from 'react';
import api from '../services/api';

const money = (value) => `R${Number(value || 0).toLocaleString('en-ZA')}`;

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/reservations');
      setReservations(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return <section className="workspace-shell"><div className="workspace-skeleton" role="status">Loading reservations…</div></section>;

  return (
    <section className="workspace-shell">
      <div className="workspace-heading"><div><p className="workspace-eyebrow">Marketplace activity</p><h1>All reservations</h1><p className="workspace-subtitle">A complete, read-only view of current and past stays.</p></div></div>
      {error && <div className="alert alert-error" role="alert">{error}<button type="button" onClick={fetchAll}>Try again</button></div>}
      {reservations.length === 0 ? <div className="workspace-empty"><h2>No reservations yet</h2><p>Reservations will appear here as guests begin booking stays.</p></div> : <div className="listing-table-wrap"><table className="listing-table"><thead><tr><th>Guest</th><th>Stay</th><th>Host</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead><tbody>{reservations.map((reservation) => <tr key={reservation._id}><td data-label="Guest"><strong>{reservation.user?.username || 'Guest'}</strong><br /><small>{reservation.user?.email}</small></td><td data-label="Stay">{reservation.accommodation?.title || 'Accommodation'}<br /><small>{reservation.accommodation?.location}</small></td><td data-label="Host">{reservation.host?.username || 'Host'}</td><td data-label="Dates">{new Date(reservation.checkIn).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} – {new Date(reservation.checkOut).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</td><td data-label="Total">{money(reservation.totalCost)}</td><td data-label="Status"><span className={`status-badge status-${reservation.status}`}>{reservation.status}</span></td></tr>)}</tbody></table></div>}
    </section>
  );
};

export default AllReservations;
