import React from 'react';
import { useNavigate } from 'react-router-dom';
const locations = [{name:'New York',tagline:'City that never sleeps',color:'#bc1a6e'},{name:'Paris',tagline:'Romance and culture',color:'#de3151'},{name:'Tokyo',tagline:'Tradition meets future',color:'#cc2d4a'},{name:'Cape Town',tagline:'Where mountains meet sea',color:'#d93b30'}];
const InspirationSection = () => {
  const navigate = useNavigate();
  return (
    <section className="inspiration-section">
      <h2>Inspiration for your next trip</h2>
      <div className="inspiration-grid">
        {locations.map(loc => (
          <div key={loc.name} className="inspiration-card" style={{backgroundColor:loc.color}} onClick={() => navigate(`/locations/${encodeURIComponent(loc.name)}`)}>
            <div className="inspiration-content"><h3>{loc.name}</h3><p>{loc.tagline}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default InspirationSection;
