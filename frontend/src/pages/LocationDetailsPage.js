import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const readDateParam = (searchParams, key, fallback) => {
  const value = searchParams.get(key);
  const parsed = new Date(value);
  return value && !Number.isNaN(parsed.getTime()) ? value : fallback;
};

const readGuestsParam = (searchParams) => {
  const raw = Number(searchParams.get('guests'));
  return Number.isInteger(raw) && raw >= 1 ? raw : 1;
};

const LocationDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [acc, setAcc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calculator state
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 172800000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(() => readDateParam(searchParams, 'checkIn', tomorrow));
  const [checkOut, setCheckOut] = useState(() => readDateParam(searchParams, 'checkOut', dayAfterTomorrow));
  const [guests, setGuests] = useState(() => readGuestsParam(searchParams));
  const [reserving, setReserving] = useState(false);
  const [reserveMsg, setReserveMsg] = useState('');
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    fetchAccommodation();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the id param changes
  }, [id]);

  const fetchAccommodation = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/accommodations/${id}`);
      setAcc(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load accommodation');
    } finally {
      setLoading(false);
    }
  };

  // Cost calculation
  const { nights, baseCost, totalCost, breakdown } = useMemo(() => {
    if (!acc) return { nights: 0, baseCost: 0, totalCost: 0, breakdown: {} };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const n = diff > 0 ? diff : 1;
    const base = acc.price * n;
    const total = base - (acc.weeklyDiscount || 0) + (acc.cleaningFee || 0) + (acc.serviceFee || 0) + (acc.occupancyTaxes || 0);
    return {
      nights: n,
      baseCost: base,
      totalCost: total,
      breakdown: {
        price: acc.price,
        weeklyDiscount: acc.weeklyDiscount || 0,
        cleaningFee: acc.cleaningFee || 0,
        serviceFee: acc.serviceFee || 0,
        occupancyTaxes: acc.occupancyTaxes || 0,
      },
    };
  }, [acc, checkIn, checkOut]);

  const handleReserve = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/listing/${id}`)}`);
      return;
    }

    const guestCount = Number(guests);
    const maxGuests = Number(acc?.guests || 1);
    const safeGuests = Math.min(Math.max(guestCount, 1), maxGuests);

    if (!checkIn || !checkOut) {
      setReserveMsg('Please select both check-in and check-out dates.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setReserveMsg('Check-out must be after check-in.');
      return;
    }

    if (guestCount < 1 || guestCount > maxGuests) {
      setReserveMsg(`Please select between 1 and ${maxGuests} guests.`);
      return;
    }

    setReserving(true);
    setReserveMsg('');
    try {
      await api.post('/reservations', {
        accommodation: id,
        checkIn,
        checkOut,
        guests: safeGuests,
        totalCost,
      });
      setReserveMsg('Reservation confirmed. Your trip details are ready in My reservations.');
    } catch (err) {
      setReserveMsg(err.response?.data?.message || 'Reservation failed. Please try again.');
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!acc) return <div className="error">Accommodation not found</div>;

  const images = acc.images || [];
  const mainImage = images[0] ? getImageUrl(images[0]) : null;
  const galleryImages = images.slice(1, 5).map(getImageUrl);
  const allImages = [mainImage, ...galleryImages].filter(Boolean);

  return (
    <div className="details-page">
      {/* Heading */}
      <div className="details-header">
        <h1>{acc.title}</h1>
        <div className="details-subheader">
          <span className="rating">★ {acc.rating || 'New'} · {acc.reviews || 0} reviews</span>
          <span className="dot">·</span>
          <span className="location">{acc.location}</span>
          <span className="dot">·</span>
          <span className="type">{acc.type || 'Entire place'}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="gallery-main">
          {mainImage ? <img src={mainImage} alt={acc.title} onClick={() => setActiveImage(0)} /> : <div className="no-image">No Image</div>}
        </div>
        <div className="gallery-grid">
          {galleryImages.map((src, i) => (
            <div key={i} className="gallery-thumb"><img src={src} alt={`${acc.title} ${i + 2}`} onClick={() => setActiveImage(i + 1)} /></div>
          ))}
          {galleryImages.length < 4 && Array.from({ length: 4 - galleryImages.length }).map((_, i) => (
            <div key={`empty-${i}`} className="gallery-thumb empty"><span>No Image</span></div>
          ))}
        </div>
      </div>

      {activeImage !== null && (
        <div className="gallery-lightbox" role="dialog" aria-label="Image gallery" onClick={() => setActiveImage(null)}>
          <button type="button" className="gallery-close" aria-label="Close gallery" onClick={() => setActiveImage(null)}>×</button>
          <button type="button" className="gallery-prev" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage - 1 + allImages.length) % allImages.length); }}>‹</button>
          <img src={allImages[activeImage]} alt={`${acc.title} ${activeImage + 1}`} onClick={(event) => event.stopPropagation()} />
          <button type="button" className="gallery-next" aria-label="Next image" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage + 1) % allImages.length); }}>›</button>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="details-body">
        {/* Left Column */}
        <div className="details-left">
          <div className="details-section host-section">
            <h2>{acc.type || 'Entire place'} hosted by {acc.host?.username || 'Host'}</h2>
            <p>{acc.guests} guests · {acc.bedrooms} bedrooms · {acc.bathrooms} bathrooms</p>
          </div>

          <div className="details-section">
            <h3>About this place</h3>
            <p>{acc.description || 'No description available.'}</p>
          </div>

          <div className="details-section">
            <h3>Where you'll sleep</h3>
            <div className="sleep-card">
              {allImages[2] ? <img src={allImages[2]} alt={`${acc.title} bedroom`} className="sleep-image" /> : <span className="sleep-icon">🛏</span>}
              <div><p>Bedroom {acc.bedrooms}</p><span>{acc.bedrooms} bed{acc.bedrooms !== 1 ? 's' : ''}</span></div>
            </div>
          </div>

          <div className="details-section">
            <h3>What this place offers</h3>
            <div className="amenities-list">
              {(acc.amenities || []).map((a) => (
                <div key={a} className="amenity-item">✓ {a}</div>
              ))}
              {(acc.amenities || []).length === 0 && <p>No amenities listed.</p>}
            </div>
          </div>

          <div className="details-section">
            <h3>{nights} nights in {acc.location}</h3>
            <div className="date-display">
              <div className="date-box"><label>Check-in</label><span>{checkIn}</span></div>
              <div className="date-box"><label>Check-out</label><span>{checkOut}</span></div>
            </div>
          </div>

          {acc.specificRatings && (
            <div className="details-section">
              <h3>Reviews · {acc.rating} ★</h3>
              <div className="ratings-grid">
                {Object.entries(acc.specificRatings).map(([key, val]) => (
                  <div key={key} className="rating-bar">
                    <span className="rating-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="rating-track"><div className="rating-fill" style={{ width: `${(val / 5) * 100}%` }} /></div>
                    <span className="rating-value">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="details-section host-details-section">
            <h3>Meet your host</h3>
            <p><strong>{acc.host?.username || 'Your host'}</strong> is committed to a considerate, well-prepared stay.</p>
            <div className="host-detail-badges">
              <span>Responsive host</span>
              <span>Identity confirmed</span>
            </div>
          </div>

          <div className="details-section">
            <h3>Health &amp; safety</h3>
            <p>This host follows enhanced cleaning practices and provides a self check-in option when available. Review the property details before you arrive.</p>
          </div>

          <div className="details-section">
            <h3>Cancellation policy</h3>
            <p>Cancel before check-in for a full refund of the nightly rate, subject to the booking terms shown at checkout. Service fees may be non-refundable.</p>
          </div>

          <div className="details-section">
            <h3>House rules</h3>
            <ul className="rules-list">
              <li>Check-in: After 3:00 PM</li>
              <li>Checkout: 11:00 AM</li>
              <li>{acc.guests} guests maximum</li>
              <li>No smoking</li>
              <li>No parties or events</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Cost Calculator */}
        <div className="details-right">
          <div className="calculator-card">
            <div className="calculator-header">
              <span className="calc-price">R{acc.price}</span>
              <span className="calc-unit"> / night</span>
            </div>

            <div className="calculator-inputs">
              <div className="date-inputs">
                <div className="date-field">
                  <label>CHECK-IN</label>
                  <input type="date" value={checkIn} min={tomorrow} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="date-field">
                  <label>CHECKOUT</label>
                  <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>
              <div className="guest-field">
                <label>GUESTS</label>
                <select value={Math.min(Number(guests), Math.max(acc.guests || 1, 1))} onChange={(e) => setGuests(e.target.value)}>
                  {Array.from({ length: Math.max(acc.guests || 1, 1) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="reserve-btn" onClick={handleReserve} disabled={reserving}>
              {reserving ? 'Reserving...' : 'Reserve'}
            </button>
            {reserveMsg && <div className={`reserve-msg ${reserveMsg.includes('confirmed') ? 'success' : 'error'}`}>{reserveMsg}</div>}

            <div className="cost-breakdown">
              <div className="cost-row">
                <span>R{breakdown.price} x {nights} nights</span>
                <span>R{baseCost}</span>
              </div>
              {breakdown.weeklyDiscount > 0 && (
                <div className="cost-row discount">
                  <span>Weekly discount</span>
                  <span>-R{breakdown.weeklyDiscount}</span>
                </div>
              )}
              <div className="cost-row">
                <span>Cleaning fee</span>
                <span>R{breakdown.cleaningFee}</span>
              </div>
              <div className="cost-row">
                <span>Service fee</span>
                <span>R{breakdown.serviceFee}</span>
              </div>
              <div className="cost-row">
                <span>Occupancy taxes</span>
                <span>R{breakdown.occupancyTaxes}</span>
              </div>
              <div className="cost-row total">
                <span>Total</span>
                <span>R{totalCost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsPage;
