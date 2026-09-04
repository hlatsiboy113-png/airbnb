import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const currency = (value) => `R${Number(value || 0).toLocaleString('en-ZA')}`;

const HostDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsResponse, reservationsResponse, listingsResponse] = await Promise.all([
          api.get('/reservations/host/stats'),
          api.get('/reservations/host'),
          api.get('/accommodations'),
        ]);
        setStats(statsResponse.data.data);
        setReservations(reservationsResponse.data.data || []);
        setListings((listingsResponse.data.data || []).filter((listing) => (listing.host?._id || listing.host)?.toString() === user?._id?.toString()));
      } catch (err) {
        setError(err.response?.data?.message || 'We could not load the host dashboard.');
      }
    };
    loadDashboard();
  }, [user?._id]);

  const recentReservations = useMemo(() => reservations.slice(0, 5), [reservations]);

  if (!stats && !error) return <section className="workspace-shell"><div className="workspace-skeleton" role="status">Preparing your hosting overview…</div></section>;

  return (
    <section className="workspace-shell host-dashboard">
      <div className="workspace-heading"><div><p className="workspace-eyebrow">Host workspace</p><h1>Good to see you, {user?.username?.split(' ')[0] || 'host'}.</h1><p className="workspace-subtitle">A focused view of your places and upcoming guests.</p></div><button type="button" className="btn btn-primary" onClick={() => navigate('/host/create')}>Create listing</button></div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <div className="stats-grid">
        <article className="stat-card"><span className="stat-label">Active listings</span><strong>{listings.length}</strong><small>Places ready to welcome guests</small></article>
        <article className="stat-card"><span className="stat-label">Reservations</span><strong>{stats?.totalReservations || 0}</strong><small>{stats?.upcomingReservations || 0} upcoming</small></article>
        <article className="stat-card"><span className="stat-label">Earnings</span><strong>{currency(stats?.totalEarnings)}</strong><small>Excluding cancelled trips</small></article>
      </div>
      <div className="dashboard-grid">
        <section className="dashboard-panel"><div className="panel-heading"><div><h2>Recent reservations</h2><p>Latest activity across your listings.</p></div><button type="button" className="link-button" onClick={() => navigate('/host/reservations')}>View all</button></div>
          {recentReservations.length ? <div className="reservation-list">{recentReservations.map((reservation) => <article key={reservation._id} className="reservation-row"><div><strong>{reservation.user?.username || 'Guest'}</strong><span>{reservation.accommodation?.title || 'Accommodation'}</span></div><div><strong>{currency(reservation.totalCost)}</strong><span>{new Date(reservation.checkIn).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })} – {new Date(reservation.checkOut).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span></div><span className={`status-badge status-${reservation.status}`}>{reservation.status}</span></article>)}</div> : <div className="panel-empty">No reservations yet. Share your listing to start welcoming guests.</div>}
        </section>
        <aside className="dashboard-panel quick-actions"><div className="panel-heading"><div><h2>Quick actions</h2><p>Keep your hosting business moving.</p></div></div><button type="button" onClick={() => navigate('/host/create')}>Add a new place <span>→</span></button><button type="button" onClick={() => navigate('/host/listings')}>Manage listings <span>→</span></button><button type="button" onClick={() => navigate('/host/reservations')}>Review reservations <span>→</span></button></aside>
      </div>
    </section>
  );
};

export default HostDashboard;
