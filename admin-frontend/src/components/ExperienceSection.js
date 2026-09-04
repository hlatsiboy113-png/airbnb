import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExperienceSection = () => {
  const navigate = useNavigate();

  return (
    <section className="experience-section">
      <h2>Discover AirStay Experiences</h2>
      <div className="experience-grid">
        <div className="experience-card trip">
          <div className="experience-content">
            <h3>Things to do on your trip</h3>
            <button type="button" onClick={() => navigate('/locations/New%20York')}>Experiences</button>
          </div>
        </div>
        <div className="experience-card home">
          <div className="experience-content">
            <h3>Things to do at home</h3>
            <button type="button" onClick={() => navigate('/locations/Paris')}>Online Experiences</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
