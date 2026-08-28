const mongoose = require('mongoose');

/**
 * Accommodation Schema
 * Represents a property listing with pricing, amenities, and ratings
 */
const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: 'Entire place',
    },
    guests: {
      type: Number,
      default: 1,
      min: [1, 'Must accommodate at least 1 guest'],
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: [0, 'Bathrooms cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    amenities: [{
      type: String,
      trim: true,
    }],
    images: [{
      type: String,
    }],
    weeklyDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    cleaningFee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative'],
    },
    serviceFee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative'],
    },
    occupancyTaxes: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, 'Reviews cannot be negative'],
    },
    specificRatings: {
      cleanliness: { type: Number, default: 0, min: 0, max: 5 },
      communication: { type: Number, default: 0, min: 0, max: 5 },
      checkIn: { type: Number, default: 0, min: 0, max: 5 },
      accuracy: { type: Number, default: 0, min: 0, max: 5 },
      location: { type: Number, default: 0, min: 0, max: 5 },
      value: { type: Number, default: 0, min: 0, max: 5 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
