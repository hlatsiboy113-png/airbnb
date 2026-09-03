const Accommodation = require('../models/Accommodation');

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
    title: 'Camps Bay Modern Villa', location: 'Cape Town', description: 'A sleek villa with a private pool and Atlantic seaboard views.', type: 'Entire place', guests: 8, bedrooms: 4, bathrooms: 3, price: 410, amenities: ['wifi', 'pool', 'sea view', 'braai area', 'security'], images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'], rating: 4.9, reviews: 41,
  },
  {
    title: 'Waterfront Studio', location: 'Cape Town', description: 'A compact studio steps from the V&A Waterfront harbour walk.', type: 'Entire place', guests: 2, bedrooms: 1, bathrooms: 1, price: 140, amenities: ['wifi', 'kitchen', 'elevator', 'gym'], images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'], rating: 4.6, reviews: 17,
  },
  {
    title: 'Sandton Luxury Apartment', location: 'Johannesburg', description: 'An upscale apartment in the financial district, walk to Sandton City.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 2, price: 260, amenities: ['wifi', 'kitchen', 'gym', 'security', 'backup power'], images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 28,
  },
  {
    title: 'Rosebank Creative Loft', location: 'Johannesburg', description: 'An artsy loft near Rosebank\u2019s galleries, markets, and rooftop bars.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 130, amenities: ['wifi', 'workspace', 'kitchen'], images: ['https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80'], rating: 4.5, reviews: 13,
  },
  {
    title: 'Melville Garden Cottage', location: 'Johannesburg', description: 'A leafy garden cottage on a quiet street near Melville\u2019s cafes.', type: 'Entire place', guests: 3, bedrooms: 1, bathrooms: 1, price: 150, amenities: ['wifi', 'garden', 'kitchen', 'free parking'], images: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 22,
  },
  {
    title: 'Fourways Family Home', location: 'Johannesburg', description: 'A spacious family home with a garden and braai area near the mall.', type: 'Entire place', guests: 7, bedrooms: 3, bathrooms: 2, price: 290, amenities: ['wifi', 'kitchen', 'braai area', 'free parking', 'backup power'], images: ['https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80'], rating: 4.6, reviews: 19,
  },
  {
    title: 'Umhlanga Beach Apartment', location: 'Durban', description: 'A breezy beachfront apartment steps from the promenade.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 1, price: 195, amenities: ['wifi', 'sea view', 'kitchen', 'pool'], images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 30,
  },
  {
    title: 'Durban North Villa', location: 'Durban', description: 'A family villa with a garden, pool, and easy access to the beaches.', type: 'Entire place', guests: 6, bedrooms: 3, bathrooms: 2, price: 240, amenities: ['wifi', 'pool', 'garden', 'free parking'], images: ['https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 21,
  },
  {
    title: 'Golden Mile Studio', location: 'Durban', description: 'A budget-friendly studio close to the Golden Mile beachfront.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 95, amenities: ['wifi', 'air conditioning'], images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'], rating: 4.3, reviews: 11,
  },
  {
    title: 'Berea Heritage Apartment', location: 'Durban', description: 'A characterful apartment in a heritage building overlooking the city.', type: 'Entire place', guests: 3, bedrooms: 1, bathrooms: 1, price: 125, amenities: ['wifi', 'kitchen', 'workspace'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'], rating: 4.5, reviews: 14,
  },
  {
    title: 'Hatfield Student Loft', location: 'Pretoria', description: 'A modern loft near the university, embassies, and Hatfield Square.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 105, amenities: ['wifi', 'workspace', 'kitchen'], images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'], rating: 4.4, reviews: 9,
  },
  {
    title: 'Waterkloof Family Home', location: 'Pretoria', description: 'A quiet, jacaranda-lined family home with a private garden.', type: 'Entire place', guests: 6, bedrooms: 3, bathrooms: 2, price: 225, amenities: ['wifi', 'garden', 'kitchen', 'free parking', 'braai area'], images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 18,
  },
  {
    title: 'Menlyn Modern Apartment', location: 'Pretoria', description: 'A stylish apartment near Menlyn Park and the Gautrain.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 2, price: 180, amenities: ['wifi', 'kitchen', 'gym', 'security'], images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'], rating: 4.6, reviews: 15,
  },
  {
    title: 'Vilakazi Street Heritage Home', location: 'Soweto', description: 'A welcoming home on the historic street once home to two Nobel laureates.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 1, price: 110, amenities: ['wifi', 'kitchen', 'braai area'], images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 25,
  },
  {
    title: 'Orlando Towers View Loft', location: 'Soweto', description: 'A bright loft with a view of the iconic Orlando Towers.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 85, amenities: ['wifi', 'kitchen'], images: ['https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80'], rating: 4.5, reviews: 12,
  },
  {
    title: 'Shoreditch Warehouse Loft', location: 'London', description: 'An industrial-chic loft in the heart of East London\u2019s creative scene.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 1, price: 265, amenities: ['wifi', 'kitchen', 'workspace', 'heating'], images: ['https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80'], rating: 4.7, reviews: 24,
  },
  {
    title: 'Notting Hill Townhouse', location: 'London', description: 'A classic townhouse near the colourful streets and Portobello Market.', type: 'Entire place', guests: 5, bedrooms: 3, bathrooms: 2, price: 340, amenities: ['wifi', 'kitchen', 'garden', 'heating'], images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'], rating: 4.9, reviews: 37,
  },
  {
    title: 'Camden Canalside Studio', location: 'London', description: 'A cosy canalside studio near Camden Market and the lock.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 150, amenities: ['wifi', 'heating'], images: ['https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80'], rating: 4.4, reviews: 16,
  },
  {
    title: 'Downtown Dubai Sky Suite', location: 'Dubai', description: 'A high-rise suite with Burj Khalifa views and hotel-style amenities.', type: 'Entire place', guests: 4, bedrooms: 2, bathrooms: 2, price: 380, amenities: ['wifi', 'pool', 'gym', 'air conditioning', 'security'], images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'], rating: 4.8, reviews: 34,
  },
  {
    title: 'Jumeirah Beach Apartment', location: 'Dubai', description: 'A beachfront apartment with direct access to the sand and sea.', type: 'Entire place', guests: 6, bedrooms: 3, bathrooms: 2, price: 420, amenities: ['wifi', 'pool', 'sea view', 'air conditioning'], images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80'], rating: 4.9, reviews: 39,
  },
  {
    title: 'Al Fahidi Heritage Room', location: 'Dubai', description: 'A quiet room in the historic Al Fahidi district, near the creek and museums.', type: 'Private room', guests: 2, bedrooms: 1, bathrooms: 1, price: 90, amenities: ['wifi', 'air conditioning'], images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'], rating: 4.5, reviews: 10,
  },
];

const ensureDefaultAccommodations = async (hostId) => {
  if (process.env.NODE_ENV === 'production') return;

  await Promise.all(DEFAULT_ACCOMMODATIONS.map(async (accommodation) => {
    const existing = await Accommodation.findOne({ title: accommodation.title, location: accommodation.location });
    if (!existing) {
      await Accommodation.create({ ...accommodation, host: hostId });
    } else if (!existing.images?.length && accommodation.images?.length) {
      existing.images = accommodation.images;
      await existing.save();
    }
  }));
};

module.exports = { DEFAULT_ACCOMMODATIONS, ensureDefaultAccommodations };
