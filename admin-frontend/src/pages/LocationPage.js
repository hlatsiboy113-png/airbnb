import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import LocationCard from '../components/LocationCard';

const EMPTY_FILTERS = { minPrice: '', maxPrice: '', type: '', minRating: '', amenities: '' };

const LocationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterLocation, setFilterLocation] = useState(location || '');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';

  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (location) params.location = location;
      if (guests) params.guests = guests;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.type) params.type = filters.type;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.amenities) params.amenities = filters.amenities;

      const res = await api.get('/accommodations', { params });
      setAccommodations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  }, [location, guests, filters]);

  useEffect(() => {
    setFilterLocation(location || '');
  }, [location]);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (filterLocation.trim()) navigate(`/locations/${encodeURIComponent(filterLocation.trim())}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => setFilters(EMPTY_FILTERS);

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const dateSummary = checkIn || checkOut ? `${checkIn || 'Any'} \u2192 ${checkOut || 'Any'}` : null;

  return (
    <div className="location-page">
      <div className="location-header">
        <div>
          <h1>{accommodations.length} stays in {location || 'all locations'}</h1>
          {(dateSummary || guests) && (
            <p className="location-search-summary">
              {dateSummary && <span>{dateSummary}</span>}
              {guests && <span>{guests} guests</span>}
            </p>
          )}
        </div>
        <form onSubmit={handleFilterSubmit} className="location-filter">
          <input type="text" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} placeholder="Filter by location..." />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="filters-bar">
        <div className="filter-field">
          <label htmlFor="minPrice">Min price</label>
          <input id="minPrice" type="number" min="0" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} placeholder="R0" />
        </div>
        <div className="filter-field">
          <label htmlFor="maxPrice">Max price</label>
          <input id="maxPrice" type="number" min="0" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} placeholder="Any" />
        </div>
        <div className="filter-field">
          <label htmlFor="type">Property type</label>
          <select id="type" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
            <option value="">Any type</option>
            <option value="Entire place">Entire place</option>
            <option value="Private room">Private room</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="minRating">Min rating</label>
          <select id="minRating" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)}>
            <option value="">Any rating</option>
            <option value="4.5">4.5+</option>
            <option value="4.7">4.7+</option>
            <option value="4.9">4.9+</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="amenities">Amenities</label>
          <select id="amenities" value={filters.amenities} onChange={(e) => handleFilterChange('amenities', e.target.value)}>
            <option value="">Any amenities</option>
            <option value="wifi">Wifi</option>
            <option value="pool">Pool</option>
            <option value="free parking">Free parking</option>
            <option value="kitchen">Kitchen</option>
          </select>
        </div>
        {hasActiveFilters && (
          <button type="button" className="clear-filters-btn" onClick={handleClearFilters}>Clear Filters</button>
        )}
      </div>

      {loading && <div className="loading">Loading accommodations...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && accommodations.length === 0 && (
        <div className="empty-state">
          <p>No accommodations found{location ? ` for "${location}"` : ''}{hasActiveFilters ? ' matching your filters' : ''}.</p>
          {hasActiveFilters && <button onClick={handleClearFilters}>Clear filters</button>}
          <button onClick={() => navigate('/')}>Browse all locations</button>
        </div>
      )}
      {!loading && !error && accommodations.length > 0 && (
        <div className="locations-grid">
          {accommodations.map((acc) => <LocationCard key={acc._id} accommodation={acc} />)}
        </div>
      )}
    </div>
  );
};

export default LocationPage;
