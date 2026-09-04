import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import LocationCard from '../components/LocationCard';

const ResultSkeleton = () => <div className="result-skeleton" aria-hidden="true"><div /><span /><span /><small /></div>;

const LocationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLocation, setFilterLocation] = useState(location || '');
  const activeLocation = location && location !== 'Anywhere' ? location : '';

  const fetchAccommodations = async (requestedLocation) => {
    try {
      setLoading(true);
      setError('');
      const query = requestedLocation ? `?location=${encodeURIComponent(requestedLocation)}` : '';
      const response = await api.get(`/accommodations${query}`);
      setAccommodations(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not load stays right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilterLocation(activeLocation);
    fetchAccommodations(activeLocation);
  }, [activeLocation]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    const value = filterLocation.trim();
    navigate(value ? `/locations/${encodeURIComponent(value)}` : '/explore');
  };

  return (
    <section className="location-page">
      <div className="location-header">
        <div><p className="eyebrow">Places to stay</p><h1>{loading ? 'Finding stays…' : `${accommodations.length} stays in ${activeLocation || 'Anywhere'}`}</h1><p>Explore a place that suits how you want to travel.</p></div>
        <form onSubmit={handleFilterSubmit} className="location-filter"><input aria-label="Filter by location" type="text" value={filterLocation} onChange={(event) => setFilterLocation(event.target.value)} placeholder="Where are you going?" /><button type="submit" aria-label="Search location">Search</button></form>
      </div>
      {loading && <div className="locations-grid" role="status" aria-label="Loading stays">{Array.from({ length: 4 }, (_, index) => <ResultSkeleton key={index} />)}</div>}
      {!loading && error && <div className="error" role="alert"><div><strong>Something went wrong.</strong><p>{error}</p><button type="button" className="retry-button" onClick={() => fetchAccommodations(activeLocation)}>Try again</button></div></div>}
      {!loading && !error && accommodations.length === 0 && <div className="empty-state"><div><h2>No stays found in {activeLocation || 'this area'}</h2><p>Try another destination, or browse all available stays.</p><button type="button" className="primary-button" onClick={() => navigate('/explore')}>Browse all stays</button></div></div>}
      {!loading && !error && accommodations.length > 0 && <div className="locations-grid">{accommodations.map((accommodation) => <LocationCard key={accommodation._id} accommodation={accommodation} />)}</div>}
    </section>
  );
};

export default LocationPage;
