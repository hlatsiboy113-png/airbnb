import React from 'react';

const HeroBanner = () => {
  return (
    <section className="hero-banner">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Find your next stay</h1>
          <p>Search deals on homes, villas, apartments, and much more...</p>
          <button className="hero-cta">Explore stays</button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
