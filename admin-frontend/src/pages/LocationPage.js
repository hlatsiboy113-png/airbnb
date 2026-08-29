import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LocationCard from '../components/LocationCard';

const LocationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLocation, setFilterLocation] = useState(location || '');

  useEffect(() => {
    setFilterLocation(location || '');
    fetchAccommodations(location);
  }, [location]);

  const fetchAccommodations = async (loc) => {
    try {
      setLoading(true);
      setError('');
      const query = loc ? `?location=${encodeURIComponent(loc)}` : '';
      const res = await api.get(`/accommodations${query}`);
      setAccommodations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (filterLocation.trim()) {
      navigate(`/locations/${encodeURIComponent(filterLocation.trim())}`);
    }
  };

  return (
    <div className="location-page">
      <div className="location-header">
        <h1>{accommodations.length} stays in {location || 'all locations'}</h1>
        <form onSubmit={handleFilterSubmit} className="location-filter">
          <input
            type="text"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            placeholder="Filter by location..."
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading && <div className="loading">Loading accommodations...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && accommodations.length === 0 && (
        <div className="empty-state">
          <p>No accommodations found for "{location}".</p>
          <button onClick={() => navigate('/')}>Browse all locations</button>
        </div>
      )}

      {!loading && !error && accommodations.length > 0 && (
        <div className="locations-grid">
          {accommodations.map((acc) => (
            <LocationCard key={acc._id} accommodation={acc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPage;
