import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const FAVORITES_KEY = 'favoriteAccommodations';

const readFavorites = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []);
  } catch {
    return new Set();
  }
};

const LocationCard = ({ accommodation }) => {
  const navigate = useNavigate();
  const { _id, images, type, title, location, amenities, rating, reviews, price } = accommodation;
  const imageUrl = images && images.length > 0 ? getImageUrl(images[0]) : null;
  const [isFavorite, setIsFavorite] = useState(() => readFavorites().has(_id));

  const toggleFavorite = useCallback((e) => {
    e.stopPropagation();
    const favorites = readFavorites();
    if (favorites.has(_id)) {
      favorites.delete(_id);
    } else {
      favorites.add(_id);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    setIsFavorite(favorites.has(_id));
  }, [_id]);

  return (
    <div className="location-card" onClick={() => navigate(`/listing/${_id}`)}>
      <div className="location-card-image">
        {imageUrl ? <img src={imageUrl} alt={title} loading="lazy" /> : <div className="no-image">No Image</div>}
        <button
          type="button"
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="location-card-body">
        <div className="location-card-header">
          <span className="card-type">{type || 'Entire place'}</span>
          <span className="card-rating">★ {rating || 'New'}</span>
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-location">{location}</p>
        {amenities && amenities.length > 0 && <p className="card-amenities">{amenities.slice(0, 3).join(' · ')}</p>}
        <div className="card-footer">
          <span className="card-price">R{price} <span>/ night</span></span>
          {reviews > 0 && <span className="card-reviews">({reviews} reviews)</span>}
        </div>
      </div>
    </div>
  );
};
export default React.memo(LocationCard);
