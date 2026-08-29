import React from 'react';
import HeroBanner from '../components/HeroBanner';
import InspirationSection from '../components/InspirationSection';
import ExperienceSection from '../components/ExperienceSection';
import ShopSection from '../components/ShopSection';
import GetawaysSection from '../components/GetawaysSection';
const HomePage = () => (
  <div className="home-page">
    <HeroBanner />
    <div className="home-content">
      <InspirationSection />
      <ExperienceSection />
      <ShopSection />
      <GetawaysSection />
    </div>
  </div>
);
export default HomePage;
