import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import LocationCard from '../components/LocationCard';
import SearchBar from '../components/SearchBar';

const ResultSkeleton = () => <div className="result-skeleton" aria-hidden="true"><div /><span /><span /><small /></div>;

const LocationPage = () => {
  const { location } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const activeLocation = location && location !== 'Anywhere' ? location : '';
  const guestsParam = Number(searchParams.get('guests'));
  const minGuests = Number.isInteger(guestsParam) && guestsParam > 1 ? guestsParam : 0;

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

  const requestSeq = useRef(0);

  const fetchAccommodations = async () => {
    const seq = ++requestSeq.current;
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (activeLocation) params.set('location', activeLocation);
      if (minGuests > 0) params.set('guests', String(minGuests));
      const query = params.toString();
      const response = await api.get(`/accommodations${query ? `?${query}` : ''}`);
      if (seq !== requestSeq.current) return;
      setAccommodations(response.data.data || []);
    } catch (err) {
      if (seq !== requestSeq.current) return;
      setError(err.response?.data?.message || 'We could not load stays right now. Please try again.');
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when the route or criteria change
  }, [activeLocation, minGuests]);

  const headingPlace = activeLocation || 'Anywhere';
  const guestNote = minGuests > 1 ? ` · up to ${minGuests} guests` : '';

  return (
    <section className="location-page">
      <div className="location-header">
        <div>
          <p className="eyebrow">Places to stay</p>
          <h1>{loading ? 'Finding stays…' : `${accommodations.length} ${accommodations.length === 1 ? 'stay' : 'stays'} in ${headingPlace}`}</h1>
          <p>Explore a place that suits how you want to travel{guestNote}.</p>
        </div>
        <SearchBar />
      </div>
      {loading && <div className="locations-grid" role="status" aria-label="Loading stays">{Array.from({ length: 4 }, (_, index) => <ResultSkeleton key={index} />)}</div>}
      {!loading && error && <div className="error" role="alert"><div><strong>Something went wrong.</strong><p>{error}</p><button type="button" className="retry-button" onClick={fetchAccommodations}>Try again</button></div></div>}
      {!loading && !error && accommodations.length === 0 && <div className="empty-state"><div><h2>No stays match your search</h2><p>We could not find stays in {headingPlace}{guestNote}. Try another destination or clear your search.</p><button type="button" className="primary-button" onClick={() => navigate('/explore')}>Browse all stays</button></div></div>}
      {!loading && !error && accommodations.length > 0 && <div className="locations-grid">{accommodations.map((accommodation) => <LocationCard key={accommodation._id} accommodation={accommodation} to={`/listing/${accommodation._id}${detailQuery}`} />)}</div>}
    </section>
  );
};

export default LocationPage;