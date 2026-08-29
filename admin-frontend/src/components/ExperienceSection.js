import React from 'react';

const ExperienceSection = () => {
  return (
    <section className="experience-section">
      <h2>Discover Airbnb Experiences</h2>
      <div className="experience-grid">
        <div className="experience-card trip">
          <div className="experience-content">
            <h3>Things to do on your trip</h3>
            <button>Experiences</button>
          </div>
        </div>
        <div className="experience-card home">
          <div className="experience-content">
            <h3>Things to do at home</h3>
            <button>Online Experiences</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
