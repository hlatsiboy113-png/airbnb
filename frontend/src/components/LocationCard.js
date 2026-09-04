import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const LocationCard = ({ accommodation }) => {
  const navigate = useNavigate();
  const { _id, images, type, title, location, amenities, rating, reviews, price } = accommodation;
  const imageUrl = images && images.length > 0 ? getImageUrl(images[0]) : null;

  return (
    <div className="location-card" onClick={() => navigate(`/listing/${_id}`)}>
      <div className="location-card-image">
        {imageUrl ? <img src={imageUrl} alt={title} loading="lazy" /> : <div className="no-image">No Image</div>}
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
