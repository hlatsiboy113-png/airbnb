const Accommodation = require('../models/Accommodation');

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
];

const withGallery = (images = []) => [...images, ...GALLERY_IMAGES]
  .filter((image, index, all) => all.indexOf(image) === index)
  .slice(0, 5);

const DEFAULT_ACCOMMODATIONS = [
  {
    title: 'Mountain View Retreat',
    location: 'Canmore',
    description: 'A peaceful base for exploring the Canadian Rockies.',
    type: 'Entire place',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    price: 185,
    amenities: ['wifi', 'kitchen', 'free parking'],
    images: [
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
    ],
    rating: 4.8,
    reviews: 24,
  },
  {
    title: 'Skyline Apartment',
    location: 'New York',
    description: 'A bright apartment close to neighbourhood restaurants and parks.',
    type: 'Entire place',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    price: 220,
    amenities: ['wifi', 'kitchen', 'washer'],
    images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'],
    rating: 4.7,
    reviews: 31,
  },
  {
    title: 'Left Bank Hideaway',
    location: 'Paris',
    description: 'A comfortable pied-a-terre for slow mornings and city walks.',
    type: 'Entire place',
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    price: 160,
    amenities: ['wifi', 'kitchen', 'air conditioning'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'],
    rating: 4.9,
    reviews: 18,
  },
  {
    title: 'Lantern House',
    location: 'Tokyo',
    description: 'A calm, modern home with easy access to the city.',
    type: 'Private room',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    price: 135,
    amenities: ['wifi', 'kitchen', 'workspace'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
    rating: 4.6,
    reviews: 15,
  },
  {
    title: 'Ocean and Mountain Villa',
    location: 'Cape Town',
    description: 'A spacious stay between the coastline and Table Mountain.',
    type: 'Entire place',
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    price: 195,
    amenities: ['wifi', 'pool', 'free parking'],
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'],
    rating: 4.8,
    reviews: 27,
  },
  {
    title: 'Pine Cabin Escape', location: 'Canmore', description: 'A warm cabin with trail access and wide mountain views.', type: 'Entire place', guests: 5, bedrooms: 2, bathrooms: 1, price: 210, amenities: ['wifi', 'fireplace', 'free parking'], images: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 19,
  },
  {
    title: 'Riverstone Loft', location: 'Canmore', description: 'A sunny loft for an easy weekend in the Rockies.', type: 'Entire place', guests: 3, bedrooms: 1, bathrooms: 1, price: 165, amenities: ['wifi', 'kitchen', 'workspace'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=81'], rating: 4.6, reviews: 12,
  },
  {
    title: 'Brooklyn Garden Flat', location: 'New York', description: 'A quiet garden-level flat near local cafés and galleries.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 175, amenities: ['wifi', 'garden', 'kitchen'], images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'], rating: 4.5, reviews: 16,
  },
  {
    title: 'Hudson Heights Home', location: 'New York', description: 'A spacious home with skyline views and a full kitchen.', type: 'Entire place', guests: 5, bedrooms: 2, bathrooms: 2, price: 280, amenities: ['wifi', 'kitchen', 'washer'], images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 22,
  },
  {
    title: 'Montmartre Studio', location: 'Paris', description: 'A compact studio near art, cafés, and the Sacré-Cœur.', type: 'Entire place', guests: 2, bedrooms: 1, bathrooms: 1, price: 145, amenities: ['wifi', 'kitchen', 'elevator'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=82'], rating: 4.7, reviews: 21,
  },
  {
    title: 'Seine View Residence', location: 'Paris', description: 'A refined apartment with a relaxed riverside atmosphere.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 1, price: 245, amenities: ['wifi', 'kitchen', 'washer'], images: ['https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80'], rating: 4.9, reviews: 29,
  },
  {
    title: 'Shibuya Garden Room', location: 'Tokyo', description: 'A peaceful room with a private garden near the city pulse.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 120, amenities: ['wifi', 'garden', 'workspace'], images: ['https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80'], rating: 4.5, reviews: 14,
  },
  {
    title: 'Neon District Apartment', location: 'Tokyo', description: 'A modern apartment close to late-night dining and transit.', type: 'Entire place', guests: 4, bedrooms: 1, bathrooms: 1, price: 190, amenities: ['wifi', 'kitchen', 'air conditioning'], images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 26,
  },
  {
    title: 'Signal Hill Hideaway', location: 'Cape Town', description: 'A bright hideaway with ocean air and sunset views.', type: 'Entire place', guests: 3, bedrooms: 1, bathrooms: 1, price: 155, amenities: ['wifi', 'pool', 'free parking'], images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 20,
  },
  {
    title: 'Bo-Kaap Courtyard Home', location: 'Cape Town', description: 'A colourful courtyard home close to city landmarks.', type: 'Entire place', guests: 5, bedrooms: 2, bathrooms: 2, price: 230, amenities: ['wifi', 'kitchen', 'patio'], images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'], rating: 4.9, reviews: 33,
  },
  {
    title: 'West Village Sunroom', location: 'New York', description: 'A light-filled apartment for exploring the city on foot.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 1, price: 245, amenities: ['wifi', 'kitchen', 'washer'], images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 18,
  },
  {
    title: 'Canal Saint-Martin Loft', location: 'Paris', description: 'A character-filled loft near waterside cafés and galleries.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 1, price: 210, amenities: ['wifi', 'kitchen', 'air conditioning'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 17,
  },
  {
    title: 'Asakusa Courtyard Stay', location: 'Tokyo', description: 'A peaceful modern stay close to temples, transit, and local food.', type: 'Entire place', guests: 3, bedrooms: 1, bathrooms: 1, price: 155, amenities: ['wifi', 'kitchen', 'workspace'], images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 19,
  },
  {
    title: 'Clifton Sunset House', location: 'Cape Town', description: 'A relaxed coastal home with room for long lunches and late sunsets.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 2, price: 260, amenities: ['wifi', 'pool', 'free parking'], images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'], rating: 4.9, reviews: 24,
  },
  {
    title: 'Harlem Brownstone Studio', location: 'New York', description: 'A warm, quiet base for neighbourhood mornings and city nights.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 150, amenities: ['wifi', 'kitchen', 'workspace'], images: ['https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80'], rating: 4.6, reviews: 14,
  },
  {
    title: 'Latin Quarter Nook', location: 'Paris', description: 'A compact, welcoming stay close to bookshops, bakeries, and the river.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 135, amenities: ['wifi', 'kitchen', 'air conditioning'], images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'], rating: 4.6, reviews: 13,
  },
  {
    title: 'Meguro Morning House', location: 'Tokyo', description: 'A calm neighbourhood home with thoughtful spaces for a city break.', type: 'Entire place', guests: 3, bedrooms: 1, bathrooms: 1, price: 165, amenities: ['wifi', 'kitchen', 'washer'], images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 16,
  },
  {
    title: 'Sea Point Garden Flat', location: 'Cape Town', description: 'An easy coastal stay with a leafy terrace and mountain air.', type: 'Entire place', guests: 3, bedrooms: 1, bathrooms: 1, price: 175, amenities: ['wifi', 'patio', 'free parking'], images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 15,
  },
];

const ensureDefaultAccommodations = async (hostId) => {
  if (process.env.NODE_ENV === 'production') return;

  await Promise.all(DEFAULT_ACCOMMODATIONS.map(async (accommodation) => {
    const existing = await Accommodation.findOne({ title: accommodation.title, location: accommodation.location });
    if (!existing) {
      await Accommodation.create({ ...accommodation, images: withGallery(accommodation.images), host: hostId });
    } else if ((existing.images?.length || 0) < 5) {
      existing.images = withGallery(existing.images?.length ? existing.images : accommodation.images);
      await existing.save();
    }
  }));
};

module.exports = { DEFAULT_ACCOMMODATIONS, ensureDefaultAccommodations };
