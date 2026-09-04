import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShopSection = () => {
  const navigate = useNavigate();

  return (
    <section className="shop-section">
      <div className="shop-content">
        <div className="shop-text">
          <h2>Shop AirStay gift cards</h2>
          <button type="button" onClick={() => navigate('/locations/Tokyo')}>Learn more</button>
        </div>
        <div className="shop-image">
          <div className="gift-card-placeholder">🎁 Gift Cards</div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
