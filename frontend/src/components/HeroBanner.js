import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    location: 'Cape Town',
    eyebrow: 'City + coast',
    title: 'Mountains in the morning. Ocean by lunch.',
    body: 'Find bright, design-led stays from the City Bowl to the coast.',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=2200&q=90',
  },
  {
    location: 'Kyoto',
    eyebrow: 'Slow travel',
    title: 'A slower way to arrive.',
    body: 'Wake near quiet temples, garden paths, and neighbourhood cafés.',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=2200&q=90',
  },
  {
    location: 'Amalfi Coast',
    eyebrow: 'Seaside stays',
    title: 'A view worth taking the long way for.',
    body: 'Stay above the sea, with small towns and late dinners nearby.',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=2200&q=90',
  },
];

const HeroBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || motionReduced) return undefined;
    const carousel = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 5800);
    return () => window.clearInterval(carousel);
  }, [paused]);

  const selectSlide = (index) => {
    setActiveSlide(index);
    setPaused(true);
  };

  const goToSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
    setPaused(true);
  };

  const slide = slides[activeSlide];

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured destinations">
      <div className="hero-slides" aria-live="polite">
        {slides.map((item, index) => (
          <div key={item.location} className={`hero-slide ${index === activeSlide ? 'is-active' : ''}`} style={{ backgroundImage: `url(${item.image})` }} aria-hidden={index !== activeSlide} />
        ))}
      </div>
      <div className="hero-scrim" />
      <div className="hero-content page-shell">
        <p className="hero-eyebrow">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <p className="hero-copy">{slide.body}</p>
        <button className="hero-action" type="button" onClick={() => navigate(`/locations/${encodeURIComponent(slide.location)}`)}>Explore {slide.location}</button>
      </div>
      <div className="hero-controls page-shell">
        <div className="hero-dots" role="tablist" aria-label="Select featured destination">
          {slides.map((item, index) => (
            <button key={item.location} type="button" role="tab" aria-label={`Show ${item.location}`} aria-selected={index === activeSlide} className={index === activeSlide ? 'is-active' : ''} onClick={() => selectSlide(index)} />
          ))}
        </div>
        <div className="hero-navigation">
          <button type="button" className="hero-control" aria-label="Previous destination" onClick={() => goToSlide(-1)}>‹</button>
          <button type="button" className="hero-control" aria-label={paused ? 'Play carousel' : 'Pause carousel'} onClick={() => setPaused((value) => !value)}>{paused ? '▶' : 'Ⅱ'}</button>
          <button type="button" className="hero-control" aria-label="Next destination" onClick={() => goToSlide(1)}>›</button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
