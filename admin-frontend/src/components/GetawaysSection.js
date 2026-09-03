import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = ['Popular', 'Historic', 'Coastal', 'Islands', 'Lakes'];
const destinations = {
  Popular: ['Canmore', 'Benalmádena', 'Marbella', 'Mijas', 'Prescott', 'Scottsdale', 'Tucson', 'Jasper'],
  Historic: ['Paris', 'Rome', 'Athens', 'Cairo', 'Istanbul', 'Prague', 'Budapest', 'Vienna'],
  Coastal: ['Cape Town', 'Barcelona', 'Nice', 'Dubrovnik', 'Santorini', 'Amalfi', 'Biarritz', 'Lisbon'],
  Islands: ['Bali', 'Sicily', 'Majorca', 'Crete', 'Rhodes', 'Fiji', 'Maldives', 'Seychelles'],
  Lakes: ['Lake Como', 'Lake Tahoe', 'Lake Bled', 'Lake Geneva', 'Lake Louise', 'Plitvice', 'Lake Garda', 'Loch Ness'],
};

const GetawaysSection = () => {
  const [activeTab, setActiveTab] = useState('Popular');
  const navigate = useNavigate();

  return (
    <section className="getaways-section">
      <h2>Inspiration for future getaways</h2>
      <div className="tabs">{tabs.map((t) => <button key={t} className={activeTab === t ? 'tab active' : 'tab'} onClick={() => setActiveTab(t)}>{t}</button>)}</div>
      <div className="destinations-list">
        {destinations[activeTab].map((d) => (
          <div key={d} className="destination-item">
            <button type="button" className="dest-name" onClick={() => navigate(`/locations/${encodeURIComponent(d)}`)}>{d}</button>
            <span className="dest-type">Holiday rentals</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GetawaysSection;
