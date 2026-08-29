import React, { useState } from 'react';

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

  return (
    <section className="getaways-section">
      <h2>Inspiration for future getaways</h2>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="destinations-list">
        {destinations[activeTab].map((dest) => (
          <div key={dest} className="destination-item">
            <span className="dest-name">{dest}</span>
            <span className="dest-type">Holiday rentals</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GetawaysSection;
