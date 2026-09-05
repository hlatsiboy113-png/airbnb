import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import LocationCard from '../components/LocationCard';

const LocationPage = () => {
  const { location } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLocation, setFilterLocation] = useState(location || '');
  const minGuests = Number(searchParams.get('guests')) > 1 ? Number(searchParams.get('guests')) : 0;

  const detailQuery = useMemo(() => {
    const params = new URLSearchParams();
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (minGuests > 0) params.set('guests', String(minGuests));
    const query = params.toString();
    return query ? `?${query}` : '';
  }, [searchParams, minGuests]);

  useEffect(() => {
    setFilterLocation(location || '');
    fetchAccommodations();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when the route or criteria change
  }, [location, minGuests]);

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (location && location !== 'Anywhere') params.set('location', location);
      if (minGuests > 0) params.set('guests', String(minGuests));
      const query = params.toString();
      const res = await api.get(`/accommodations${query ? `?${query}` : ''}`);
      setAccommodations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (filterLocation.trim()) navigate(`/locations/${encodeURIComponent(filterLocation.trim())}`);
  };

  return (
    <div className="location-page">
      <div className="location-header">
        <h1>{accommodations.length} stays in {location || 'all locations'}</h1>
        <form onSubmit={handleFilterSubmit} className="location-filter"><input type="text" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} placeholder="Filter by location..." /><button type="submit">Search</button></form>
      </div>
      {loading && <div className="loading">Loading accommodations...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && accommodations.length === 0 && <div className="empty-state"><p>No accommodations found for "{location}".</p><button onClick={() => navigate('/')}>Browse all locations</button></div>}
      {!loading && !error && accommodations.length > 0 && <div className="locations-grid">{accommodations.map((acc) => <LocationCard key={acc._id} accommodation={acc} to={`/listing/${acc._id}${detailQuery}`} />)}</div>}
    </div>
  );
};

export default LocationPage;