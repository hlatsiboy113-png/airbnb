import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';

const inspiration = [
  { name: 'Cape Town', distance: '2,150 kilometres away', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85' },
  { name: 'Paris', distance: '8,720 kilometres away', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85' },
  { name: 'Tokyo', distance: '13,090 kilometres away', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85' },
  { name: 'New York', distance: '12,640 kilometres away', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=85' },
];

const getaways = {
  Popular: ['Cape Town', 'Paris', 'Kyoto', 'Amalfi Coast', 'New York', 'Cape Winelands'],
  Historic: ['Kyoto', 'Rome', 'Marrakesh', 'Athens', 'Edinburgh', 'Prague'],
  Coastal: ['Amalfi Coast', 'Cape Town', 'Lisbon', 'Tulum', 'Byron Bay', 'Nice'],
  Islands: ['Bali', 'Santorini', 'Maui', 'Zanzibar', 'Seychelles', 'Mallorca'],
  Lakes: ['Lake Como', 'Queenstown', 'Lake Bled', 'Taupō', 'Annecy', 'Lucerne'],
};

function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Popular');
  const explore = (location) => navigate(`/locations/${encodeURIComponent(location)}`);

  return (
    <div className="home-page">
      <HeroBanner />

      <section className="content-section page-shell" aria-labelledby="inspiration-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find a change of scenery</p>
            <h2 id="inspiration-heading">Inspiration for your next trip</h2>
          </div>
          <button className="text-action" type="button" onClick={() => explore('Anywhere')}>View all stays <span aria-hidden="true">→</span></button>
        </div>
        <div className="inspiration-grid">
          {inspiration.map((place) => (
            <button type="button" className="inspiration-card" key={place.name} onClick={() => explore(place.name)}>
              <img src={place.image} alt={`${place.name} travel destination`} />
              <span className="inspiration-card-copy"><strong>{place.name}</strong><small>{place.distance}</small></span>
            </button>
          ))}
        </div>
      </section>

      <section className="content-section page-shell" aria-labelledby="experiences-heading">
        <div className="section-heading">
          <div><p className="eyebrow">Made for the moment</p><h2 id="experiences-heading">Discover experiences</h2></div>
        </div>
        <div className="experience-grid">
          <button className="experience-card outdoors" type="button" onClick={() => explore('Cape Town')}><span>Things to do on your trip</span><small>Local plans, expert hosts, unforgettable days.</small></button>
          <button className="experience-card indoors" type="button" onClick={() => explore('Kyoto')}><span>Things to do at home</span><small>Make room for a new ritual, wherever you are.</small></button>
        </div>
      </section>

      <section className="gift-card-section page-shell" aria-label="AirStay gift cards">
        <div className="gift-card-copy">
          <p className="eyebrow">Give a stay</p>
          <h2>Shop AirStay gift cards</h2>
          <p>Let them choose a place, an experience, or the beginning of a story.</p>
          <button type="button" className="dark-button" onClick={() => explore('Anywhere')}>Learn more</button>
        </div>
        <div className="gift-card-art" role="img" aria-label="A stack of coral AirStay gift cards against a coastal background"><div className="gift-card-back" /><div className="gift-card-front"><span className="gift-mark">airstay</span><span>Made for getting away</span></div></div>
      </section>

      <section className="content-section page-shell future-section" aria-labelledby="getaways-heading">
        <div className="section-heading"><div><p className="eyebrow">Keep dreaming</p><h2 id="getaways-heading">Future getaways</h2></div></div>
        <div className="getaway-tabs" role="tablist" aria-label="Destination types">
          {Object.keys(getaways).map((tab) => <button key={tab} type="button" role="tab" aria-selected={tab === activeTab} className={tab === activeTab ? 'is-active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
        <div className="destination-grid">
          {getaways[activeTab].map((location) => <button key={location} type="button" onClick={() => explore(location)}>{location}<span aria-hidden="true">→</span></button>)}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
