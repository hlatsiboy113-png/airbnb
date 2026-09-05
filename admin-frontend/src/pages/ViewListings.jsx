import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getImageUrl } from '../services/api';

const ViewListings = () => {
  const { user, isAdmin } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();
  const workspaceBase = isAdmin ? '/admin' : '/host';

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/accommodations');
      setListings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const visibleListings = useMemo(() => {
    const scoped = isAdmin ? listings : listings.filter((listing) => (listing.host?._id || listing.host)?.toString() === user?._id?.toString());
    const q = filterText.trim().toLowerCase();
    if (!q) return scoped;
    return scoped.filter((listing) => (
      String(listing.title || '').toLowerCase().includes(q) ||
      String(listing.location || '').toLowerCase().includes(q)
    ));
  }, [isAdmin, listings, user?._id, filterText]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This action cannot be undone.')) return;
    try {
      setDeleteLoading(id);
      await api.delete(`/accommodations/${id}`);
      setListings((current) => current.filter((listing) => listing._id !== id));
      setNotice('Listing removed.');
    } catch (err) {
      setError(err.response?.data?.message || 'The listing could not be removed.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <section className="workspace-shell"><div className="workspace-skeleton" role="status">Loading listings…</div></section>;

  return (
    <section className="workspace-shell">
      <div className="workspace-heading">
        <div><p className="workspace-eyebrow">{isAdmin ? 'Platform inventory' : 'Your portfolio'}</p><h1>{isAdmin ? 'All listings' : 'Your listings'}</h1></div>
        <button className="btn btn-primary" type="button" onClick={() => navigate(`${workspaceBase}/create`)}>Create listing</button>
      </div>
      <div className="workspace-search-row" role="search">
        <input
          className="list-filter-input"
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search by title or location"
          aria-label={`Search ${isAdmin ? 'all' : 'your'} listings`}
        />
        {listings.length > 0 && !loading && <span className="list-filter-count">{visibleListings.length} of {listings.length} shown</span>}
      </div>
      {error && <div className="alert alert-error" role="alert">{error}<button type="button" onClick={fetchListings}>Try again</button></div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {listings.length > 0 && visibleListings.length === 0 ? (
        <div className="workspace-empty"><h2>No matches</h2><p>No listings match “{filterText}”. Try a different title or location.</p><button className="btn btn-primary" type="button" onClick={() => setFilterText('')}>Clear filter</button></div>
      ) : visibleListings.length === 0 ? (
        <div className="workspace-empty"><h2>No listings yet</h2><p>Create your first listing to begin hosting.</p><button className="btn btn-primary" type="button" onClick={() => navigate(`${workspaceBase}/create`)}>Create listing</button></div>
      ) : (
        <div className="listing-table-wrap">
          <table className="listing-table">
            <thead><tr><th>Listing</th><th>Location</th><th>Nightly price</th><th>Type</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{visibleListings.map((listing) => <tr key={listing._id}>
              <td data-label="Listing"><div className="listing-identity">{listing.images?.[0] ? <img src={getImageUrl(listing.images[0])} alt="" /> : <div className="listing-thumbnail-placeholder" aria-hidden="true" />}<strong>{listing.title}</strong></div></td>
              <td data-label="Location">{listing.location}</td>
              <td data-label="Nightly price">R{listing.price}</td>
              <td data-label="Type">{listing.type || 'Entire place'}</td>
              <td data-label="Actions"><div className="table-actions"><button className="btn btn-secondary" type="button" onClick={() => navigate(`${workspaceBase}/update/${listing._id}`)}>Edit</button><button className="btn btn-danger" type="button" disabled={deleteLoading === listing._id} onClick={() => handleDelete(listing._id)}>{deleteLoading === listing._id ? 'Deleting…' : 'Delete'}</button></div></td>
            </tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ViewListings;
