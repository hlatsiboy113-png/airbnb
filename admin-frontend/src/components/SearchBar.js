import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Airbnb-style search bar with Where / When / Who sections.
 * Fully functional: destination navigates to the matching location page,
 * with check-in/check-out dates and guest count passed through as query
 * params that LocationPage reads and applies.
 */
const SearchBar = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [openSection, setOpenSection] = useState(null); // 'where' | 'when' | 'who' | null
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSection = (section) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const dest = destination.trim();
    if (!dest) {
      setOpenSection('where');
      return;
    }
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', String(guests));
    const query = params.toString();
    navigate(`/locations/${encodeURIComponent(dest)}${query ? `?${query}` : ''}`);
    setOpenSection(null);
  };

  const adjustGuests = (delta) => {
    setGuests((current) => Math.max(1, Math.min(16, current + delta)));
  };

  const whenLabel = checkIn || checkOut
    ? `${checkIn || 'Any'} \u2192 ${checkOut || 'Any'}`
    : 'Add dates';
  const whoLabel = guests > 1 ? `${guests} guests` : 'Add guests';

  return (
    <form className="airbnb-search-bar" onSubmit={handleSearch} ref={containerRef}>
      <div
        className={`search-section search-where ${openSection === 'where' ? 'active' : ''}`}
        onClick={() => setOpenSection('where')}
      >
        <label>Where</label>
        <input
          type="text"
          placeholder="Search destinations"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onFocus={() => setOpenSection('where')}
        />
      </div>

      <div className="search-divider" />

      <div
        className={`search-section search-when ${openSection === 'when' ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); toggleSection('when'); }}
      >
        <label>When</label>
        <span className="search-value">{whenLabel}</span>
        {openSection === 'when' && (
          <div className="search-popover" onClick={(e) => e.stopPropagation()}>
            <div className="date-field">
              <label htmlFor="search-checkin">Check-in</label>
              <input
                id="search-checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="date-field">
              <label htmlFor="search-checkout">Check-out</label>
              <input
                id="search-checkout"
                type="date"
                value={checkOut}
                min={checkIn || undefined}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="search-divider" />

      <div
        className={`search-section search-who ${openSection === 'who' ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); toggleSection('who'); }}
      >
        <label>Who</label>
        <span className="search-value">{whoLabel}</span>
        {openSection === 'who' && (
          <div className="search-popover search-popover-who" onClick={(e) => e.stopPropagation()}>
            <span>Guests</span>
            <div className="guest-stepper">
              <button type="button" onClick={() => adjustGuests(-1)} disabled={guests <= 1} aria-label="Decrease guests">-</button>
              <span>{guests}</span>
              <button type="button" onClick={() => adjustGuests(1)} disabled={guests >= 16} aria-label="Increase guests">+</button>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="search-btn" aria-label="Search">🔍</button>
    </form>
  );
};

export default SearchBar;
