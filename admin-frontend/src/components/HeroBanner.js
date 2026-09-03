import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <div className="hero-content">
        <h1>Find your next stay</h1>
        <p>Search deals on homes, villas, apartments, and much more...</p>
        <button type="button" className="hero-cta" onClick={() => navigate('/explore')}>
          Explore stays
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
