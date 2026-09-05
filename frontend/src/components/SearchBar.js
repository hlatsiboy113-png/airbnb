import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg>
);

const readGuests = (searchParams) => {
  const raw = Number(searchParams.get('guests'));
  return Number.isInteger(raw) && raw >= 1 ? Math.min(raw, 16) : 1;
};

const SearchBar = () => {
  const { location: routeLocation } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [openSection, setOpenSection] = useState(null);
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(() => readGuests(searchParams));

  const resetFromUrl = () => {
    setDestination(routeLocation && routeLocation !== 'Anywhere' ? routeLocation : '');
    setCheckIn(searchParams.get('checkIn') || '');
    setCheckOut(searchParams.get('checkOut') || '');
    setGuests(readGuests(searchParams));
  };

  useEffect(() => {
    resetFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberate sync of a controlled form with the URL
  }, [routeLocation, searchParams]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpenSection(null);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpenSection(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleSection = (section) => setOpenSection((current) => (current === section ? null : section));

  const handleSubmit = (event) => {
    event.preventDefault();
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

  const clearSearch = () => {
    setDestination('');
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    setOpenSection(null);
    navigate('/explore');
  };

  const adjustGuests = (delta) => setGuests((current) => Math.max(1, Math.min(16, current + delta)));

  const hasCriteria = Boolean(destination.trim()) || Boolean(checkIn) || Boolean(checkOut) || guests > 1;
  const whenLabel = checkIn || checkOut ? `${checkIn || 'Any'} → ${checkOut || 'Any'}` : 'Add dates';
  const whoLabel = guests > 1 ? `${guests} guests` : 'Add guests';

  return (
    <form className="guest-search-bar" onSubmit={handleSubmit} ref={containerRef}>
      <label className={`guest-search-field guest-search-where ${openSection === 'where' ? 'active' : ''}`}>
        <span>Where</span>
        <input
          type="text"
          placeholder="Search destinations"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          onFocus={() => setOpenSection('where')}
        />
      </label>

      <span className="guest-search-sep" aria-hidden="true" />

      <div
        className={`guest-search-field guest-search-when ${openSection === 'when' ? 'active' : ''}`}
        onClick={(event) => {
          event.stopPropagation();
          toggleSection('when');
        }}
      >
        <span>When</span>
        <span className="guest-search-value">{whenLabel}</span>
        {openSection === 'when' && (
          <div className="guest-search-popover" onClick={(event) => event.stopPropagation()}>
            <div className="guest-date-field">
              <label htmlFor="guest-search-checkin">Check-in</label>
              <input id="guest-search-checkin" type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />
            </div>
            <div className="guest-date-field">
              <label htmlFor="guest-search-checkout">Check-out</label>
              <input id="guest-search-checkout" type="date" value={checkOut} min={checkIn || undefined} onChange={(event) => setCheckOut(event.target.value)} />
            </div>
          </div>
        )}
      </div>

      <span className="guest-search-sep" aria-hidden="true" />

      <div
        className={`guest-search-field guest-search-who ${openSection === 'who' ? 'active' : ''}`}
        onClick={(event) => {
          event.stopPropagation();
          toggleSection('who');
        }}
      >
        <span>Who</span>
        <span className="guest-search-value">{whoLabel}</span>
        {openSection === 'who' && (
          <div className="guest-search-popover guest-search-popover-who" onClick={(event) => event.stopPropagation()}>
            <span className="guest-search-popover-title">Guests</span>
            <div className="guest-stepper">
              <button type="button" onClick={() => adjustGuests(-1)} disabled={guests <= 1} aria-label="Decrease guests">−</button>
              <span className="guest-count">{guests}</span>
              <button type="button" onClick={() => adjustGuests(1)} disabled={guests >= 16} aria-label="Increase guests">+</button>
            </div>
          </div>
        )}
      </div>

      {hasCriteria && (
        <button type="button" className="guest-search-clear" onClick={clearSearch}>Clear</button>
      )}

      <button type="submit" className="guest-search-search" aria-label="Search stays"><SearchIcon /></button>
    </form>
  );
};

export default SearchBar;