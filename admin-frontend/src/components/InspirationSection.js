import React from 'react';
import { useNavigate } from 'react-router-dom';

const locations = [
  {
    name: 'New York',
    tagline: 'City that never sleeps',
    image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Paris',
    tagline: 'Romance and culture',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Tokyo',
    tagline: 'Tradition meets future',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Cape Town',
    tagline: 'Where mountains meet sea',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80',
  },
];

const InspirationSection = () => {
  const navigate = useNavigate();

  return (
    <section className="inspiration-section">
      <h2>Inspiration for your next trip</h2>
      <div className="inspiration-grid">
        {locations.map((loc) => (
          <div
            key={loc.name}
            className="inspiration-card"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.28)), url(${loc.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            onClick={() => navigate(`/locations/${encodeURIComponent(loc.name)}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(`/locations/${encodeURIComponent(loc.name)}`);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="inspiration-content">
              <h3>{loc.name}</h3>
              <p>{loc.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InspirationSection;
