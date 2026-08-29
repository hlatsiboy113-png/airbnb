import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/locations/:location" element={<LocationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
