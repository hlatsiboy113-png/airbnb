import React, { useState } from 'react';
import api, { BACKEND_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const currency = (value) => `R${Number(value || 0).toLocaleString('en-ZA')}`;

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg>
);

const HostReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchReservations = async (query) => {
    try {
      setLoading(true);
      setError('');
      const q = typeof query === 'string' ? query.trim() : '';
      const res = await api.get(`/reservations/host${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setReservations(res.data.data);
    } catch (err) {
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    setActiveQuery(q);
    setSearching(true);
    fetchReservations(q).finally(() => setSearching(false));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveQuery('');
    setSearching(true);
    fetchReservations('').finally(() => setSearching(false));
  };

  const noSearchResults = !loading && !error && activeQuery && reservations.length === 0;
  const noReservations = !loading && !error && !activeQuery && reservations.length === 0;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Host Reservations</h1>
      <p style={{ color: '#717171', marginBottom: '24px' }}>Host · {user?.username}</p>

      <form className="workspace-search-row" onSubmit={handleSearch} role="search">
        <div className="workspace-search-form">
          <input
            className="list-filter-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by guest, title or location"
            aria-label="Search host reservations"
          />
          <button className="btn btn-primary" type="submit" aria-label="Search reservations">
            <SearchIcon />
          </button>
        </div>
        {activeQuery && (
          <span className="list-filter-count">
            {searching ? 'Searching…' : `${reservations.length} result${reservations.length === 1 ? '' : 's'} for “${activeQuery}”`}
          </span>
        )}
        {activeQuery && (
          <button type="button" className="link-button" onClick={clearSearch}>Clear</button>
        )}
      </form>

      {error && <div className="alert alert-error" role="alert">{error}<button type="button" onClick={() => fetchReservations(activeQuery)}>Try again</button></div>}
      {loading && <div className="workspace-skeleton" role="status" style={{ minHeight: '220px' }}>Loading reservations…</div>}
      {noSearchResults && (
        <div className="workspace-empty"><h2>No matches</h2><p>No reservations match “{activeQuery}”. Try a different guest, title, or location.</p><button className="btn btn-primary" type="button" onClick={clearSearch}>Clear search</button></div>
      )}
      {noReservations && (
        <div className="workspace-empty"><p>No reservations for your properties yet.</p></div>
      )}
      {!loading && !error && reservations.length > 0 && (
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
                <p>Check-in: {new Date(r.checkIn).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</p>
                <p>Check-out: {new Date(r.checkOut).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</p>
                <p>Guests: {r.guests}</p>
                <p className="reservation-cost">Total: {currency(r.totalCost)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostReservations;